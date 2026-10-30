import type {BiologicalSex} from '../../types/hra';
import type {AsHoverMapping} from '../../types/asHover';

// Explicit crosswalk entries validated against the v1.5 united GLB node names
// and the corresponding HRA v1.3 expression scene-node records. Unknown nodes
// intentionally fall back to a name-only label; no ontology ID is invented.
const SHARED: Record<string, Omit<AsHoverMapping, 'parentOrganKey'|'parentOrganLabel'>> = {
  ascending_colon: {label:'ascending colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001156'},
  descending_colon: {label:'descending colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001158'},
  transverse_colon: {label:'transverse colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001157'},
  sigmoid_colon: {label:'sigmoid colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001159'},
  hepatic_flexure_of_colon: {label:'hepatic flexure of colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0022277'},
  splenic_flexure_of_colon: {label:'splenic flexure of colon', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0022276'},
  body_of_pancreas: {label:'body of pancreas', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001150'},
  head_of_pancreas: {label:'head of pancreas', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001069'},
  tail_of_pancreas: {label:'tail of pancreas', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001151'},
  neck_of_pancreas: {label:'neck of pancreas', ontologyId:'http://purl.org/sig/ont/fma/fma14517'},
  uncinate_process_of_the_pancreas: {label:'uncinate process of pancreas', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0010373'},
  kidney_capsule: {label:'kidney capsule', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002015'},
  hilum_of_kidney: {label:'hilum of kidney', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0008716'},
  cortex_of_kidney: {label:'cortex of kidney', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001225'},
  outer_cortex_of_kidney: {label:'outer cortex of kidney', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002189'},
  lungs: {label:'lung', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002048'},
  left_lungs_L: {label:'left lung', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002168'},
  lungs_R: {label:'right lung', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002167'},
  small_intestine: {label:'small intestine', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002108'},
  pancreas: {label:'pancreas', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001264'},
  liver: {label:'liver', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002107'},
  skin: {label:'skin', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002097'},
  eye: {label:'eye', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0000970'},
  brain: {label:'brain', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0000955'},
  spinal_cord: {label:'spinal cord', ontologyId:'http://purl.obolibrary.org/obo/UBERON_0002240'},
};

export function mappingForMesh(sex: BiologicalSex, meshName: string): AsHoverMapping | null {
  const prefix = sex === 'male' ? 'VH_M_' : 'VH_F_';
  const raw = meshName.startsWith(prefix) ? meshName.slice(prefix.length) : meshName;
  const entry = SHARED[raw];
  if (!entry) return null;
  const parentOrganKey = raw.includes('pancreas') ? 'pancreas' : raw.includes('colon') || raw.includes('intestine') ? (raw.includes('small') ? 'small-intestine' : 'large-intestine') : raw.includes('kidney') || raw.includes('cortex') || raw.includes('hilum') ? 'kidney' : raw.includes('lung') ? 'lung' : raw.includes('liver') ? 'liver' : raw.includes('skin') ? 'skin' : raw.includes('eye') ? 'eye' : raw.includes('brain') ? 'brain' : raw.includes('spinal_cord') ? 'spinal-cord' : null;
  const parentOrganLabel = parentOrganKey ? parentOrganKey.split('-').map((x)=>x[0].toUpperCase()+x.slice(1)).join(' ') : null;
  return {...entry, parentOrganKey, parentOrganLabel};
}

export const VERIFIED_AS_MAPPING_COUNT = Object.keys(SHARED).length;
