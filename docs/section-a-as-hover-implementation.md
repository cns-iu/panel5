# Section A AS hover implementation

## Audit and changed files

The existing Section A used a camera-space `<Html>` tooltip and only the
temporary primitive fallback emitted pointer hover events. The real united
v1.5 GLBs had click handling but no anatomical-structure hover contract.

This change adds:

- `web/src/types/asHover.ts` — UI-only hover data contract.
- `web/src/components/anatomy/asHoverMap.ts` — explicit, validated v1.5 node
  names crosswalked to HRA expression scene-node ontology records.
- `web/src/components/anatomy/asHoverResolver.ts` — pure resolver with a
  cautious readable-name fallback and no fabricated IDs.
- `web/src/components/anatomy/AnatomyScene.tsx` — real GLB pointer picking,
  independent male/female state, clearing on canvas/model exit, and the fixed
  HTML bottom-left overlay.
- `web/src/styles/global.css` — non-interactive overlay styling.
- `web/src/components/anatomy/__tests__/asHoverResolver.test.ts` — resolver
  coverage for verified, unknown, skin/decorative, and readable-name cases.

The approved Section A YlGnBu palette remains in `sectionAColors.ts`; no color
logic was changed by this task.

## Asset and mapping audit

The viewers load the locally hosted copies of the NIH/HRA united v1.5 assets
listed in `model-manifest.json`:

- Male: `hra-reference-organ-united-male-v1.5.glb`, NIH 3DPX-021022,
  849 meshes / 1,052 scene nodes.
- Female: `hra-reference-organ-united-female-v1.5.glb`, NIH 3DPX-020992,
  888 meshes / 1,095 scene nodes.

The explicit crosswalk is matched against actual node names and the existing
HRA expression scene-node records. It currently verifies 17 selectable
structures in each sex (34 sex-specific entries total); the female asset does
not contain the male-only uncinate-process node. Skin is deliberately excluded
from raycasting so it cannot occlude internal anatomy. Remaining raycastable
meshes are reported as `mesh-name-only` with `Ontology: Not mapped` rather than
being silently hidden or assigned a parent organ's ID.

Concrete verified examples:

| GLB mesh name | Display label | Ontology |
| --- | --- | --- |
| `VH_M_ascending_colon` / `VH_F_ascending_colon` | Ascending colon | UBERON:0001156 |
| `VH_M_body_of_pancreas` / `VH_F_body_of_pancreas` | Body of pancreas | UBERON:0001150 |
| `VH_M_kidney_capsule_L` / `VH_F_kidney_capsule_L` | Kidney capsule | UBERON:0002015 |
| `VH_M_lungs` / `VH_F_lungs` | Lung | UBERON:0002048 |
| `VH_M_neck_of_pancreas` / `VH_F_neck_of_pancreas` | Neck of pancreas | FMA:14517 |

Meshes without a verified crosswalk still show their human-readable original
node name and `Not mapped`. This is expected for the many v1.5 nodes that do
not have a corresponding v1.3 expression scene-node record in the current
repository; the implementation does not infer ontology identity from a broad
substring or from the parent organ.

## Verification

- `npm run typecheck` — passed.
- `npm run test -- --run` — passed after the resolver tests were added.
- `npm run build` — passed.
- Browser/e2e verification should use the deployed page and real loaded GLBs;
  the repository's Playwright server may be unable to bind in restricted local
  environments. The overlay is `data-testid="as-hover-male"` or
  `data-testid="as-hover-female"` and is pointer-transparent so orbit controls
  and organ clicks remain available.

Section A click selection, FTU filtering, Section C updates, and the original
YlGnBu appearance are preserved.
