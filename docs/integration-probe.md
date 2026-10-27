# Integration probe

- Probe date: 2026-10-26
- Host: macOS-26.6.2-arm64-arm-64bit
- Python: 3.9.6
- Node: checked separately in the execution log
- DNS/network note: failures are preserved verbatim.

## Endpoint results

### `ftu_api`

- URL: `https://apps.humanatlas.io/api/v1/ftu-illustrations`
- Result: `{"status": 200, "content_type": "application/json; charset=UTF-8", "content_length": "2017166", "final_url": "https://apps.humanatlas.io/api/v1/ftu-illustrations"}`

### `rui_reference_data`

- URL: `https://apps.humanatlas.io/api/v1/rui-reference-data`
- Result: `{"status": 200, "content_type": "application/json; charset=UTF-8", "content_length": "6031261", "final_url": "https://apps.humanatlas.io/api/v1/rui-reference-data"}`

### `ftu_css`

- URL: `https://cdn.humanatlas.io/ui/ftu-ui/styles.css`
- Result: `{"status": 200, "content_type": "text/css", "content_length": "44306", "final_url": "https://cdn.humanatlas.io/ui/ftu-ui/styles.css"}`

### `ftu_wc`

- URL: `https://cdn.humanatlas.io/ui/ftu-ui/wc.js`
- Result: `{"status": 200, "content_type": "text/javascript", "content_length": "1714899", "final_url": "https://cdn.humanatlas.io/ui/ftu-ui/wc.js"}`

### `ftu_main`

- URL: `https://cdn.humanatlas.io/ui/ftu-ui/main.js`
- Result: `{"status": 200, "content_type": "text/javascript", "content_length": "1679548", "final_url": "https://cdn.humanatlas.io/ui/ftu-ui/main.js"}`

### `hra_pop`

- URL: `https://github.com/x-atlas-consortia/hra-pop/raw/refs/heads/main/output-data/v1.1/reports/atlas-ad-hoc/datasets-as-ct-gene.csv.gz`
- Result: `{"status": 200, "content_type": "application/octet-stream", "content_length": "11962072", "final_url": "https://raw.githubusercontent.com/x-atlas-consortia/hra-pop/refs/heads/main/output-data/v1.1/reports/atlas-ad-hoc/datasets-as-ct-gene.csv.gz"}`

## Interpretation

The live probe succeeded. Local schema inspection follows the downloaded snapshots.

- FTU JSON-LD: 28 items; Kidney items: 8; required fields checked on downloaded snapshot.

- RUI reference data: sceneNodeLookup=1906; kidney organIRILookup entries=4.

- HRApop v1.1: rows=589550; columns=['dataset_id', 'tool', 'as_id', 'as_label', 'cl_id', 'cl_label', 'gene_id', 'gene_label', 'ensembl_id', 'mean_expr']; XIAP source rows=14; XIAP AS IDs=9.


## Schema checklist

- FTU JSON-LD fields: `@id`, `organ_id`, `organ_label`, `label`, `mapping`, `illustration_files`.
- RUI fields: `sceneNodeLookup`, `reference_organ`, `representation_of`, `scenegraph`, `scenegraphNode`.
- HRApop fields: `dataset_id`, `tool`, `as_id`, `as_label`, `cl_id`, `cl_label`, `gene_id`, `gene_label`, `ensembl_id`, `mean_expr`.
