# HPO future integration

HPO associations are intentionally not processed in this release. Section C exposes a neutral 3D anatomy panel with the status `HPO data not yet available`.

The future contract should remain explicit:

```ts
type HpoViewState =
  | { status: 'pending-data' }
  | { status: 'loading' }
  | { status: 'ready'; payload: HpoOrganMapping }
  | { status: 'error'; message: string };

type HpoOrganMapping = {
  sourceVersion: string;
  organIri: string;
  geneId: string;
  terms: Array<{ hpoId: string; structureIri?: string; score?: number }>;
};
```

No HPO API, ontology lookup, term IDs, scores, counts, or phenotype coloring are used by the current application. The neutral panel is kept read-only until validated data and a documented mapping method are available.
