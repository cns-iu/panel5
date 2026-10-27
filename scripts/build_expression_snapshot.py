#!/usr/bin/env python3
"""Build real organ/gene expression responses from HRApop and RUI snapshots."""
from __future__ import annotations
import csv,gzip,json,math
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def norm(v):
    v=(v or '').strip()
    if v.startswith(('http://','https://')): return v
    prefix,_,ident=v.partition(':')
    if prefix.upper()=='UBERON': return 'http://purl.obolibrary.org/obo/UBERON_'+ident
    if prefix.upper()=='FMA': return 'http://purl.org/sig/ont/fma/fma'+ident
    return v

def main():
    rows=defaultdict(lambda:[0.0,0])
    with gzip.open(ROOT/'data/raw/datasets-as-ct-gene.csv.gz','rt',encoding='utf-8',newline='') as f:
        for r in csv.DictReader(f):
            if r.get('gene_label','').upper()!='XIAP' and r.get('gene_id','').upper()!='XIAP': continue
            try: value=float(r.get('mean_expr',''))
            except (TypeError,ValueError): continue
            if not math.isfinite(value): continue
            rows[norm(r.get('as_id'))][0]+=value; rows[norm(r.get('as_id'))][1]+=1
    means={k:v[0]/v[1] for k,v in rows.items() if v[1]}
    scene=json.loads((ROOT/'data/raw/rui-reference-data.json').read_text())['sceneNodeLookup']
    lookup=json.loads((ROOT/'data/raw/rui-reference-data.json').read_text())['organIRILookup']
    contexts=[]
    for organ_label,organ_key in [('kidney','kidney'),('large intestine','large-intestine'),('liver','liver'),('lung','lung'),('pancreas','pancreas')]:
      for sex in ('Female','Male'):
        latitudes=('Left','Right') if organ_key=='kidney' else ('',)
        for lat in latitudes:
          iri=lookup.get(f'{organ_label}|{sex}|{lat}')
          if not iri: continue
          nodes=[]
          for sid,node in scene.items():
            if node.get('reference_organ')!=iri or '/landmark/' in sid: continue
            ontology=norm(node.get('representation_of')) if node.get('representation_of') else None
            val=means.get(ontology)
            n=rows.get(ontology,[0,0])[1]
            nodes.append({'sceneNodeId':sid,'ontologyId':ontology,'label':node.get('tooltip') or node.get('scenegraphNode') or sid.rsplit('#',1)[-1],'meanExpr':val,'nRecords':n,'hasData':val is not None})
          vals=[n['meanExpr'] for n in nodes if n['hasData']]
          contexts.append((organ_key,sex.lower(),lat.lower() or 'midline',iri,nodes,vals))
    out={}
    for organ,sex,lat,iri,nodes,vals in contexts:
      out[f'{organ}|XIAP|{sex}|{lat}']={'organKey':organ,'referenceOrganIri':iri,'modelSex':sex,'laterality':lat,'geneId':'XIAP','geneLabel':'XIAP','expressionCohort':'pooled','aggregation':'Unweighted arithmetic mean of source mean_expr rows by as_id, following as-b.ipynb.','sourceVersion':'HRApop v1.1','min':min(vals) if vals else None,'max':max(vals) if vals else None,'nodes':nodes,'coverage':{'totalNodes':len(nodes),'nodesWithData':len(vals),'nodesWithoutData':len(nodes)-len(vals)}}
    target=ROOT/'data/processed/expression.json'; target.parent.mkdir(exist_ok=True); target.write_text(json.dumps(out,indent=2));
    print('wrote',target,'contexts',len(out),'XIAP AS values',len(means))
    for k,v in out.items():
      if v['coverage']['nodesWithData']: print(k,v['coverage'],'range',v['min'],v['max'])
if __name__=='__main__': main()
