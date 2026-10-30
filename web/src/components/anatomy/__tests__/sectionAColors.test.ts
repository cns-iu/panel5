import {describe,expect,it} from 'vitest';
import {NEUTRAL_ANATOMY, getSectionAColor, interpolateYlGnBu} from '../sectionAColors';

describe('Section A Viva-inspired palette',()=>{
  it('returns deterministic colors for known organs',()=>{
    expect(getSectionAColor('kidney')).toBe(getSectionAColor('kidney'));
    expect(getSectionAColor('kidney')).not.toBe(NEUTRAL_ANATOMY);
    expect(getSectionAColor('brain')).not.toBe(getSectionAColor('kidney'));
  });

  it('uses the same color for an organ in both sexes',()=>{
    expect(getSectionAColor('large-intestine')).toBe(getSectionAColor('large-intestine'));
  });

  it('uses neutral gray for unknown anatomy and clamps interpolation',()=>{
    expect(getSectionAColor('unknown-structure')).toBe(NEUTRAL_ANATOMY);
    expect(interpolateYlGnBu(-1)).toBe('#ffffd9');
    expect(interpolateYlGnBu(2)).toBe('#081d58');
  });
});
