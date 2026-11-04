export const ORGAN_GENE_OPTIONS: Record<string,string[]> = {
  pancreas: ['SLC30A8','CPE','EPAS1'],
  skin: ['KRT10','TYR'],
  'large-intestine': ['MUC2'],
  'small-intestine': ['FABP2','DEFA5','SI'],
  kidney: ['UMOD','SLC34A1','NPHS1'],
};

export function genesForOrgan(organKey:string): string[] {
  return [...new Set(['XIAP', ...(ORGAN_GENE_OPTIONS[organKey] ?? [])])];
}
