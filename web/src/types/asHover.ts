import type {BiologicalSex, Laterality} from './hra';

export type AsHoverInfo = {
  meshName: string;
  label: string;
  ontologyId: string | null;
  parentOrganKey: string | null;
  parentOrganLabel: string | null;
  sex: BiologicalSex;
  laterality: Laterality;
  matchType: 'verified' | 'mesh-name-only';
};

export type AsHoverMapping = {
  label: string;
  ontologyId: string;
  parentOrganKey: string | null;
  parentOrganLabel: string | null;
};
