import {type ReactNode} from 'react';
import type {FtuCatalog} from '../../types/hra';

const STAGING_FTU_URL='https://cns-iu.github.io/hra-ftu-explorer-supporting-information/iftu-testing/';
const ENABLED=import.meta.env.VITE_USE_OFFICIAL_FTU!=='false';

export function preloadOfficialFtuBundle(){
  // The staging bundle is loaded inside the isolated bridge iframe.
}

export function OfficialFtuHost({catalog,organLabel,selectedIri,fallback}:{catalog:FtuCatalog;organLabel:string;selectedIri:string|null;onSelect:(iri:string)=>void;fallback:ReactNode}){
  const initialId=selectedIri??catalog['@graph'][0]?.['@id'];
  if(!initialId)return <>{fallback}</>;
  const src=`${STAGING_FTU_URL}?id=${encodeURIComponent(initialId)}`;
  return <div className="official-ftu-host" aria-label={`Functional Tissue Unit Explorer — ${organLabel}`}>
    <div className="official-ftu-heading">
      <h3>Human Reference Atlas</h3>
      <div><em>Functional Tissue Unit Level</em></div>
      <div className="official-ftu-organ">{organLabel}</div>
      <p>Hover over different cell types in the 2D illustration on left to see gene expression values per cell type for healthy humans in data visualization on right.</p>
    </div>
    {ENABLED?<iframe key={src} className="official-ftu-frame" src={src} title={`HRA Functional Tissue Unit Explorer — ${organLabel}`} allow="fullscreen" loading="eager"/>:fallback}
  </div>;
}
