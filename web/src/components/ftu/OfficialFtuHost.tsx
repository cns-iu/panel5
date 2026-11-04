import {type ReactNode} from 'react';
import type {FtuCatalog} from '../../types/hra';

const BRIDGE_PATH='/ftu-bridge.html';
const ENABLED=import.meta.env.VITE_USE_OFFICIAL_FTU!=='false';

export function preloadOfficialFtuBundle(){
  // The staging bundle is loaded inside the isolated bridge iframe.
}

export function OfficialFtuHost({catalog,organLabel,selectedIri,fallback}:{catalog:FtuCatalog;organLabel:string;selectedIri:string|null;onSelect:(iri:string)=>void;fallback:ReactNode}){
  const initialId=selectedIri??catalog['@graph'][0]?.['@id'];
  if(!initialId)return <>{fallback}</>;
  const src=`${BRIDGE_PATH}?id=${encodeURIComponent(initialId)}`;
  return <div className="official-ftu-host" aria-label={`Functional Tissue Unit Explorer — ${organLabel}`}>
    {ENABLED?<iframe key={src} className="official-ftu-frame" src={src} title={`HRA Functional Tissue Unit Explorer — ${organLabel}`} allow="fullscreen" loading="eager"/>:fallback}
  </div>;
}
