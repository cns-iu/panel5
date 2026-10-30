import {describe,expect,it} from 'vitest';
import {humanizeMeshName, resolveAsHover} from '../asHoverResolver';

const mesh=(name:string,userData:Record<string,unknown>={})=>({name,userData} as any);
describe('resolveAsHover',()=>{
  it('resolves a verified GLB node',()=>{const x=resolveAsHover(mesh('VH_M_ascending_colon'),'male');expect(x).toMatchObject({label:'ascending colon',ontologyId:'http://purl.obolibrary.org/obo/UBERON_0001156',parentOrganKey:'large-intestine',matchType:'verified'});});
  it('keeps unknown nodes name-only',()=>{const x=resolveAsHover(mesh('VH_F_mysterious_structure_L'),'female');expect(x).toMatchObject({label:'Mysterious Structure Left',ontologyId:null,matchType:'mesh-name-only',laterality:'left'});});
  it('does not fabricate identifiers for decorative or skin meshes',()=>{expect(resolveAsHover(mesh('VH_M_skin'),'male')).toBeNull(); expect(resolveAsHover(mesh('decorative_backdrop'),'male')).toMatchObject({ontologyId:null});});
  it('normalizes readable labels',()=>{expect(humanizeMeshName('VH_F_head_of_pancreas')).toBe('Head Of Pancreas');});
});
