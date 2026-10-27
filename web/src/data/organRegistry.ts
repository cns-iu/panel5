import type {BiologicalSex, Laterality} from '../types/hra';
export type OrganRegistryEntry = {organKey:string; organLabel:string; ftuOrganId:string; ontologyIds:string[]; supportedSex: BiologicalSex[]; color:string};
export const ORGAN_REGISTRY: OrganRegistryEntry[] = [
  {organKey:'pancreas', organLabel:'Pancreas', ftuOrganId:'UBERON:0001264', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0001264'], supportedSex:['male','female'], color:'#fbbf24'},
  {organKey:'skin', organLabel:'Skin', ftuOrganId:'UBERON:0002097', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0002097'], supportedSex:['male','female'], color:'#f59e8b'},
  {organKey:'eye', organLabel:'Eye', ftuOrganId:'UBERON:0000970', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0000970'], supportedSex:['male','female'], color:'#60a5fa'},
  {organKey:'large-intestine', organLabel:'Large intestine', ftuOrganId:'UBERON:0000059', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0000059'], supportedSex:['male','female'], color:'#34d399'},
  {organKey:'small-intestine', organLabel:'Small intestine', ftuOrganId:'UBERON:0002108', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0002108'], supportedSex:['male','female'], color:'#f97316'},
  {organKey:'kidney', organLabel:'Kidney', ftuOrganId:'UBERON:0002113', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0002113'], supportedSex:['male','female'], color:'#38bdf8'},
  {organKey:'lymph-node', organLabel:'Lymph node', ftuOrganId:'UBERON:0000029', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0000029'], supportedSex:['male','female'], color:'#c084fc'},
  {organKey:'spinal-cord', organLabel:'Spinal cord', ftuOrganId:'UBERON:0002240', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0002240'], supportedSex:['male','female'], color:'#f472b6'},
  {organKey:'brain', organLabel:'Brain', ftuOrganId:'UBERON:0000955', ontologyIds:['http://purl.obolibrary.org/obo/UBERON_0000955'], supportedSex:['male','female'], color:'#fb7185'},
];
export function getOrgan(key:string){return ORGAN_REGISTRY.find((x)=>x.organKey===key) ?? null;}
export function contextFor(key:string, sex:BiologicalSex, laterality:Laterality){const o=getOrgan(key); if(!o) return null; return {organKey:o.organKey,organLabel:o.organLabel,organOntologyIds:o.ontologyIds,sex,laterality,referenceOrganIri:`https://purl.humanatlas.io/ref-organ/${sex}-${key}-${laterality}`,sceneNodeIds:[]};}
