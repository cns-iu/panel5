import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, Html, useGLTF} from '@react-three/drei';
import {MOUSE} from 'three';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import type {BiologicalSex, Laterality} from '../../types/hra';
import {contextFor, getOrgan} from '../../data/organRegistry';
import {useExplorerStore} from '../../store/selection';
import {staticAsset} from '../../utils/staticAsset';
import {getSectionAColor} from './sectionAColors';

const MODEL_BASE=import.meta.env.VITE_MODEL_BASE_URL;
// The whole-body GLBs are too large for a normal GitHub repository.  They are
// compressed for same-origin GitHub Pages hosting; a configured local API
// remains available for development.
const FULL_BODY_STATIC: Record<BiologicalSex,string> = {
  male: staticAsset('models/hra-reference-organ-united-male-v1.5.glb'),
  female: staticAsset('models/hra-reference-organ-united-female-v1.5.glb'),
};
const placements: Record<string,[number,number,number]> = {pancreas:[0.25,-0.2,0.45],skin:[0,0,0],eye:[0,1.72,0.38],'large-intestine':[0,-0.8,0.38],'small-intestine':[0,-0.38,0.42],kidney:[1.05,0.3,0.35],'lymph-node':[-0.7,0.2,0.38],'spinal-cord':[0,0.3,-0.12],brain:[0,1.72,0.38]};
function OrganMesh({organKey, sex, laterality, onHover}:{organKey:string;sex:BiologicalSex;laterality:Laterality;onHover:(k:string|null)=>void}){
 const selectOrgan=useExplorerStore((s)=>s.selectOrgan); const selected=useExplorerStore((s)=>s.organ); const position=placements[organKey] ?? [0,0,0]; const isSelected=selected?.organKey===organKey&&selected.sex===sex&&selected.laterality===laterality;
 const scale = organKey==='eye'?[.12,.12,.12]:organKey==='large-intestine'?[.9,.45,.25]:organKey==='small-intestine'?[.72,.35,.18]:organKey==='pancreas'?[.65,.2,.2]:organKey==='brain'?[.55,.45,.38]:organKey==='spinal-cord'?[.12,.9,.12]:organKey==='lymph-node'?[.16,.16,.16]:[.28,.48,.2];
 const pos: [number,number,number] = [position[0]+(laterality==='left'&&organKey==='kidney'?-0.28:laterality==='right'&&organKey==='kidney'?0.28:0),position[1],position[2]];
 return <mesh position={pos} scale={scale as [number,number,number]} onPointerOver={(e)=>{e.stopPropagation();onHover(organKey)}} onPointerOut={()=>onHover(null)} onClick={(e)=>{e.stopPropagation();const c=contextFor(organKey,sex,laterality);if(c) selectOrgan(c)}} userData={{organKey, sex, laterality}}>
   <sphereGeometry args={[1,32,20]}/><meshStandardMaterial color={getSectionAColor(organKey)} emissive={isSelected?getSectionAColor(organKey):'#000000'} emissiveIntensity={isSelected?.45:0} roughness={.58} metalness={.05}/>
 </mesh>;
}
function ReferenceKidneyModel({sex,laterality,onSelect}:{sex:BiologicalSex;laterality:Laterality;onSelect:()=>void}){
 const url=staticAsset(`models/kidney-${sex}-${laterality}-v1.3.glb`); const {scene}=useGLTF(url); const cloned=useMemo(()=>scene.clone(true),[scene]); const x=laterality==='right'?1.05:-1.05;
 return <primitive object={cloned} position={[x,.3,.48]} scale={3.5} onClick={(e:any)=>{e.stopPropagation();onSelect()}} userData={{source:'HRA sceneNodeLookup',sex,laterality}}/>;
}
function nodeOrgan(name:string){const n=name.toLowerCase(); if(n.includes('pancreas'))return 'pancreas'; if(n.includes('liver')||n.includes('hepatic')||n.includes('porta_hepatis'))return 'liver'; if((n.includes('lung')||n.includes('bronch')||n.includes('pulmonary')||n.includes('hilum'))&&!n.includes('kidney'))return 'lung'; if(n.includes('skin'))return 'skin'; if(n.includes('eye'))return 'eye'; if(n.includes('large_intestine')||n.includes('colon'))return 'large-intestine'; if(n.includes('small_intestine'))return 'small-intestine'; if(n.includes('kidney')||n.includes('renal_')||n.includes('cortex_of_kidney')||n.includes('medulla')||n.includes('papilla')||n.includes('pyramid'))return 'kidney'; if(n.includes('lymph_node'))return 'lymph-node'; if(n.includes('spinal_cord'))return 'spinal-cord'; if(n.includes('brain'))return 'brain'; return null;}
function nodeLaterality(name:string): Laterality {const n=name.toLowerCase(); if(/(^|[_-])(left|l|_l)([_-]|$)/.test(n)||n.endsWith('_l'))return 'left'; if(/(^|[_-])(right|r|_r)([_-]|$)/.test(n)||n.endsWith('_r'))return 'right'; return 'midline';}
function FullBodyModel({sex,onOrgan,onLoaded}:{sex:BiologicalSex;onOrgan:(organKey:string,laterality:Laterality,sceneNode:string)=>void;onLoaded:()=>void}){
 const {scene}=useGLTF(MODEL_BASE ? `${MODEL_BASE}/${sex}` : FULL_BODY_STATIC[sex]); useEffect(()=>{onLoaded()},[onLoaded]); const cloned=useMemo(()=>{const copy=scene.clone(true);copy.traverse((obj)=>{const nodeName=(obj.name||'').toLowerCase();if(sex==='female'&&nodeName.includes('placenta')){obj.visible=false;obj.traverse((child:any)=>{child.visible=false;child.raycast=()=>{}});return}const mesh=obj as any;if(!mesh.isMesh)return;const organ=nodeOrgan(mesh.name||'');const isSkin=nodeName.includes('skin');if(isSkin)mesh.raycast=()=>{};if(mesh.material){const apply=(m:any)=>{const next=m.clone();next.color?.set(getSectionAColor(organ));if(isSkin){next.transparent=true;next.opacity=.12;next.depthWrite=false}return next};mesh.material=Array.isArray(mesh.material)?mesh.material.map(apply):apply(mesh.material)}mesh.userData={organKey:organ,source:'NIH 3D / HRA v1.5',sceneNode:mesh.name}});return copy},[scene,sex]);
 return <primitive object={cloned} scale={2.05} position={[0,0,0]} onClick={(e:any)=>{e.stopPropagation();const organ=e.object?.userData?.organKey;if(organ)onOrgan(organ,nodeLaterality(e.object?.name||''),e.object?.name||'unknown')}} userData={{source:'NIH 3D 3DPX-021022/3DPX-020992',sex}}/>;
}
function Body({sex,onHover,useFullBody,bodyLoaded,onBodyLoaded}:{sex:BiologicalSex;onHover:(k:string|null)=>void;useFullBody:boolean;bodyLoaded:boolean;onBodyLoaded:()=>void}){
 const selected=useExplorerStore((s)=>s.organ); const selectOrgan=useExplorerStore((s)=>s.selectOrgan); const laterality: Laterality = selected?.sex===sex && selected.organKey==='kidney' ? selected.laterality : 'left';
 const selectKidney=()=>{const c=contextFor('kidney',sex,laterality);if(c)selectOrgan(c)}; const selectFullOrgan=(key:string,lat:Laterality,sceneNode:string)=>{const c=contextFor(key,sex,key==='kidney'?lat:'midline');if(c)selectOrgan({...c,sceneNodeIds:[sceneNode]})};
 return <group rotation={[0,0,0]}>
   {!bodyLoaded && <><mesh position={[0,0,0]} scale={[1.05,1.85,.38]}><capsuleGeometry args={[.62,1.7,12,24]}/><meshPhysicalMaterial color="#dce8f5" transparent opacity={.14} roughness={.1} transmission={.25} depthWrite={false}/></mesh><mesh position={[0,1.72,0]} scale={[.55,.55,.38]}><sphereGeometry args={[1,24,16]}/><meshPhysicalMaterial color="#dce8f5" transparent opacity={.12} depthWrite={false}/></mesh><mesh position={[-.98,.6,0]} rotation={[0,0,-.15]} scale={[.18,1.15,.18]}><capsuleGeometry args={[.5,1.6,8,16]}/><meshPhysicalMaterial color="#dce8f5" transparent opacity={.1} depthWrite={false}/></mesh><mesh position={[.98,.6,0]} rotation={[0,0,.15]} scale={[.18,1.15,.18]}><capsuleGeometry args={[.5,1.6,8,16]}/><meshPhysicalMaterial color="#dce8f5" transparent opacity={.1} depthWrite={false}/></mesh>{(['pancreas','eye','large-intestine','small-intestine','lymph-node','spinal-cord','brain'] as const).map((k)=><OrganMesh key={k} organKey={k} sex={sex} laterality="midline" onHover={onHover}/>)}<OrganMesh organKey="kidney" sex={sex} laterality="left" onHover={onHover}/><OrganMesh organKey="kidney" sex={sex} laterality="right" onHover={onHover}/><Suspense fallback={null}><ReferenceKidneyModel sex={sex} laterality={laterality==='midline'?'left':laterality} onSelect={selectKidney}/></Suspense></>}
   {useFullBody && <Suspense fallback={null}><FullBodyModel sex={sex} onOrgan={selectFullOrgan} onLoaded={onBodyLoaded}/></Suspense>}
 </group>;
}
export function AnatomyScene({sex}:{sex:BiologicalSex}){
 const [hovered,setHovered]=useState<string|null>(null); const [bodyAvailable,setBodyAvailable]=useState(false); const [bodyLoaded,setBodyLoaded]=useState(false); const selected=useExplorerStore((s)=>s.organ); const modelUrl=MODEL_BASE ? `${MODEL_BASE}/${sex}` : FULL_BODY_STATIC[sex];
 // The NIH file endpoint serves the GLB through GET but does not reliably
 // answer cross-origin HEAD requests.  Do not use a HEAD preflight to decide
 // whether the model exists; let drei load the verified public asset directly.
 useEffect(()=>{setBodyLoaded(false);setBodyAvailable(true)},[modelUrl]);
 const laterality = selected?.sex===sex && selected.organKey==='kidney' ? selected.laterality : 'left'; const label=hovered ? (getOrgan(hovered)?.organLabel ?? hovered) : null; const markBodyLoaded=useCallback(()=>setBodyLoaded(true),[]);
 return <div className="anatomy-canvas" aria-label={`${sex} anatomy viewer`}><Canvas camera={{position:[0,0,sex==='male'?5.4:5],fov:40}} dpr={[1,1.5]}><ambientLight intensity={1.2}/><directionalLight position={[3,4,5]} intensity={2}/><Environment preset="city"/><Body sex={sex} onHover={setHovered} useFullBody={bodyAvailable} bodyLoaded={bodyLoaded} onBodyLoaded={markBodyLoaded}/><OrbitControls enablePan={true} mouseButtons={{LEFT:MOUSE.PAN,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.ROTATE}} minDistance={3.2} maxDistance={9}/>{label && <Html position={[0,2.25,0]} center><div className="tooltip">{label} · {sex === 'male' ? 'Male' : 'Female'}{hovered==='kidney' ? ` · ${laterality === 'right' ? 'Right' : 'Left'}`:''}</div></Html>}</Canvas></div>;
}
