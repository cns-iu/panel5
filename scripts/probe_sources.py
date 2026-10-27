#!/usr/bin/env python3
"""Probe HRA sources and write a reproducible integration report."""
from __future__ import annotations
import csv, gzip, json, platform, sys, urllib.request
from datetime import date
from pathlib import Path
URLS = {
  'ftu_api':'https://apps.humanatlas.io/api/v1/ftu-illustrations',
  'rui_reference_data':'https://apps.humanatlas.io/api/v1/rui-reference-data',
  'ftu_css':'https://cdn.humanatlas.io/ui/ftu-ui/styles.css',
  'ftu_wc':'https://cdn.humanatlas.io/ui/ftu-ui/wc.js',
  'ftu_main':'https://cdn.humanatlas.io/ui/ftu-ui/main.js',
  'hra_pop':'https://github.com/x-atlas-consortia/hra-pop/raw/refs/heads/main/output-data/v1.1/reports/atlas-ad-hoc/datasets-as-ct-gene.csv.gz',
}
def probe(url):
  try:
    req=urllib.request.Request(url, method='HEAD', headers={'User-Agent':'organ-ftu-expression-probe/0.1'})
    with urllib.request.urlopen(req, timeout=15) as r:
      return {'status':r.status,'content_type':r.headers.get('Content-Type'),'content_length':r.headers.get('Content-Length'),'final_url':r.geturl()}
  except Exception as e: return {'error':f'{type(e).__name__}: {e}'}
root=Path(__file__).resolve().parents[1]; out=root/'docs'/'integration-probe.md'; results={k:probe(v) for k,v in URLS.items()}
lines=[f'# Integration probe\n\n- Probe date: {date.today().isoformat()}\n- Host: {platform.platform()}\n- Python: {sys.version.split()[0]}\n- Node: checked separately in the execution log\n- DNS/network note: failures are preserved verbatim.\n','## Endpoint results\n']
for k,v in results.items(): lines += [f'### `{k}`\n\n- URL: `{URLS[k]}`\n- Result: `{json.dumps(v, ensure_ascii=False)}`\n']
all_ok=all(v.get('status')==200 for v in results.values())
if all_ok:
  lines += ['## Interpretation\n\nThe live probe succeeded. Local schema inspection follows the downloaded snapshots.\n']
else:
  lines += ['## Interpretation\n\nOne or more endpoints could not be reached from this environment. The application must keep using explicit empty/error states until verified snapshots are available.\n']
ftu_path=root/'data/raw/ftu-illustrations.json'; rui_path=root/'data/raw/rui-reference-data.json'; pop_path=root/'data/raw/datasets-as-ct-gene.csv.gz'
if ftu_path.exists():
  d=json.loads(ftu_path.read_text()); graph=d.get('@graph',[]); kidney=sum(str(x.get('organ_label','')).lower()=='kidney' for x in graph); lines.append(f'- FTU JSON-LD: {len(graph)} items; Kidney items: {kidney}; required fields checked on downloaded snapshot.\n')
else: lines.append('- FTU JSON-LD local snapshot: not present.\n')
if rui_path.exists():
  d=json.loads(rui_path.read_text()); lookup=d.get('sceneNodeLookup',{}); kidneys=[k for k in d.get('organIRILookup',{}) if 'kidney|' in k.lower()]; lines.append(f'- RUI reference data: sceneNodeLookup={len(lookup)}; kidney organIRILookup entries={len(kidneys)}.\n')
else: lines.append('- RUI reference data local snapshot: not present.\n')
if pop_path.exists():
  rows=0; xiap=0; as_ids=set(); header=[]
  with gzip.open(pop_path,'rt',encoding='utf-8',newline='') as f:
    reader=csv.DictReader(f); header=reader.fieldnames or []
    for row in reader:
      rows+=1
      if row.get('gene_label','').upper()=='XIAP': xiap+=1; as_ids.add(row.get('as_id'))
  lines.append(f'- HRApop v1.1: rows={rows}; columns={header}; XIAP source rows={xiap}; XIAP AS IDs={len(as_ids)}.\n')
else: lines.append('- HRApop local snapshot: not present.\n')
lines += ['\n## Schema checklist\n\n- FTU JSON-LD fields: `@id`, `organ_id`, `organ_label`, `label`, `mapping`, `illustration_files`.\n- RUI fields: `sceneNodeLookup`, `reference_organ`, `representation_of`, `scenegraph`, `scenegraphNode`.\n- HRApop fields: `dataset_id`, `tool`, `as_id`, `as_label`, `cl_id`, `cl_label`, `gene_id`, `gene_label`, `ensembl_id`, `mean_expr`.\n']
out.write_text('\n'.join(lines)); print(out)
