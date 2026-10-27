from __future__ import annotations
import json, os
from pathlib import Path
from typing import Literal
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parents[2]
app = FastAPI(title='Organ FTU Expression API', version='0.1.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
ORGAN_REGISTRY = [
 {'organKey':'pancreas','organLabel':'Pancreas','ftuOrganId':'UBERON:0001264'},
 {'organKey':'skin','organLabel':'Skin','ftuOrganId':'UBERON:0002097'},
 {'organKey':'eye','organLabel':'Eye','ftuOrganId':'UBERON:0000970'},
 {'organKey':'large-intestine','organLabel':'Large intestine','ftuOrganId':'UBERON:0000059'},
 {'organKey':'small-intestine','organLabel':'Small intestine','ftuOrganId':'UBERON:0002108'},
 {'organKey':'kidney','organLabel':'Kidney','ftuOrganId':'UBERON:0002113'},
 {'organKey':'lymph-node','organLabel':'Lymph node','ftuOrganId':'UBERON:0000029'},
 {'organKey':'spinal-cord','organLabel':'Spinal cord','ftuOrganId':'UBERON:0002240'},
 {'organKey':'brain','organLabel':'Brain','ftuOrganId':'UBERON:0000955'},
]

def load_expression():
    path = ROOT / 'data' / 'processed' / 'expression.json'
    if path.exists():
        try: return json.loads(path.read_text())
        except json.JSONDecodeError: return {}
    return {}

@app.get('/api/v1/health')
def health(): return {'status':'ok','service':'organ-ftu-expression-api','dataSnapshotAvailable':bool(load_expression())}

@app.get('/api/v1/organs')
def organs(): return {'organs': ORGAN_REGISTRY}

MODEL_FILES = {
    'male': ROOT / 'data' / 'raw' / 'models' / 'hra-reference-organ-united-male-v1.5.glb',
    'female': ROOT / 'data' / 'raw' / 'models' / 'hra-reference-organ-united-female-v1.5.glb',
}

@app.head('/api/v1/models/{sex}')
def model_head(sex: str):
    if sex not in MODEL_FILES: raise HTTPException(status_code=404, detail='Unknown model sex')
    if not MODEL_FILES[sex].exists(): raise HTTPException(status_code=404, detail='Model not downloaded; run scripts/fetch_reference_models.py')
    return Response(status_code=200, headers={'content-type':'model/gltf-binary'})

@app.get('/api/v1/models/{sex}')
def model_file(sex: str):
    if sex not in MODEL_FILES: raise HTTPException(status_code=404, detail='Unknown model sex')
    path=MODEL_FILES[sex]
    if not path.exists(): raise HTTPException(status_code=404, detail='Model not downloaded; run scripts/fetch_reference_models.py')
    return FileResponse(path, media_type='model/gltf-binary', filename=path.name)

@app.get('/api/v1/ftu-illustrations')
def ftu_illustrations():
    path = ROOT / 'data' / 'raw' / 'ftu-illustrations.json'
    if path.exists():
        return json.loads(path.read_text())
    return {'@graph': []}

@app.get('/api/v1/genes')
def genes(q: str = Query('', max_length=80), limit: int = Query(20, ge=1, le=100)):
    catalog = [{'geneId':'XIAP','geneLabel':'XIAP'}]
    q = q.strip().upper()
    return {'genes':[x for x in catalog if not q or q in x['geneId'] or q in x['geneLabel']][:limit], 'sourceVersion':'HRApop v1.1'}

@app.get('/api/v1/expression')
def expression(organKey: str, geneId: str, sex: Literal['male','female']='female', laterality: Literal['left','right','midline','unspecified']='left'):
    snapshot = load_expression()
    key = f'{organKey}|{geneId.upper()}|{sex}|{laterality}'
    if key in snapshot: return snapshot[key]
    if not any(x['organKey'] == organKey for x in ORGAN_REGISTRY): raise HTTPException(status_code=404, detail='Unknown organ')
    return {'organKey':organKey,'referenceOrganIri':None,'modelSex':sex,'laterality':laterality,'geneId':geneId.upper(),'geneLabel':geneId.upper(),'expressionCohort':'pooled','aggregation':'Unweighted arithmetic mean of source mean_expr rows by as_id, following as-b.ipynb.','sourceVersion':'HRApop v1.1','min':None,'max':None,'nodes':[],'coverage':{'totalNodes':0,'nodesWithData':0,'nodesWithoutData':0},'unavailableReason':'No verified expression snapshot is installed. Configure data/processed/expression.json from the locked HRApop ETL output.'}
