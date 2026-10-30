import type {Object3D} from 'three';
import type {BiologicalSex, Laterality} from '../../types/hra';
import type {AsHoverInfo, AsHoverMapping} from '../../types/asHover';
import {mappingForMesh} from './asHoverMap';

const READABLE_REPLACEMENTS: Array<[RegExp,string]> = [[/^VH_[MF]_/, ''], [/^Allen_/, ''], [/^Yao_/, '']];
export function humanizeMeshName(name: string): string {
  let value = name || 'Unnamed anatomical structure';
  for (const [pattern,replacement] of READABLE_REPLACEMENTS) value = value.replace(pattern,replacement);
  return value.replace(/[_-]+/g,' ').replace(/\bL\b/g,'left').replace(/\bR\b/g,'right').replace(/\s+/g,' ').trim().replace(/\b\w/g,(c)=>c.toUpperCase());
}

function lateralityFromName(name: string): Laterality {
  const n = name.toLowerCase();
  if (/(^|[_-])(left|l)([_-]|$)/.test(n) || /_l(?:_|$)/.test(n)) return 'left';
  if (/(^|[_-])(right|r)([_-]|$)/.test(n) || /_r(?:_|$)/.test(n)) return 'right';
  return 'midline';
}

export function resolveAsHover(mesh: Object3D, sex: BiologicalSex, mapping: (sex: BiologicalSex, name: string) => AsHoverMapping | null = mappingForMesh): AsHoverInfo | null {
  const meshName = mesh.userData?.meshName || mesh.name || '';
  if (!meshName || mesh.userData?.decorative || mesh.userData?.isSkin || meshName.toLowerCase().includes('skin')) return null;
  const verified = mesh.userData?.asHover as AsHoverMapping | undefined ?? mapping(sex, meshName);
  const organKey = mesh.userData?.organKey ?? null;
  const organLabel = mesh.userData?.parentOrganLabel ?? (organKey ? String(organKey).split('-').map((x)=>x[0].toUpperCase()+x.slice(1)).join(' ') : null);
  return {meshName, label:verified?.label ?? humanizeMeshName(meshName), ontologyId:verified?.ontologyId ?? null, parentOrganKey:verified?.parentOrganKey ?? organKey, parentOrganLabel:verified?.parentOrganLabel ?? organLabel, sex, laterality:lateralityFromName(meshName), matchType:verified ? 'verified' : 'mesh-name-only'};
}
