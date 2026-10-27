import type {FtuCatalog} from '../types/hra';
import {normalizeOntologyId} from '../utils/ontology';
const labels = [
  ['kidney-ascending-thin-loop-of-henle','Ascending Thin Limb of Loop of Henle','UBERON:0001290'],
  ['kidney-cortical-collecting-duct','Cortical Collecting Duct','UBERON:0004203'],
  ['kidney-descending-thin-loop-of-henle','Descending Thin Limb of Loop of Henle','UBERON:0001289'],
  ['kidney-inner-medullary-collecting-duct','Inner Medullary Collecting Duct','UBERON:0004204'],
  ['kidney-nephron','Nephron','UBERON:0001285'],
  ['kidney-outer-medullary-collecting-duct','Outer Medullary Collecting Duct','UBERON:0004202'],
  ['kidney-renal-corpuscle','Renal Corpuscle','UBERON:0001225'],
  ['kidney-thick-ascending-loop-of-henle','Thick Ascending Limb of Loop of Henle','UBERON:0001291'],
  ['liver-lobule','Liver Lobule','UBERON:0002106'],
  ['lung-pulmonary-alveolus','Pulmonary Alveolus','UBERON:0002037'],
  ['large-intestine-crypt-of-lieberkuhn','Crypt of Lieberkuhn','UBERON:0001982'],
  ['pancreas-pancreatic-acinus','Pancreatic Acinus','UBERON:0000110'],
] as const;
export const FTU_CATALOG: FtuCatalog = {'@graph': labels.map(([slug,label,representation_of])=>({'@id':`https://purl.humanatlas.io/2d-ftu/${slug}`,'label':label,'organ_id':slug.split('-')[0] === 'large' ? 'UBERON:0000059' : slug.split('-')[0] === 'kidney' ? 'UBERON:0002113' : slug.split('-')[0] === 'liver' ? 'UBERON:0002107' : slug.split('-')[0] === 'lung' ? 'UBERON:0002048' : 'UBERON:0001264','organ_label':slug.split('-')[0] === 'large' ? 'Large intestine' : slug.split('-')[0].replace(/^./,(c)=>c.toUpperCase()),representation_of,mapping:[],illustration_files:[{file:`https://cdn.humanatlas.io/2d-ftu/${slug}.svg`,file_format:'svg'}],sourceUrl:`https://humanatlas.io/2d-ftu-illustrations`}))};
export function filterFtusForOrgan(catalog: FtuCatalog, organKey: string): FtuCatalog { const id = ({pancreas:'UBERON:0001264',skin:'UBERON:0002097',eye:'UBERON:0000970','large-intestine':'UBERON:0000059','small-intestine':'UBERON:0002108',kidney:'UBERON:0002113','lymph-node':'UBERON:0000029','spinal-cord':'UBERON:0002240',brain:'UBERON:0000955'} as Record<string,string|undefined>)[organKey]; const normalizedId=id ? normalizeOntologyId(id) : null; return {'@graph':id ? catalog['@graph'].filter((item)=>{const itemId=normalizeOntologyId(item.organ_id) ?? item.organ_id.toLowerCase(); return itemId===normalizedId || itemId===id.toLowerCase()}) : []}; }
