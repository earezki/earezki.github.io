import{A as L,d as l,y as P}from"./hooks.module.Defe-Nsp.js";import{B as p}from"./button.BxMsy_Hr.js";import{u as t}from"./jsxRuntime.module.-6qU79gW.js";import{c as u}from"./createLucideIcon.CJzk5HWJ.js";import"./preact.module.Crax5nOs.js";import"./compat.module.A6lYqC56.js";import"./index.DYK6lN4Y.js";import"./cn.CDN07tui.js";/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=u("pause",[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]);/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=u("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]);/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=u("volume-2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=u("volume-x",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);function D({src:y,initialDuration:g=0}){const n=L(null),[i,c]=l(!1),[d,m]=l(0),[o,x]=l(g),[s,v]=l(!1);P(()=>{const e=n.current;if(!e)return;const r=()=>m(e.currentTime),a=()=>{e.duration&&isFinite(e.duration)&&x(e.duration)},f=()=>c(!1);return e.addEventListener("timeupdate",r),e.addEventListener("loadedmetadata",a),e.addEventListener("ended",f),()=>{e.removeEventListener("timeupdate",r),e.removeEventListener("loadedmetadata",a),e.removeEventListener("ended",f)}},[]);const k=()=>{const e=n.current;e&&(i?e.pause():e.play(),c(!i))},w=()=>{const e=n.current;e&&(e.muted=!s,v(!s))},M=e=>{const r=n.current,a=e.target;r&&(r.currentTime=parseFloat(a.value),m(r.currentTime))},h=e=>{if(!isFinite(e))return"0:00";const r=Math.floor(e/60),a=Math.floor(e%60);return`${r}:${a.toString().padStart(2,"0")}`},b=o>0?d/o*100:0;return t("div",{class:"flex flex-col gap-2 w-full",children:[t("audio",{ref:n,src:y,preload:"metadata"}),t("div",{class:"flex items-center",children:[t(p,{variant:"outline",size:"icon",onClick:k,"aria-label":i?"Pause":"Play",class:"h-10 w-10 rounded-full shrink-0",children:i?t(A,{class:"h-5 w-5"}):t(E,{class:"h-5 w-5 ml-0.5"})}),t("div",{class:"flex-1 flex flex-row items-center gap-2 min-w-0",children:[t("span",{class:"text-xs text-muted-foreground w-10 text-right shrink-0",children:h(d)}),t("div",{class:"relative flex-1 h-2 bg-muted-foreground/10 dark:bg-muted-foreground/20 rounded-full overflow-hidden group cursor-pointer",children:[t("div",{class:"absolute inset-y-0 left-0 bg-primary transition-all duration-150",style:{width:`${b}%`}}),t("input",{type:"range",min:"0",max:o||0,value:d,onInput:M,class:"absolute inset-0 w-full opacity-0 cursor-pointer","aria-label":"Seek"})]}),t("span",{class:"text-xs text-muted-foreground w-10 text-left shrink-0",children:h(o)})]}),t(p,{variant:"ghost",size:"icon",onClick:w,"aria-label":s?"Unmute":"Mute",class:"h-10 w-10 shrink-0",children:s?t(z,{class:"h-4 w-4"}):t(T,{class:"h-4 w-4"})})]})]})}export{D as AudioPlayer};
