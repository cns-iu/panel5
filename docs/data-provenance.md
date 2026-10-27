# Data provenance

The current verified snapshot was retrieved on 2026-10-26 from the Human Reference Atlas FTU illustration API, RUI reference data endpoint, HRApop v1.1 report, and HRA CDN kidney reference-organ assets. Exact URLs, versions, content sizes, hashes, and schema notes are tracked in [`data-sources.lock.json`](../data-sources.lock.json), [`model-manifest.json`](../model-manifest.json), and [`integration-probe.md`](integration-probe.md).

The downloaded kidney GLBs are the v1.3 sex/laterality-specific files referenced by `sceneNodeLookup`. Their node names are retained, and `representation_of` values are used for the scene↔AS crosswalk. The expression snapshot in `data/processed/expression.json` follows the AS-B notebook's unweighted arithmetic mean of valid `mean_expr` rows by `as_id`; missing nodes remain null/grey.

The complete male and female body assets are the HRA v1.5 GLBs published through the NIH 3D proxy endpoints listed in `model-manifest.json`. The files are intentionally ignored because they are approximately 136 MiB and 193 MiB; `scripts/fetch_reference_models.py --allow-network` recreates them from the locked URLs and verifies their hashes before the API serves them.

The HRApop input and full RUI/FTU JSON files remain in `data/raw` and are intentionally ignored by Git because they are source downloads. Recreate them with the URLs in `data-sources.lock.json`, then rerun `scripts/build_expression_snapshot.py`.

HRA 3D and FTU resources are generally published under CC BY 4.0; verify the exact release asset before deployment. HRA UI source code is MIT according to its upstream repository. The footer contains the research/educational-use disclaimer.
