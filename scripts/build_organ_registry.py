#!/usr/bin/env python3
"""Validate/format the canonical organ registry source before shipping it."""
import json
from pathlib import Path
p=Path('data/processed/organ-registry.json')
if p.exists():
 data=json.loads(p.read_text()); assert all(x.get('organKey') and x.get('organOntologyIds') for x in data); print('validated',len(data),'organs')
else: print('No generated registry found; frontend registry remains the reviewed source.')
