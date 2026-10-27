export type BiologicalSex = 'male' | 'female';
export type Laterality = 'left' | 'right' | 'midline' | 'unspecified';
export type ExpressionCohort = 'pooled' | 'male' | 'female';

export type SelectedOrganContext = {
  organKey: string;
  organLabel: string;
  organOntologyIds: string[];
  sex: BiologicalSex;
  laterality: Laterality;
  referenceOrganIri?: string;
  sceneNodeIds: string[];
};

export type FtuIllustration = {
  '@id': string;
  label: string;
  organ_id: string;
  organ_label: string;
  representation_of: string;
  mapping: Array<{label: string; svg_id?: string; svg_group_id?: string; representation_of: string}>;
  illustration_files?: Array<{file: string; file_format: string}>;
  sourceUrl?: string;
};
export type FtuCatalog = {'@graph': FtuIllustration[]};

export type ExpressionNode = {
  sceneNodeId: string;
  ontologyId: string | null;
  label: string;
  meanExpr: number | null;
  nRecords: number;
  hasData: boolean;
};
export type ExpressionResponse = {
  organKey: string;
  referenceOrganIri: string | null;
  modelSex: BiologicalSex;
  laterality: Laterality;
  geneId: string;
  geneLabel: string;
  expressionCohort: ExpressionCohort;
  aggregation: string;
  sourceVersion: string;
  min: number | null;
  max: number | null;
  nodes: ExpressionNode[];
  coverage: {totalNodes: number; nodesWithData: number; nodesWithoutData: number};
  unavailableReason?: string;
};
