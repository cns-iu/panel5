import {describe,it,expect} from 'vitest';
import {FTU_CATALOG,filterFtusForOrgan} from '../ftuCatalog';
describe('filterFtusForOrgan',()=>{it('returns only kidney FTUs',()=>{const x=filterFtusForOrgan(FTU_CATALOG,'kidney');expect(x['@graph']).toHaveLength(8);expect(x['@graph'].every((v)=>v.organ_id==='UBERON:0002113')).toBe(true)});it('returns empty for unknown organ',()=>{expect(filterFtusForOrgan(FTU_CATALOG,'unknown')['@graph']).toHaveLength(0)})});
