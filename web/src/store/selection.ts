import {create} from 'zustand';
import type {ExpressionCohort, SelectedOrganContext} from '../types/hra';
export type ExplorerState = {organ:SelectedOrganContext|null; selectedFtuIri:string|null; selectedGeneId:string; expressionStratification:ExpressionCohort; selectOrgan:(organ:SelectedOrganContext)=>void; selectFtu:(iri:string|null)=>void; selectGene:(gene:string)=>void};
export const useExplorerStore=create<ExplorerState>((set)=>({organ:null,selectedFtuIri:null,selectedGeneId:'XIAP',expressionStratification:'pooled',selectOrgan:(organ)=>set({organ,selectedFtuIri:null}),selectFtu:(selectedFtuIri)=>set({selectedFtuIri}),selectGene:(selectedGeneId)=>set({selectedGeneId:selectedGeneId.trim().toUpperCase()})}));
