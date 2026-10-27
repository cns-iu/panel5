# Architecture

The React application owns one `SelectedOrganContext` in a Zustand store. Anatomy selection updates the FTU subset and the expression query. FTU selection only updates the FTU detail, preserving the organ-level boundary described in the task brief.

The two anatomy canvases are isolated R3F scenes with independent controls. Their stable `data-testid` organ buttons provide a keyboard and E2E fallback alongside pointer interaction. When the ignored NIH source downloads are present, each scene loads the corresponding HRA v1.5 whole-body GLB through the API, colors the requested pancreas, skin, eye, large intestine, small intestine, kidney, lymph node, spinal cord, and brain meshes, and keeps skin translucent so the organ controls remain discoverable. The verified kidney v1.3 GLBs in `web/public/models` remain available for the expression view and preserve the scene node names recorded in `model-manifest.json`.

The FTU panel mounts the official `hra-ftu-ui` custom element from the versioned HRA CDN. React supplies the verified organ-filtered illustration catalogue plus the official summaries and datasets endpoints, and listens to `illustration-selected`. A local catalogue detail view is kept as a truthful fallback when the CDN cannot be reached.

The Python API is a thin same-origin boundary for organ metadata, gene search, and expression lookup. ETL output is expected at `data/processed/expression.json`; absent data produces a truthful empty state. No tissue blocks, donors, sample cubes, or EUI sample APIs are referenced.
