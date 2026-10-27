# Organ–FTU–Expression Explorer

A React + TypeScript research interface for exploring Human Reference Atlas organ context, Functional Tissue Unit illustrations, and AS-B-style anatomical structure expression. The app is intentionally data-aware: unavailable upstream data remains unavailable instead of being replaced with fake colors or zeros.

## Run the web app

```bash
npm install
cp .env.example .env
npm run dev
```

The browser app runs at `http://localhost:5173`. To run the API in another terminal:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r api/requirements.txt
uvicorn api.app.main:app --reload --port 8000
```

Set `VITE_API_BASE_URL=http://localhost:8000` when using the API. The API serves `/api/v1/health`, `/organs`, `/genes`, and `/expression`. A verified XIAP ETL snapshot is included at `data/processed/expression.json`; regenerate it from the locked raw downloads with `python3 scripts/build_expression_snapshot.py` when the upstream release changes.

Section C uses the HRApop v1.1 XIAP snapshot and verified HRA reference-organ anatomy. Large Intestine uses the organ-specific HRA v1.3 GLBs recorded in [`docs/section-c-model-probe.md`](docs/section-c-model-probe.md); Kidney uses the verified local kidney GLBs when the selected side is available. The left panel colors real meshes by the pooled AS-level expression values, while the right panel shows the same real mesh in neutral color and states `HPO data not yet available`. No HPO data are fetched or inferred. Implementation details and the future HPO contract are documented in [`docs/section-c-implementation-notes.md`](docs/section-c-implementation-notes.md) and [`docs/hpo-future-integration.md`](docs/hpo-future-integration.md).

## Checks

```bash
npm run typecheck
npm run build
npm run test
npm run test:e2e
python3 scripts/probe_sources.py
python3 scripts/build_expression_snapshot.py
```

## Data and deployment notes

External URLs are configurable in `.env.example` and recorded in `data-sources.lock.json`. The 2026-10-26 probe succeeded; four verified kidney GLBs and a compact XIAP expression snapshot are included. The complete male/female HRA v1.5 body GLBs are reproducible source assets and are intentionally ignored because of their size. Fetch them before running the full-body viewer:

```bash
python3 scripts/fetch_reference_models.py --allow-network
```

Do not commit the large raw JSON/CSV/GLB downloads. Run the probe and ETL again when the upstream release changes.

The UI has no tissue-block or donor data dependency. `sex` selects anatomy geometry; expression is labelled pooled until a validated sex-specific dataset exists. The footer carries the research and educational use disclaimer.

See [`docs/integration-probe.md`](docs/integration-probe.md), [`docs/data-dictionary.md`](docs/data-dictionary.md), [`docs/data-provenance.md`](docs/data-provenance.md), and [`docs/validation-report.md`](docs/validation-report.md).
