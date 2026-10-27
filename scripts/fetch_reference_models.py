#!/usr/bin/env python3
"""Fetch GLB assets listed in model-manifest.json after a successful probe.

This script is deliberately opt-in and records bytes/hash; it never guesses a URL.
"""
from __future__ import annotations
import argparse, hashlib, json, urllib.request
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--manifest',default='model-manifest.json'); ap.add_argument('--out',default='data/raw/models'); ap.add_argument('--allow-network',action='store_true'); args=ap.parse_args()
    if not args.allow_network: raise SystemExit('Refusing network download without --allow-network; run scripts/probe_sources.py first.')
    manifest=json.loads(Path(args.manifest).read_text()); out=Path(args.out); out.mkdir(parents=True,exist_ok=True)
    for model in manifest.get('models',[]) + manifest.get('fullBodyModels',[]) + manifest.get('sectionCOrganModels',[]):
        url=model['url']; asset=model['asset']; target=out/asset
        with urllib.request.urlopen(url,timeout=120) as r, target.open('wb') as f:
            while chunk:=r.read(1024*1024): f.write(chunk)
        size=target.stat().st_size
        h=hashlib.sha256(target.read_bytes()).hexdigest()
        if model.get('bytes') and size != model['bytes']:
            raise SystemExit(f'{asset}: byte count mismatch (expected {model["bytes"]}, got {size})')
        if model.get('sha256') and h != model['sha256']:
            raise SystemExit(f'{asset}: SHA-256 mismatch (expected {model["sha256"]}, got {h})')
        print(asset, size, h)
if __name__=='__main__': main()
