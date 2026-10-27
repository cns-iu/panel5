#!/usr/bin/env python3
"""Validate a downloaded FTU JSON-LD snapshot and report per-organ counts."""
import json,sys
from collections import Counter
p=sys.argv[1] if len(sys.argv)>1 else 'data/raw/ftu-illustrations.json'
d=json.load(open(p)); g=d.get('@graph',[]); missing=[x.get('@id') for x in g if not all(x.get(k) for k in ('@id','organ_id','organ_label','label'))]; print(json.dumps({'items':len(g),'byOrgan':Counter(x.get('organ_label') for x in g),'missingRequired':missing},indent=2,default=dict))
