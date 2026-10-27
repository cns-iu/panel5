# Section C model probe

- Probe date: 2026-10-26 local snapshot
- RUI source: `data/raw/rui-reference-data.json` (`sceneNodeLookup` entries: 1906)
- Selection rule: exact `reference_organ` match plus non-empty `scenegraph` and `scenegraphNode`; no landmarks, extraction sites, or sample blocks are admitted.

## Male large intestine

- Reference organ IRI: `https://purl.humanatlas.io/ref-organ/large-intestine-male/v1.3#primary`
- Anatomy nodes after landmark/sample filtering: `11`; valid transform matrices: `11`
- Renderable anatomy nodes: `11`; skipped nodes absent from GLB: `none`
- GLB: `large-intestine-male-v1.3.glb`; bytes `687076`; SHA-256 `908a5c38bf14574a673f2d2619502281f7f9e47c46c4eba837aae2e80e38c489`
- GLB scene nodes: `11`; all renderable scenegraphNode names found: `True`
- Source URL: https://cdn.humanatlas.io/digital-objects/ref-organ/large-intestine-male/v1.3/assets/3d-sbu-m-large-intestine.glb

## Female large intestine

- Reference organ IRI: `https://purl.humanatlas.io/ref-organ/large-intestine-female/v1.3#primary`
- Anatomy nodes after landmark/sample filtering: `11`; valid transform matrices: `11`
- Renderable anatomy nodes: `11`; skipped nodes absent from GLB: `none`
- GLB: `large-intestine-female-v1.3.glb`; bytes `387376`; SHA-256 `b3046d2af718e7f031578db4089a9f4bea707aa4a75af98aab78f172c2f53d74`
- GLB scene nodes: `11`; all renderable scenegraphNode names found: `True`
- Source URL: https://cdn.humanatlas.io/digital-objects/ref-organ/large-intestine-female/v1.3/assets/3d-sbu-f-large-intestine.glb

## Conclusion

- Male and female Large Intestine use verified, organ-specific HRA v1.3 GLBs with the original scene node names retained. Section C reuses these same meshes for expression and the neutral HPO placeholder; no sphere or point fallback is used.
