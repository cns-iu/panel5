# Validation report

## Current run (2026-10-26)

- Live HRA/FTU/CDN probe: passed. FTU API returned 28 items; Kidney returned 8.
- RUI reference data: passed. `sceneNodeLookup` contains 1,906 entries, including sex/laterality-specific kidney v1.3 GLB mappings.
- HRApop v1.1: passed. 589,550 rows, expected 10 columns, 14 XIAP source rows.
- Real expression ETL: passed for XIAP contexts. Female left kidney maps 12 scene nodes to UBERON:0004200 with pooled mean expression 1.4 from 4 records.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test`: 7 tests passed.
- `npm run test:e2e`: passed.
- Real-page screenshot: [`docs/screenshots/kidney-real-data.png`](screenshots/kidney-real-data.png).
- Whole-body model API: passed. Male and female HRA v1.5 GLBs are served through `/api/v1/models/{sex}` with verified SHA-256 and source-proxy URLs recorded in `model-manifest.json`.
- Official FTU component: passed. `<hra-ftu-ui>` loads the versioned CDN bundle, opens the organ-filtered FTU route, and selects Nephron in the browser test.

## Remaining scope

- The top-level anatomy view uses the male/female HRA v1.5 whole-body GLBs when the downloaded raw assets are present, with the verified kidney models and primitive organ controls kept as an offline/loading fallback.
- The FTU explorer mounts the official `<hra-ftu-ui>` web component and its versioned summaries/datasets bundles. If the CDN is unreachable, it falls back to the reviewed local catalogue.
- Expression colors use the verified scene crosswalk and HRApop XIAP snapshot for the downloaded kidney models. Other genes require repeating the ETL against the locked report.
