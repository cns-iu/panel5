#!/usr/bin/env python3
"""Validate a scene-node crosswalk without silently coercing IDs."""
from __future__ import annotations
import json,sys
from pathlib import Path
from collections import Counter

def main():
 path=Path(sys.argv[1]) if len(sys.argv)>1 else Path('data/processed/scene-crosswalk.json')
 if not path.exists(): raise SystemExit(f'{path} not found; run the scene ETL first')
 rows=json.loads(path.read_text()); rows=rows.get('nodes',rows)
 matched=[r for r in rows if r.get('ontologyId') and r.get('geometryKey')]
 dup=[k for k,v in Counter(r.get('ontologyId') for r in matched).items() if v>1]
 result={'sceneNodesTotal':len(rows),'matchedGeometryNodes':len(matched),'unmatchedOntologyIds':sum(not r.get('ontologyId') for r in rows),'duplicateOntologyIds':dup}
 Path('data/processed/mapping-coverage.json').write_text(json.dumps(result,indent=2)); print(json.dumps(result,indent=2))
if __name__=='__main__': main()
