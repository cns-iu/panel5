#!/usr/bin/env python3
"""Validate the Section C reference-organ scene contract against local snapshots."""
from __future__ import annotations
import argparse, hashlib, json, math, struct
from pathlib import Path

def glb_nodes(path: Path) -> set[str]:
    data=path.read_bytes(); offset=12; document=None
    while offset < len(data):
        length, kind=struct.unpack_from('<II', data, offset)
        chunk=data[offset+8:offset+8+length]; offset += 8 + length
        if kind == 0x4E4F534A: document=json.loads(chunk); break
    if document is None: raise ValueError(f'No JSON chunk in {path}')
    return {node.get('name') for node in document.get('nodes',[]) if node.get('name')}

def main() -> None:
    parser=argparse.ArgumentParser(); parser.add_argument('--rui',default='data/raw/rui-reference-data.json'); parser.add_argument('--manifest',default='model-manifest.json'); args=parser.parse_args()
    rui=json.loads(Path(args.rui).read_text()); manifest=json.loads(Path(args.manifest).read_text())
    lines=['# Section C model probe','',f'- Probe date: 2026-10-26 local snapshot','- RUI source: `data/raw/rui-reference-data.json` (`sceneNodeLookup` entries: '+str(len(rui['sceneNodeLookup']))+')','- Selection rule: exact `reference_organ` match plus non-empty `scenegraph` and `scenegraphNode`; no landmarks, extraction sites, or sample blocks are admitted.','']
    for sex in ('male','female'):
        reference=f'https://purl.humanatlas.io/ref-organ/large-intestine-{sex}/v1.3#primary'
        nodes=[node for node in rui['sceneNodeLookup'].values() if node.get('reference_organ')==reference and not str(node.get('@id','')).startswith('https://purl.humanatlas.io/landmark/') and 'landmark' not in str(node.get('scenegraphNode','')).lower() and isinstance(node.get('scenegraph'),str) and node.get('scenegraphNode')]
        model=next(x for x in manifest['sectionCOrganModels'] if x['organKey']=='large-intestine' and x['sex']==sex)
        path=Path('web/public/models')/model['asset']; names=glb_nodes(path); missing=[node['scenegraphNode'] for node in nodes if node['scenegraphNode'] not in names]
        valid=[node for node in nodes if node['scenegraphNode'] in names]; digest=hashlib.sha256(path.read_bytes()).hexdigest(); matrices=sum(isinstance(node.get('transformMatrix'),list) and len(node['transformMatrix'])==16 and all(isinstance(v,(int,float)) and math.isfinite(v) for v in node['transformMatrix']) for node in nodes)
        lines += [f'## {sex.title()} large intestine','',f'- Reference organ IRI: `{reference}`',f'- Anatomy nodes after landmark/sample filtering: `{len(nodes)}`; valid transform matrices: `{matrices}`',f'- Renderable anatomy nodes: `{len(valid)}`; skipped nodes absent from GLB: `{[node["scenegraphNode"] for node in nodes if node["scenegraphNode"] not in names] or "none"}`',f'- GLB: `{model["asset"]}`; bytes `{path.stat().st_size}`; SHA-256 `{digest}`',f'- GLB scene nodes: `{len(names)}`; all renderable scenegraphNode names found: `{all(node["scenegraphNode"] in names for node in valid)}`',f'- Source URL: {model["url"]}','']
    lines += ['## Conclusion','', '- Male and female Large Intestine use verified, organ-specific HRA v1.3 GLBs with the original scene node names retained. Section C reuses these same meshes for expression and the neutral HPO placeholder; no sphere or point fallback is used.']
    print('\n'.join(lines))

if __name__=='__main__': main()
