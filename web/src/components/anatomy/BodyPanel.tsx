import {useExplorerStore} from '../../store/selection';
import type {BiologicalSex} from '../../types/hra';
import {ORGAN_REGISTRY, contextFor} from '../../data/organRegistry';
import {AnatomyScene} from './AnatomyScene';

export function BodyPanel({sex}:{sex:BiologicalSex}){
  return <section className="body-panel" aria-labelledby={`${sex}-title`}>
    <h3 id={`${sex}-title`} className="body-label">{sex === 'male' ? 'Male reference' : 'Female reference'}</h3>
    <AnatomyScene sex={sex}/>
  </section>;
}

export function ReferenceOrganPicker(){
  const selected=useExplorerStore((s)=>s.organ);
  const select=useExplorerStore((s)=>s.selectOrgan);
  const activeSex=selected?.sex ?? 'male';
  return <section className="reference-organ-picker" aria-label="Reference organ list">
    <div className="section-kicker">REFERENCE ORGANS</div>
    <div className="organ-picker shared-organ-picker">
      {ORGAN_REGISTRY.map(({organKey,organLabel})=>{
        const laterality=organKey==='kidney'?'left':'midline';
        return <button key={organKey} className={selected?.organKey===organKey?'organ-chip active':'organ-chip'} data-testid={`reference-organ-${organKey}`} onClick={()=>{const context=contextFor(organKey,activeSex,laterality);if(context)select(context)}}>{organLabel}</button>;
      })}
    </div>
  </section>;
}
