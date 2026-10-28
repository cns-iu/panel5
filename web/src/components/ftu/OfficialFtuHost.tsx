import {createElement, useEffect, useRef, useState, type ReactNode} from 'react';
import type {FtuCatalog} from '../../types/hra';

type FtuElement = HTMLElement & {
  illustrations?: FtuCatalog;
  selectedIllustration?: string;
  summaries?: string;
  datasets?: string;
  baseHref?: string;
};
const BASE = import.meta.env.VITE_FTU_BASE_HREF ?? 'https://cdn.humanatlas.io/ui/ftu-ui/';
const SUMMARY_URL = import.meta.env.VITE_FTU_SUMMARIES_URL ?? `${BASE}assets/TEMP/ftu-cell-summaries.jsonld`;
const DATASET_URL = import.meta.env.VITE_FTU_DATASETS_URL ?? `${BASE}assets/TEMP/ftu-datasets.jsonld`;
const ENABLED = import.meta.env.VITE_USE_OFFICIAL_FTU !== 'false';
let bundlePromise: Promise<void> | null = null;
function loadScript(src:string,id:string,type?:string){return new Promise<void>((resolve,reject)=>{const existing=document.getElementById(id) as HTMLScriptElement|null;if(existing){if(existing.dataset.loaded==='true')return resolve(); existing.addEventListener('load',()=>resolve(),{once:true}); existing.addEventListener('error',()=>reject(new Error(`Failed to load ${src}`)),{once:true}); return;} const script=document.createElement('script');script.id=id;script.src=src;script.async=true;if(type)script.type=type;script.addEventListener('load',()=>{script.dataset.loaded='true';resolve()},{once:true});script.addEventListener('error',()=>reject(new Error(`Failed to load ${src}`)),{once:true});document.head.appendChild(script)});}
function loadOfficialBundle(){if(bundlePromise)return bundlePromise; bundlePromise=(async()=>{if(!document.querySelector('link[data-ftu-styles]')){const link=document.createElement('link');link.rel='stylesheet';link.href=`${BASE}styles.css`;link.dataset.ftuStyles='true';document.head.appendChild(link)} await loadScript(`${BASE}polyfills.js`,'hra-ftu-polyfills'); await loadScript(`${BASE}main.js`,'hra-ftu-main','module'); await customElements.whenDefined('hra-ftu-ui')})(); return bundlePromise;}
export function OfficialFtuHost({catalog,selectedIri,onSelect,fallback}:{catalog:FtuCatalog;selectedIri:string|null;onSelect:(iri:string)=>void;fallback:ReactNode}){
 const elementRef=useRef<FtuElement|null>(null); const [ready,setReady]=useState(false); const [error,setError]=useState<string|null>(null);
 useEffect(()=>{if(!window.location.hostname.endsWith('github.io'))return;const base='/panel5';const normalize=(value:string|URL|null|undefined)=>{if(!value)return value;const url=new URL(String(value),window.location.origin);if(url.pathname==='/ftu'||url.pathname==='/ftu/')return `${base}/ftu${url.search}${url.hash}`;return value};const originalPush=window.history.pushState.bind(window.history);const originalReplace=window.history.replaceState.bind(window.history);window.history.pushState=(state,title,url)=>originalPush(state,title,normalize(url));window.history.replaceState=(state,title,url)=>originalReplace(state,title,normalize(url));return()=>{window.history.pushState=originalPush;window.history.replaceState=originalReplace}},[]);
 useEffect(()=>{if(!ENABLED)return; if(window.location.hostname.endsWith('github.io')&&!document.querySelector('base[data-panel5-base]')){const base=document.createElement('base');base.href='/panel5/';base.dataset.panel5Base='true';document.head.prepend(base)} let active=true;loadOfficialBundle().then(()=>active&&setReady(true)).catch((e)=>active&&setError(e instanceof Error?e.message:'Official FTU bundle unavailable'));return()=>{active=false}},[]);
 useEffect(()=>{if(!ready)return;const id='panel5-ftu-header-style';if(!document.getElementById(id)){const style=document.createElement('style');style.id=id;style.textContent='.official-ftu-host hra-ftu-ui hra-header{display:none!important;}';document.head.appendChild(style)}},[ready]);
 useEffect(()=>{const el=elementRef.current;if(!el||!ready)return;el.baseHref=BASE;el.illustrations=catalog;el.summaries=SUMMARY_URL;el.datasets=DATASET_URL;el.selectedIllustration=selectedIri??catalog['@graph'][0]?.['@id']; const handler=(event:Event)=>{const iri=(event as CustomEvent<string>).detail;if(typeof iri==='string'&&catalog['@graph'].some((item)=>item['@id']===iri))onSelect(iri)};el.addEventListener('illustration-selected',handler);return()=>el.removeEventListener('illustration-selected',handler)},[catalog,onSelect,ready,selectedIri]);
 if(!ready||error||catalog['@graph'].length===0)return <>{fallback}{error&&<p className="ftu-runtime-note">Official HRA FTU bundle unavailable: {error}. Showing the verified catalogue fallback.</p>}</>;
 const initialId=selectedIri??catalog['@graph'][0]?.['@id'];
 // The official component initializes its own Angular router as soon as it is
 // connected. Put it on the /ftu route before React appends the element so its
 // selectedIllustration input opens the detail view instead of the landing page.
 const appBase=window.location.hostname.endsWith('github.io')?'/panel5':'';
 const ftuPath=`${appBase}/ftu`;
 if(initialId&&window.location.pathname!==ftuPath)window.history.replaceState({},'',`${ftuPath}?id=${encodeURIComponent(initialId)}`);
 return <div className="official-ftu-host"><div className="official-ftu-badge">Official HRA FTU Explorer · live Web Component</div>{createElement('hra-ftu-ui',{'selected-illustration':selectedIri ?? catalog['@graph'][0]?.['@id'],ref:(node:HTMLElement|null)=>{elementRef.current=node as FtuElement|null}})}</div>;
}
