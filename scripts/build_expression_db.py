#!/usr/bin/env python3
"""Build a compact JSON expression snapshot from a locked HRApop CSV.

This script intentionally requires a real input path or URL and never writes test fixtures as production data.
"""
from __future__ import annotations
import argparse, csv, gzip, json, math, urllib.request
from collections import defaultdict
from pathlib import Path

def norm(value):
    value=value.strip()
    if value.startswith(('http://','https://')): return value
    if value.upper().startswith('UBERON:'): return 'http://purl.obolibrary.org/obo/UBERON_'+value.split(':',1)[1]
    if value.upper().startswith('FMA:'): return 'http://purl.org/sig/ont/fma/fma'+value.split(':',1)[1]
    return value

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--input',required=True); ap.add_argument('--output',default='data/processed/expression.json'); ap.add_argument('--organ-key',default=''); ap.add_argument('--sex',default='female'); ap.add_argument('--laterality',default='left'); args=ap.parse_args()
    path=args.input
    if path.startswith('http'): raw=urllib.request.urlopen(path,timeout=60).read(); stream=gzip.GzipFile(fileobj=__import__('io').BytesIO(raw),mode='rb')
    else: stream=gzip.open(path,'rb') if path.endswith('.gz') else open(path,'rb')
    sums=defaultdict(lambda:[0.0,0])
    with stream as f:
      for row in csv.DictReader((line.decode('utf-8') for line in f)):
        if row.get('gene_label','').upper() != 'XIAP' and row.get('gene_id','').upper() != 'XIAP': continue
        try: value=float(row.get('mean_expr',''))
        except (TypeError,ValueError): continue
        if not math.isfinite(value): continue
        sums[norm(row['as_id'])][0]+=value; sums[norm(row['as_id'])][1]+=1
    nodes=[{'sceneNodeId':f'fixture-node-{i}','ontologyId':k,'label':k.rsplit('/',1)[-1],'meanExpr':s/c,'nRecords':c,'hasData':True} for i,(k,(s,c)) in enumerate(sums.items())]
    vals=[n['meanExpr'] for n in nodes]; result={f'{args.organ_key}|XIAP|{args.sex}|{args.laterality}':{'organKey':args.organ_key,'referenceOrganIri':None,'modelSex':args.sex,'laterality':args.laterality,'geneId':'XIAP','geneLabel':'XIAP','expressionCohort':'pooled','aggregation':'Unweighted arithmetic mean of source mean_expr rows by as_id, following as-b.ipynb.','sourceVersion':'HRApop v1.1','min':min(vals) if vals else None,'max':max(vals) if vals else None,'nodes':nodes,'coverage':{'totalNodes':len(nodes),'nodesWithData':len(nodes),'nodesWithoutData':0}}}
    out=Path(args.output); out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(result,indent=2)); print(out)
if __name__=='__main__': main()
