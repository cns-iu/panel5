import {describe,expect,it} from 'vitest';
import {expressionValue,modelUrl,organForNode,sideMatches} from '../AnatomyModelCanvas';

describe('Section C anatomy mapping',()=>{
  it('maps each real large-intestine scene node to the selected organ',()=>{
    expect(organForNode('VH_M_ascending_colon')).toBe('large-intestine');
    expect(organForNode('VH_M_rectum')).toBe('large-intestine');
    expect(organForNode('VH_M_caecum')).toBe('large-intestine');
    expect(organForNode('VH_M_vermiform_appendix')).toBe('large-intestine');
    expect(organForNode('sample_block_01')).toBeNull();
  });

  it('keeps laterality and model URLs sex-specific',()=>{
    expect(sideMatches('VH_F_left_kidney','left')).toBe(true);
    expect(sideMatches('VH_F_right_kidney','left')).toBe(false);
    expect(sideMatches('VH_M_transverse_colon','midline')).toBe(true);
    expect(modelUrl('large-intestine','female','midline')).toContain('large-intestine-female-v1.3.glb');
    expect(modelUrl('kidney','male','left')).toContain('kidney-male-left-v1.3.glb');
  });

  it('treats zero as valid expression and null/NaN as missing',()=>{
    expect(expressionValue({meanExpr:0,hasData:true})).toBe(0);
    expect(expressionValue({meanExpr:null,hasData:true})).toBeNull();
    expect(expressionValue({meanExpr:Number.NaN,hasData:true})).toBeNull();
    expect(expressionValue({meanExpr:1,hasData:false})).toBeNull();
  });
});
