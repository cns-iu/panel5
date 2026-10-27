# Data dictionary

| Field | Meaning | Source/contract |
|---|---|---|
| `organKey` | Stable application key such as `kidney` | Local registry, aligned to HRA organ ontology |
| `organOntologyIds` | Normalized ontology IRIs | HRA scene/FTU metadata; normalization in `web/src/utils/ontology.ts` |
| `sex` | Anatomical reference model selection (`male` or `female`) | Does not imply sex-stratified expression |
| `laterality` | Model side (`left`, `right`, `midline`, `unspecified`) | Scene metadata when available |
| `@id` | Versioned FTU illustration IRI | HRA FTU JSON-LD |
| `representation_of` | FTU or anatomical structure ontology target | HRA FTU/scene metadata |
| `meanExpr` | Arithmetic mean of source `mean_expr` rows grouped by `as_id` | AS-B notebook method; only valid numeric records are included |
| `nRecords` | Number of valid source records contributing to a mean | ETL output |
| `hasData` | Whether a node has an observed expression value | `false` is missing data, never a zero value |
| `expressionCohort` | `pooled` unless a validated sex-specific dataset is loaded | HRApop/AS-B contract |

## Ontology normalization

`UBERON:0002080` becomes `http://purl.obolibrary.org/obo/UBERON_0002080`; `FMA:1234` follows the notebook's FMA URI form. Existing HTTP(S) IRIs are preserved. Unknown CURIE prefixes are rejected rather than guessed.
