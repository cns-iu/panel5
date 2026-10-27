import {describe,it,expect} from 'vitest';
import {viridisColor} from '../viridis';
describe('viridisColor',()=>{it('maps endpoints and missing values',()=>{expect(viridisColor(0,0,1)).toBe('#440154');expect(viridisColor(1,0,1)).toBe('#fde725');expect(viridisColor(null,0,1,false)).toBe('#c8d1dc')});it('handles equal ranges',()=>{expect(viridisColor(2,2,2)).toBe('#26828e')})});
