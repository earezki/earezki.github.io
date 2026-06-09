import{k as c,F as C}from"./preact.module.BrqZEJFG.js";/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase());/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=e=>{const t=w(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var m={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,children:s,iconNode:a,class:n="",...i})=>c("svg",{...m,width:String(t),height:t,stroke:e,"stroke-width":o?Number(r)*24/Number(t):r,class:["lucide",n].join(" "),...!s&&!g(i)&&{"aria-hidden":"true"},...i},[...a.map(([p,d])=>c(p,d)),...C(s)]);/**
 * @license lucide-preact v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=(e,t)=>{const r=({class:o="",className:s="",children:a,...n})=>c(f,{...n,iconNode:t,class:h(`lucide-${l(u(e))}`,`lucide-${l(e)}`,o,s)},a);return r.displayName=u(e),r};export{b as c};
