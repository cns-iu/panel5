// Section A visual styling only. These colors are not model-count data,
// gene-expression values, HPO values, or any other quantitative measurement.
export const YLGNBU_STOPS = [
  '#ffffd9', '#edf8b1', '#c7e9b4',
  '#7fcdbb', '#41b6c4', '#1d91c0',
  '#225ea8', '#253494', '#081d58',
] as const;

export const NEUTRAL_ANATOMY = '#5a616b';

// Fixed visual positions only; they do not encode biological abundance,
// computational-model coverage, expression, or HPO counts.
export const SECTION_A_COLOR_POSITIONS: Record<string, number> = {
  pancreas: 0.08,
  skin: 0.14,
  eye: 0.18,
  'lymph-node': 0.26,
  'large-intestine': 0.36,
  'small-intestine': 0.47,
  lung: 0.56,
  kidney: 0.65,
  'spinal-cord': 0.76,
  liver: 0.84,
  brain: 0.92,
};

function channel(value:string){return Number.parseInt(value,16)}
function hexChannel(value:number){return Math.max(0,Math.min(255,Math.round(value))).toString(16).padStart(2,'0')}

export function interpolateYlGnBu(position:number):string{
  const p=Math.max(0,Math.min(1,position));
  const scaled=p*(YLGNBU_STOPS.length-1);
  const index=Math.min(YLGNBU_STOPS.length-2,Math.floor(scaled));
  const t=scaled-index;
  const left=YLGNBU_STOPS[index].slice(1);
  const right=YLGNBU_STOPS[index+1].slice(1);
  return `#${hexChannel(channel(left.slice(0,2))+(channel(right.slice(0,2))-channel(left.slice(0,2)))*t)}${hexChannel(channel(left.slice(2,4))+(channel(right.slice(2,4))-channel(left.slice(2,4)))*t)}${hexChannel(channel(left.slice(4,6))+(channel(right.slice(4,6))-channel(left.slice(4,6)))*t)}`;
}

export function getSectionAColor(organKey:string|null|undefined):string{
  const position=organKey ? SECTION_A_COLOR_POSITIONS[organKey] : undefined;
  return position===undefined ? NEUTRAL_ANATOMY : interpolateYlGnBu(position);
}
