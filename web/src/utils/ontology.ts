export function normalizeOntologyId(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const [prefix, id] = raw.split(':', 2);
  if (!id || !/^[A-Za-z0-9_.-]+$/.test(id)) return null;
  const p = prefix.toUpperCase();
  if (p === 'UBERON') return `http://purl.obolibrary.org/obo/UBERON_${id}`;
  if (p === 'FMA') return `http://purl.org/sig/ont/fma/fma${id}`;
  if (p === 'CL') return `http://purl.obolibrary.org/obo/CL_${id}`;
  return null;
}

export function mapSceneNodeToOrgan(label: string, sex: 'male' | 'female', laterality: 'left' | 'right' | 'midline' | 'unspecified') {
  const lower = label.toLowerCase().replace(/[-_]/g, ' ');
  const organKey = lower.includes('pancreas') ? 'pancreas' : lower.includes('skin') ? 'skin' : lower.includes('eye') ? 'eye' : lower.includes('large intestine') || lower.includes('colon') ? 'large-intestine' : lower.includes('small intestine') ? 'small-intestine' : lower.includes('kidney') ? 'kidney' : lower.includes('lymph node') ? 'lymph-node' : lower.includes('spinal cord') ? 'spinal-cord' : lower.includes('brain') ? 'brain' : 'unknown';
  const organLabels: Record<string,string> = {'large-intestine':'Large intestine','small-intestine':'Small intestine','lymph-node':'Lymph node','spinal-cord':'Spinal cord'};
  const organLabel = organLabels[organKey] ?? organKey.charAt(0).toUpperCase() + organKey.slice(1);
  return {organKey, organLabel, sex, laterality};
}
