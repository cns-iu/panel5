import {Canvas} from '@react-three/fiber';
import {OrbitControls, useGLTF} from '@react-three/drei';
import {Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import * as THREE from 'three';
import {MOUSE} from 'three';
import {viridisColor} from '../../utils/viridis';
import type {BiologicalSex, ExpressionResponse, Laterality} from '../../types/hra';
import {staticAsset} from '../../utils/staticAsset';

const API_BASE=import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const HPO_NEUTRAL_COLOR='#dae1e8';

export type AnatomyStats={targetMeshCount:number;matchedCount:number;missingCount:number;min:number|null;max:number|null};
type ViewerMode='expression'|'hpo';
type Props={organKey:string;sex:BiologicalSex;laterality:Laterality;data:ExpressionResponse|null;mode:ViewerMode;onStats?:(stats:AnatomyStats)=>void;onReady?:()=>void;onHover?:(hover:{label:string;meanExpr:number|null;hasData:boolean}|null)=>void};

export function organForNode(name:string){const n=name.toLowerCase();if(n.includes('pancreas'))return 'pancreas';if(n.includes('liver')||n.includes('hepatic')||n.includes('porta_hepatis'))return 'liver';if(n.includes('lung')||n.includes('bronch')||n.includes('pulmonary')||n.includes('hilum'))return 'lung';if(n.includes('skin'))return 'skin';if(n.includes('eye'))return 'eye';if(n.includes('large_intestine')||n.includes('colon')||n.includes('rectum')||n.includes('caecum')||n.includes('ileocecal')||n.includes('vermiform')||n.includes('flexure'))return 'large-intestine';if(n.includes('small_intestine'))return 'small-intestine';if(n.includes('kidney'))return 'kidney';if(n.includes('lymph_node'))return 'lymph-node';if(n.includes('spinal_cord'))return 'spinal-cord';if(n.includes('brain'))return 'brain';return null;}
export function sideMatches(name:string,laterality:Laterality){if(laterality==='midline'||laterality==='unspecified')return true;const n=name.toLowerCase();return laterality==='left'?/(^|[_-])(left|l)([_-]|$)/.test(n)||n.endsWith('_l'):/(^|[_-])(right|r)([_-]|$)/.test(n)||n.endsWith('_r');}
export function modelUrl(organKey:string,sex:BiologicalSex,laterality:Laterality){if(organKey==='large-intestine')return staticAsset(`models/large-intestine-${sex}-v1.3.glb`);if(organKey==='kidney'&&(laterality==='left'||laterality==='right'))return staticAsset(`models/kidney-${sex}-${laterality}-v1.3.glb`);if(['lung','liver','pancreas'].includes(organKey))return staticAsset(`models/hra-reference-organ-united-${sex}-v1.5.glb`);return `${API_BASE}/api/v1/models/${sex}`;}
function nodeKey(value:string){return value.split('#').pop() ?? value;}
export function expressionValue(node:{meanExpr:number|null;hasData:boolean}|undefined){return node&&node.hasData&&typeof node.meanExpr==='number'&&Number.isFinite(node.meanExpr)?node.meanExpr:null;}

function buildScene(scene:THREE.Object3D,props:Props){
  const copy=scene.clone(true);const byNode=new Map((props.data?.nodes ?? []).map((node)=>[nodeKey(node.sceneNodeId),node]));const target:THREE.Mesh[]=[];
  copy.traverse((object)=>{const mesh=object as THREE.Mesh;if(!mesh.isMesh)return;const organ=organForNode(mesh.name||'');const isTarget=organ===props.organKey&&sideMatches(mesh.name||'',props.laterality);mesh.visible=isTarget;if(!isTarget)return;const match=byNode.get(mesh.name);target.push(mesh);mesh.userData={...mesh.userData,sceneNodeId:match?.sceneNodeId,ontologyId:match?.ontologyId,label:match?.label ?? mesh.name,meanExpr:match?.meanExpr ?? null,hasData:Boolean(match?.hasData)};});
  if(target.length===0)throw new Error(`No real anatomical meshes found for ${props.organKey} (${props.sex}, ${props.laterality})`);
  const values=props.mode==='expression'?target.map((mesh)=>expressionValue(mesh.userData as {meanExpr:number|null;hasData:boolean})).filter((value):value is number=>value!==null):[];const min=values.length?Math.min(...values):null;const max=values.length?Math.max(...values):null;let matched=0;
  target.forEach((mesh)=>{const value=expressionValue(mesh.userData as {meanExpr:number|null;hasData:boolean});if(value!==null)matched+=1;const color=props.mode==='hpo'?HPO_NEUTRAL_COLOR:viridisColor(value,min,max,value!==null);const apply=(material:THREE.Material)=>{const next=material.clone();if('color' in next)(next as THREE.MeshStandardMaterial).color.set(color);return next};mesh.material=Array.isArray(mesh.material)?mesh.material.map(apply):apply(mesh.material);});
  const bounds=new THREE.Box3();target.forEach((mesh)=>bounds.expandByObject(mesh));const center=bounds.getCenter(new THREE.Vector3());const size=bounds.getSize(new THREE.Vector3());const largest=Math.max(size.x,size.y,size.z);const fitScale=largest>0?2.8/largest:1;return {copy,center,fitScale,stats:{targetMeshCount:target.length,matchedCount:matched,missingCount:target.length-matched,min,max} satisfies AnatomyStats};
}

function RealAnatomy({props,onReady}:{props:Props;onReady:()=>void}){const {scene}=useGLTF(modelUrl(props.organKey,props.sex,props.laterality));const built=useMemo(()=>buildScene(scene,props),[scene,props]);useEffect(()=>{props.onStats?.(built.stats);onReady()},[built,props,onReady]);const position=[-built.center.x*built.fitScale,-built.center.y*built.fitScale,-built.center.z*built.fitScale] as [number,number,number];return <group scale={built.fitScale} position={position}><primitive object={built.copy} onPointerOver={(event:any)=>{event.stopPropagation();const object=event.object;props.onHover?.({label:object.userData?.label ?? object.name,meanExpr:object.userData?.meanExpr ?? null,hasData:Boolean(object.userData?.hasData)})}} onPointerOut={()=>props.onHover?.(null)} onClick={(event:any)=>event.stopPropagation()}/></group>}

class ModelBoundary extends Component<{children:ReactNode;fallbackLabel:string},{error:Error|null}>{state:{error:Error|null}={error:null};static getDerivedStateFromError(error:Error){return {error}}render(){if(this.state.error)return <div className="model-error"><strong>3D anatomy unavailable</strong><span>{this.props.fallbackLabel}</span><code>{this.state.error.message}</code></div>;return this.props.children}}

export function AnatomyModelCanvas(props:Props){const [ready,setReady]=useState(false);const [hover,setHover]=useState<{label:string;meanExpr:number|null;hasData:boolean}|null>(null);const controls=useRef<any>(null);const url=modelUrl(props.organKey,props.sex,props.laterality);const onReady=()=>{setReady(true);props.onReady?.()};return <ModelBoundary key={`${url}-${props.mode}`} fallbackLabel={`Source: ${url}`}><div className="anatomy-model-wrap"><Canvas camera={{position:[0,0,4.6],fov:40}} className="expression-canvas"><ambientLight intensity={1.15}/><directionalLight position={[4,4,5]} intensity={2}/><Suspense fallback={null}><RealAnatomy props={{...props,onHover:(value)=>{setHover(value);props.onHover?.(value)}}} onReady={onReady}/></Suspense><OrbitControls ref={controls} enablePan={true} mouseButtons={{LEFT:MOUSE.PAN,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.ROTATE}} minDistance={2.2} maxDistance={9}/></Canvas>{!ready&&<div className="model-loading">Loading verified 3D anatomy…</div>}<div className="viewer-actions"><button type="button" onClick={()=>controls.current?.reset()}>Reset</button><button type="button" onClick={()=>controls.current?.reset()}>Fit</button></div>{hover&&<div className="model-tooltip"><strong>{hover.label}</strong><span>{props.mode==='hpo'?'HPO data not yet available':hover.hasData&&hover.meanExpr!==null?`Mean expression: ${hover.meanExpr}`:'No expression data'}</span></div>}</div></ModelBoundary>}

export const HPO_NEUTRAL=HPO_NEUTRAL_COLOR;
