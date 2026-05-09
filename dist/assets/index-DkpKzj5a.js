(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();function hr(t,e){return t.appendChild(e.element),()=>mr(t,e)}function mr(t,e){e.dispose(),t.removeChild(e.element)}const le=Symbol(0);let Ne=!1,de=null,Te=null,X=null,H=0,xe=[],st={};const pr=()=>{},be=0,Dt=1,Be=2,Ie=3;function xr(){Ne=!0,queueMicrotask(Tr)}function Tr(){if(!xe.length){Ne=!1;return}for(let t=0;t<xe.length;t++)xe[t].$st!==be&&vr(xe[t]);xe=[],Ne=!1}function vr(t){let e=[t];for(;t=t[le];)t.$e&&t.$st!==be&&e.push(t);for(let r=e.length-1;r>=0;r--)ct(e[r])}function j(t){const e=br();return Lt(e,t.length?t.bind(null,we.bind(e)):t,null)}function fe(t){if(!t||!de)return t||pr;const e=de;return e.$d?Array.isArray(e.$d)?e.$d.push(t):e.$d=[e.$d,t]:e.$d=t,function(){e.$st!==Ie&&(t.call(null),ut(e.$d)?e.$d=null:Array.isArray(e.$d)&&e.$d.splice(e.$d.indexOf(t),1))}}function we(t=!0){if(this.$st!==Ie){if(this.$h)if(Array.isArray(this.$h))for(let e=this.$h.length-1;e>=0;e--)we.call(this.$h[e]);else we.call(this.$h);if(t){const e=this[le];e&&(Array.isArray(e.$h)?e.$h.splice(e.$h.indexOf(this),1):e.$h=null),wr(this)}}}function wr(t){t.$st=Ie,t.$d&&St(t),t.$s&&Ye(t,0),t[le]=null,t.$s=null,t.$o=null,t.$h=null,t.$cx=st,t.$eh=null}function St(t){try{if(Array.isArray(t.$d))for(let e=t.$d.length-1;e>=0;e--){const r=t.$d[e];r.call(r)}else t.$d.call(t.$d);t.$d=null}catch(e){Gt(t,e)}}function Lt(t,e,r){const n=de,i=Te;de=t,Te=r;try{return e.call(t)}finally{de=n,Te=i}}function Gt(t,e){if(!t||!t.$eh)throw e;let r=0,n=t.$eh.length,i=e;for(r=0;r<n;r++)try{t.$eh[r](i);break}catch(o){i=o}if(r===n)throw i}function Ut(){return this.$st===Ie?this.$v:(Te&&!this.$e&&(!X&&Te.$s&&Te.$s[H]==this?H++:X?X.push(this):X=[this]),this.$c&&ct(this),this.$v)}function Nt(t){const e=ut(t)?t(this.$v):t;if(this.$ch(this.$v,e)&&(this.$v=e,this.$o))for(let r=0;r<this.$o.length;r++)It(this.$o[r],Be);return this.$v}const at=function(){this[le]=null,this.$h=null,de&&de.append(this)},he=at.prototype;he.$cx=st;he.$eh=null;he.$c=null;he.$d=null;he.append=function(t){t[le]=this,this.$h?Array.isArray(this.$h)?this.$h.push(t):this.$h=[this.$h,t]:this.$h=t,t.$cx=t.$cx===st?this.$cx:{...this.$cx,...t.$cx},this.$eh&&(t.$eh=t.$eh?[...t.$eh,...this.$eh]:this.$eh)};he.dispose=function(){we.call(this)};function br(){return new at}const Bt=function(e,r,n){at.call(this),this.$st=r?Be:be,this.$i=!1,this.$e=!1,this.$s=null,this.$o=null,this.$v=e,r&&(this.$c=r),n&&n.dirty&&(this.$ch=n.dirty)},lt=Bt.prototype;Object.setPrototypeOf(lt,he);lt.$ch=Er;lt.call=Ut;function _t(t,e,r){return new Bt(t,e,r)}function Er(t,e){return t!==e}function ut(t){return typeof t=="function"}function ct(t){if(t.$st===Dt)for(let e=0;e<t.$s.length&&(ct(t.$s[e]),t.$st!==Be);e++);t.$st===Be?kt(t):t.$st=be}function yr(t){t.$h&&we.call(t,!1),t.$d&&St(t),t.$eh=t[le]?t[le].$eh:null}function kt(t){let e=X,r=H;X=null,H=0;try{yr(t);const n=Lt(t,t.$c,t);xt(t),!t.$e&&t.$i?Nt.call(t,n):(t.$v=n,t.$i=!0)}catch(n){xt(t),Gt(t,n)}finally{X=e,H=r,t.$st=be}}function xt(t){if(X){if(t.$s&&Ye(t,H),t.$s&&H>0){t.$s.length=H+X.length;for(let r=0;r<X.length;r++)t.$s[H+r]=X[r]}else t.$s=X;let e;for(let r=H;r<t.$s.length;r++)e=t.$s[r],e.$o?e.$o.push(t):e.$o=[t]}else t.$s&&H<t.$s.length&&(Ye(t,H),t.$s.length=H)}function It(t,e){if(!(t.$st>=e)&&(t.$e&&t.$st===be&&(xe.push(t),Ne||xr()),t.$st=e,t.$o))for(let r=0;r<t.$o.length;r++)It(t.$o[r],Dt)}function Ye(t,e){let r,n;for(let i=e;i<t.$s.length;i++)r=t.$s[i],r.$o&&(n=r.$o.indexOf(t),r.$o[n]=r.$o[r.$o.length-1],r.$o.pop())}function M(t,e){const r=_t(t,null,e),n=Ut.bind(r);return n[le]=!0,n.set=Nt.bind(r),n}function Ce(t,e){const r=_t(null,function(){let i=t();return ut(i)&&fe(i),null},void 0);return r.$e=!0,kt(r),we.bind(r,!0)}function J(t,e){return{__component:!0,element:t,dispose:e}}function De(t){return t!==null&&typeof t=="object"&&t.__component}function Cr(t){const e=new FileReader;return new Promise(r=>{e.onload=function(n){const i=n.target.result;r(i)},e.readAsArrayBuffer(t)})}function Fr(t,e,r){return t*(r/e)}function Je(t){return"error"in t}let $r=0;function Ar(){return $r++}function Rr(){let t=0;return()=>t++}let ye="<",Ge="</",se=">",ze="/>",Mr="<!--",Pr="-->";const Qe=`
`,Dr="\r";let Xe=new Set([Dr,Qe," "]);const Ot="onClick",Wt="onInput",Ht="onKeyDown",Vt="onFocusOut",zt="onChange",Xt="onScroll";let Sr=new Set([Ot,Wt,Ht,Vt,zt,Xt]),Lr=new Set(["disabled"]),Gr=new Set(["value"]);const ae="children";function Ur(t,e){const r={type:"element",tag:"div",properties:[],bindings:[],events:[],children:[]};let n=r,i=0,o=0,s=0,a=0,l=0;const u=Q();if(u)return{error:u};return{value:r};function g(T=1){return t[i].slice(o,o+T)||""}function c(){return e[s]}function f(){s+=1}function h(T=1){o+=T,l+=T}function w(){i+=1,o=0}function p(){let T=t[i];for(;o<T.length&&Xe.has(T[o]);)T[o]===Qe&&(a+=1,l=0),h()}function E(){let T=t[i];for(;(o<T.length||O())&&g(3)!==Pr;)T[o]===Qe&&(a+=1,l=0),O()?(w(),f(),T=t[i]):h()}function m(){const T=t[i];return o>=T.length&&i>=t.length-1}function b(){let T=o,y=t[i];for(;o<y.length&&!Xe.has(y[o])&&y[o]!==se;)h();return y.slice(T,o)}function d(){p();const T=x();if(Je(T))return T.error;if(T.value.selfClosing)return null;const y=Q();if(y)return y;const S=R();if(S)return S}function x(){if(g()===ye)h();else return{error:U(`Error during parseElementStart: expect start of opening element "${ye}", but got "${g()}"`)};const T=b();n.tag=T,p();const y=$();if(y)return{error:y};let S=!1;if(g()===se)h();else if(g(2)===ze)S=!0,h(2);else return{error:U(`Error during parseElementStart: expect end of opening element "${se}" or "${ze}", but got "${g()}"`)};return{value:{selfClosing:S,tag:T}}}function $(){for(;g()!==se&&g(2)!==ze;){p();const T=P();if(g()!=="=")return U(`Error during parseAttribs: invalid char between attrib name and value; expect "=", but got "${g()}"`);h();const y=te();if(Je(y))return y.error;const S=y.value;if(Sr.has(T)){if(typeof S!="function")return U(`Error during parseAttribs: "${T}" event attrib; expect value to be function, but got "${typeof S}"`);n.events.push([T,S])}else if(typeof S=="function")n.bindings.push([T,S]);else if(typeof S=="number"||typeof S=="string"||typeof S=="boolean")n.properties.push([T,S]);else return U("Error during parseAttribs: unknown atrib value type");p()}}function P(){let T=o,y=t[i];for(;o<y.length&&y[o]!=="="&&!Xe.has(y[o]);)h();return y.slice(T,o)}function k(){let T=o,y=t[i];for(;o<y.length&&y[o]!=='"';)h();return y.slice(T,o)}function te(){if(g()!=='"')return{error:U(`Error during parseAttribValue: value should be enclosing in '"', but got "${g()}"`)};if(h(),O()){w();const y=c();return f(),T()??{value:y}}else{let y=k();return T()??{value:y}}function T(){if(g()!=='"')return{error:U(`Error during parseAttribValue: value should be enclosing in '"', but got "${g()}"`)};h()}}function O(){return t[i].length===o}function Q(){for(;p(),!m();)if(O()){const T=c();if(typeof T=="function")n.bindings.push([ae,T]);else if(typeof T=="number"||typeof T=="string"||typeof T=="boolean")n.properties.push([ae,T]);else return U("Error during parseChildren: unknown atrib value type");w(),f()}else if(g(4)===Mr)h(4),E(),h(3);else{if(g(2)===Ge)break;if(g()===ye){const T=n;n={type:"element",tag:void 0,properties:[],bindings:[],events:[],children:[]},T.children.push(n);const y=d();if(y)return y;n=T}else{const T=D();n.children.push({type:"text",value:T})}}p()}function D(){let T=o,y=t[i];for(;o<y.length&&y[o]!==ye;)h();return y.slice(T,o)}function R(){if(g(2)===Ge)h(2);else return U(`Error during parseElementEnd: expect start of closing element "${Ge}", but got "${g(2)}"`);const T=b();if(T!==n.tag)return U(`Error during parseElementEnd: expect closing element to be "${n.tag}", but got "${T}"`);if(p(),g()===se)h();else return U(`Error during parseElementEnd: expect end of closing element "${se}", but got "${g()}"`)}function U(T){return{description:T,line:a,templatesIndex:i,column:l,valuesIndex:s}}}function Tt(t,e,r){let n="",i=t,o=1;const s=Ar(),a=Rr();return l(),n;function l(){if(i.type==="text"){n+=`${new Array(o+1).join(" ")}${i.value}
`;return}let g=null;const c=()=>(g===null&&(g=`parsed-element-${s}-${a()}`),`[${g}]`),f="@{reactive binding}",h="@{event handler}";n+=`${new Array(o).join(" ")}${ye}${i.tag}`;const w=i.bindings.filter(([d])=>d!==ae).sort(([d],[x])=>d.charCodeAt(0)-x.charCodeAt(0)),p=i.events.toSorted(([d],[x])=>d.charCodeAt(0)-x.charCodeAt(0)),E=i.properties.filter(([d])=>d!==ae).sort(([d],[x])=>d.charCodeAt(0)-x.charCodeAt(0));if(E.length>0){const d=E.map(([x,$])=>`${x}="${String($)}"`).join(" ");n+=` ${d}`}if(i.bindings.length>0&&e)e(c,i.bindings);else if(w.length>0){const d=w.map(([x])=>`${x}="${f}"`).join(" ");n+=` ${d}`}if(p.length>0)if(r)r(c,p);else{const d=p.map(([x])=>`${x}="${h}"`).join(" ");n+=` ${d}`}g&&(n+=` ${g}`),n+=se,i.children.length>0&&(n+=`
`);const m=i.bindings.find(([d])=>d===ae),b=i.properties.find(([d])=>d===ae);m&&!e?n+=f:b?n+=String(b[1]):u(),i.children.length>0&&(n+=new Array(o).join(" ")),n+=`${Ge}${i.tag}${se}`,n+=`
`}function u(){if(i.type==="text")return;o+=1;let g=i;for(let c=0;c<i.children.length;c++)i=i.children[c],l(),i=g;o-=1}}function L(t,...e){let r=Ur(t,e);if(Je(r)){let f=new Array(t.length+e.length);for(let p=0;p<t.length-1;p++)f[p*2+0]=t[p],f[p*2+1]=String(e[p]);f[(t.length-1)*2+0]=t[t.length-1];const h=f.join("");console.warn(`Error for template
`+h),console.warn("html parsing error: ",r.error.description);const w=h.split(`
`);if(r.error.line<w.length){const p=r.error.column-15,E=r.error.column+15;console.warn(`Error at line - ${r.error.line} column - ${r.error.column}`),r.error.line!==0&&console.warn(`${r.error.line-1}: ${w[r.error.line-1]}`),console.warn(`${r.error.line}: ${w[r.error.line].slice(0,p)+"%c"+w[r.error.line].slice(p)}`,"color: red"),r.error.line<w.length-1&&console.warn(`${r.error.line+1}: ${w[r.error.line+1]}`),console.warn(`Error at line - ${w[r.error.line].slice(p,E)}`)}return{element:document.createElement("div"),dispose:()=>{}}}let n=Tt(r.value);const i=document.createElement("div");let o=()=>{},s=[],a=[],l=[];const u=(f,h)=>{const w=h.find(([E])=>E===ae),p=h.filter(([E])=>E!==ae);w&&l.push({selector:f(),child:w[1]}),p.length>0&&p.forEach(E=>{s.push({selector:f(),binding:E})})},g=(f,h)=>{h.length>0&&h.forEach(w=>{a.push({selector:f(),event:w})})},c=Tt(r.value,u,g);return i.innerHTML=c,(l.length>0||s.length>0||a.length)&&j(f=>{const h=E=>{De(E)&&E.dispose()},w=new Map;let p=[];o=()=>{p.forEach(h),f()};for(let E=0;E<l.length;E++){const m=l[E];let b=w.has(m.selector)?w.get(m.selector):i.querySelector(m.selector);w.set(m.selector,b),b?Ce((()=>{let x=null;return()=>{if(vt(m.child)){const $=m.child();De($)?(h(x),b.innerHTML="",b.appendChild($.element)):$===null?(h(x),b.innerHTML=""):vt(m.child)&&Array.isArray($)?Array.isArray(x)?(x.filter(k=>$.findIndex(te=>k===te)===-1).forEach(k=>{h(k),b.removeChild(k.element)}),$.forEach(k=>{b.appendChild(k.element)})):(h(x),b.innerHTML="",$.forEach(P=>{b.appendChild(P.element)})):b.innerHTML=String($),De(x)&&(p=p.filter(P=>P!==x)),De($)&&p.push($),x=$}else b.innerHTML=String(m.child())}})()):(console.warn("Error during parsing template: cannot find element with id "+m.selector),console.warn(`Error for template
`+n),console.warn(`Error for result template
`+c))}for(let E=0;E<s.length;E++){const m=s[E];let b=w.has(m.selector)?w.get(m.selector):i.querySelector(m.selector);w.set(m.selector,b),b?Ce(()=>{if(Lr.has(m.binding[0])){const d=m.binding[1]();d?b.setAttribute(m.binding[0],String(d)):b.removeAttribute(m.binding[0])}else if(Gr.has(m.binding[0])){const d=m.binding[1]();b[m.binding[0]]=String(d)}else{const d=m.binding[1]();b.setAttribute(m.binding[0],String(d))}}):console.warn("Error during parsing template: cannot find element with id "+m.selector)}for(let E=0;E<a.length;E++){const m=a[E];let b=w.has(m.selector)?w.get(m.selector):i.querySelector(m.selector);if(w.set(m.selector,b),b){if(m.event[0]===Ot){const d=x=>{m.event[1](x)};b.addEventListener("click",d),fe(()=>b.removeEventListener("click",d))}if(m.event[0]===Wt){const d=x=>{m.event[1](x)};b.addEventListener("input",d),fe(()=>b.removeEventListener("input",d))}if(m.event[0]===Ht){const d=x=>{m.event[1](x)};b.addEventListener("keydown",d),fe(()=>b.removeEventListener("keydown",d))}if(m.event[0]===Vt){const d=x=>{m.event[1](x)};b.addEventListener("focusout",d),fe(()=>b.removeEventListener("focusout",d))}if(m.event[0]===zt){const d=x=>{m.event[1](x)};b.addEventListener("change",d),fe(()=>b.removeEventListener("change",d))}if(m.event[0]===Xt){const d=x=>{m.event[1](x)};b.addEventListener("scroll",d),fe(()=>b.removeEventListener("scroll",d))}}else console.warn("Error during parsing template: cannot find element with id "+m.selector)}}),J(i,o)}function _(t){return t.__child=!0,t}function vt(t){return t.__child}var Ue=(t=>(t[t.comma=44]="comma",t[t.semicolon=59]="semicolon",t[t.G=71]="G",t[t.I=73]="I",t[t.F=70]="F",t))(Ue||{}),Ze=(t=>(t[t.blockLabel=33]="blockLabel",t[t.graphicControl=249]="graphicControl",t[t.applicationLabel=255]="applicationLabel",t))(Ze||{}),Oe=(t=>(t[t.imageSeparator=44]="imageSeparator",t[t.gifTermination=59]="gifTermination",t))(Oe||{}),K=(t=>(t[t.start=6]="start",t[t.size=7]="size",t))(K||{}),ge=(t=>(t[t.start=13]="start",t[t.entriesCount=3]="entriesCount",t))(ge||{}),qt=(t=>(t[t.size=10]="size",t))(qt||{});function jt(t,e){return Kt(t,ge.start,e)}function Kt(t,e,r){const n=new Uint8Array(t),i=1<<r;let o=n.subarray(e,e+i*3);return{entriesCount:i,getRed(s){return n[e+(s*3+0)]},getGreen(s){return n[e+(s*3+1)]},getBlue(s){return n[e+(s*3+2)]},getColor(s){return{red:this.getRed(s),green:this.getGreen(s),blue:this.getBlue(s)}},getRawData(){return o}}}function Nr(t,e){const r=new Uint8Array(t);r[e]!==Oe.imageSeparator&&console.warn(`Invalid image descriptor: ${e}. Image desriptor doesn't start with ','`);const n=r[e+1]|r[e+2]<<8,i=r[e+3]|r[e+4]<<8,o=r[e+5]|r[e+6]<<8,s=r[e+7]|r[e+8]<<8,a=r[e+9]>>7,l=r[e+9]>>6&1,u=(r[e+9]&7)+1;return{imageLeft:n,imageTop:i,imageWidth:o,imageHeight:s,M:a,I:l,pixel:u,compressedData:null,graphicControl:null,colorMap:null,startPointer:0}}function Yt(t,e){const r=new Uint8Array(t);for(;r[e]&&e<r.byteLength;){const n=r[e];e+=n+1}return e+1}var _e=(t=>(t[t.noAction=0]="noAction",t[t.noDispose=1]="noDispose",t[t.clear=2]="clear",t[t.prev=3]="prev",t))(_e||{});function Br(t,e){const r=new Uint8Array(t),n=r[e]&1,i=r[e]>>>1&1,o=r[e]>>>2&7,s=(r[e+1]|r[e+2]<<8)*10,a=r[e+3];return{isTransparent:n,isUserInputRequired:i,disposalMethod:o,delayTime:s,transparentColorIndex:a}}function _r(t,e){return e+=1,Yt(t,e)}function Jt(t,e){const r=new Uint8Array(t),n=[];let i=null,o=null;for(;e<r.byteLength&&e!==-1;)switch(r[e]){case Ze.blockLabel:{if(e++,r[e++]===Ze.graphicControl){const a=r[e];i=Br(t,e+1),e=e+a+1}else e=Yt(t,e);break}case Oe.imageSeparator:{o=Nr(t,e),n.push(o),e+=qt.size,o.M&&(o.colorMap=Kt(t,e,o.pixel),e+=o.colorMap.entriesCount*ge.entriesCount),i&&(o.graphicControl=i),o.compressedData=r.subarray(e,_r(t,e)),o.startPointer=e,e+=o.compressedData.byteLength;break}default:{e++;break}}return{images:n,blockEnd:e}}function kr(t){const e=new Uint8Array(t);e[K.start+K.size-1]!==0&&console.warn("Invalid Screen Descriptor section: last byte should be 0");const r=e[K.start+0]|e[K.start+1]<<8,n=e[K.start+2]|e[K.start+3]<<8,i=e[K.start+4]>>7,o=((e[K.start+4]&112)>>4)+1,s=(e[K.start+4]&7)+1,a=e[K.start+5];return{screenWidth:r,screenHeight:n,M:i,cr:o,pixel:s,background:a}}function Ir(t){const e=String.fromCharCode,r=new Uint8Array(t);if(r[0]===Ue.G&&r[1]===Ue.I&&r[2]===Ue.F){const n=Number(e(r[3]))*10+Number(e(r[4])),i=`GIF${n}${e(r[5])}`,o=kr(t);let s=ge.start,a=null;o.M&&(a=jt(t,o.pixel),s+=a.entriesCount*ge.entriesCount);let{images:l,blockEnd:u}=Jt(t,s);for(;u<r.length&&r[u]!==Oe.gifTermination;)u++;return u>r.length&&console.warn("GIF doens`t terminate with proper symbol. It may be corrapted."),{signature:i,version:n,screenDescriptor:o,colorMap:a,images:l,buffer:r}}}function Or(t,e){const r=new Uint8Array(e);let n=null,i=ge.start;t.screenDescriptor.M&&(n=jt(e,t.screenDescriptor.pixel),i+=n.entriesCount*ge.entriesCount);let{images:o}=Jt(e,i);t.colorMap=n,t.images=o,t.buffer=r}function Wr(t){return{gif:t}}class Hr{constructor(){this.onceTimerId=-1}once(e,r){this.onceTimerId=setTimeout(e,r)}clear(){return this.isOnceTimerSetted()?(clearTimeout(this.onceTimerId),this.onceTimerId=-1,!0):!1}isOnceTimerSetted(){return this.onceTimerId!==-1}}class wt{constructor(e,r){this.width=e,this.height=r,this.memory=new ImageData(e,r)}getRawMemory(){return this.memory}setRedInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+0]=n}setGreenInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+1]=n}setBlueInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+2]=n}setAlphaInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+3]=n}set(e){this.memory.data.set(e.getRawMemory().data)}}class Vr{constructor(e,r,n,i){this.ctx=e.getContext("2d"),this.graphicMemory=new wt(r.screenWidth,r.screenHeight),this.prevGraphicMemory=new wt(r.screenWidth,r.screenHeight)}drawToTexture(e,r,n){const i=e.graphicControl;i!=null&&i.isTransparent?this.updateFrameData89(e,r,n):this.updateFrameData87(e,r,n)}drawToScreen(){const e=this.graphicMemory;this.ctx.putImageData(e.getRawMemory(),0,0)}restorePrevDisposal(){this.graphicMemory.set(this.prevGraphicMemory)}saveDisposalPrev(){this.prevGraphicMemory.set(this.graphicMemory)}getCanvasPixels(e){new Uint8ClampedArray(e.buffer).set(this.graphicMemory.getRawMemory().data)}getPrevCanvasPixels(e){new Uint8ClampedArray(e.buffer).set(this.prevGraphicMemory.getRawMemory().data)}dispose(){}getCurrentTexture(){throw new Error("Method not implemented.")}updateFrameData87(e,r,n){const i=this.graphicMemory,o=e.M?e.colorMap:r,s=e.imageLeft,a=e.imageTop,l=e.imageHeight,u=e.imageWidth;let g=0,c=0,f=0;for(let h=0;h<l;h++)for(let w=0;w<u;w++)f=h*u+w,g=w+s,c=h+a,i.setRedInPixel(g,c,o.getRed(n[f])),i.setGreenInPixel(g,c,o.getGreen(n[f])),i.setBlueInPixel(g,c,o.getBlue(n[f])),i.setAlphaInPixel(g,c,255)}updateFrameData89(e,r,n){const i=this.graphicMemory,o=e.M?e.colorMap:r,s=e.graphicControl,a=e.imageLeft,l=e.imageTop,u=e.imageHeight,g=e.imageWidth;let c=0,f=0,h=0;for(let w=0;w<u;w++)for(let p=0;p<g;p++)h=w*g+p,n[h]!==s.transparentColorIndex&&(c=p+a,f=w+l,i.setRedInPixel(c,f,o.getRed(n[h])),i.setGreenInPixel(c,f,o.getGreen(n[h])),i.setBlueInPixel(c,f,o.getBlue(n[h])),i.setAlphaInPixel(c,f,255))}}var et=(t=>(t[t.FLOAT=0]="FLOAT",t))(et||{});function zr(t,e){switch(e){case 0:return t.FLOAT}return 0}function bt(t,e){switch(e){case t.FLOAT:case 0:return Float32Array.BYTES_PER_ELEMENT}return 0}class Xr{constructor(e,r){this.vbo=e.createBuffer();let n=0;if(this.layout=r.map(i=>{const o=n;return n+=bt(e,i.type)*i.componentsCount,{type:zr(e,i.type),componentsCount:i.componentsCount,offset:o}}),this.stride=0,r.length){const i=this.layout[r.length-1];this.stride=i.offset+bt(e,i.type)*i.componentsCount}}bind(e){e.bindBuffer(e.ARRAY_BUFFER,this.vbo)}activateAttribPointer(e,r){r>=0&&r<this.layout.length&&(this.setAttribPointer(e,r),e.enableVertexAttribArray(r))}activateAllAttribPointers(e){this.setAllAttribPointers(e);for(let r=0;r<this.layout.length;r++)e.enableVertexAttribArray(r)}setData(e,r){e.bufferData(e.ARRAY_BUFFER,r,e.STATIC_DRAW)}dispose(e){e.deleteBuffer(this.vbo)}setAttribPointer(e,r){if(r>=0&&r<this.layout.length){const n=this.layout[r];e.vertexAttribPointer(r,n.componentsCount,n.type,!1,this.stride,n.offset)}}setAllAttribPointers(e){for(let r=0;r<this.layout.length;r++){const n=this.layout[r];e.vertexAttribPointer(r,n.componentsCount,n.type,!1,this.stride,n.offset)}}}const Qt=3,Zt=2,qr=Qt+Zt,jr=[{type:et.FLOAT,componentsCount:Qt},{type:et.FLOAT,componentsCount:Zt}];Float32Array.from([-1,1,0,0,1,1,1,0,1,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0,-1,-1,0,0,0]);const er=Float32Array.from([-1,1,0,0,0,1,1,0,1,0,-1,-1,0,0,1,1,1,0,1,0,1,-1,0,1,1,-1,-1,0,0,1]),Z=er.length/qr;var tt=(t=>(t[t.NEAREST=0]="NEAREST",t[t.LINEAR=1]="LINEAR",t))(tt||{}),rt=(t=>(t[t.RGB=0]="RGB",t[t.RGBA=1]="RGBA",t[t.R8=2]="R8",t[t.RED=3]="RED",t))(rt||{}),tr=(t=>(t[t.UNSIGNED_BYTE=0]="UNSIGNED_BYTE",t))(tr||{}),nt=(t=>(t[t.TEXTURE0=0]="TEXTURE0",t[t.TEXTURE1=1]="TEXTURE1",t[t.TEXTURE2=2]="TEXTURE2",t))(nt||{});function Et(t,e){switch(e){case 0:return t.NEAREST;case 1:return t.LINEAR}return 0}function Se(t,e){switch(e){case 2:return t.R8;case 3:return t.RED;case 0:return t.RGB;case 1:return t.RGBA}return 0}function qe(t,e){switch(e){case 0:return t.UNSIGNED_BYTE}return 0}function Kr(t,e){return t.TEXTURE0+e}const rr={min:0,mag:0},nr={internalFormat:0,format:0,type:0},Yr={filtering:rr,imageFormat:nr};class it{constructor(e,r,n,i,o=Yr){this.width=r,this.height=n,this.texture=e.createTexture(),this.textureUnit=0;const s=(o==null?void 0:o.filtering)??rr,a=(o==null?void 0:o.imageFormat)??nr;this.config={filtering:s,imageFormat:a},e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,Et(e,s.min)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,Et(e,s.mag)),e.texImage2D(e.TEXTURE_2D,0,Se(e,a.internalFormat),r,n,0,Se(e,a.format),qe(e,a.type),i),e.bindTexture(e.TEXTURE_2D,null)}bind(e){e.bindTexture(e.TEXTURE_2D,this.texture)}setTextureWrap(e,r,n){e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,r,n),e.bindTexture(e.TEXTURE_2D,null)}setTextureFilter(e,r,n){e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,r,n),e.bindTexture(e.TEXTURE_2D,null)}getTextureUnit(){return this.textureUnit}setTextureUnit(e){this.textureUnit=e}setData(e,r,n,i,o,s){const a=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,r,n,i,o,Se(e,a.format),qe(e,a.type),s),this.prevDataPointer=s}putData(e,r,n,i,o,s){if(this.prevDataPointer!==s){const a=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,r,n,i,o,Se(e,a.format),qe(e,a.type),s),this.prevDataPointer=s}}getGLTexture(){return this.texture}activeTexture(e,r){e.activeTexture(Kr(e,r!==void 0?r:this.textureUnit))}getWidth(){return this.width}getHeight(){return this.height}dispose(e){e.deleteTexture(this.texture)}}class Jr{bind(e){console.warn("A noop texture was tried to bind"),console.trace()}getGLTexture(){return null}activeTexture(e,r){}getWidth(){return-1}getHeight(){return-1}setTextureWrap(){}setTextureFilter(){}dispose(){}}function ee(t,e){return{texture:e,readResultToBuffer(i,o){o??(o=t.RGBA);const s=r(e);t.readPixels(0,0,e.getWidth(),e.getHeight(),o,t.UNSIGNED_BYTE,i),n(s)}};function r(i){const o=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,o);const s=t.createRenderbuffer();return t.bindRenderbuffer(t.RENDERBUFFER,s),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH24_STENCIL8,i.getWidth(),i.getHeight()),t.bindRenderbuffer(t.RENDERBUFFER,null),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,s),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i.getGLTexture(),0),o}function n(i){t.bindFramebuffer(t.FRAMEBUFFER,null),t.deleteFramebuffer(i)}}var F=(t=>(t[t.ScreenDrawer=0]="ScreenDrawer",t[t.FlipDrawer=1]="FlipDrawer",t[t.CopyDrawer=2]="CopyDrawer",t[t.MixDrawer=3]="MixDrawer",t[t.GifAlpha=10]="GifAlpha",t[t.GifFrame=11]="GifFrame",t[t.GifTimeline=12]="GifTimeline",t[t.GifTimelineCurrentFrame=13]="GifTimelineCurrentFrame",t[t.GifTimelineWidth=14]="GifTimelineWidth",t[t.BlackAndWhite=100]="BlackAndWhite",t[t.Mandess=101]="Mandess",t[t.Darking=102]="Darking",t[t.ConvolutionMatrix=103]="ConvolutionMatrix",t))(F||{});class ir{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.FlipDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return n.bind(),this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}function or(t){const e=t,r=new Jr;return{bind(){e.bindFramebuffer(e.FRAMEBUFFER,null)},getBuffer(){return r},dispose(){}}}function yt(t,e,r,n){const i=t,o=e,s=r,{frameBuffer:a,texture:l}=g();return{bind(){i.bindFramebuffer(t.FRAMEBUFFER,a)},getBuffer(){return l},dispose(){i.bindFramebuffer(t.FRAMEBUFFER,null),i.deleteFramebuffer(a),i.deleteTexture(l.getGLTexture())}};function g(){const c=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,c);const f=new it(t,o,s,null,n);return t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,f.getGLTexture(),0),i.bindFramebuffer(t.FRAMEBUFFER,null),{frameBuffer:c,texture:f}}}class Qr{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.ScreenDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r}=e,n=or(this.drawer.getGL());return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}class Zr{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.GifAlpha)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setUniform1f(this.drawer.getGL(),"TransperancyIndex",r.transperancyIndex),this.gpuProgram.setUniform1f(this.drawer.getGL(),"ScreenHeight",r.screenHeight),this.gpuProgram.setUniform4fv(this.drawer.getGL(),"Rect",r.alphaSquarCoord[0],r.alphaSquarCoord[1],r.alphaSquarCoord[2],r.alphaSquarCoord[3]),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"IndexTexture",n.gifFrame),this.drawer.drawTriangles(i,0,Z,this.drawer.getNumberOfDrawCalls(n.gifFrame)),ee(this.drawer.getGL(),i.getBuffer())}}class en{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.GifFrame)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setUniform1f(this.drawer.getGL(),"ColorTableSize",r.colorTableSize),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"IndexTexture",n.indexTexture),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"alphaTexture",n.alphaTexture),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"ColorTableTexture",n.colorTableTexture),n.prevFrameTexture&&this.gpuProgram.setTextureUniform(this.drawer.getGL(),"prevFrameTexture",n.prevFrameTexture),this.drawer.drawTriangles(i,0,Z,this.drawer.getNumberOfDrawCalls(n.indexTexture)),ee(this.drawer.getGL(),i.getBuffer())}}class ot{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.FlipDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}function sr(t){let e=new WeakMap;return{drawTriangles(r,n,i,o){r.bind(),t.drawArrays(t.TRIANGLES,n,i);const s=r.getBuffer();e.has(s)?e.set(s,o+e.get(s)+1):e.set(s,o+1)},getGL(){return t},startFrame(){e=new Map},endFrame(){e=new Map},getNumberOfDrawCalls(r){return e.has(r)?e.get(r):0}}}function tn(t,e){let r=[],n=[],i=-1;const o={allocate(a,l,u){const g=yt(t,a,l,u);return n.push(g),g},dispose(a){const l=n.findIndex(u=>u===a);l===-1&&console.warn(`${e}: buffer was already disposed or never created with current allocator`),n[l]=null,n=n.filter(u=>u!==null),a.dispose()}};return{startFrame(){s()},endFrame(){s()},allocateFrameDrawingTarget(a){i+=1,r[i]=[];const l={depth:i,allocate(g,c,f){this.depth!==i&&console.warn(`${e}: allocator should be called inside own callback`);const h=yt(t,g,c,f);return r[i].push(h),h}};try{a(l),u()}catch(g){console.warn(g),u()}function u(){for(let g=0;g<r[i].length;g++)r[i][g].dispose();r[i]=[],i-=1}},getLastingAllocator(){return o}};function s(){for(let a=0;a<r.length;a++)for(let l=0;l<r[a].length;l++)r[a][l].dispose();r=[]}}function rn(t,e,r){const n=t.createProgram();if(t.attachShader(n,e),t.attachShader(n,r),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS)){const i=t.getProgramInfoLog(n);return console.warn(`Fail to link program: ${i}`),t.deleteProgram(n),null}return n}class nn{constructor(e,r,n){this.program=rn(e,r,n),this.uniformBuffer=new Map,this.currentTextureUnit=-1}isProgramCreated(){return this.program!==null}useProgram(e){this.currentTextureUnit=-1,e.useProgram(this.program)}setTextureUniform(e,r,n){this.currentTextureUnit+=1,n.activeTexture(e,this.currentTextureUnit),n.bind(e),this.setUniform1i(e,r,this.currentTextureUnit)}setUniform1i(e,r,n){let i=this.getCache(e,r);i.value!==n&&(i.value=n,e.uniform1i(i.location,n))}setUniform1f(e,r,n){let i=this.getCache(e,r);i.value!==n&&(i.value=n,e.uniform1f(i.location,n))}setUniform1fv(e,r,n){let i=this.getCache(e,r+"[0]"),o=i.value;(!o||n!==o)&&(i.value=n,e.uniform1fv(i.location,n.getBuffer()))}setUniform3f(e,r,n,i,o){let s=this.getCache(e,r),a=s.value;(!a||(a[0]!==n||a[1],a[2]!==o))&&(a=new Float32Array(3),a[0]=n,a[1]=i,a[2]=o,s.value=a,e.uniform3f(s.location,n,i,o))}setUniform3fv(e,r,n,i,o){let s=this.getCache(e,r+"[0]"),a=s.value;(!a||(a[0]!==n||a[1],a[2]!==o))&&(a=new Float32Array(3),a[0]=n,a[1]=i,a[2]=o,s.value=a,e.uniform3fv(s.location,a))}setUniform4fv(e,r,n,i,o,s){let a=this.getCache(e,r),l=a.value;(!l||(l[0]!==n||l[1],l[2],l[3]!==s))&&(l=new Float32Array(4),l[0]=n,l[1]=i,l[2]=o,l[3]=s,a.value=l,e.uniform4fv(a.location,l))}getCache(e,r){let n=this.uniformBuffer.get(r);return n||(n={location:e.getUniformLocation(this.program,r),value:void 0}),n}dispose(e){e.deleteProgram(this.program),this.program=null}}function ar(t,e,r){const n=t.createShader(e);if(n===0&&console.warn("Fail to create shader"),t.shaderSource(n,r),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(n);return console.warn(`Fail to compile shader: ${i}`),t.deleteShader(n),null}return n}function on(t,e){return ar(t,t.VERTEX_SHADER,e)}function sn(t,e){return ar(t,t.FRAGMENT_SHADER,e)}function Ct(t,e){t.deleteShader(e)}const ne=`#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

out vec2 texCoord;

void main()
{
  gl_Position = vPosition;
  texCoord = aTexCoord;
}
`,je=`#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

uniform float totalWidth;
uniform float timelineFrameWidth;
uniform float offset;
uniform float startPadding;
uniform float frameStartOffset;

out vec2 texCoord;
out float colorEnable;

void main()
{

  // 0          1, 3
  // -----------
  // |         |
  // |         |
  // -----------
  // 2, 4       5

  // x coord - mod(squarVertextId, 2.0), either 0.0 or 1.0
  // y coord, should be 0.0 for 0, 1, 3 and 1.0 for 2, 4, 5
  // 1.0 - abs(squarVertextId - 2.0)) gives 1.0 for index 2
  // clamp(squarVertextId - 3.0, 0.0, 1.0) - gives 1.0 for indices 4 and 5

  float squarVertextId = mod(float(gl_VertexID), 6.0);
  float squarId = floor(float(gl_VertexID) / 6.0);
  float squarSize = timelineFrameWidth / totalWidth;
  float normilizedStartPadding = startPadding / totalWidth;

  float y = max(0.0, 1.0 - abs(squarVertextId - 2.0)) + clamp(squarVertextId - 3.0, 0.0, 1.0);
  float texX = mod(squarVertextId, 2.0);
  float frameCount = 4.0;
  float spaceBetweenSquars = offset;
  float x = (frameStartOffset * squarSize) + normilizedStartPadding + texX * squarSize + (squarSize * spaceBetweenSquars) * squarId;

  gl_Position = vec4(mix(-1.0, 1.0, x), mix(-1.0, 1.0, y), 0.0, 1.0);

  texCoord = vec2(texX, y);
  colorEnable = squarId + 1.0;
}
`,an=`#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

out vec2 texCoord;
out vec2 texMultCoordA;
out vec2 texMultCoordGB;

void main()
{
  gl_Position = vPosition;
  texCoord = aTexCoord;
  texMultCoordA = vec2(aTexCoord.x * (1.0 / 1.1), aTexCoord.y * (1.0 / 1.1));
  texMultCoordGB = vec2(aTexCoord.x * (1.0 / 1.05) + 0.08, aTexCoord.y * (1.0 / 1.05));
}
`,Ke=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = texture(targetTexture, texCoord);
}
`,ln=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture1;
uniform sampler2D targetTexture2;
uniform sampler2D targetTexture3;
uniform sampler2D targetTexture4;

in vec2 texCoord;
in float colorEnable;

out vec4 fragColor;

void main()
{
  fragColor = vec4(0.0, 0.0, 0.0, 1.0);
  // max(0.0, 1.0 - abs(colorEnable - 1.0) - triangle func will return 1.0 for x in colorEnable - x, and rest is 0.0
  fragColor = fragColor + texture(targetTexture1, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 1.0)));
  fragColor = fragColor + texture(targetTexture2, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 2.0)));
  fragColor = fragColor + texture(targetTexture3, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 3.0)));
  fragColor = fragColor + texture(targetTexture4, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 4.0)));
}
`,un=`#version 300 es

precision mediump float;

uniform float ratio;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  if (
    texCoord.x < (0.05 * ratio) ||
    texCoord.x > 1.0 - (0.05 * ratio) ||
    texCoord.y < 0.05 ||
    texCoord.y > 1.0 - 0.05
    ) {
    fragColor = vec4(1.0, 0.0, 0.0, 0.2);
  } else {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
`,cn=`#version 300 es

precision mediump float;

uniform vec3 color;

out vec4 fragColor;

void main()
{
  fragColor = vec4(color.rgb, 1.0);
}
`,fn=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 tex = texture(targetTexture, texCoord);
  float color = (tex.r + tex.g + tex.b) / 3.0;
  fragColor = vec4(vec3(color), tex.a);
}
`,dn=`#version 300 es

precision mediump float;

uniform sampler2D backgroundTexture;
uniform sampler2D foregroundTexture;

uniform float alpha;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = mix(texture(backgroundTexture, texCoord), texture(foregroundTexture, texCoord), alpha);
}
`,gn=`#version 300 es

precision mediump float;

uniform sampler2D IndexTexture;

uniform float TransperancyIndex;
uniform float ScreenHeight;
uniform vec4 Rect;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  float imageLeft = Rect.x;
  float imageTop = Rect.y;
  float width = Rect.z;
  float hieght = Rect.w;
  float x = gl_FragCoord.x;
  float y = ScreenHeight - gl_FragCoord.y;

  vec4 myindex = texture(IndexTexture, texCoord);

  float alpha = step(imageLeft, x) - (2.0 * step(imageLeft + width, x)) + step(imageTop, y) - (2.0 * step(imageTop + hieght, y)) - (1.0 - (step(imageLeft, x)))- (1.0 - (step(imageTop, y)));
  // TODO: check for better the best way with performance
  alpha = alpha * (1.0 - (step(TransperancyIndex, myindex.x * 255.0) - step(TransperancyIndex + 1.0, myindex.x * 255.0)));

  fragColor = vec4(alpha, 0.0, 0.0, 1.0);   //Output the color
}
`,hn=`#version 300 es

precision mediump float;

uniform sampler2D ColorTableTexture;     //256 x 1 pixels
uniform sampler2D IndexTexture;
uniform sampler2D alphaTexture;
uniform sampler2D prevFrameTexture;
uniform float ColorTableSize;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 myindex = texture(IndexTexture, texCoord);

  float normilaziedX = (myindex.x * 255.0) / ColorTableSize;
  vec4 texel = texture(ColorTableTexture, vec2(normilaziedX, myindex.y));
  float alpha = texture(alphaTexture, vec2(texCoord.x, 1.0 - texCoord.y)).r;

  fragColor = mix(texture(prevFrameTexture, texCoord), vec4(texel.rgb, 1.0), alpha);
}
`,mn=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;
in vec2 texMultCoordA;
in vec2 texMultCoordGB;

out vec4 fragColor;

void main()
{
  fragColor = texture(targetTexture, texCoord) * 7.0;
  fragColor = mix(fragColor, vec4(texture(targetTexture, texMultCoordA).r, 0.0, 0.0, 1.0) * 2.0, 0.7);
  fragColor = mix(fragColor, vec4(0.0, texture(targetTexture, texMultCoordGB).g, texture(targetTexture, texMultCoordGB).b, 1.0) * 1.5, 0.5);
}
`,pn=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;
uniform float animationProgress;
uniform float direction;
uniform vec3 color;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 tex = texture(targetTexture, texCoord);
  float normilizedAnimationProgress = abs(direction - clamp(animationProgress, 0.0, 1.0));
  vec3 _color = mix(vec3(tex.rgb), color, normilizedAnimationProgress);
  fragColor = vec4(_color, tex.a);
}
`,xn=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

uniform float kernel[9];
uniform float kernelWeight;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec2 onePixel = vec2(1) / vec2(textureSize(targetTexture, 0));

  vec4 colorSum =
      texture(targetTexture, texCoord + onePixel * vec2(-1, -1)) * kernel[0] +
      texture(targetTexture, texCoord + onePixel * vec2( 0, -1)) * kernel[1] +
      texture(targetTexture, texCoord + onePixel * vec2( 1, -1)) * kernel[2] +
      texture(targetTexture, texCoord + onePixel * vec2(-1,  0)) * kernel[3] +
      texture(targetTexture, texCoord + onePixel * vec2( 0,  0)) * kernel[4] +
      texture(targetTexture, texCoord + onePixel * vec2( 1,  0)) * kernel[5] +
      texture(targetTexture, texCoord + onePixel * vec2(-1,  1)) * kernel[6] +
      texture(targetTexture, texCoord + onePixel * vec2( 0,  1)) * kernel[7] +
      texture(targetTexture, texCoord + onePixel * vec2( 1,  1)) * kernel[8];

  fragColor = vec4((colorSum / kernelWeight).rgb, 1.0);
}
`;function Tn(t,e){let r=new Map;return{getProgram(o){if(r.has(o))return r.get(o);let{vertText:s,fragText:a}=n(o);if(s===""||a===""){console.warn(e,"- Unknown program id -",F[o]);const{vertText:c,fragText:f}=i();s=c,a=f}const l=on(t,s),u=sn(t,a),g=new nn(t,l,u);return Ct(t,l),Ct(t,u),g.isProgramCreated()||console.warn(e,"- Program fail -",F[o]),r.set(o,g),g},dispose(){r.values().forEach(o=>o.dispose(t)),r=null}};function n(o){return o===F.ScreenDrawer||o===F.CopyDrawer?{vertText:ne,fragText:Ke}:o===F.FlipDrawer?{vertText:ne,fragText:Ke}:o===F.MixDrawer?{vertText:ne,fragText:dn}:o===F.BlackAndWhite?{vertText:ne,fragText:fn}:o===F.GifAlpha?{vertText:ne,fragText:gn}:o===F.GifFrame?{vertText:ne,fragText:hn}:o===F.Mandess?{vertText:an,fragText:mn}:o===F.Darking?{vertText:ne,fragText:pn}:o===F.ConvolutionMatrix?{vertText:ne,fragText:xn}:o===F.GifTimeline?{vertText:je,fragText:ln}:o===F.GifTimelineCurrentFrame?{vertText:je,fragText:un}:o===F.GifTimelineWidth?{vertText:je,fragText:cn}:{vertText:"",fragText:""}}function i(){return{vertText:ne,fragText:Ke}}}const ft=new Map;function lr(t,e){ft.set(e,{resouceManager:tn(t,e),shaderManager:Tn(t,e)})}function ur(t){ft.delete(t)}function C(t){return ft.get(t)}let vn=-1;class wn{constructor(e,r,n,i){const o=e.getContext("webgl2");this.id=String(++vn),lr(o,String(this.id)),this.drawer=sr(o),this.drawer.startFrame();const s=n[0],a=s.M?s.colorMap:i,{screenWidth:l,screenHeight:u}=r;this.screenWidth=l,this.screenHeight=u,o.enable(o.BLEND),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.viewport(0,0,l,u),o.clearColor(0,0,0,1),this.vboToTexture=new Xr(o,jr),this.vboToTexture.bind(o),this.vboToTexture.setData(o,er),this.vboToTexture.activateAllAttribPointers(o);const g=n.reduce((c,f)=>f.M&&f.colorMap.entriesCount>c?f.colorMap.entriesCount:c,a.entriesCount);this.maxColorMapSize=g,this.colorTableTexture=new it(o,g,1,null),this.gifFrameTexture=new it(o,l,u,null,{imageFormat:{internalFormat:rt.R8,format:rt.RED,type:tr.UNSIGNED_BYTE}}),this.colorTableTexture.setTextureUnit(nt.TEXTURE0),this.gifFrameTexture.setTextureUnit(nt.TEXTURE1),this.gl=o}drawToTexture(e,r,n){const i=this.gl;this.gifFrameTexture.bind(i),this.gifFrameTexture.setData(i,e.imageLeft,e.imageTop,e.imageWidth,e.imageHeight,n),this.gl.viewport(0,0,this.screenWidth,this.screenHeight),this.gl.enable(this.gl.BLEND),this.gl.blendEquation(this.gl.FUNC_ADD),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA),C(this.id).resouceManager.allocateFrameDrawingTarget(o=>{const s=this.drawToAlphaTexture(o.allocate(this.screenWidth,this.screenHeight),e),a=e.M?e.colorMap:r;this.colorTableTexture.bind(i),this.colorTableTexture.putData(i,0,0,a.entriesCount,1,a.getRawData()),this.gifFrameTexture.bind(i),this.gifFrameTexture.setData(i,e.imageLeft,e.imageTop,e.imageWidth,e.imageHeight,n),this.currentFrameBuffer&&C(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer),this.currentFrameBuffer=C(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight,{filtering:{min:tt.LINEAR,mag:tt.LINEAR}}),this.currentFrame=new en(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:{colorTableSize:this.maxColorMapSize},textures:{colorTableTexture:this.colorTableTexture,indexTexture:this.gifFrameTexture,alphaTexture:s.texture,prevFrameTexture:this.prevFrame?this.prevFrame.texture:null},drawingTarget:this.currentFrameBuffer}),this.prevFrameBuffer&&C(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer),this.prevFrameBuffer=C(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight),this.prevFrame=new ot(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:this.prevFrameBuffer})})}restorePrevDisposal(){this.currentFrame=this.disposalPrevFrame,this.prevFrame=this.disposalPrevFrame}drawToScreen(e,r){this.gl.viewport(0,0,this.screenWidth,this.screenHeight),this.gl.enable(this.gl.BLEND),this.gl.blendEquation(this.gl.FUNC_ADD),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA),C(this.id).resouceManager.allocateFrameDrawingTarget(n=>{let i=this.postProcessing(this.currentFrame,n,e,r);this.drawer.getNumberOfDrawCalls(i.texture)%2===1&&(i=new ir(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:i.texture},drawingTarget:n.allocate(this.screenWidth,this.screenHeight)})),new Qr(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:i.texture}})}),this.drawer.endFrame(),C(this.id).resouceManager.endFrame(),this.drawer.startFrame(),C(this.id).resouceManager.startFrame()}postProcessing(e,r,n,i){this.gl.viewport(0,0,this.screenWidth,this.screenHeight),this.gl.enable(this.gl.BLEND),this.gl.blendEquation(this.gl.FUNC_ADD),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);let o=e;for(let s=0;s<n.length;s++)o=n[s].apply(this.drawer,C(this.id).shaderManager,o,r,i);return o}drawToAlphaTexture(e,r){var o;this.gl.viewport(0,0,this.screenWidth,this.screenHeight),this.gl.enable(this.gl.BLEND),this.gl.blendEquation(this.gl.FUNC_ADD),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);const n={screenHeight:this.screenHeight,transperancyIndex:(o=r.graphicControl)!=null&&o.isTransparent?r.graphicControl.transparentColorIndex:512,alphaSquarCoord:[r.imageLeft,r.imageTop,r.imageWidth,r.imageHeight]};return new Zr(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:n,textures:{gifFrame:this.gifFrameTexture},drawingTarget:e})}saveDisposalPrev(){this.gl.viewport(0,0,this.screenWidth,this.screenHeight),this.gl.enable(this.gl.BLEND),this.gl.blendEquation(this.gl.FUNC_ADD),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA),this.disposalPrevFrameBuffer&&C(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer),this.disposalPrevFrameBuffer=C(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight),this.disposalPrevFrame=new ot(this.drawer,C(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:this.disposalPrevFrameBuffer})}getCanvasPixels(e){this.currentFrame&&this.currentFrame.readResultToBuffer(e,this.gl.RGBA)}getPrevCanvasPixels(e){this.prevFrame&&this.prevFrame.readResultToBuffer(e,this.gl.RGBA)}getCurrentTexture(){return this.currentFrame.texture}dispose(){this.vboToTexture.dispose(this.drawer.getGL()),this.currentFrame.texture.dispose(this.gl),this.disposalPrevFrame.texture.dispose(this.gl),this.prevFrame.texture.dispose(this.gl),this.gifFrameTexture.dispose(this.gl),this.colorTableTexture.dispose(this.gl),C(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer),C(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer),C(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer),C(this.id).shaderManager.dispose(),ur(this.id)}}const Ft="./assets/lzw_parallel-CUzHX8pJ.js";let bn=0;function $t(t,e){return e??(e=bn++%16777216),{...t,id:e}}let me=new Map;function At(t){t.addEventListener("message",r=>{const n=r.data;if(!me.has(n.id)){e.forEach(i=>i(r.data));return}me.get(n.id)(n),me.delete(n.id)});let e=[];return{send(r,n){const i=$t(r);me.has(i.id)&&me.delete(i.id),n?t.postMessage(i,n):t.postMessage(i);let o=a=>{},s=new Promise(a=>{o=a});return me.set(i.id,o),s},reply(r,n,i){const o=$t(r,n.id);i?t.postMessage(o,i):t.postMessage(o)},on(r){e.push(r)}}}const En=3;let pe=[],yn=new Map,oe=0;var z=(t=>(t[t.timeline=0]="timeline",t[t.main=1]="main",t))(z||{});function Cn(){pe.push({worker:At(new Worker(Ft,{type:"module"})),occupied:!1,buffer:new Uint8Array(oe),priority:1,gifToId:new Map,jobs:[]});for(let o=0;o<En;o++)pe.push({worker:At(new Worker(Ft,{type:"module"})),occupied:!1,buffer:new Uint8Array(oe),priority:0,gifToId:new Map,jobs:[]});let t=[];return{async init(o){if(yn.has(o))return;let s=o.buffer.buffer;for(let l of pe){l.occupied&&await n(l.jobs),l.occupied=!0;let u=await l.worker.send({type:"init",props:{gif:s,screenWidth:o.screenDescriptor.screenWidth,screenHeight:o.screenDescriptor.screenHeight}},[s]);i(l),l.gifToId.set(o,u.props.id),s=u.props.gif}Or(o,s);let a=o.screenDescriptor.screenWidth*o.screenDescriptor.screenHeight;oe<a&&(oe=a)},async freeGif(o){return Promise.all(pe.map(async s=>{s.occupied&&await n(s.jobs);let a=s.gifToId.get(o);s.occupied=!0,await s.worker.send({type:"free",props:{id:a}}),s.gifToId.delete(o),i(s)})).then()},async uncompress(o,s,a){const l=await e(a);let u=l.gifToId.get(o);l.buffer.length<oe&&(l.buffer=new Uint8Array(oe));const g=l.buffer.length,c=await l.worker.send({type:"uncompress",props:{id:u,startPointer:s.startPointer,compressedDataSize:s.compressedData.length,data:l.buffer.buffer}},[l.buffer.buffer]),f=new Uint8Array(c.props.data);return g<oe?l.buffer=new Uint8Array(oe):l.buffer=f,{readBuffer(){return i(l),l.buffer},[Symbol.dispose](){i(l)}}},getNumberOfFreeWorkers(o){return pe.filter(s=>r(s,o)).length}};async function e(o){const s=pe.filter(a=>r(a,o));return s.length>0?(s[0].occupied=!0,s[0]):n(t)}function r(o,s){return!o.occupied&&o.priority<=s}function n(o){let s=l=>{},a=new Promise(l=>{s=l});return o.push(s),a}function i(o){if(o.occupied=!1,o.jobs.length>0){const s=o.jobs[0];o.jobs=o.jobs.slice(1),s(o)}if(t.length>0){const s=t[0];t=t.slice(1),s(o)}}}const Y=Cn(),Rt=1/25*1e3;class cr{constructor(){this.gifs=[],this.frameSubsriptions=[],this.effectSubsriptions=[]}addGifToRender(e,r,n){const i={id:this.gifs.length},o={gifEntity:e,currentFrame:-1,algorithm:n.algorithm==="GL"?new wn(r,e.gif.screenDescriptor,e.gif.images,e.gif.colorMap):new Vr(r,e.gif.screenDescriptor,e.gif.images,e.gif.colorMap),timer:new Hr,canvas:r,effects:[]},{screenWidth:s,screenHeight:a}=o.gifEntity.gif.screenDescriptor;return o.canvas.width=s,o.canvas.height=a,o.canvas.style&&(o.canvas.style.width=`${s}px`,o.canvas.style.height=`${a}px`),this.gifs.push(o),o.gifEntity.gif.images.length?new Promise(l=>o.timer.once(()=>{this.setFrame(i,0).then(()=>l(i))})):Promise.resolve(i)}addEffectToGif(e,r,n,i){r>n&&console.warn("from cannot be greater than to",r,n);const o=this.gifs[e.id];r<0&&console.warn("from should be greater than 0",r),n>=o.gifEntity.gif.images.length&&console.warn("to should be less than number of gif frames",n,o.gifEntity.gif.images.length);const s=i({screenWidth:o.gifEntity.gif.screenDescriptor.screenWidth,screenHeight:o.gifEntity.gif.screenDescriptor.screenHeight,from:r,to:n});o.effects.push(s),this.notifyEffectSubscribers(e,s,r,n)}removeEffectFromGif(e,r){const n=this.gifs[e.id];n.effects=n.effects.filter(i=>i!==r),this.notifyEffectSubscribers(e,r,r.getFrom(),r.getTo())}setFrame(e,r){const n=this.gifs[e.id];return new Promise(i=>{r>-1&&r<n.gifEntity.gif.images.length?(n.timer.clear(),n.timer.once(async()=>{let o=Math.max(0,n.currentFrame),s=r;r<n.currentFrame&&(o=Mt(n.gifEntity.gif,r));for(let u=o;u<s;u++){let g=[],c=0;for(;u+c<s&&Y.getNumberOfFreeWorkers(z.main)>0;){const f=n.gifEntity.gif.images[u+c];g.push(Y.uncompress(n.gifEntity.gif,f,z.main)),c++}if(g.length>0)(await Promise.all(g)).forEach((f,h)=>{this.drawToTexture(n,u+h,f.readBuffer()),this.performeDisposalMethod(n,u+h)}),u+=c-1;else{const f=n.gifEntity.gif.images[u],h=await Y.uncompress(n.gifEntity.gif,f,z.main);this.drawToTexture(n,u,h.readBuffer()),this.performeDisposalMethod(n,u)}}n.currentFrame=r;const a=n.gifEntity.gif.images[r],l=await Y.uncompress(n.gifEntity.gif,a,z.main);this._drawFrame(n,n.currentFrame,l.readBuffer()),i(),this.notifyFrameSubscribers(e)})):i()})}setFrameSilent(e,r){const n=this.gifs[e.id];return new Promise(i=>{r>-1&&r<n.gifEntity.gif.images.length?(n.timer.clear(),n.timer.once(async()=>{let o=Math.max(0,n.currentFrame),s=r;r<n.currentFrame&&(o=Mt(n.gifEntity.gif,r));for(let u=o;u<s;u++){let g=[],c=0;for(;u+c<s&&Y.getNumberOfFreeWorkers(z.timeline)>0;){const f=n.gifEntity.gif.images[u+c];g.push(Y.uncompress(n.gifEntity.gif,f,z.timeline)),c++}if(g.length>0)(await Promise.all(g)).forEach((f,h)=>{this.drawToTexture(n,u+h,f.readBuffer()),this.performeDisposalMethod(n,u+h)}),u+=c-1;else{const f=n.gifEntity.gif.images[u],h=await Y.uncompress(n.gifEntity.gif,f,z.timeline);this.drawToTexture(n,u,h.readBuffer()),this.performeDisposalMethod(n,u)}}n.currentFrame=r;const a=n.gifEntity.gif.images[r],l=await Y.uncompress(n.gifEntity.gif,a,z.timeline);this._drawFrameSilent(n,n.currentFrame,l.readBuffer()),i(),this.notifyFrameSubscribers(e)})):i()})}autoplayStart(e){var n;const r=this.gifs[e.id];if(r.gifEntity.gif.images.length>1){const i=async()=>{var l;const o=(r.currentFrame+1)%r.gifEntity.gif.images.length;r.timer.once(i,((l=r.gifEntity.gif.images[o].graphicControl)==null?void 0:l.delayTime)||Rt),r.currentFrame=o;const s=r.gifEntity.gif.images[o],a=await Y.uncompress(r.gifEntity.gif,s,z.main);this._drawFrame(r,r.currentFrame,a.readBuffer()),this.notifyFrameSubscribers(e)};return r.timer.once(i,((n=r.gifEntity.gif.images[r.currentFrame].graphicControl)==null?void 0:n.delayTime)||Rt),!0}else return!1}autoplayEnd(e){this.gifs[e.id].timer.clear()}onFrameRender(e,r){return this.frameSubsriptions.push(n=>{n.gifDescription.id===e.id&&r(n)}),{clear:()=>{this.frameSubsriptions=this.frameSubsriptions.filter(n=>n!==r)}}}onEffectAdded(e,r){return this.effectSubsriptions.push(n=>{n.gifDescription.id===e.id&&r(n)}),{clear:()=>{this.effectSubsriptions=this.effectSubsriptions.filter(n=>n!==r)}}}getCurrentFrame(e){return this.gifs[e.id].currentFrame}dispose(){this.gifs.forEach(e=>{e.timer.clear(),e.algorithm.dispose()})}getGif(e){return this.gifs[e.id].gifEntity}readCurrentFrame(e,r){this.gifs[e.id].algorithm.getCanvasPixels(r)}getCurrentTexture(e){return this.gifs[e.id].algorithm.getCurrentTexture()}drawToTexture(e,r,n){var o;const i=e.gifEntity.gif.images[r];e.algorithm.drawToTexture(i,e.gifEntity.gif.colorMap,n),((o=i.graphicControl)==null?void 0:o.disposalMethod)!==_e.prev&&e.algorithm.saveDisposalPrev()}notifyFrameSubscribers(e){const r=this.gifs[e.id];this.frameSubsriptions.forEach(n=>{n({gifDescription:e,frameNumber:r.currentFrame,totalFrameNumber:r.gifEntity.gif.images.length})})}notifyEffectSubscribers(e,r,n,i){const o=this.gifs[e.id];this.effectSubsriptions.forEach(s=>{s({gifDescription:e,effect:r,effects:o.effects,from:n,to:i})})}drawToScreen(e){const r=e.effects.filter(n=>n.shouldBeApplied(e.currentFrame));e.algorithm.drawToScreen(r,e.currentFrame)}_drawFrame(e,r,n){this.drawToTexture(e,r,n),this.drawToScreen(e),this.performeDisposalMethod(e,r)}_drawFrameSilent(e,r,n){this.drawToTexture(e,r,n),this.performeDisposalMethod(e,r)}performeDisposalMethod(e,r){var i;((i=e.gifEntity.gif.images[r].graphicControl)==null?void 0:i.disposalMethod)===_e.prev&&e.algorithm.restorePrevDisposal()}}function Mt(t,e){for(let r=e;r>0;r--)if(t.images[r].graphicControl.disposalMethod===_e.noAction)return r;return 0}function Fn(t){return j(e=>{const r=M(!1),i=L`
      <div style="display: flex; justify-content: center;">
        <div style="margin-right: 5px">
          <button onClick="${()=>t.isPlay.set(o=>!o)}">${()=>t.isPlay()?"Stop":"Play"}</button>
          <button disabled="${()=>t.isPlay()}" onClick="${()=>{r()||(r.set(!0),t.renderNext()().then(()=>r.set(!1)))}}">Next</button>
        </div>
        <div style="border: 1px solid black">${()=>`${t.currentFrameNumber()} / ${t.totalFrameNumber()}`}</div>
      </div>
    `;return J(i.element,()=>{e(),i.dispose()})})}class fr{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.BlackAndWhite)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}class $n{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.Mandess)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}class An{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.MixDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"backgroundTexture",n.background),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"foregroundTexture",n.foreground),this.gpuProgram.setUniform1f(this.drawer.getGL(),"alpha",r.alpha);const o=this.drawer.getNumberOfDrawCalls(n.background),s=this.drawer.getNumberOfDrawCalls(n.foreground);return o%2===0&&s%2===0||o%2===1&&s%2===1||console.warn("MixRenderResultsRenderPass: foreground and background texture are flipped in different direction"),this.drawer.drawTriangles(i,0,Z,r.alpha>=.5?s:o),ee(this.drawer.getGL(),i.getBuffer())}}let Rn=0;function We(){return Rn++}const Fe=We();function Mn(t){return t.getId()===Fe}function Pn(t){let e=.7;return{apply(r,n,i,o){let s=i;const a=new fr(r,n).execute({memory:{},globals:{},textures:{targetTexture:s.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),l=new $n(r,n).execute({memory:{},globals:{},textures:{targetTexture:s.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)});return s=new An(r,n).execute({memory:{},globals:{alpha:e},textures:{background:a.texture,foreground:l.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),s},shouldBeApplied(r){return r>=t.from&&r<=t.to},getId(){return Fe},getFrom(){return t.from},getTo(){return t.to},setFrom(r){t.from=r},setTo(r){t.to=r},getAlpha(){return e},setAlpha(r){e=r}}}const $e=We();function Dn(t){return t.getId()===$e}function Sn(t){return{apply(e,r,n,i){let o=n;return o=new fr(e,r).execute({memory:{},globals:{},textures:{targetTexture:o.texture},drawingTarget:i.allocate(t.screenWidth,t.screenHeight)}),o},shouldBeApplied(e){return e>=t.from&&e<=t.to},getId(){return $e},getFrom(){return t.from},setFrom(e){t.from=e},getTo(){return t.to},setTo(e){t.to=e}}}function Ln(t,e,r){return e<=t?1:(r-t)/Math.max(e-t,1)}var ve=(t=>(t[t.out=0]="out",t[t.in=1]="in",t))(ve||{});class Gn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.Darking)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e,i=e.globals.color;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.gpuProgram.setUniform1f(this.drawer.getGL(),"animationProgress",e.globals.animationProgress??1),this.gpuProgram.setUniform1f(this.drawer.getGL(),"direction",e.globals.direction),this.gpuProgram.setUniform3f(this.drawer.getGL(),"color",i.r,i.g,i.b),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}class dt extends Array{get r(){return this[0]}set r(e){this[0]=e}get g(){return this[1]}set g(e){this[1]=e}get b(){return this[2]}set b(e){this[2]=e}get a(){return this[3]}set a(e){this[3]=e}copy(){const e=new dt;return e.r=this.r,e.g=this.g,e.b=this.b,e.a=this.a,e}constructor(){super(4),this[0]=0,this[1]=0,this[2]=0,this[3]=1}}const dr=()=>new dt,Ae=We();function Un(t){return t.getId()===Ae}function Nn(t,e){return e.direction=e.direction??ve.in,e.color=e.color??dr(),{apply(r,n,i,o,s){const a=Ln(t.from,t.to,s);let l=i;return l=new Gn(r,n).execute({memory:{},globals:{animationProgress:a,direction:e.direction,color:e.color},textures:{targetTexture:l.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),l},shouldBeApplied(r){return r>=t.from&&r<=t.to},getId(){return Ae},getFrom(){return t.from},setFrom(r){t.from=r},getTo(){return t.to},setTo(r){t.to=r},getDirection(){return e.direction},setDirection(r){e.direction=r},getColor(){return e.color},setColor(r){e.color=r}}}class Bn{constructor(e){this.buffer=new Float32Array(e)}getBuffer(){return this.buffer}}function _n(t){const e=new Bn(9);return t.getBuffer().forEach((r,n)=>{e.getBuffer()[n]=t.getBuffer()[n]}),e}function kn(t){const e=t.getBuffer().reduce((r,n)=>r+n);return e<=0?1:e}class In{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(F.ConvolutionMatrix)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.gpuProgram.setUniform1fv(this.drawer.getGL(),"kernel",_n(e.globals.kernel)),this.gpuProgram.setUniform1f(this.drawer.getGL(),"kernelWeight",kn(e.globals.kernel)),this.drawer.drawTriangles(n,0,Z,this.drawer.getNumberOfDrawCalls(r.targetTexture)),ee(this.drawer.getGL(),n.getBuffer())}}class On{constructor(){this.buffer=new Float32Array(9)}getBuffer(){return this.buffer}}const Wn=t=>{const e=new On;let r=Math.min(3,t.length);for(let n=0;n<r;n++){let i=Math.min(3,t[n].length);for(let o=0;o<i;o++)e.getBuffer()[n*r+o]=t[n][o]}return e},Hn=()=>Wn([[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]),Re=We();function Vn(t){return t.getId()===Re}function zn(t){return{apply(e,r,n,i){let o=n;return o=new In(e,r).execute({memory:{},globals:{kernel:Hn()},textures:{targetTexture:o.texture},drawingTarget:i.allocate(t.screenWidth,t.screenHeight)}),o},shouldBeApplied(e){return e>=t.from&&e<=t.to},getId(){return Re},getFrom(){return t.from},setFrom(e){t.from=e},getTo(){return t.to},setTo(e){t.to=e}}}function q(t,e){return r=>{const n=r.target.value;if(isNaN(Number(n)))e(n);else{const i=Number(n);t(i)}}}function Xn(t){return e=>{const r=e.target.value;t(r)}}function qn(t){return j(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o}=t,s=q(u=>{u=Math.max(0,u-1),n(u)},()=>{n(r())}),a=q(u=>{u=Math.max(0,u-1),o(u)},()=>{o(i())}),l=L`
            <div>
              <span>Editing Black And White Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${u=>{u.key==="Enter"&&s(u)}}" onFocusOut="${s}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${u=>{u.key==="Enter"&&a(u)}}" onFocusOut="${a}" class="to-input" value="${()=>i()+1}"/>
              </div>
            </div>
    `;return J(l.element,()=>{e(),l.dispose()})})}function jn(t){return j(e=>{const{effect:r,fromValue:n,setFromValue:i,toValue:o,setToValue:s}=t,a=M(r.getAlpha(),{dirty(f,h){return!0}});Ce(()=>{a(),t.rerender()});const l=q(f=>{f=Math.max(0,f-1),i(f)},()=>{i(n())}),u=q(f=>{f=Math.max(0,f-1),s(f)},()=>{s(o())}),g=q(f=>{f=Math.max(0,f),a.set(f),r.setAlpha(f)},()=>{a.set(r.getAlpha())}),c=L`
            <div>
              <span>Editing Madness Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${f=>{f.key==="Enter"&&l(f)}}" onFocusOut="${l}" class="from-input" value="${()=>n()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${f=>{f.key==="Enter"&&u(f)}}" onFocusOut="${u}" class="to-input" value="${()=>o()+1}"/>
              </div>
              <div>
                <span>Alpha</span>
                <input onKeyDown="${f=>{f.key==="Enter"&&g(f)}}" onFocusOut="${g}" class="alpha-input" value="${()=>a()}"/>
              </div>
            </div>
    `;return J(c.element,()=>{e(),c.dispose()})})}function Kn(t){return j(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o,rerender:s,effect:a}=t,l=M(a.getDirection(),{dirty(d,x){return!0}}),u=M(a.getColor().r*255,{dirty(d,x){return!0}}),g=M(a.getColor().g*255,{dirty(d,x){return!0}}),c=M(a.getColor().b*255,{dirty(d,x){return!0}}),f=q(d=>{d=Math.max(0,d-1),n(d)},()=>{n(r())}),h=q(d=>{d=Math.max(0,d-1),o(d)},()=>{o(i())}),w=Xn(d=>{l.set(d==="in"?ve.in:ve.out),a.setDirection(l()),s()}),p=q(d=>{d=Math.min(Math.max(0,d),255),u.set(d),a.getColor().r=d/255,s()},()=>{u.set(u())}),E=q(d=>{d=Math.min(Math.max(0,d),255),g.set(d),a.getColor().g=d/255,s()},()=>{g.set(g())}),m=q(d=>{d=Math.min(Math.max(0,d),255),c.set(d),a.getColor().b=d/255,s()},()=>{c.set(c())}),b=L`
            <div>
              <span>Editing In and Out Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&f(d)}}" onFocusOut="${f}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&h(d)}}" onFocusOut="${h}" class="to-input" value="${()=>i()+1}"/>
              </div>
              <div>
                <span>Direction</span>
                <select name="Direction" value="${()=>l()===ve.in?"in":"out"}"
                  onChange="${w}"
                >
                  <option value="in">In</option>
                  <option value="out">Out</option>
                </select>
              </div>
              <div>
                <span>
                  Color
                </span>
                <div style="display: flex">
                  <span>
                    <span>Red:</span>
                    <input onKeyDown="${d=>{d.key==="Enter"&&p(d)}}" onFocusOut="${p}" class="from-input" value="${()=>u()}"/>
                  </span>
                  <span>
                    <span>Green:</span>
                    <input onKeyDown="${d=>{d.key==="Enter"&&E(d)}}" onFocusOut="${E}" class="from-input" value="${()=>g()}"/>
                  </span>
                  <span>
                    <span>Blue:</span>
                    <input onKeyDown="${d=>{d.key==="Enter"&&m(d)}}" onFocusOut="${m}" class="from-input" value="${()=>c()}"/>
                  </span>
                  <span style="display: flex; align-items: end;">
                    <span style="${()=>`display: inline-block; width: 50px; height: 30px; background-color: rgb(${u()}, ${g()}, ${c()})`}"></span>
                  </span>
                </div>
              </div>
            </div>
    `;return J(b.element,()=>{e(),b.dispose()})})}function Yn(t){return j(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o}=t,s=q(u=>{u=Math.max(0,u-1),n(u)},()=>{n(r())}),a=q(u=>{u=Math.max(0,u-1),o(u)},()=>{o(i())}),l=L`
            <div>
              <span>Editing Edge Detection Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${u=>{u.key==="Enter"&&s(u)}}" onFocusOut="${s}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${u=>{u.key==="Enter"&&a(u)}}" onFocusOut="${a}" class="to-input" value="${()=>i()+1}"/>
              </div>
            </div>
    `;return J(l.element,()=>{e(),l.dispose()})})}function ke(t){return t===Fe?"Madness Effect":t===$e?"Black And White Effect":t===Ae?"In And Out Effect":t===Re?"Edge Detection Effect":null}function Jn(t,e){return Mn(t.effect)?L`<div>
        <div>${_(()=>jn(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:Dn(t.effect)?L`<div>
        <div>${_(()=>qn(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:Un(t.effect)?L`<div>
        <div>${_(()=>Kn(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:Vn(t.effect)?L`<div>
        <div>${_(()=>Yn(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:L`<div>
      <span>Editing is not supported for this effect</span>
      <button onClick="${e}">close</button>
  </div>`}const Pt=(t,e,r,n)=>`${n+1}. ${ke(t)||"Unknown Effect"} - from: ${e+1}; to: ${r+1}`;function Qn(t){return j(e=>{const r=M(null),n=t.selectedEffect;let i=null;const o=()=>{i=null,r.set(null),n.set(-1)},s=()=>{t.removeSelectedEffect(n()),o()},a=(c,f)=>{const h=Pt(c.effect.getId(),c.from(),c.to(),f);if(i===h)return!1;i=h;const w={fromValue:()=>c.from(),setFromValue(p){c.from.set(p),c.effect.setFrom(p),t.rerender()},toValue:()=>c.to(),setToValue(p){c.to.set(p),c.effect.setTo(p),t.rerender()},effect:c.effect,currentFrameNumber:t.currentFrameNumber,rerender:()=>t.rerender()};return r.set(Jn(w,o)),!0};Ce(()=>{const c=n(),f=t.effects()[c];f!==void 0&&a(f,c)});const l=(c,f)=>{const h=()=>{a(c,f)&&n.set(f)},w=()=>c.effect.shouldBeApplied(t.currentFrameNumber()-1)?"color: green":"",p=E=>n()===E?"background-color: #a9dcf3":"";return L`<li onClick="${h}" style="${()=>w()+"; "+p(f)+"; cursor: pointer;"}">
        ${Pt(c.effect.getId(),c.from(),c.to(),f)}
      </li>`},u=()=>L`
      <ul>
        ${_(()=>t.effects().map(l))}
      </ul>
    `,g=L`
    <div>
        <div style="margin-bottom: 5px">
          ${_(()=>t.effects().length===0?"No effects":u())}
        </div>
        <button
          style="maring-right: 5px"
          disabled="${()=>!t.isEffectSelectedToAdd()}"
          onClick="${()=>t.addSelectedEffect()}">
            Add Effect
        </button>
        <button disabled="${()=>n()===-1}" onClick="${()=>s()}">Remove Effect</button>
        <div style="border-top: 1px solid black; margin-top: 5px">
          ${_(()=>r())}
        </div>
      </div>
    `;return J(g.element,()=>{e(),g.dispose()})})}function Zn(t){return j(e=>{const r=L`
      <div style="border-bottom: 1px solid black; padding-top: 5px;">
        <div style="position: relative; display: flex; justify-content: center; margin-bottom: 5px;">
            <canvas></canvas>
          <div style="position: absolute; top: 0; right: 5px;">
            <button onClick="${()=>t.onClose()}">close</button>
          </div>
        </div>
        <div>
          <div style="border-bottom: 1px solid black">${_(()=>Fn(t))}</div>
          <div>${_(()=>Qn(t))}</div>
        </div>
      </div>
    `,n=J(r.element,()=>{e(),r.dispose()});return n.getCanvas=()=>r.element.querySelector("canvas"),n})}function ei(t){const{selectedEffect:e,selectEffect:r}=t,n=M([$e,Fe,Ae,Re]);return j(i=>{const o=L`
      <div style="border: 1px solid black;">
        <span>Select Effect:</span>
        <ul style="padding: 0; padding-left: 15px;">
            ${_(()=>n().map(a=>L`<li
                  style="${()=>(e()===a?"background-color: green; ":"")+"cursor: pointer"}"
                  onClick="${()=>r(a)}"
                >
                  ${ke(a)}
              </li>`))}
        </ul>
      </div>
    `;return J(o.element,()=>{i(),o.dispose()})})}function ti(t,e){return t/e|0}function ri(t,e,r){let n=Math.floor(t/e)*e;n<t&&(n+=e);let i=[];for(let o=0;o<r;o++)i.push(n+o*e);return i}let ni=0,Le=80;function ii(t){return j(e=>{const{timelineHeight:r,gif:n}=t,i=r,o=n.gif.screenDescriptor.screenWidth,s=n.gif.screenDescriptor.screenHeight,a=Fr(o,s,i)|0,l=a*n.gif.images.length,u=l+a*2,g=4;let c=0,f=0,h=0,w=M(0),p={currentFrame:0,thumbnailFrames:[],frameStartOffset:0,normilizedStartPadding:0},E=-1,m=new cr,b=()=>{},d=(()=>{}),x=`Timeline_${ni++}`,$=[],P=[],k=M(0),te=M(0),O=M(0),Q=M(0),D=M(0),R=()=>Promise.resolve(),U=A=>{if(t.isPlay())return;const G=(A.offsetX-Q())/O()+D()|0;G!==t.currentFrameNumber()-1&&G<m.getGif(d()).gif.images.length&&t.render(G)},T=A=>{w.set(A),p.currentFrame=ti(w(),a),p.thumbnailFrames=ri(p.currentFrame,f,g).filter(G=>G<n.gif.images.length),p.normilizedStartPadding=p.currentFrame*a-w(),p.frameStartOffset=0,p.thumbnailFrames.length>0&&(p.frameStartOffset=p.thumbnailFrames[0]-p.currentFrame)},y=A=>{T(A.target.scrollLeft)};const S=L`
      <div style="display: flex">
        <div style="${()=>`max-height: ${5*i+20}px; overflow-y: scroll; overflow-x: hidden;`}">
          <div style="display: flex; width: 100%; position: sticky; top: 0; z-index: 3; background-color: white;">
            <div style="${()=>`width: ${Le}px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding-top: 20px; border-right: 1px solid black; border-bottom: 1px solid black;`}">main frame</div>
            <div style="width: 100%;">
              <ul style="position: relative; padding: 0; height: 20px; list-style: none; overflow: hidden">
                  ${_(()=>Array.from({length:k()}).map((A,G)=>L`<li style="${()=>"position: absolute; left: "+(O()*G+Q())+"px"}">${D()+G+1}</li>`))}
                </ul>
              <div style="${()=>`display: flex; width: 100%; height: ${i}px;`+(t.isPlay()?" cursor: default":" cursor: pointer")}">
                  <canvas onClick="${U}"></canvas>
              </div>
            </div>
          </div>
          <div style="${()=>`position: relative; height: ${t.effects().length*i}px`}">
            ${_(()=>t.effects().map((A,G)=>{const gt=()=>{const I=Math.max(0,A.from()-D()),He=Math.min(A.to()-D()+1-I,k()-I),Me=A.to()-A.from()>0&&!(D()>A.from()+A.to()||D()+k()<A.from());return`position: absolute; display: flex; width: ${Me?Math.max(Math.min(He*O(),te()+O()),0):0}px; height: ${i}px; justify-content: center; align-items: center; border: 1px solid black; display: ${Me?"flex":"none"};left: ${I*O()+Q()+Le}px;top: ${G*i}px;background-color: ${G%2===0?"black":"white"}; color: ${G%2===0?"white":"black"};overflow: hidden;`},v=I=>`width: ${Le}px; height: ${i}px; background-color: white; z-index: 2; position: relative; display: flex; align-items: center; justify-content: center; border-right: 1px solid black;`+(t.selectedEffect()===I?"background-color: #a9dcf3":"")+"cursor: pointer";return L`
                <div>
                  <div style="${()=>v(G)}" onClick="${()=>t.selectedEffect.set(G)}">
                    ${String(G+1)+"."+ke(A.effect.getId())}
                </div>
                  <div style="${gt}">
                    ${ke(A.effect.getId())}
                  </div>
                </div>`}))}
          </div>
            <div style="overflow: scroll; margin-top: -1px; position: sticky; bottom: 0; z-index: 3;" onScroll="${y}">
                <div style="${()=>`width: ${u+Le}px; height: 1px`}"></div>
            </div>
        </div>
      </div>
    `;return setTimeout(async()=>{const A=S.element.querySelector("canvas"),G=await m.addGifToRender(n,A,{algorithm:"GL",thread:z.timeline});b=()=>{m.dispose()},d=()=>G,c=A.parentElement.getBoundingClientRect().width,h=Math.ceil(c/a),f=Math.max(1,Math.ceil((h-g)/Math.max(1,g-1))),T(0),te.set(c),A.width=c,A.height=i,A.style.width=`${c}px`,A.style.height=`${i}px`;const v=A.getContext("webgl2");lr(v,x);const I=sr(v);I.startFrame(),v.enable(v.BLEND),v.blendFunc(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA),v.viewport(0,0,c,i),v.clearColor(0,0,0,1),O.set(a);const He=k,Me=async()=>{const B={...p},gr=w();if(!($.length===B.thumbnailFrames.length&&$[0]===B.thumbnailFrames[0]&&$.at(-1)===B.thumbnailFrames.at(-1))){let V=[];for(let N=0;N<Math.min($.length,P.length);N++)B.thumbnailFrames.includes($[N])?V.push({frameNumber:$[N],frame:P[N]}):C(x).resouceManager.getLastingAllocator().dispose(P[N]);for(let N=Math.min($.length,P.length);N<P.length;N++)C(x).resouceManager.getLastingAllocator().dispose(P[N]);P=[];for(let N=0;N<B.thumbnailFrames.length;N++){const W=B.thumbnailFrames[N],ie=V.findIndex(re=>re.frameNumber===W);if(ie!==-1)P.push(V[ie].frame);else{await m.setFrameSilent(G,W);const re=m.getCurrentTexture(G);re.setTextureWrap(v,v.TEXTURE_WRAP_S,v.CLAMP_TO_EDGE),re.setTextureWrap(v,v.TEXTURE_WRAP_T,v.CLAMP_TO_EDGE),re.setTextureFilter(v,v.TEXTURE_MIN_FILTER,v.LINEAR),re.setTextureFilter(v,v.TEXTURE_MAG_FILTER,v.LINEAR);const pt=C(x).resouceManager.getLastingAllocator().allocate(a,i);P.push(pt),v.viewport(0,0,a,i),new ot(I,C(x).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:re},drawingTarget:pt})}}$=B.thumbnailFrames}const Pe=or(I.getGL());Pe.bind(),v.clear(v.COLOR_BUFFER_BIT),v.viewport(0,0,c,i);const ue=C(x).shaderManager.getProgram(F.GifTimelineWidth);ue.useProgram(v),ue.setUniform3f(v,"color",35/255,35/255,35/255),ue.setUniform1f(v,"totalWidth",c),ue.setUniform1f(v,"timelineFrameWidth",Math.min(c,l-gr)),ue.setUniform1f(v,"offset",0),ue.setUniform1f(v,"startPadding",0),ue.setUniform1f(v,"frameStartOffset",0),I.drawTriangles(Pe,0,6,0);const ce=C(x).shaderManager.getProgram(F.GifTimeline);C(x).resouceManager.allocateFrameDrawingTarget(V=>{const N=[];for(let W=0;W<P.length;W++){let ie=P[W].getBuffer();if(I.getNumberOfDrawCalls(ie)%2===1){v.viewport(0,0,a,i);const re=new ir(I,C(x).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:ie},drawingTarget:V.allocate(a,i)});N.push(re.texture)}else N.push(ie)}ce.useProgram(v);for(let W=0;W<N.length;W++){const ie=N[W];ce.setTextureUniform(v,`targetTexture${W+1}`,ie)}ce.setUniform1f(v,"totalWidth",c),ce.setUniform1f(v,"timelineFrameWidth",a),ce.setUniform1f(v,"offset",f),ce.setUniform1f(v,"startPadding",B.normilizedStartPadding),ce.setUniform1f(v,"frameStartOffset",B.frameStartOffset),v.enable(v.BLEND),v.blendFunc(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA),v.viewport(0,0,c,i),v.clearColor(0,0,0,1),I.drawTriangles(Pe,0,6*B.thumbnailFrames.length,0)});const mt=Math.min(n.gif.images.length-B.currentFrame,h+1),Ve=t.currentFrameNumber()-B.currentFrame-1;if(!(Ve<0||Ve>B.currentFrame+mt)){const V=C(x).shaderManager.getProgram(F.GifTimelineCurrentFrame);V.useProgram(v),V.setUniform1f(v,"totalWidth",c),V.setUniform1f(v,"timelineFrameWidth",a),V.setUniform1f(v,"startPadding",B.normilizedStartPadding),V.setUniform1f(v,"frameStartOffset",Ve),V.setUniform1f(v,"ratio",i/a),I.drawTriangles(Pe,0,6,0)}Q.set(B.normilizedStartPadding),He.set(mt),D.set(B.currentFrame)};let Ee=null;R=()=>(Ee===null&&(Ee=Me().finally(()=>{Ee=null})),Ee);const ht=()=>{E=requestAnimationFrame(ht),R()};E=requestAnimationFrame(ht)},0),J(S.element,()=>{cancelAnimationFrame(E),e(),S.dispose(),P.forEach(A=>{C(x).resouceManager.getLastingAllocator().dispose(A)}),C(x).shaderManager.dispose(),ur(x),b()})})}function oi(t){let e=[];const r=M([]),n=M(null),i=a=>{n.set(a)},o=a=>a===Fe?l=>Pn(l):a===Ae?l=>Nn(l,{direction:ve.in,color:dr()}):a===$e?l=>Sn(l):a===Re?l=>zn(l):()=>null,s=async a=>{const l=a.target.files.item(0),u=await Cr(l),g=Ir(u);if(g){const c=Wr(g);e.push(c),j(async f=>{let h=new cr;await Y.init(c.gif);let w=()=>{},p=()=>{},E=R=>{};const m=M(!1),b=M(1),d=M(c.gif.images.length),x=M([]),$=M(()=>Promise.resolve()),P=M(-1),te=Zn({isPlay:m,renderNext:$,currentFrameNumber:b,totalFrameNumber:d,effects:x,selectedEffect:P,rerender:()=>p(),onClose:()=>w(),removeSelectedEffect:R=>{h.removeEffectFromGif(D,x()[R].effect)},isEffectSelectedToAdd:()=>n()!==null,addSelectedEffect:()=>{const R=o(n());h.addEffectToGif(D,0,1,U=>R(U))}}),O=80,Q=L`
                    <div>
                        <div>
                            ${_(()=>te)}
                        </div>
                        <div>
                            ${_(()=>ii({gif:c,currentFrameNumber:b,isPlay:m,timelineHeight:O,render:R=>E(R),effects:x,selectedEffect:P}))}
                        </div>
                    </div>
                `;w=()=>{h.dispose(),f(),r.set(r().filter(R=>R!==Q)),e=e.filter(R=>R!==c),Y.freeGif(c.gif)},r.set(r().concat(Q));const D=await h.addGifToRender(c,te.getCanvas(),{algorithm:"GL",thread:z.main});p=()=>{m()||h.setFrame(D,h.getCurrentFrame(D))},E=R=>{m()||h.setFrame(D,R)},h.onEffectAdded(D,R=>{if(R.effects.length>x().length){const U=M(R.effect.getFrom(),{dirty(y,S){return!0}}),T=M(R.effect.getTo(),{dirty(y,S){return!0}});x.set([...x(),{effect:R.effect,from:U,to:T}])}else x.set(x().filter(U=>U.effect!==R.effect))}),h.onFrameRender(D,R=>{b.set(R.frameNumber+1)}),Ce(()=>{m()?h.autoplayStart(D)||console.warn("Error to stop"):h.autoplayEnd(D)}),m.set(!0),$.set(()=>()=>h.setFrame(D,(h.getCurrentFrame(D)+1)%c.gif.images.length))})}};return j(a=>{const l=L`
      <div>
        <div>
            <input type="file" onChange="${s}" />
        </div>
        <div style="display: flex">
            <div style="min-width: 80%; border: 1px solid black;">${_(()=>r())}</div>
            <div style="width: 100%; height: 100%; position: sticky; top: 0">${_(()=>ei({selectedEffect:n,selectEffect:i}))}</div>
        </div>
      </div>
    `;return J(l.element,()=>{a(),l.dispose()})})}const si=document.getElementById("main"),ai=oi();hr(si,ai);
