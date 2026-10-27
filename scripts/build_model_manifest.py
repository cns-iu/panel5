#!/usr/bin/env python3
from __future__ import annotations
import hashlib,json,sys
from pathlib import Path
for name in sys.argv[1:]:
 p=Path(name); print(json.dumps({'asset':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}))
