(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();function Rr(t,e){return t.appendChild(e.element),()=>Dr(t,e)}function Dr(t,e){e.dispose(),t.removeChild(e.element)}const he=Symbol(0);let Je=!1,Te=null,Ae=null,J=null,j=0,Ce=[],vt={};const Pr=()=>{},Pe=0,zt=1,Ze=2,et=3;function Mr(){Je=!0,queueMicrotask(Sr)}function Sr(){if(!Ce.length){Je=!1;return}for(let t=0;t<Ce.length;t++)Ce[t].$st!==Pe&&Lr(Ce[t]);Ce=[],Je=!1}function Lr(t){let e=[t];for(;t=t[he];)t.$e&&t.$st!==Pe&&e.push(t);for(let r=e.length-1;r>=0;r--)yt(e[r])}function Q(t){const e=Gr();return qt(e,t.length?t.bind(null,Re.bind(e)):t,null)}function Fe(t){if(!t||!Te)return t||Pr;const e=Te;return e.$d?Array.isArray(e.$d)?e.$d.push(t):e.$d=[e.$d,t]:e.$d=t,function(){e.$st!==et&&(t.call(null),Et(e.$d)?e.$d=null:Array.isArray(e.$d)&&e.$d.splice(e.$d.indexOf(t),1))}}function Re(t=!0){if(this.$st!==et){if(this.$h)if(Array.isArray(this.$h))for(let e=this.$h.length-1;e>=0;e--)Re.call(this.$h[e]);else Re.call(this.$h);if(t){const e=this[he];e&&(Array.isArray(e.$h)?e.$h.splice(e.$h.indexOf(this),1):e.$h=null),_r(this)}}}function _r(t){t.$st=et,t.$d&&Xt(t),t.$s&&dt(t,0),t[he]=null,t.$s=null,t.$o=null,t.$h=null,t.$cx=vt,t.$eh=null}function Xt(t){try{if(Array.isArray(t.$d))for(let e=t.$d.length-1;e>=0;e--){const r=t.$d[e];r.call(r)}else t.$d.call(t.$d);t.$d=null}catch(e){jt(t,e)}}function qt(t,e,r){const n=Te,i=Ae;Te=t,Ae=r;try{return e.call(t)}finally{Te=n,Ae=i}}function jt(t,e){if(!t||!t.$eh)throw e;let r=0,n=t.$eh.length,i=e;for(r=0;r<n;r++)try{t.$eh[r](i);break}catch(o){i=o}if(r===n)throw i}function Kt(){return this.$st===et?this.$v:(Ae&&!this.$e&&(!J&&Ae.$s&&Ae.$s[j]==this?j++:J?J.push(this):J=[this]),this.$c&&yt(this),this.$v)}function Yt(t){const e=Et(t)?t(this.$v):t;if(this.$ch(this.$v,e)&&(this.$v=e,this.$o))for(let r=0;r<this.$o.length;r++)er(this.$o[r],Ze);return this.$v}const wt=function(){this[he]=null,this.$h=null,Te&&Te.append(this)},ve=wt.prototype;ve.$cx=vt;ve.$eh=null;ve.$c=null;ve.$d=null;ve.append=function(t){t[he]=this,this.$h?Array.isArray(this.$h)?this.$h.push(t):this.$h=[this.$h,t]:this.$h=t,t.$cx=t.$cx===vt?this.$cx:{...this.$cx,...t.$cx},this.$eh&&(t.$eh=t.$eh?[...t.$eh,...this.$eh]:this.$eh)};ve.dispose=function(){Re.call(this)};function Gr(){return new wt}const Jt=function(e,r,n){wt.call(this),this.$st=r?Ze:Pe,this.$i=!1,this.$e=!1,this.$s=null,this.$o=null,this.$v=e,r&&(this.$c=r),n&&n.dirty&&(this.$ch=n.dirty)},bt=Jt.prototype;Object.setPrototypeOf(bt,ve);bt.$ch=Ur;bt.call=Kt;function Zt(t,e,r){return new Jt(t,e,r)}function Ur(t,e){return t!==e}function Et(t){return typeof t=="function"}function yt(t){if(t.$st===zt)for(let e=0;e<t.$s.length&&(yt(t.$s[e]),t.$st!==Ze);e++);t.$st===Ze?Qt(t):t.$st=Pe}function Br(t){t.$h&&Re.call(t,!1),t.$d&&Xt(t),t.$eh=t[he]?t[he].$eh:null}function Qt(t){let e=J,r=j;J=null,j=0;try{Br(t);const n=qt(t,t.$c,t);St(t),!t.$e&&t.$i?Yt.call(t,n):(t.$v=n,t.$i=!0)}catch(n){St(t),jt(t,n)}finally{J=e,j=r,t.$st=Pe}}function St(t){if(J){if(t.$s&&dt(t,j),t.$s&&j>0){t.$s.length=j+J.length;for(let r=0;r<J.length;r++)t.$s[j+r]=J[r]}else t.$s=J;let e;for(let r=j;r<t.$s.length;r++)e=t.$s[r],e.$o?e.$o.push(t):e.$o=[t]}else t.$s&&j<t.$s.length&&(dt(t,j),t.$s.length=j)}function er(t,e){if(!(t.$st>=e)&&(t.$e&&t.$st===Pe&&(Ce.push(t),Je||Mr()),t.$st=e,t.$o))for(let r=0;r<t.$o.length;r++)er(t.$o[r],zt)}function dt(t,e){let r,n;for(let i=e;i<t.$s.length;i++)r=t.$s[i],r.$o&&(n=r.$o.indexOf(t),r.$o[n]=r.$o[r.$o.length-1],r.$o.pop())}function L(t,e){const r=Zt(t,null,e),n=Kt.bind(r);return n[he]=!0,n.set=Yt.bind(r),n}function De(t,e){const r=Zt(null,function(){let i=t();return Et(i)&&Fe(i),null},void 0);return r.$e=!0,Qt(r),Re.bind(r,!0)}function re(t,e){return{__component:!0,element:t,dispose:e}}function Xe(t){return t!==null&&typeof t=="object"&&t.__component}function Nr(t){const e=new FileReader;return new Promise(r=>{e.onload=function(n){const i=n.target.result;r(i)},e.readAsArrayBuffer(t)})}function tr(t,e,r){return t*(r/e)}function ht(t){return"error"in t}let kr=0;function Or(){return kr++}function Ir(){let t=0;return()=>t++}let _e="<",Ke="</",fe=">",at="/>",Wr="<!--",Hr="-->";const gt=`
`,Vr="\r";let ut=new Set([Vr,gt," "]);const rr="onClick",nr="onInput",ir="onKeyDown",or="onFocusOut",sr="onChange";let zr=new Set([rr,nr,ir,or,sr]),Xr=new Set(["disabled"]),qr=new Set(["value"]);const de="children";function jr(t,e){const r={type:"element",tag:"div",properties:[],bindings:[],events:[],children:[]};let n=r,i=0,o=0,a=0,s=0,u=0;const d=N();if(d)return{error:d};return{value:r};function g(x=1){return t[i].slice(o,o+x)||""}function p(){return e[a]}function h(){a+=1}function c(x=1){o+=x,u+=x}function T(){i+=1,o=0}function C(){let x=t[i];for(;o<x.length&&ut.has(x[o]);)x[o]===gt&&(s+=1,u=0),c()}function $(){let x=t[i];for(;(o<x.length||q())&&g(3)!==Hr;)x[o]===gt&&(s+=1,u=0),q()?(T(),h(),x=t[i]):c()}function v(){const x=t[i];return o>=x.length&&i>=t.length-1}function b(){let x=o,E=t[i];for(;o<E.length&&!ut.has(E[o])&&E[o]!==fe;)c();return E.slice(x,o)}function l(){C();const x=w();if(ht(x))return x.error;if(x.value.selfClosing)return null;const E=N();if(E)return E;const F=le();if(F)return F}function w(){if(g()===_e)c();else return{error:B(`Error during parseElementStart: expect start of opening element "${_e}", but got "${g()}"`)};const x=b();n.tag=x,C();const E=P();if(E)return{error:E};let F=!1;if(g()===fe)c();else if(g(2)===at)F=!0,c(2);else return{error:B(`Error during parseElementStart: expect end of opening element "${fe}" or "${at}", but got "${g()}"`)};return{value:{selfClosing:F,tag:x}}}function P(){for(;g()!==fe&&g(2)!==at;){C();const x=y();if(g()!=="=")return B(`Error during parseAttribs: invalid char between attrib name and value; expect "=", but got "${g()}"`);c();const E=ne();if(ht(E))return E.error;const F=E.value;if(zr.has(x)){if(typeof F!="function")return B(`Error during parseAttribs: "${x}" event attrib; expect value to be function, but got "${typeof F}"`);n.events.push([x,F])}else if(typeof F=="function")n.bindings.push([x,F]);else if(typeof F=="number"||typeof F=="string"||typeof F=="boolean")n.properties.push([x,F]);else return B("Error during parseAttribs: unknown atrib value type");C()}}function y(){let x=o,E=t[i];for(;o<E.length&&E[o]!=="="&&!ut.has(E[o]);)c();return E.slice(x,o)}function U(){let x=o,E=t[i];for(;o<E.length&&E[o]!=='"';)c();return E.slice(x,o)}function ne(){if(g()!=='"')return{error:B(`Error during parseAttribValue: value should be enclosing in '"', but got "${g()}"`)};if(c(),q()){T();const E=p();return h(),x()??{value:E}}else{let E=U();return x()??{value:E}}function x(){if(g()!=='"')return{error:B(`Error during parseAttribValue: value should be enclosing in '"', but got "${g()}"`)};c()}}function q(){return t[i].length===o}function N(){for(;C(),!v();)if(q()){const x=p();if(typeof x=="function")n.bindings.push([de,x]);else if(typeof x=="number"||typeof x=="string"||typeof x=="boolean")n.properties.push([de,x]);else return B("Error during parseChildren: unknown atrib value type");T(),h()}else if(g(4)===Wr)c(4),$(),c(3);else{if(g(2)===Ke)break;if(g()===_e){const x=n;n={type:"element",tag:void 0,properties:[],bindings:[],events:[],children:[]},x.children.push(n);const E=l();if(E)return E;n=x}else{const x=K();n.children.push({type:"text",value:x})}}C()}function K(){let x=o,E=t[i];for(;o<E.length&&E[o]!==_e;)c();return E.slice(x,o)}function le(){if(g(2)===Ke)c(2);else return B(`Error during parseElementEnd: expect start of closing element "${Ke}", but got "${g(2)}"`);const x=b();if(x!==n.tag)return B(`Error during parseElementEnd: expect closing element to be "${n.tag}", but got "${x}"`);if(C(),g()===fe)c();else return B(`Error during parseElementEnd: expect end of closing element "${fe}", but got "${g()}"`)}function B(x){return{description:x,line:s,templatesIndex:i,column:u,valuesIndex:a}}}function Lt(t,e,r){let n="",i=t,o=1;const a=Or(),s=Ir();return u(),n;function u(){if(i.type==="text"){n+=`${new Array(o+1).join(" ")}${i.value}
`;return}let g=null;const p=()=>(g===null&&(g=`parsed-element-${a}-${s()}`),`[${g}]`),h="@{reactive binding}",c="@{event handler}";n+=`${new Array(o).join(" ")}${_e}${i.tag}`;const T=i.bindings.filter(([l])=>l!==de).sort(([l],[w])=>l.charCodeAt(0)-w.charCodeAt(0)),C=i.events.toSorted(([l],[w])=>l.charCodeAt(0)-w.charCodeAt(0)),$=i.properties.filter(([l])=>l!==de).sort(([l],[w])=>l.charCodeAt(0)-w.charCodeAt(0));if($.length>0){const l=$.map(([w,P])=>`${w}="${String(P)}"`).join(" ");n+=` ${l}`}if(i.bindings.length>0&&e)e(p,i.bindings);else if(T.length>0){const l=T.map(([w])=>`${w}="${h}"`).join(" ");n+=` ${l}`}if(C.length>0)if(r)r(p,C);else{const l=C.map(([w])=>`${w}="${c}"`).join(" ");n+=` ${l}`}g&&(n+=` ${g}`),n+=fe,i.children.length>0&&(n+=`
`);const v=i.bindings.find(([l])=>l===de),b=i.properties.find(([l])=>l===de);v&&!e?n+=h:b?n+=String(b[1]):d(),i.children.length>0&&(n+=new Array(o).join(" ")),n+=`${Ke}${i.tag}${fe}`,n+=`
`}function d(){if(i.type==="text")return;o+=1;let g=i;for(let p=0;p<i.children.length;p++)i=i.children[p],u(),i=g;o-=1}}function G(t,...e){let r=jr(t,e);if(ht(r)){let h=new Array(t.length+e.length);for(let C=0;C<t.length-1;C++)h[C*2+0]=t[C],h[C*2+1]=String(e[C]);h[(t.length-1)*2+0]=t[t.length-1];const c=h.join("");console.warn(`Error for template
`+c),console.warn("html parsing error: ",r.error.description);const T=c.split(`
`);if(r.error.line<T.length){const C=r.error.column-15,$=r.error.column+15;console.warn(`Error at line - ${r.error.line} column - ${r.error.column}`),r.error.line!==0&&console.warn(`${r.error.line-1}: ${T[r.error.line-1]}`),console.warn(`${r.error.line}: ${T[r.error.line].slice(0,C)+"%c"+T[r.error.line].slice(C)}`,"color: red"),r.error.line<T.length-1&&console.warn(`${r.error.line+1}: ${T[r.error.line+1]}`),console.warn(`Error at line - ${T[r.error.line].slice(C,$)}`)}return{element:document.createElement("div"),dispose:()=>{}}}let n=Lt(r.value);const i=document.createElement("div");let o=()=>{},a=[],s=[],u=[];const d=(h,c)=>{const T=c.find(([$])=>$===de),C=c.filter(([$])=>$!==de);T&&u.push({selector:h(),child:T[1]}),C.length>0&&C.forEach($=>{a.push({selector:h(),binding:$})})},g=(h,c)=>{c.length>0&&c.forEach(T=>{s.push({selector:h(),event:T})})},p=Lt(r.value,d,g);return i.innerHTML=p,(u.length>0||a.length>0||s.length)&&Q(h=>{const c=$=>{Xe($)&&$.dispose()},T=new Map;let C=[];o=()=>{C.forEach(c),h()};for(let $=0;$<u.length;$++){const v=u[$];let b=T.has(v.selector)?T.get(v.selector):i.querySelector(v.selector);T.set(v.selector,b),b?De((()=>{let w=null;return()=>{if(_t(v.child)){const P=v.child();Xe(P)?(c(w),b.innerHTML="",b.appendChild(P.element)):P===null?(c(w),b.innerHTML=""):_t(v.child)&&Array.isArray(P)?Array.isArray(w)?(w.filter(U=>P.findIndex(ne=>U===ne)===-1).forEach(U=>{c(U),b.removeChild(U.element)}),P.forEach(U=>{b.appendChild(U.element)})):(c(w),b.innerHTML="",P.forEach(y=>{b.appendChild(y.element)})):b.innerHTML=String(P),Xe(w)&&(C=C.filter(y=>y!==w)),Xe(P)&&C.push(P),w=P}else b.innerHTML=String(v.child())}})()):(console.warn("Error during parsing template: cannot find element with id "+v.selector),console.warn(`Error for template
`+n),console.warn(`Error for result template
`+p))}for(let $=0;$<a.length;$++){const v=a[$];let b=T.has(v.selector)?T.get(v.selector):i.querySelector(v.selector);T.set(v.selector,b),b?De(()=>{if(Xr.has(v.binding[0])){const l=v.binding[1]();l?b.setAttribute(v.binding[0],String(l)):b.removeAttribute(v.binding[0])}else if(qr.has(v.binding[0])){const l=v.binding[1]();b[v.binding[0]]=String(l)}else{const l=v.binding[1]();b.setAttribute(v.binding[0],String(l))}}):console.warn("Error during parsing template: cannot find element with id "+v.selector)}for(let $=0;$<s.length;$++){const v=s[$];let b=T.has(v.selector)?T.get(v.selector):i.querySelector(v.selector);if(T.set(v.selector,b),b){if(v.event[0]===rr){const l=w=>{v.event[1](w)};b.addEventListener("click",l),Fe(()=>b.removeEventListener("click",l))}if(v.event[0]===nr){const l=w=>{v.event[1](w)};b.addEventListener("input",l),Fe(()=>b.removeEventListener("input",l))}if(v.event[0]===ir){const l=w=>{v.event[1](w)};b.addEventListener("keydown",l),Fe(()=>b.removeEventListener("keydown",l))}if(v.event[0]===or){const l=w=>{v.event[1](w)};b.addEventListener("focusout",l),Fe(()=>b.removeEventListener("focusout",l))}if(v.event[0]===sr){const l=w=>{v.event[1](w)};b.addEventListener("change",l),Fe(()=>b.removeEventListener("change",l))}}else console.warn("Error during parsing template: cannot find element with id "+v.selector)}}),re(i,o)}function V(t){return t.__child=!0,t}function _t(t){return t.__child}var Ye=(t=>(t[t.comma=44]="comma",t[t.semicolon=59]="semicolon",t[t.G=71]="G",t[t.I=73]="I",t[t.F=70]="F",t))(Ye||{}),mt=(t=>(t[t.blockLabel=33]="blockLabel",t[t.graphicControl=249]="graphicControl",t[t.applicationLabel=255]="applicationLabel",t))(mt||{}),tt=(t=>(t[t.imageSeparator=44]="imageSeparator",t[t.gifTermination=59]="gifTermination",t))(tt||{}),te=(t=>(t[t.start=6]="start",t[t.size=7]="size",t))(te||{}),Ue=(t=>(t[t.start=13]="start",t[t.entriesCount=3]="entriesCount",t))(Ue||{}),ar=(t=>(t[t.size=10]="size",t))(ar||{});function Kr(t,e){return ur(t,Ue.start,e)}function ur(t,e,r){const n=new Uint8Array(t),i=1<<r;let o=n.subarray(e,e+i*3);return{entriesCount:i,getRed(a){return n[e+(a*3+0)]},getGreen(a){return n[e+(a*3+1)]},getBlue(a){return n[e+(a*3+2)]},getColor(a){return{red:this.getRed(a),green:this.getGreen(a),blue:this.getBlue(a)}},getRawData(){return o}}}function Yr(t,e){const r=new Uint8Array(t);r[e]!==tt.imageSeparator&&console.warn(`Invalid image descriptor: ${e}. Image desriptor doesn't start with ','`);const n=r[e+1]|r[e+2]<<8,i=r[e+3]|r[e+4]<<8,o=r[e+5]|r[e+6]<<8,a=r[e+7]|r[e+8]<<8,s=r[e+9]>>7,u=r[e+9]>>6&1,d=(r[e+9]&7)+1;return{imageLeft:n,imageTop:i,imageWidth:o,imageHeight:a,M:s,I:u,pixel:d,compressedData:null,graphicControl:null,colorMap:null,startPointer:0}}function lr(t,e){const r=new Uint8Array(t);for(;r[e]&&e<r.byteLength;){const n=r[e];e+=n+1}return e+1}var pt=(t=>(t[t.noAction=0]="noAction",t[t.noDispose=1]="noDispose",t[t.clear=2]="clear",t[t.prev=3]="prev",t))(pt||{});function Jr(t,e){const r=new Uint8Array(t),n=r[e]&1,i=r[e]>>>1&1,o=r[e]>>>2&7,a=(r[e+1]|r[e+2]<<8)*10,s=r[e+3];return{isTransparent:n,isUserInputRequired:i,disposalMethod:o,delayTime:a,transparentColorIndex:s}}function Zr(t,e){return e+=1,lr(t,e)}function Qr(t,e){const r=new Uint8Array(t),n=[];let i=null,o=null;for(;e<r.byteLength&&e!==-1;)switch(r[e]){case mt.blockLabel:{if(e++,r[e++]===mt.graphicControl){const s=r[e];i=Jr(t,e+1),e=e+s+1}else e=lr(t,e);break}case tt.imageSeparator:{o=Yr(t,e),n.push(o),e+=ar.size,o.M&&(o.colorMap=ur(t,e,o.pixel),e+=o.colorMap.entriesCount*Ue.entriesCount),i&&(o.graphicControl=i),o.compressedData=r.subarray(e,Zr(t,e)),o.startPointer=e,e+=o.compressedData.byteLength;break}default:{e++;break}}return{images:n,blockEnd:e}}function en(t){const e=new Uint8Array(t);e[te.start+te.size-1]!==0&&console.warn("Invalid Screen Descriptor section: last byte should be 0");const r=e[te.start+0]|e[te.start+1]<<8,n=e[te.start+2]|e[te.start+3]<<8,i=e[te.start+4]>>7,o=((e[te.start+4]&112)>>4)+1,a=(e[te.start+4]&7)+1,s=e[te.start+5];return{screenWidth:r,screenHeight:n,M:i,cr:o,pixel:a,background:s}}function tn(t){const e=String.fromCharCode,r=new Uint8Array(t);if(r[0]===Ye.G&&r[1]===Ye.I&&r[2]===Ye.F){const n=Number(e(r[3]))*10+Number(e(r[4])),i=`GIF${n}${e(r[5])}`,o=en(t);let a=Ue.start,s=null;o.M&&(s=Kr(t,o.pixel),a+=s.entriesCount*Ue.entriesCount);let{images:u,blockEnd:d}=Qr(t,a);for(;d<r.length&&r[d]!==tt.gifTermination;)d++;return d>r.length&&console.warn("GIF doens`t terminate with proper symbol. It may be corrapted."),{signature:i,version:n,screenDescriptor:o,colorMap:s,images:u,buffer:r}}}function rn(t){return{gif:t}}var nn=(()=>{var t=typeof document<"u"&&document.currentScript?document.currentScript.src:void 0;return(function(e){e=e||{};var r=typeof e<"u"?e:{},n=Object.assign,i,o;r.ready=new Promise(function(f,m){i=f,o=m});var a=n({},r),s=!0,u="";function d(f){return r.locateFile?r.locateFile(f,u):u+f}var g;typeof document<"u"&&document.currentScript&&(u=document.currentScript.src),t&&(u=t),u.indexOf("blob:")!==0?u=u.substr(0,u.replace(/[?#].*/,"").lastIndexOf("/")+1):u="",r.print||console.log.bind(console);var p=r.printErr||console.warn.bind(console);n(r,a),a=null,r.arguments&&r.arguments,r.thisProgram&&r.thisProgram,r.quit&&r.quit;var h;r.wasmBinary&&(h=r.wasmBinary),r.noExitRuntime,typeof WebAssembly!="object"&&Le("no native wasm support detected");var c,T=!1;function C(f){var m=r["_"+f];return m}function $(f,m,A,k,I){var O={string:function(X){var ye=0;if(X!=null&&X!==0){var Mt=(X.length<<2)+1;ye=it(Mt),y(X,ye,Mt)}return ye},array:function(X){var ye=it(X.length);return U(X,ye),ye}};function R(X){return m==="string"?w(X):m==="boolean"?!!X:X}var D=C(f),Y=[],pe=0;if(k)for(var xe=0;xe<k.length;xe++){var Pt=O[A[xe]];Pt?(pe===0&&(pe=Rt()),Y[xe]=Pt(k[xe])):Y[xe]=k[xe]}var st=D.apply(null,Y);function $r(X){return pe!==0&&Dt(pe),R(X)}return st=$r(st),st}function v(f,m,A,k){A=A||[];var I=A.every(function(R){return R==="number"}),O=m!=="string";return O&&I&&!k?C(f):function(){return $(f,m,A,arguments)}}var b=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0;function l(f,m,A){for(var k=m+A,I=m;f[I]&&!(I>=k);)++I;if(I-m>16&&f.subarray&&b)return b.decode(f.subarray(m,I));for(var O="";m<I;){var R=f[m++];if(!(R&128)){O+=String.fromCharCode(R);continue}var D=f[m++]&63;if((R&224)==192){O+=String.fromCharCode((R&31)<<6|D);continue}var Y=f[m++]&63;if((R&240)==224?R=(R&15)<<12|D<<6|Y:R=(R&7)<<18|D<<12|Y<<6|f[m++]&63,R<65536)O+=String.fromCharCode(R);else{var pe=R-65536;O+=String.fromCharCode(55296|pe>>10,56320|pe&1023)}}return O}function w(f,m){return f?l(K,f,m):""}function P(f,m,A,k){if(!(k>0))return 0;for(var I=A,O=A+k-1,R=0;R<f.length;++R){var D=f.charCodeAt(R);if(D>=55296&&D<=57343){var Y=f.charCodeAt(++R);D=65536+((D&1023)<<10)|Y&1023}if(D<=127){if(A>=O)break;m[A++]=D}else if(D<=2047){if(A+1>=O)break;m[A++]=192|D>>6,m[A++]=128|D&63}else if(D<=65535){if(A+2>=O)break;m[A++]=224|D>>12,m[A++]=128|D>>6&63,m[A++]=128|D&63}else{if(A+3>=O)break;m[A++]=240|D>>18,m[A++]=128|D>>12&63,m[A++]=128|D>>6&63,m[A++]=128|D&63}}return m[A]=0,A-I}function y(f,m,A){return P(f,K,m,A)}function U(f,m){N.set(f,m)}function ne(f,m){return f%m>0&&(f+=m-f%m),f}var q,N,K;function le(f){q=f,r.HEAP8=N=new Int8Array(f),r.HEAP16=new Int16Array(f),r.HEAP32=new Int32Array(f),r.HEAPU8=K=new Uint8Array(f),r.HEAPU16=new Uint16Array(f),r.HEAPU32=new Uint32Array(f),r.HEAPF32=new Float32Array(f),r.HEAPF64=new Float64Array(f)}var B=r.INITIAL_MEMORY||65536;r.wasmMemory?c=r.wasmMemory:c=new WebAssembly.Memory({initial:B/65536,maximum:2147483648/65536}),c&&(q=c.buffer),B=q.byteLength,le(q);var x,E=[],F=[],z=[];function Me(){if(r.preRun)for(typeof r.preRun=="function"&&(r.preRun=[r.preRun]);r.preRun.length;)Se(r.preRun.shift());ae(E)}function ge(){ae(F)}function me(){if(r.postRun)for(typeof r.postRun=="function"&&(r.postRun=[r.postRun]);r.postRun.length;)ee(r.postRun.shift());ae(z)}function Se(f){E.unshift(f)}function we(f){F.unshift(f)}function ee(f){z.unshift(f)}var W=0,ce=null;function be(f){W++,r.monitorRunDependencies&&r.monitorRunDependencies(W)}function nt(f){if(W--,r.monitorRunDependencies&&r.monitorRunDependencies(W),W==0&&ce){var m=ce;ce=null,m()}}r.preloadedImages={},r.preloadedAudios={};function Le(f){r.onAbort&&r.onAbort(f),f="Aborted("+f+")",p(f),T=!0,f+=". Build with -s ASSERTIONS=1 for more info.";var m=new WebAssembly.RuntimeError(f);throw o(m),m}var We="data:application/octet-stream;base64,";function ie(f){return f.startsWith(We)}var H;H="out.wasm",ie(H)||(H=d(H));function _(f){try{if(f==H&&h)return new Uint8Array(h);if(!g)throw"both async and sync fetching of the wasm failed"}catch(m){Le(m)}}function Ee(){return!h&&s&&typeof fetch=="function"?fetch(H,{credentials:"same-origin"}).then(function(f){if(!f.ok)throw"failed to load wasm binary file at '"+H+"'";return f.arrayBuffer()}).catch(function(){return _(H)}):Promise.resolve().then(function(){return _(H)})}function He(){var f={a:Ar};function m(R,D){var Y=R.exports;r.asm=Y,x=r.asm.f,we(r.asm.c),nt()}be();function A(R){m(R.instance)}function k(R){return Ee().then(function(D){return WebAssembly.instantiate(D,f)}).then(function(D){return D}).then(R,function(D){p("failed to asynchronously prepare wasm: "+D),Le(D)})}function I(){return!h&&typeof WebAssembly.instantiateStreaming=="function"&&!ie(H)&&typeof fetch=="function"?fetch(H,{credentials:"same-origin"}).then(function(R){var D=WebAssembly.instantiateStreaming(R,f);return D.then(A,function(Y){return p("wasm streaming compile failed: "+Y),p("falling back to ArrayBuffer instantiation"),k(A)})}):k(A)}if(r.instantiateWasm)try{var O=r.instantiateWasm(f,m);return O}catch(R){return p("Module.instantiateWasm callback failed with error: "+R),!1}return I().catch(o),{}}function ae(f){for(;f.length>0;){var m=f.shift();if(typeof m=="function"){m(r);continue}var A=m.func;typeof A=="number"?m.arg===void 0?$t(A)():$t(A)(m.arg):A(m.arg===void 0?null:m.arg)}}var Ve=[];function $t(f){var m=Ve[f];return m||(f>=Ve.length&&(Ve.length=f+1),Ve[f]=m=x.get(f)),m}function Cr(f){try{return c.grow(f-q.byteLength+65535>>>16),le(c.buffer),1}catch{}}function Fr(f){var m=K.length;f=f>>>0;var A=2147483648;if(f>A)return!1;for(var k=1;k<=4;k*=2){var I=m*(1+.2/k);I=Math.min(I,f+100663296);var O=Math.min(A,ne(Math.max(f,I),65536)),R=Cr(O);if(R)return!0}return!1}var Ar={b:Fr,a:c};He(),r.___wasm_call_ctors=function(){return(r.___wasm_call_ctors=r.asm.c).apply(null,arguments)},r._lzw_uncompress=function(){return(r._lzw_uncompress=r.asm.d).apply(null,arguments)},r._malloc=function(){return(r._malloc=r.asm.e).apply(null,arguments)};var Rt=r.stackSave=function(){return(Rt=r.stackSave=r.asm.g).apply(null,arguments)},Dt=r.stackRestore=function(){return(Dt=r.stackRestore=r.asm.h).apply(null,arguments)},it=r.stackAlloc=function(){return(it=r.stackAlloc=r.asm.i).apply(null,arguments)};r.cwrap=v;var ze;ce=function f(){ze||ot(),ze||(ce=f)};function ot(f){if(W>0||(Me(),W>0))return;function m(){ze||(ze=!0,r.calledRun=!0,!T&&(ge(),i(r),r.onRuntimeInitialized&&r.onRuntimeInitialized(),me()))}r.setStatus?(r.setStatus("Running..."),setTimeout(function(){setTimeout(function(){r.setStatus("")},1),m()},1)):m()}if(r.run=ot,r.preInit)for(typeof r.preInit=="function"&&(r.preInit=[r.preInit]);r.preInit.length>0;)r.preInit.pop()();return ot(),e.ready})})();const on="/assets/uncompress_wasm_code-hbswY8bJ.wasm",sn=12,an=1<<sn,cr=65536,un=2,ln=an*12*un+cr/2;function cn(t,e){const r=Math.floor((t.byteLength+e+ln)/cr)+1,n=new WebAssembly.Memory({initial:r,maximum:r}),i=new Uint8Array(n.buffer);return nn({wasmMemory:n,locateFile(a){return a.endsWith(".wasm")?on:a}}).then(a=>{const s=a.cwrap("lzw_uncompress","void",["number","number","number","number"]),u=a._malloc(t.byteLength),d=a._malloc(e);return i.set(t,u),{module:a,lzw_uncompress:s,gifStartPointer:u,outBuffer:i.subarray(d,d+e),outStartPointer:d}})}function fn(t){let e=0;return cn(t.buffer,t.screenDescriptor.screenWidth*t.screenDescriptor.screenHeight).then(r=>{e=r.gifStartPointer;function n(i){r.lzw_uncompress(e+i.startPointer,i.compressedData.length,r.outStartPointer,r.outBuffer.length)}return{lzw_uncompress:n,out:r.outBuffer}})}class dn{constructor(){this.onceTimerId=-1}once(e,r){this.onceTimerId=setTimeout(e,r)}clear(){return this.isOnceTimerSetted()?(clearTimeout(this.onceTimerId),this.onceTimerId=-1,!0):!1}isOnceTimerSetted(){return this.onceTimerId!==-1}}class Gt{constructor(e,r){this.width=e,this.height=r,this.memory=new ImageData(e,r)}getRawMemory(){return this.memory}setRedInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+0]=n}setGreenInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+1]=n}setBlueInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+2]=n}setAlphaInPixel(e,r,n){const i=(r*this.width+e)*4;this.memory.data[i+3]=n}set(e){this.memory.data.set(e.getRawMemory().data)}}class hn{constructor(e,r,n,i,o){this.ctx=e.getContext("2d"),this.uncompressedData=o.out,this.lzw_uncompress=o.lzw_uncompress,this.graphicMemory=new Gt(r.screenWidth,r.screenHeight),this.prevGraphicMemory=new Gt(r.screenWidth,r.screenHeight)}drawToTexture(e,r){const n=e.graphicControl;n!=null&&n.isTransparent?this.updateFrameData89(e,r):this.updateFrameData87(e,r)}drawToScreen(){const e=this.graphicMemory;this.ctx.putImageData(e.getRawMemory(),0,0)}restorePrevDisposal(){this.graphicMemory.set(this.prevGraphicMemory)}saveDisposalPrev(){this.prevGraphicMemory.set(this.graphicMemory)}getCanvasPixels(e){new Uint8ClampedArray(e.buffer).set(this.graphicMemory.getRawMemory().data)}getPrevCanvasPixels(e){new Uint8ClampedArray(e.buffer).set(this.prevGraphicMemory.getRawMemory().data)}dispose(){}updateFrameData87(e,r){const n=this.graphicMemory,i=e.M?e.colorMap:r,o=e.imageLeft,a=e.imageTop,s=e.imageHeight,u=e.imageWidth;let d=0,g=0,p=0;this.lzw_uncompress(e);for(let h=0;h<s;h++)for(let c=0;c<u;c++)p=h*u+c,d=c+o,g=h+a,n.setRedInPixel(d,g,i.getRed(this.uncompressedData[p])),n.setGreenInPixel(d,g,i.getGreen(this.uncompressedData[p])),n.setBlueInPixel(d,g,i.getBlue(this.uncompressedData[p])),n.setAlphaInPixel(d,g,255)}updateFrameData89(e,r){const n=this.graphicMemory,i=e.M?e.colorMap:r,o=e.graphicControl,a=e.imageLeft,s=e.imageTop,u=e.imageHeight,d=e.imageWidth;let g=0,p=0,h=0;this.lzw_uncompress(e);for(let c=0;c<u;c++)for(let T=0;T<d;T++)h=c*d+T,this.uncompressedData[h]!==o.transparentColorIndex&&(g=T+a,p=c+s,n.setRedInPixel(g,p,i.getRed(this.uncompressedData[h])),n.setGreenInPixel(g,p,i.getGreen(this.uncompressedData[h])),n.setBlueInPixel(g,p,i.getBlue(this.uncompressedData[h])),n.setAlphaInPixel(g,p,255))}}var xt=(t=>(t[t.FLOAT=0]="FLOAT",t))(xt||{});function gn(t,e){switch(e){case 0:return t.FLOAT}return 0}function Ut(t,e){switch(e){case t.FLOAT:case 0:return Float32Array.BYTES_PER_ELEMENT}return 0}class mn{constructor(e,r){this.vbo=e.createBuffer();let n=0;if(this.layout=r.map(i=>{const o=n;return n+=Ut(e,i.type)*i.componentsCount,{type:gn(e,i.type),componentsCount:i.componentsCount,offset:o}}),this.stride=0,r.length){const i=this.layout[r.length-1];this.stride=i.offset+Ut(e,i.type)*i.componentsCount}}bind(e){e.bindBuffer(e.ARRAY_BUFFER,this.vbo)}activateAttribPointer(e,r){r>=0&&r<this.layout.length&&(this.setAttribPointer(e,r),e.enableVertexAttribArray(r))}activateAllAttribPointers(e){this.setAllAttribPointers(e);for(let r=0;r<this.layout.length;r++)e.enableVertexAttribArray(r)}setData(e,r){e.bufferData(e.ARRAY_BUFFER,r,e.STATIC_DRAW)}dispose(e){e.deleteBuffer(this.vbo)}setAttribPointer(e,r){if(r>=0&&r<this.layout.length){const n=this.layout[r];e.vertexAttribPointer(r,n.componentsCount,n.type,!1,this.stride,n.offset)}}setAllAttribPointers(e){for(let r=0;r<this.layout.length;r++){const n=this.layout[r];e.vertexAttribPointer(r,n.componentsCount,n.type,!1,this.stride,n.offset)}}}const fr=3,dr=2,pn=fr+dr,xn=[{type:xt.FLOAT,componentsCount:fr},{type:xt.FLOAT,componentsCount:dr}];Float32Array.from([-1,1,0,0,1,1,1,0,1,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0,-1,-1,0,0,0]);const hr=Float32Array.from([-1,1,0,0,0,1,1,0,1,0,-1,-1,0,0,1,1,1,0,1,0,1,-1,0,1,1,-1,-1,0,0,1]),oe=hr.length/pn;var Ge=(t=>(t[t.NEAREST=0]="NEAREST",t[t.LINEAR=1]="LINEAR",t))(Ge||{}),Be=(t=>(t[t.RGB=0]="RGB",t[t.RGBA=1]="RGBA",t[t.R8=2]="R8",t[t.RED=3]="RED",t))(Be||{}),Ct=(t=>(t[t.UNSIGNED_BYTE=0]="UNSIGNED_BYTE",t))(Ct||{}),Tt=(t=>(t[t.TEXTURE0=0]="TEXTURE0",t[t.TEXTURE1=1]="TEXTURE1",t[t.TEXTURE2=2]="TEXTURE2",t))(Tt||{});function Bt(t,e){switch(e){case 0:return t.NEAREST;case 1:return t.LINEAR}return 0}function qe(t,e){switch(e){case 2:return t.R8;case 3:return t.RED;case 0:return t.RGB;case 1:return t.RGBA}return 0}function lt(t,e){switch(e){case 0:return t.UNSIGNED_BYTE}return 0}function Tn(t,e){return t.TEXTURE0+e}const gr={min:0,mag:0},mr={internalFormat:0,format:0,type:0},vn={filtering:gr,imageFormat:mr};class Qe{constructor(e,r,n,i,o=vn){this.width=r,this.height=n,this.texture=e.createTexture(),this.textureUnit=0;const a=(o==null?void 0:o.filtering)??gr,s=(o==null?void 0:o.imageFormat)??mr;this.config={filtering:a,imageFormat:s},e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,Bt(e,a.min)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,Bt(e,a.mag)),e.texImage2D(e.TEXTURE_2D,0,qe(e,s.internalFormat),r,n,0,qe(e,s.format),lt(e,s.type),i),e.bindTexture(e.TEXTURE_2D,null)}bind(e){e.bindTexture(e.TEXTURE_2D,this.texture)}setTextureWrap(e,r,n){e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,r,n),e.bindTexture(e.TEXTURE_2D,null)}setTextureFilter(e,r,n){e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,r,n),e.bindTexture(e.TEXTURE_2D,null)}getTextureUnit(){return this.textureUnit}setTextureUnit(e){this.textureUnit=e}setData(e,r,n,i,o,a){const s=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,r,n,i,o,qe(e,s.format),lt(e,s.type),a),this.prevDataPointer=a}putData(e,r,n,i,o,a){if(this.prevDataPointer!==a){const s=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,r,n,i,o,qe(e,s.format),lt(e,s.type),a),this.prevDataPointer=a}}getGLTexture(){return this.texture}activeTexture(e,r){e.activeTexture(Tn(e,r!==void 0?r:this.textureUnit))}getWidth(){return this.width}getHeight(){return this.height}dispose(e){e.deleteTexture(this.texture)}}class wn{bind(e){console.warn("A noop texture was tried to bind"),console.trace()}getGLTexture(){return null}activeTexture(e,r){}getWidth(){return-1}getHeight(){return-1}setTextureWrap(){}setTextureFilter(){}dispose(){}}function se(t,e){return{texture:e,readResultToBuffer(i,o){o??(o=t.RGBA);const a=r(e);t.readPixels(0,0,e.getWidth(),e.getHeight(),o,t.UNSIGNED_BYTE,i),n(a)}};function r(i){const o=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,o);const a=t.createRenderbuffer();return t.bindRenderbuffer(t.RENDERBUFFER,a),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH24_STENCIL8,i.getWidth(),i.getHeight()),t.bindRenderbuffer(t.RENDERBUFFER,null),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,a),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i.getGLTexture(),0),o}function n(i){t.bindFramebuffer(t.FRAMEBUFFER,null),t.deleteFramebuffer(i)}}var S=(t=>(t[t.ScreenDrawer=0]="ScreenDrawer",t[t.FlipDrawer=1]="FlipDrawer",t[t.CopyDrawer=2]="CopyDrawer",t[t.MixDrawer=3]="MixDrawer",t[t.GifAlpha=10]="GifAlpha",t[t.GifFrame=11]="GifFrame",t[t.GifTimeline=12]="GifTimeline",t[t.GifTimelineCurrentFrame=13]="GifTimelineCurrentFrame",t[t.BlackAndWhite=100]="BlackAndWhite",t[t.Mandess=101]="Mandess",t[t.Darking=102]="Darking",t[t.ConvolutionMatrix=103]="ConvolutionMatrix",t))(S||{});class Nt{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.FlipDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return n.bind(),this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}function pr(t){const e=t,r=new wn;return{bind(){e.bindFramebuffer(e.FRAMEBUFFER,null)},getBuffer(){return r},dispose(){}}}function kt(t,e,r,n){const i=t,o=e,a=r,{frameBuffer:s,texture:u}=g();return{bind(){i.bindFramebuffer(t.FRAMEBUFFER,s)},getBuffer(){return u},dispose(){i.bindFramebuffer(t.FRAMEBUFFER,null),i.deleteFramebuffer(s),i.deleteTexture(u.getGLTexture())}};function g(){const p=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,p);const h=new Qe(t,o,a,null,n);return t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,h.getGLTexture(),0),i.bindFramebuffer(t.FRAMEBUFFER,null),{frameBuffer:p,texture:h}}}class bn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.ScreenDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r}=e,n=pr(this.drawer.getGL());return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}class En{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.GifAlpha)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setUniform1f(this.drawer.getGL(),"TransperancyIndex",r.transperancyIndex),this.gpuProgram.setUniform1f(this.drawer.getGL(),"ScreenHeight",r.screenHeight),this.gpuProgram.setUniform4fv(this.drawer.getGL(),"Rect",r.alphaSquarCoord[0],r.alphaSquarCoord[1],r.alphaSquarCoord[2],r.alphaSquarCoord[3]),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"IndexTexture",n.gifFrame),this.drawer.drawTriangles(i,0,oe,this.drawer.getNumberOfDrawCalls(n.gifFrame)),se(this.drawer.getGL(),i.getBuffer())}}class yn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.GifFrame)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setUniform1f(this.drawer.getGL(),"ColorTableSize",r.colorTableSize),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"IndexTexture",n.indexTexture),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"alphaTexture",n.alphaTexture),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"ColorTableTexture",n.colorTableTexture),n.prevFrameTexture&&this.gpuProgram.setTextureUniform(this.drawer.getGL(),"prevFrameTexture",n.prevFrameTexture),this.drawer.drawTriangles(i,0,oe,this.drawer.getNumberOfDrawCalls(n.indexTexture)),se(this.drawer.getGL(),i.getBuffer())}}class je{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.FlipDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}function xr(t){let e=new WeakMap;return{drawTriangles(r,n,i,o){r.bind(),t.drawArrays(t.TRIANGLES,n,i);const a=r.getBuffer();e.has(a)?e.set(a,o+e.get(a)+1):e.set(a,o+1)},getGL(){return t},startFrame(){e=new Map},endFrame(){e=new Map},getNumberOfDrawCalls(r){return e.has(r)?e.get(r):0}}}function Cn(t,e){let r=[],n=[],i=-1;const o={allocate(s,u,d){const g=kt(t,s,u,d);return n.push(g),g},dispose(s){const u=n.findIndex(d=>d===s);u===-1&&console.warn(`${e}: buffer was already disposed or never created with current allocator`),n[u]=null,n=n.filter(d=>d!==null),s.dispose()}};return{startFrame(){a()},endFrame(){a()},allocateFrameDrawingTarget(s){i+=1,r[i]=[];const u={depth:i,allocate(g,p,h){this.depth!==i&&console.warn(`${e}: allocator should be called inside own callback`);const c=kt(t,g,p,h);return r[i].push(c),c}};try{s(u),d()}catch(g){console.warn(g),d()}function d(){for(let g=0;g<r[i].length;g++)r[i][g].dispose();r[i]=[],i-=1}},getLastingAllocator(){return o}};function a(){for(let s=0;s<r.length;s++)for(let u=0;u<r[s].length;u++)r[s][u].dispose();r=[]}}function Fn(t,e,r){const n=t.createProgram();if(t.attachShader(n,e),t.attachShader(n,r),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS)){const i=t.getProgramInfoLog(n);return console.warn(`Fail to link program: ${i}`),t.deleteProgram(n),null}return n}class An{constructor(e,r,n){this.program=Fn(e,r,n),this.uniformBuffer=new Map,this.currentTextureUnit=-1}isProgramCreated(){return this.program!==null}useProgram(e){this.currentTextureUnit=-1,e.useProgram(this.program)}setTextureUniform(e,r,n){this.currentTextureUnit+=1,n.activeTexture(e,this.currentTextureUnit),n.bind(e),this.setUniform1i(e,r,this.currentTextureUnit)}setUniform1i(e,r,n){let i=this.getCache(e,r);i.value!==n&&(i.value=n,e.uniform1i(i.location,n))}setUniform1f(e,r,n){let i=this.getCache(e,r);i.value!==n&&(i.value=n,e.uniform1f(i.location,n))}setUniform1fv(e,r,n){let i=this.getCache(e,r+"[0]"),o=i.value;(!o||n!==o)&&(i.value=n,e.uniform1fv(i.location,n.getBuffer()))}setUniform3f(e,r,n,i,o){let a=this.getCache(e,r),s=a.value;(!s||(s[0]!==n||s[1],s[2]!==o))&&(s=new Float32Array(3),s[0]=n,s[1]=i,s[2]=o,a.value=s,e.uniform3f(a.location,n,i,o))}setUniform3fv(e,r,n,i,o){let a=this.getCache(e,r+"[0]"),s=a.value;(!s||(s[0]!==n||s[1],s[2]!==o))&&(s=new Float32Array(3),s[0]=n,s[1]=i,s[2]=o,a.value=s,e.uniform3fv(a.location,s))}setUniform4fv(e,r,n,i,o,a){let s=this.getCache(e,r),u=s.value;(!u||(u[0]!==n||u[1],u[2],u[3]!==a))&&(u=new Float32Array(4),u[0]=n,u[1]=i,u[2]=o,u[3]=a,s.value=u,e.uniform4fv(s.location,u))}getCache(e,r){let n=this.uniformBuffer.get(r);return n||(n={location:e.getUniformLocation(this.program,r),value:void 0}),n}dispose(e){e.deleteProgram(this.program),this.program=null}}function Tr(t,e,r){const n=t.createShader(e);if(n===0&&console.warn("Fail to create shader"),t.shaderSource(n,r),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(n);return console.warn(`Fail to compile shader: ${i}`),t.deleteShader(n),null}return n}function $n(t,e){return Tr(t,t.VERTEX_SHADER,e)}function Rn(t,e){return Tr(t,t.FRAGMENT_SHADER,e)}function Ot(t,e){t.deleteShader(e)}const ue=`#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

out vec2 texCoord;

void main()
{
  gl_Position = vPosition;
  texCoord = aTexCoord;
}
`,It=`#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

uniform float totalWidth;
uniform float timelineFrameWidth;
uniform float offset;
uniform float startPadding;
uniform float startOffset;

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
  float x = (startOffset * squarSize) + normilizedStartPadding + texX * squarSize + (squarSize * spaceBetweenSquars) * squarId;

  gl_Position = vec4(mix(-1.0, 1.0, x), mix(-1.0, 1.0, y), 0.0, 1.0);

  texCoord = vec2(texX, y);
  colorEnable = squarId + 1.0;
}
`,Dn=`#version 300 es

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
`,ct=`#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = texture(targetTexture, texCoord);
}
`,Pn=`#version 300 es

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
`,Mn=`#version 300 es

precision mediump float;

in vec2 texCoord;
in float colorEnable;

out vec4 fragColor;

void main()
{
  if (
    texCoord.x < 0.05 ||
    texCoord.x > 0.95 ||
    texCoord.y < 0.05 ||
    texCoord.y > 0.95
    ) {
    fragColor = vec4(1.0, 0.0, 0.0, 0.2);
  } else {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
`,Sn=`#version 300 es

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
`,Ln=`#version 300 es

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
`,_n=`#version 300 es

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
`,Gn=`#version 300 es

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
`,Un=`#version 300 es

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
`,Bn=`#version 300 es

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
`,Nn=`#version 300 es

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
`;function kn(t,e){let r=new Map;return{getProgram(o){if(r.has(o))return r.get(o);let{vertText:a,fragText:s}=n(o);if(a===""||s===""){console.warn(e,"- Unknown program id -",S[o]);const{vertText:p,fragText:h}=i();a=p,s=h}const u=$n(t,a),d=Rn(t,s),g=new An(t,u,d);return Ot(t,u),Ot(t,d),g.isProgramCreated()||console.warn(e,"- Program fail -",S[o]),r.set(o,g),g},dispose(){r.values().forEach(o=>o.dispose(t)),r=null}};function n(o){return o===S.ScreenDrawer||o===S.CopyDrawer?{vertText:ue,fragText:ct}:o===S.FlipDrawer?{vertText:ue,fragText:ct}:o===S.MixDrawer?{vertText:ue,fragText:Ln}:o===S.BlackAndWhite?{vertText:ue,fragText:Sn}:o===S.GifAlpha?{vertText:ue,fragText:_n}:o===S.GifFrame?{vertText:ue,fragText:Gn}:o===S.Mandess?{vertText:Dn,fragText:Un}:o===S.Darking?{vertText:ue,fragText:Bn}:o===S.ConvolutionMatrix?{vertText:ue,fragText:Nn}:o===S.GifTimeline?{vertText:It,fragText:Pn}:o===S.GifTimelineCurrentFrame?{vertText:It,fragText:Mn}:{vertText:"",fragText:""}}function i(){return{vertText:ue,fragText:ct}}}const Ft=new Map;function vr(t,e){Ft.set(e,{resouceManager:Cn(t,e),shaderManager:kn(t,e)})}function wr(t){Ft.delete(t)}function M(t){return Ft.get(t)}let On=-1;class In{constructor(e,r,n,i,o,a){const s=e.getContext("webgl2");this.id=String(++On),vr(s,String(this.id)),this.drawer=xr(s),this.drawer.startFrame();const u=n[0],d=u.M?u.colorMap:i,{screenWidth:g,screenHeight:p}=r;this.screenWidth=g,this.screenHeight=p,this.resultOutputDimension=a,this.uncompressedData=o.out,this.lzw_uncompress=o.lzw_uncompress,s.enable(s.BLEND),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA),s.pixelStorei(s.UNPACK_ALIGNMENT,1),s.viewport(0,0,g,p),s.clearColor(0,0,0,1),this.vboToTexture=new mn(s,xn),this.vboToTexture.bind(s),this.vboToTexture.setData(s,hr),this.vboToTexture.activateAllAttribPointers(s);const h=n.reduce((c,T)=>T.M&&T.colorMap.entriesCount>c?T.colorMap.entriesCount:c,d.entriesCount);this.maxColorMapSize=h,this.colorTableTexture=new Qe(s,h,1,null),this.gifFrameTexture=new Qe(s,g,p,null,{imageFormat:{internalFormat:Be.R8,format:Be.RED,type:Ct.UNSIGNED_BYTE}}),this.colorTableTexture.setTextureUnit(Tt.TEXTURE0),this.gifFrameTexture.setTextureUnit(Tt.TEXTURE1),this.gl=s}drawToTexture(e,r){const n=this.gl;this.lzw_uncompress(e),this.gifFrameTexture.bind(n),this.gifFrameTexture.setData(n,e.imageLeft,e.imageTop,e.imageWidth,e.imageHeight,this.uncompressedData),M(this.id).resouceManager.allocateFrameDrawingTarget(i=>{const o=this.drawToAlphaTexture(i.allocate(this.screenWidth,this.screenHeight),e),a=e.M?e.colorMap:r;this.colorTableTexture.bind(n),this.colorTableTexture.putData(n,0,0,a.entriesCount,1,a.getRawData()),this.gifFrameTexture.bind(n),this.gifFrameTexture.setData(n,e.imageLeft,e.imageTop,e.imageWidth,e.imageHeight,this.uncompressedData),this.currentFrameBuffer&&M(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer),this.currentFrameBuffer=M(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight,{filtering:{min:Ge.LINEAR,mag:Ge.LINEAR}}),this.currentFrame=new yn(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{colorTableSize:this.maxColorMapSize},textures:{colorTableTexture:this.colorTableTexture,indexTexture:this.gifFrameTexture,alphaTexture:o.texture,prevFrameTexture:this.prevFrame?this.prevFrame.texture:null},drawingTarget:this.currentFrameBuffer}),this.prevFrameBuffer&&M(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer),this.prevFrameBuffer=M(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight),this.prevFrame=new je(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:this.prevFrameBuffer})})}restorePrevDisposal(){this.currentFrame=this.disposalPrevFrame,this.prevFrame=this.disposalPrevFrame}drawToScreen(e,r){M(this.id).resouceManager.allocateFrameDrawingTarget(n=>{let i=this.postProcessing(this.currentFrame,n,e,r);this.resultOutputDimension&&(i=new je(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:n.allocate(this.resultOutputDimension.screenWidth,this.resultOutputDimension.screenHeight,{filtering:{min:Ge.LINEAR,mag:Ge.LINEAR}})})),this.drawer.getNumberOfDrawCalls(i.texture)%2===1&&(i=new Nt(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:i.texture},drawingTarget:n.allocate(this.screenWidth,this.screenHeight)})),new bn(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:i.texture}})}),this.drawer.endFrame(),M(this.id).resouceManager.endFrame(),this.drawer.startFrame(),M(this.id).resouceManager.startFrame()}postProcessing(e,r,n,i){let o=e;for(let a=0;a<n.length;a++)o=n[a].apply(this.drawer,M(this.id).shaderManager,o,r,i);return o}drawToAlphaTexture(e,r){var o;const n={screenHeight:this.screenHeight,transperancyIndex:(o=r.graphicControl)!=null&&o.isTransparent?r.graphicControl.transparentColorIndex:512,alphaSquarCoord:[r.imageLeft,r.imageTop,r.imageWidth,r.imageHeight]};return new En(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:n,textures:{gifFrame:this.gifFrameTexture},drawingTarget:e})}saveDisposalPrev(){this.disposalPrevFrameBuffer&&M(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer),this.disposalPrevFrameBuffer=M(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth,this.screenHeight),this.disposalPrevFrame=new je(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:this.disposalPrevFrameBuffer})}getCanvasPixels(e){this.currentFrame&&(this.resultOutputDimension?M(this.id).resouceManager.allocateFrameDrawingTarget(r=>{this.gl.viewport(0,0,this.resultOutputDimension.screenWidth,this.resultOutputDimension.screenHeight);let n=new je(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:this.currentFrame.texture},drawingTarget:r.allocate(this.resultOutputDimension.screenWidth,this.resultOutputDimension.screenHeight)});this.drawer.getNumberOfDrawCalls(n.texture)%2===1&&(n=new Nt(this.drawer,M(this.id).shaderManager).execute({memory:{},globals:{},textures:{targetTexture:n.texture},drawingTarget:r.allocate(this.resultOutputDimension.screenWidth,this.resultOutputDimension.screenHeight)})),this.gl.viewport(0,0,this.screenWidth,this.screenHeight),n.readResultToBuffer(e,this.gl.RGBA)}):this.currentFrame.readResultToBuffer(e))}getPrevCanvasPixels(e){this.prevFrame&&this.prevFrame.readResultToBuffer(e)}dispose(){this.vboToTexture.dispose(this.drawer.getGL()),this.currentFrame.texture.dispose(this.gl),this.disposalPrevFrame.texture.dispose(this.gl),this.prevFrame.texture.dispose(this.gl),this.gifFrameTexture.dispose(this.gl),this.colorTableTexture.dispose(this.gl),M(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer),M(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer),M(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer),M(this.id).shaderManager.dispose(),wr(this.id)}}const Wt=1/25*1e3;class Ht{constructor(){this.gifs=[],this.frameSubsriptions=[],this.effectSubsriptions=[]}addGifToRender(e,r,n){const i={id:this.gifs.length},o={gifEntity:e,currentFrame:-1,algorithm:n.algorithm==="GL"?new In(r,e.gif.screenDescriptor,e.gif.images,e.gif.colorMap,n.uncompress,n.screenDescriptor):new hn(r,e.gif.screenDescriptor,e.gif.images,e.gif.colorMap,n.uncompress),timer:new dn,canvas:r,effects:[]},{screenWidth:a,screenHeight:s}=n.screenDescriptor||o.gifEntity.gif.screenDescriptor;return o.canvas.width=a,o.canvas.height=s,o.canvas.style&&(o.canvas.style.width=`${a}px`,o.canvas.style.height=`${s}px`),this.gifs.push(o),o.gifEntity.gif.images.length?new Promise(u=>o.timer.once(()=>{this.setFrame(i,0).then(()=>u(i))})):Promise.resolve(i)}addEffectToGif(e,r,n,i){r>n&&console.warn("from cannot be greater than to",r,n);const o=this.gifs[e.id];r<0&&console.warn("from should be greater than 0",r),n>=o.gifEntity.gif.images.length&&console.warn("to should be less than number of gif frames",n,o.gifEntity.gif.images.length);const a=i({screenWidth:o.gifEntity.gif.screenDescriptor.screenWidth,screenHeight:o.gifEntity.gif.screenDescriptor.screenHeight,from:r,to:n});o.effects.push(a),this.notifyEffectSubscribers(e,a,r,n)}removeEffectFromGif(e,r){const n=this.gifs[e.id];n.effects=n.effects.filter(i=>i!==r),this.notifyEffectSubscribers(e,r,r.getFrom(),r.getTo())}setFrame(e,r){const n=this.gifs[e.id];return new Promise(i=>{r>-1&&r<n.gifEntity.gif.images.length?(n.timer.clear(),n.timer.once(()=>{const o=Math.max(0,r<n.currentFrame?0:n.currentFrame),a=r;for(let s=o;s<a;s++)this.drawToTexture(n,s),this.performeDisposalMethod(n,s);n.currentFrame=r,this._drawFrame(n,n.currentFrame),i(),this.notifyFrameSubscribers(e)})):i()})}autoplayStart(e){var n;const r=this.gifs[e.id];if(r.gifEntity.gif.images.length>1){const i=()=>{var a;const o=(r.currentFrame+1)%r.gifEntity.gif.images.length;r.timer.once(i,((a=r.gifEntity.gif.images[o].graphicControl)==null?void 0:a.delayTime)||Wt),r.currentFrame=o,this._drawFrame(r,r.currentFrame),this.notifyFrameSubscribers(e)};return r.timer.once(i,((n=r.gifEntity.gif.images[r.currentFrame].graphicControl)==null?void 0:n.delayTime)||Wt),!0}else return!1}autoplayEnd(e){this.gifs[e.id].timer.clear()}onFrameRender(e,r){return this.frameSubsriptions.push(n=>{n.gifDescription.id===e.id&&r(n)}),{clear:()=>{this.frameSubsriptions=this.frameSubsriptions.filter(n=>n!==r)}}}onEffectAdded(e,r){return this.effectSubsriptions.push(n=>{n.gifDescription.id===e.id&&r(n)}),{clear:()=>{this.effectSubsriptions=this.effectSubsriptions.filter(n=>n!==r)}}}getCurrentFrame(e){return this.gifs[e.id].currentFrame}dispose(){this.gifs.forEach(e=>{e.timer.clear(),e.algorithm.dispose()})}getGif(e){return this.gifs[e.id].gifEntity}readCurrentFrame(e,r){this.gifs[e.id].algorithm.getCanvasPixels(r)}drawToTexture(e,r){var i;const n=e.gifEntity.gif.images[r];e.algorithm.drawToTexture(n,e.gifEntity.gif.colorMap),((i=n.graphicControl)==null?void 0:i.disposalMethod)!==pt.prev&&e.algorithm.saveDisposalPrev()}notifyFrameSubscribers(e){const r=this.gifs[e.id];this.frameSubsriptions.forEach(n=>{n({gifDescription:e,frameNumber:r.currentFrame,totalFrameNumber:r.gifEntity.gif.images.length})})}notifyEffectSubscribers(e,r,n,i){const o=this.gifs[e.id];this.effectSubsriptions.forEach(a=>{a({gifDescription:e,effect:r,effects:o.effects,from:n,to:i})})}drawToScreen(e){const r=e.effects.filter(n=>n.shouldBeApplied(e.currentFrame));e.algorithm.drawToScreen(r,e.currentFrame)}_drawFrame(e,r){this.drawToTexture(e,r),this.drawToScreen(e),this.performeDisposalMethod(e,r)}performeDisposalMethod(e,r){var i;((i=e.gifEntity.gif.images[r].graphicControl)==null?void 0:i.disposalMethod)===pt.prev&&e.algorithm.restorePrevDisposal()}}function Wn(t){return Q(e=>{const r=L(!1),i=G`
      <div style="display: flex; justify-content: center;">
        <div style="margin-right: 5px">
          <button onClick="${()=>t.isPlay.set(o=>!o)}">${()=>t.isPlay()?"Stop":"Play"}</button>
          <button disabled="${()=>t.isPlay()}" onClick="${()=>{r()||(r.set(!0),t.renderNext()().then(()=>r.set(!1)))}}">Next</button>
        </div>
        <div style="border: 1px solid black">${()=>`${t.currentFrameNumber()} / ${t.totalFrameNumber()}`}</div>
      </div>
    `;return re(i.element,()=>{e(),i.dispose()})})}class br{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.BlackAndWhite)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}class Hn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.Mandess)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}class Vn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.MixDrawer)}chain(e){throw new Error("Method not implemented.")}execute(e){const{globals:r,textures:n,drawingTarget:i}=e;this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"backgroundTexture",n.background),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"foregroundTexture",n.foreground),this.gpuProgram.setUniform1f(this.drawer.getGL(),"alpha",r.alpha);const o=this.drawer.getNumberOfDrawCalls(n.background),a=this.drawer.getNumberOfDrawCalls(n.foreground);return o%2===0&&a%2===0||o%2===1&&a%2===1||console.warn("MixRenderResultsRenderPass: foreground and background texture are flipped in different direction"),this.drawer.drawTriangles(i,0,oe,r.alpha>=.5?a:o),se(this.drawer.getGL(),i.getBuffer())}}let zn=0;function rt(){return zn++}const Ne=rt();function Xn(t){return t.getId()===Ne}function qn(t){let e=.7;return{apply(r,n,i,o){let a=i;const s=new br(r,n).execute({memory:{},globals:{},textures:{targetTexture:a.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),u=new Hn(r,n).execute({memory:{},globals:{},textures:{targetTexture:a.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)});return a=new Vn(r,n).execute({memory:{},globals:{alpha:e},textures:{background:s.texture,foreground:u.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),a},shouldBeApplied(r){return r>=t.from&&r<=t.to},getId(){return Ne},getFrom(){return t.from},getTo(){return t.to},setFrom(r){t.from=r},setTo(r){t.to=r},getAlpha(){return e},setAlpha(r){e=r}}}const ke=rt();function jn(t){return t.getId()===ke}function Kn(t){return{apply(e,r,n,i){let o=n;return o=new br(e,r).execute({memory:{},globals:{},textures:{targetTexture:o.texture},drawingTarget:i.allocate(t.screenWidth,t.screenHeight)}),o},shouldBeApplied(e){return e>=t.from&&e<=t.to},getId(){return ke},getFrom(){return t.from},setFrom(e){t.from=e},getTo(){return t.to},setTo(e){t.to=e}}}function Yn(t,e,r){return e<=t?1:(r-t)/Math.max(e-t,1)}var $e=(t=>(t[t.out=0]="out",t[t.in=1]="in",t))($e||{});class Jn{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.Darking)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e,i=e.globals.color;return this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.gpuProgram.setUniform1f(this.drawer.getGL(),"animationProgress",e.globals.animationProgress??1),this.gpuProgram.setUniform1f(this.drawer.getGL(),"direction",e.globals.direction),this.gpuProgram.setUniform3f(this.drawer.getGL(),"color",i.r,i.g,i.b),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}class At extends Array{get r(){return this[0]}set r(e){this[0]=e}get g(){return this[1]}set g(e){this[1]=e}get b(){return this[2]}set b(e){this[2]=e}get a(){return this[3]}set a(e){this[3]=e}copy(){const e=new At;return e.r=this.r,e.g=this.g,e.b=this.b,e.a=this.a,e}constructor(){super(4),this[0]=0,this[1]=0,this[2]=0,this[3]=1}}const Er=()=>new At,Oe=rt();function Zn(t){return t.getId()===Oe}function Qn(t,e){return e.direction=e.direction??$e.in,e.color=e.color??Er(),{apply(r,n,i,o,a){const s=Yn(t.from,t.to,a);let u=i;return u=new Jn(r,n).execute({memory:{},globals:{animationProgress:s,direction:e.direction,color:e.color},textures:{targetTexture:u.texture},drawingTarget:o.allocate(t.screenWidth,t.screenHeight)}),u},shouldBeApplied(r){return r>=t.from&&r<=t.to},getId(){return Oe},getFrom(){return t.from},setFrom(r){t.from=r},getTo(){return t.to},setTo(r){t.to=r},getDirection(){return e.direction},setDirection(r){e.direction=r},getColor(){return e.color},setColor(r){e.color=r}}}class ei{constructor(e){this.buffer=new Float32Array(e)}getBuffer(){return this.buffer}}function ti(t){const e=new ei(9);return t.getBuffer().forEach((r,n)=>{e.getBuffer()[n]=t.getBuffer()[n]}),e}function ft(t){const e=t.getBuffer().reduce((r,n)=>r+n);return e<=0?1:e}class ri{constructor(e,r){this.drawer=e,this.gpuProgram=r.getProgram(S.ConvolutionMatrix)}chain(e){throw new Error("Method not implemented.")}execute(e){const{textures:r,drawingTarget:n}=e;return console.log(ft(e.globals.kernel),ft(e.globals.kernel)),this.gpuProgram.useProgram(this.drawer.getGL()),this.gpuProgram.setTextureUniform(this.drawer.getGL(),"targetTexture",r.targetTexture),this.gpuProgram.setUniform1fv(this.drawer.getGL(),"kernel",ti(e.globals.kernel)),this.gpuProgram.setUniform1f(this.drawer.getGL(),"kernelWeight",ft(e.globals.kernel)),this.drawer.drawTriangles(n,0,oe,this.drawer.getNumberOfDrawCalls(r.targetTexture)),se(this.drawer.getGL(),n.getBuffer())}}class ni{constructor(){this.buffer=new Float32Array(9)}getBuffer(){return this.buffer}}const ii=t=>{const e=new ni;let r=Math.min(3,t.length);for(let n=0;n<r;n++){let i=Math.min(3,t[n].length);for(let o=0;o<i;o++)e.getBuffer()[n*r+o]=t[n][o]}return e},oi=()=>ii([[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]),Ie=rt();function si(t){return t.getId()===Ie}function ai(t){return{apply(e,r,n,i){let o=n;return o=new ri(e,r).execute({memory:{},globals:{kernel:oi()},textures:{targetTexture:o.texture},drawingTarget:i.allocate(t.screenWidth,t.screenHeight)}),o},shouldBeApplied(e){return e>=t.from&&e<=t.to},getId(){return Ie},getFrom(){return t.from},setFrom(e){t.from=e},getTo(){return t.to},setTo(e){t.to=e}}}function Z(t,e){return r=>{const n=r.target.value;if(isNaN(Number(n)))e(n);else{const i=Number(n);t(i)}}}function ui(t){return e=>{const r=e.target.value;t(r)}}function li(t){return Q(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o}=t,a=Z(d=>{d=Math.max(0,d-1),n(d)},()=>{n(r())}),s=Z(d=>{d=Math.max(0,d-1),o(d)},()=>{o(i())}),u=G`
            <div>
              <span>Editing Black And White Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&a(d)}}" onFocusOut="${a}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&s(d)}}" onFocusOut="${s}" class="to-input" value="${()=>i()+1}"/>
              </div>
            </div>
    `;return re(u.element,()=>{e(),u.dispose()})})}function ci(t){return Q(e=>{const{effect:r,fromValue:n,setFromValue:i,toValue:o,setToValue:a}=t,s=L(r.getAlpha(),{dirty(h,c){return!0}});De(()=>{s(),t.rerender()});const u=Z(h=>{h=Math.max(0,h-1),i(h)},()=>{i(n())}),d=Z(h=>{h=Math.max(0,h-1),a(h)},()=>{a(o())}),g=Z(h=>{h=Math.max(0,h),s.set(h),r.setAlpha(h)},()=>{s.set(r.getAlpha())}),p=G`
            <div>
              <span>Editing Madness Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${h=>{h.key==="Enter"&&u(h)}}" onFocusOut="${u}" class="from-input" value="${()=>n()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${h=>{h.key==="Enter"&&d(h)}}" onFocusOut="${d}" class="to-input" value="${()=>o()+1}"/>
              </div>
              <div>
                <span>Alpha</span>
                <input onKeyDown="${h=>{h.key==="Enter"&&g(h)}}" onFocusOut="${g}" class="alpha-input" value="${()=>s()}"/>
              </div>
            </div>
    `;return re(p.element,()=>{e(),p.dispose()})})}function fi(t){return Q(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o,rerender:a,effect:s}=t,u=L(s.getDirection(),{dirty(l,w){return!0}}),d=L(s.getColor().r*255,{dirty(l,w){return!0}}),g=L(s.getColor().g*255,{dirty(l,w){return!0}}),p=L(s.getColor().b*255,{dirty(l,w){return!0}}),h=Z(l=>{l=Math.max(0,l-1),n(l)},()=>{n(r())}),c=Z(l=>{l=Math.max(0,l-1),o(l)},()=>{o(i())}),T=ui(l=>{u.set(l==="in"?$e.in:$e.out),s.setDirection(u()),a()}),C=Z(l=>{l=Math.min(Math.max(0,l),255),d.set(l),s.getColor().r=l/255,a()},()=>{d.set(d())}),$=Z(l=>{l=Math.min(Math.max(0,l),255),g.set(l),s.getColor().g=l/255,a()},()=>{g.set(g())}),v=Z(l=>{l=Math.min(Math.max(0,l),255),p.set(l),s.getColor().b=l/255,a()},()=>{p.set(p())}),b=G`
            <div>
              <span>Editing In and Out Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${l=>{l.key==="Enter"&&h(l)}}" onFocusOut="${h}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${l=>{l.key==="Enter"&&c(l)}}" onFocusOut="${c}" class="to-input" value="${()=>i()+1}"/>
              </div>
              <div>
                <span>Direction</span>
                <select name="Direction" value="${()=>u()===$e.in?"in":"out"}"
                  onChange="${T}"
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
                    <input onKeyDown="${l=>{l.key==="Enter"&&C(l)}}" onFocusOut="${C}" class="from-input" value="${()=>d()}"/>
                  </span>
                  <span>
                    <span>Green:</span>
                    <input onKeyDown="${l=>{l.key==="Enter"&&$(l)}}" onFocusOut="${$}" class="from-input" value="${()=>g()}"/>
                  </span>
                  <span>
                    <span>Blue:</span>
                    <input onKeyDown="${l=>{l.key==="Enter"&&v(l)}}" onFocusOut="${v}" class="from-input" value="${()=>p()}"/>
                  </span>
                  <span style="display: flex; align-items: end;">
                    <span style="${()=>`display: inline-block; width: 50px; height: 30px; background-color: rgb(${d()}, ${g()}, ${p()})`}"></span>
                  </span>
                </div>
              </div>
            </div>
    `;return re(b.element,()=>{e(),b.dispose()})})}function di(t){return Q(e=>{const{fromValue:r,setFromValue:n,toValue:i,setToValue:o}=t,a=Z(d=>{d=Math.max(0,d-1),n(d)},()=>{n(r())}),s=Z(d=>{d=Math.max(0,d-1),o(d)},()=>{o(i())}),u=G`
            <div>
              <span>Editing Edge Detection Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&a(d)}}" onFocusOut="${a}" class="from-input" value="${()=>r()+1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${d=>{d.key==="Enter"&&s(d)}}" onFocusOut="${s}" class="to-input" value="${()=>i()+1}"/>
              </div>
            </div>
    `;return re(u.element,()=>{e(),u.dispose()})})}function yr(t){return t===Ne?"Madness Effect":t===ke?"Black And White Effect":t===Oe?"In And Out Effect":t===Ie?"Edge Detection Effect":null}function hi(t,e){return Xn(t.effect)?G`<div>
        <div>${V(()=>ci(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:jn(t.effect)?G`<div>
        <div>${V(()=>li(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:Zn(t.effect)?G`<div>
        <div>${V(()=>fi(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:si(t.effect)?G`<div>
        <div>${V(()=>di(t))}</div>
        <button onClick="${e}">close</button>
        </div>`:G`<div>
      <span>Editing is not supported for this effect</span>
      <button onClick="${e}">close</button>
  </div>`}const Vt=(t,e,r,n)=>`${n+1}. ${yr(t)||"Unknown Effect"} - from: ${e+1}; to: ${r+1}`;function gi(t){return Q(e=>{const r=L(null),n=L(-1);let i=null,o=[],a=[];De(()=>{o=t.effects().map(h=>L(h.getFrom(),{dirty(c,T){return!0}})),a=t.effects().map(h=>L(h.getTo(),{dirty(c,T){return!0}}))});const s=()=>{i=null,r.set(null),n.set(-1)},u=()=>{t.removeSelectedEffect(n()),s()},d=(h,c)=>{const T=()=>{const v=Vt(h.getId(),o[c](),a[c](),c);if(i===v)return;i=v;const b={fromValue:()=>o[c](),setFromValue(l){o[c].set(l),h.setFrom(l),t.rerender()},toValue:()=>a[c](),setToValue(l){a[c].set(l),h.setTo(l),t.rerender()},effect:h,currentFrameNumber:t.currentFrameNumber,rerender:()=>t.rerender()};r.set(hi(b,s)),n.set(c)},C=()=>h.shouldBeApplied(t.currentFrameNumber()-1)?"color: green":"",$=v=>n()===v?"background-color: #a9dcf3":"";return G`<li onClick="${T}" style="${()=>C()+"; "+$(c)+"; cursor: pointer;"}">
        ${Vt(h.getId(),o[c](),a[c](),c)}
      </li>`},g=()=>G`
      <ul>
        ${V(()=>t.effects().map(d))}
      </ul>
    `,p=G`
    <div>
        <div style="margin-bottom: 5px">
          ${V(()=>t.effects().length===0?"No effects":g())}
        </div>
        <button
          style="maring-right: 5px"
          disabled="${()=>!t.isEffectSelectedToAdd()}"
          onClick="${()=>t.addSelectedEffect()}">
            Add Effect
        </button>
        <button disabled="${()=>n()===-1}" onClick="${()=>u()}">Remove Effect</button>
        <div style="border-top: 1px solid black; margin-top: 5px">
          ${V(()=>r())}
        </div>
      </div>
    `;return re(p.element,()=>{e(),p.dispose()})})}function mi(t){return Q(e=>{const r=G`
      <div style="border-bottom: 1px solid black; padding-top: 5px;">
        <div style="position: relative; display: flex; justify-content: center; margin-bottom: 5px;">
            <canvas></canvas>
          <div style="position: absolute; top: 0; right: 5px;">
            <button onClick="${()=>t.onClose()}">close</button>
          </div>
        </div>
        <div>
          <div style="border-bottom: 1px solid black">${V(()=>Wn(t))}</div>
          <div>${V(()=>gi(t))}</div>
        </div>
      </div>
    `,n=re(r.element,()=>{e(),r.dispose()});return n.getCanvas=()=>r.element.querySelector("canvas"),n})}function pi(t){const{selectedEffect:e,selectEffect:r}=t,n=L([ke,Ne,Oe,Ie]);return Q(i=>{const o=G`
      <div style="border: 1px solid black;">
        <span>Select Effect:</span>
        <ul style="padding: 0; padding-left: 15px;">
            ${V(()=>n().map(s=>G`<li
                  style="${()=>(e()===s?"background-color: green; ":"")+"cursor: pointer"}"
                  onClick="${()=>r(s)}"
                >
                  ${yr(s)}
              </li>`))}
        </ul>
      </div>
    `;return re(o.element,()=>{i(),o.dispose()})})}let xi=0;function Ti(t){return Q(e=>{const{renderer:r,descriptor:n,timelineHeight:i}=t,o=i;let a=`Timeline_${xi++}`,s={start:0,length:-1,lastFrameNumber:-1},u=[],d=L(0),g=L(0),p=L(0),h=L(0),c=L(0),T=L(!0),C=()=>Promise.resolve(),$=()=>Promise.resolve(),v=l=>{if(t.isPlay())return;const w=(l.offsetX-h())/p()+c()|0;w!==t.currentFrameNumber()-1&&w<r.getGif(n).gif.images.length&&t.render(w)};const b=G`
      <div>
        <ul style="position: relative; padding: 0; height: 20px; list-style: none;">
            ${V(()=>Array.from({length:d()}).map((l,w)=>G`<li style="${()=>"position: absolute; left: "+(p()*w+h())+"px"}">${c()+w+1}</li>`))}
          </ul>
        <div style="${()=>`display: flex; width: 100%; height: ${o}px;`+(t.isPlay()?" cursor: defualt":" cursor: pointer")}">
            <canvas onClick="${v}"></canvas>
        </div>
        <button disabled="${()=>T()}" onClick="${()=>{T.set(!0),$().then(()=>{T.set(!1)})}}">next</button>
      </div>
    `;return setTimeout(async()=>{const l=b.element.querySelector("canvas"),P=l.parentElement.getBoundingClientRect().width;g.set(P),l.width=P,l.height=o,l.style.width=`${P}px`,l.style.height=`${o}px`;const y=l.getContext("webgl2");y.enable(y.BLEND),y.blendFunc(y.SRC_ALPHA,y.ONE_MINUS_SRC_ALPHA),vr(y,a);const U=xr(y);U.startFrame(),y.viewport(0,0,P,o),y.clearColor(0,0,0,1);const ne=r.getGif(n).gif.screenDescriptor.screenWidth,q=r.getGif(n).gif.screenDescriptor.screenHeight,N=tr(ne,q,o)|0,K=N*o,le=Math.ceil(P/N),B=4;p.set(N);const x=h,E=d;let F={first:0,length:0,nextOffset:0,nextPadding:0},z=F;const Me=async(ge,me,Se)=>{const we=Math.max(1,Math.ceil((le-B)/Math.max(1,B-1))),ee=ge,W=Math.min(Math.ceil((P-me)/N),r.getGif(n).gif.images.length-ee),ce=Math.ceil((W-Se)/we);let be=0;if(s.start===ee&&s.length===W)be=s.lastFrameNumber;else{for(let _=0;_<u.length;_++)u[_].dispose(y);u=[];for(let _=0;_<ce;_++){let Ee=new Uint8Array(K*4|0);const He=ee+Se+_*we;await r.setFrame(n,He),r.readCurrentFrame(n,Ee);const ae=new Qe(y,N,o,Ee,{imageFormat:{internalFormat:Be.RGBA,format:Be.RGBA,type:Ct.UNSIGNED_BYTE}});ae.setTextureWrap(y,y.TEXTURE_WRAP_S,y.CLAMP_TO_EDGE),ae.setTextureWrap(y,y.TEXTURE_WRAP_T,y.CLAMP_TO_EDGE),ae.setTextureFilter(y,y.TEXTURE_MIN_FILTER,y.LINEAR),ae.setTextureFilter(y,y.TEXTURE_MAG_FILTER,y.LINEAR),u.push(ae),be=He}s.start=ee,s.length=W,s.lastFrameNumber=be}const nt=Math.min(Math.max(0,-(P-(W*N+me))),N),Le=Math.max(0,we+be-(ee+W)),We=pr(U.getGL()),ie=M(a).shaderManager.getProgram(S.GifTimeline);ie.useProgram(y);for(let _=0;_<u.length;_++){const Ee=u[_];ie.setTextureUniform(y,`targetTexture${_+1}`,Ee)}ie.setUniform1f(y,"totalWidth",P),ie.setUniform1f(y,"timelineFrameWidth",N),ie.setUniform1f(y,"offset",we),ie.setUniform1f(y,"startPadding",me),ie.setUniform1f(y,"startOffset",Se),y.clear(y.COLOR_BUFFER_BIT),U.drawTriangles(We,0,6*ce,0);const H=t.currentFrameNumber()-ee-1;if(!(H<0||H>ee+W)){const _=M(a).shaderManager.getProgram(S.GifTimelineCurrentFrame);_.useProgram(y),_.setUniform1f(y,"totalWidth",P),_.setUniform1f(y,"timelineFrameWidth",N),_.setUniform1f(y,"startPadding",me),_.setUniform1f(y,"startOffset",H),U.drawTriangles(We,0,6,0)}return x.set(me),E.set(W),c.set(ee),{first:ee,length:W,nextOffset:Le,nextPadding:nt}};T.set(!0),C=()=>Me(F.first+F.length,F.nextPadding,F.nextOffset).then(()=>{}),$=()=>z.first+z.length>=r.getGif(n).gif.images.length?(F={first:0,length:0,nextOffset:0,nextPadding:0},Me(0,0,0).then(ge=>{z=ge})):(F=z,Me(z.first+z.length,z.nextPadding,z.nextOffset).then(ge=>{z=ge})),$().then(()=>{T.set(!1),De(()=>{t.isPlay()||(t.currentFrameNumber(),T.set(!0),C().then(()=>{T.set(!1)}))})})},0),re(b.element,()=>{e(),b.dispose(),M(a).shaderManager.dispose(),wr(a)})})}function vi(t){let e=[];const r=L([]),n=L(null),i=s=>{n.set(s)},o=s=>s===Ne?u=>qn(u):s===Oe?u=>Qn(u,{direction:$e.in,color:Er()}):s===ke?u=>Kn(u):s===Ie?u=>ai(u):null,a=async s=>{const u=s.target.files.item(0),d=await Nr(u),g=tn(d);if(g){const p=rn(g);e.push(p),Q(async h=>{let c=new Ht,T=new Ht;const C=await fn(p.gif),$=C;let v=()=>{},b=()=>{},l=F=>{};const w=L(!1),P=L(1),y=L(p.gif.images.length),U=L([]),ne=L(()=>Promise.resolve()),N=mi({isPlay:w,renderNext:ne,currentFrameNumber:P,totalFrameNumber:y,effects:U,rerender:()=>b(),onClose:()=>v(),removeSelectedEffect:F=>{c.removeEffectFromGif(E,U()[F])},isEffectSelectedToAdd:()=>n()!==null,addSelectedEffect:()=>{const F=o(n());c.addEffectToGif(E,0,1,z=>F(z))}}),K=80,le=tr(p.gif.screenDescriptor.screenWidth,p.gif.screenDescriptor.screenHeight,K)|0,B=await T.addGifToRender(p,new OffscreenCanvas(1,1),{uncompress:$,algorithm:"GL",screenDescriptor:{screenWidth:le,screenHeight:K}}),x=G`
                    <div>
                        <div>
                            ${V(()=>N)}
                        </div>
                        <div>
                            ${V(()=>Ti({renderer:T,descriptor:B,currentFrameNumber:P,isPlay:w,timelineHeight:K,render:F=>l(F)}))}
                        </div>
                    </div>
                `;v=()=>{c.dispose(),T.dispose(),h(),r.set(r().filter(F=>F!==x)),e=e.filter(F=>F!==p)},r.set(r().concat(x));const E=await c.addGifToRender(p,N.getCanvas(),{uncompress:C,algorithm:"GL"});b=()=>{w()||c.setFrame(E,c.getCurrentFrame(E))},l=F=>{w()||c.setFrame(E,F)},c.onEffectAdded(E,F=>{U.set([...F.effects])}),c.onFrameRender(E,F=>{P.set(F.frameNumber+1)}),De(()=>{w()?c.autoplayStart(E)||console.warn("Error to stop"):c.autoplayEnd(E)}),w.set(!0),ne.set(()=>()=>c.setFrame(E,(c.getCurrentFrame(E)+1)%p.gif.images.length))})}};return Q(s=>{const u=G`
      <div>
        <div>
            <input type="file" onChange="${a}" />
        </div>
        <div style="display: flex">
            <div style="min-width: 80%; border: 1px solid black;">${V(()=>r())}</div>
            <div style="width: 100%; height: 100%; position: sticky; top: 0">${V(()=>pi({selectedEffect:n,selectEffect:i}))}</div>
        </div>
      </div>
    `;return re(u.element,()=>{s(),u.dispose()})})}const wi=document.getElementById("main"),bi=vi();Rr(wi,bi);
