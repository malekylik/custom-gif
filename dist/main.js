(()=>{var e={511:(e,t,r)=>{"use strict";var n,i,a,o,u,s,c;function l(e,t,r){var n=new Uint8Array(e),i=1<<r,a=n.subarray(t,t+3*i);return{entriesCount:i,getRed:function(e){return n[t+(3*e+0)]},getGreen:function(e){return n[t+(3*e+1)]},getBlue:function(e){return n[t+(3*e+2)]},getColor:function(e){return{red:this.getRed(e),green:this.getGreen(e),blue:this.getBlue(e)}},getRawData:function(){return a}}}function f(e,t){var r=new Uint8Array(e);return r[t]!==a.imageSeparator&&console.warn("Invalid image descriptor: ".concat(t,". Image desriptor doesn't start with ','")),{imageLeft:r[t+1]|r[t+2]<<8,imageTop:r[t+3]|r[t+4]<<8,imageWidth:r[t+5]|r[t+6]<<8,imageHeight:r[t+7]|r[t+8]<<8,M:r[t+9]>>7,I:r[t+9]>>6&1,pixel:1+(7&r[t+9]),compressedData:null,graphicControl:null,colorMap:null,startPointer:0}}function h(e,t){for(var r=new Uint8Array(e);r[t]&&t<r.byteLength;)t+=r[t]+1;return t+1}function m(e,t){var r=new Uint8Array(e);return{isTransparent:1&r[t],isUserInputRequired:r[t]>>>1&1,disposalMethod:r[t]>>>2&7,delayTime:10*(r[t+1]|r[t+2]<<8),transparentColorIndex:r[t+3]}}function d(e,t){return h(e,t+=1)}!function(e){e[e.comma=44]="comma",e[e.semicolon=59]="semicolon",e[e.G=71]="G",e[e.I=73]="I",e[e.F=70]="F"}(n||(n={})),function(e){e[e.blockLabel=33]="blockLabel",e[e.graphicControl=249]="graphicControl",e[e.applicationLabel=255]="applicationLabel"}(i||(i={})),function(e){e[e.imageSeparator=n.comma]="imageSeparator",e[e.gifTermination=n.semicolon]="gifTermination"}(a||(a={})),function(e){e[e.start=6]="start",e[e.size=7]="size"}(o||(o={})),function(e){e[e.start=o.start+o.size]="start",e[e.entriesCount=3]="entriesCount"}(u||(u={})),function(e){e[e.size=10]="size"}(s||(s={})),function(e){e[e.noAction=0]="noAction",e[e.noDispose=1]="noDispose",e[e.clear=2]="clear",e[e.prev=3]="prev"}(c||(c={}));var p,g=r(575),v=r.n(g),T=r(913),x=r.n(T),y=function(){function e(){v()(this,e),this.onceTimerId=-1}return x()(e,[{key:"once",value:function(e,t){this.onceTimerId=setTimeout(e,t)}},{key:"clear",value:function(){return!!this.isOnceTimerSetted()&&(clearTimeout(this.onceTimerId),this.onceTimerId=-1,!0)}},{key:"isOnceTimerSetted",value:function(){return-1!==this.onceTimerId}}]),e}();function b(e,t){switch(t){case p.FLOAT:return e.FLOAT}return 0}function E(e,t){switch(t){case e.FLOAT:case p.FLOAT:return Float32Array.BYTES_PER_ELEMENT}return 0}!function(e){e[e.FLOAT=0]="FLOAT"}(p||(p={}));var R,w,A,F,C=function(){function e(t,r){v()(this,e),this.vbo=t.createBuffer();var n=0;if(this.layout=r.map((function(e){var r=n;return n+=E(t,e.type)*e.componentsCount,{type:b(t,e.type),componentsCount:e.componentsCount,offset:r}})),this.stride=0,r.length){var i=this.layout[r.length-1];this.stride=i.offset+E(t,i.type)*i.componentsCount}}return x()(e,[{key:"bind",value:function(e){e.bindBuffer(e.ARRAY_BUFFER,this.vbo)}},{key:"activateAttribPointer",value:function(e,t){t>=0&&t<this.layout.length&&(this.setAttribPointer(e,t),e.enableVertexAttribArray(t))}},{key:"activateAllAttribPointers",value:function(e){this.setAllAttribPointers(e);for(var t=0;t<this.layout.length;t++)e.enableVertexAttribArray(t)}},{key:"setData",value:function(e,t){e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}},{key:"setAttribPointer",value:function(e,t){if(t>=0&&t<this.layout.length){var r=this.layout[t];e.vertexAttribPointer(t,r.componentsCount,r.type,!1,this.stride,r.offset)}}},{key:"setAllAttribPointers",value:function(e){for(var t=0;t<this.layout.length;t++){var r=this.layout[t];e.vertexAttribPointer(t,r.componentsCount,r.type,!1,this.stride,r.offset)}}}]),e}(),P=[{type:p.FLOAT,componentsCount:3},{type:p.FLOAT,componentsCount:2}],U=Float32Array.from([-1,1,0,0,0,1,1,0,1,0,-1,-1,0,0,1,1,1,0,1,0,1,-1,0,1,1,-1,-1,0,0,1]),S=function(){function e(t,r,n){v()(this,e),this.program=function(e,t,r){var n=e.createProgram();if(e.attachShader(n,t),e.attachShader(n,r),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS)){var i=e.getProgramInfoLog(n);return console.warn("Fail to link program: ".concat(i)),e.deleteProgram(n),null}return n}(t,r,n),this.uniformBuffer=new Map}return x()(e,[{key:"useProgram",value:function(e){e.useProgram(this.program)}},{key:"setTextureUniform",value:function(e,t,r){this.setUniform1i(e,t,r.getTextureUnit())}},{key:"setUniform1i",value:function(e,t,r){var n=this.getCache(e,t);n.value!==r&&(n.value=r,e.uniform1i(n.location,r))}},{key:"setUniform1f",value:function(e,t,r){var n=this.getCache(e,t);n.value!==r&&(n.value=r,e.uniform1f(n.location,r))}},{key:"setUniform1fv",value:function(e,t,r,n,i,a){var o=this.getCache(e,t),u=o.value;u&&(u[0]!==r||u[1],u[2],u[3]===a)||((u=new Float32Array(4))[0]=r,u[1]=n,u[2]=i,u[3]=a,o.value=u,e.uniform4fv(o.location,u))}},{key:"getCache",value:function(e,t){var r=this.uniformBuffer.get(t);return r||(r={location:e.getUniformLocation(this.program,t),value:void 0}),r}}]),e}();function D(e,t,r){var n=e.createShader(t);if(0===n&&console.warn("Fail to create shader"),e.shaderSource(n,r),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){var i=e.getShaderInfoLog(n);return console.warn("Fail to compile shader: ".concat(i)),e.deleteShader(n),null}return n}function I(e,t){return D(e,e.VERTEX_SHADER,t)}function _(e,t){return D(e,e.FRAGMENT_SHADER,t)}function B(e,t){e.deleteShader(t)}function k(e,t){switch(t){case R.NEAREST:return e.NEAREST;case R.LINEAR:return e.LINEAR}return 0}function N(e,t){switch(t){case w.R8:return e.R8;case w.RED:return e.RED;case w.RGB:return e.RGB}return 0}function L(e,t){switch(t){case A.UNSIGNED_BYTE:return e.UNSIGNED_BYTE}return 0}!function(e){e[e.NEAREST=0]="NEAREST",e[e.LINEAR=1]="LINEAR"}(R||(R={})),function(e){e[e.RGB=0]="RGB",e[e.R8=1]="R8",e[e.RED=2]="RED"}(w||(w={})),function(e){e[e.UNSIGNED_BYTE=0]="UNSIGNED_BYTE"}(A||(A={})),function(e){e[e.TEXTURE0=0]="TEXTURE0",e[e.TEXTURE1=1]="TEXTURE1",e[e.TEXTURE2=2]="TEXTURE2"}(F||(F={}));var M={min:R.NEAREST,mag:R.NEAREST},G={internalFormat:w.RGB,format:w.RGB,type:A.UNSIGNED_BYTE},O={filtering:M,imageFormat:G},H=function(){function e(t,r,n,i){var a,o,u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:O;v()(this,e),this.texture=t.createTexture(),this.textureUnit=F.TEXTURE0;var s=null!==(a=null==u?void 0:u.filtering)&&void 0!==a?a:M,c=null!==(o=null==u?void 0:u.imageFormat)&&void 0!==o?o:G;this.config={filtering:s,imageFormat:c},t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,k(t,s.min)),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,k(t,s.mag)),t.texImage2D(t.TEXTURE_2D,0,N(t,c.internalFormat),r,n,0,N(t,c.format),L(t,c.type),i),t.bindTexture(t.TEXTURE_2D,null)}return x()(e,[{key:"bind",value:function(e){e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"getTextureUnit",value:function(){return this.textureUnit}},{key:"setTextureUnit",value:function(e){this.textureUnit=e}},{key:"setData",value:function(e,t,r,n,i,a){var o=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,t,r,n,i,N(e,o.format),L(e,o.type),a),this.prevDataPointer=a}},{key:"putData",value:function(e,t,r,n,i,a){if(this.prevDataPointer!==a){var o=this.config.imageFormat;e.texSubImage2D(e.TEXTURE_2D,0,t,r,n,i,N(e,o.format),L(e,o.type),a),this.prevDataPointer=a}}},{key:"getGLTexture",value:function(){return this.texture}},{key:"activeTexture",value:function(e){e.activeTexture(function(e,t){return e.TEXTURE0+t}(e,this.textureUnit))}}]),e}(),X=function(){function e(t,r,n){v()(this,e),this.width=r,this.heigth=n,this.frameBuffer=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.frameBuffer);var i=t.createRenderbuffer();t.bindRenderbuffer(t.RENDERBUFFER,i),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH24_STENCIL8,r,n),t.bindRenderbuffer(t.RENDERBUFFER,null),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,i),t.bindFramebuffer(t.FRAMEBUFFER,null)}return x()(e,[{key:"bind",value:function(e){e.bindFramebuffer(e.FRAMEBUFFER,this.frameBuffer)}},{key:"unbind",value:function(e){e.bindFramebuffer(e.FRAMEBUFFER,null)}},{key:"setTexture",value:function(e,t){e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t.getGLTexture(),0)}},{key:"readPixels",value:function(e){var t=new Uint8Array(this.width*this.heigth*4);return e.readPixels(0,0,this.width,this.heigth,e.RGBA,e.UNSIGNED_BYTE,t),t}}]),e}(),z=function(){function e(t,r,n,i,a){v()(this,e);var o=n[0],u=o.M?o.colorMap:i,s=r.screenWidth,c=r.screenHeight;this.uncompressedData=a.out,this.lzw_uncompress=a.lzw_uncompress,t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.viewport(0,0,s,c),t.clearColor(0,0,0,1);var l=I(t,"#version 300 es\n\nlayout(location = 0) in vec4 vPosition;\nlayout(location = 1) in vec2 aTexCoord;\n\nout vec2 texCoord;\n\nvoid main()\n{\n  gl_Position = vPosition;\n  texCoord = aTexCoord;\n}\n"),f=I(t,"#version 300 es\n\nlayout(location = 0) in vec4 vPosition;\nlayout(location = 1) in vec2 aTexCoord;\n\nout vec2 texCoord;\n\nvoid main()\n{\n  gl_Position = vPosition;\n  texCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);\n}\n"),h=_(t,"#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D ColorTableTexture;     //256 x 1 pixels\nuniform sampler2D IndexTexture;\nuniform sampler2D alphaTexture;\nuniform float ColorTableSize;\n\nin vec2 texCoord;\n\nout vec4 fragColor;\n\nvoid main()\n{\n  vec4 myindex = texture(IndexTexture, texCoord);\n\n  float normilaziedX = (myindex.x * 255.0) / ColorTableSize;\n  vec4 texel = texture(ColorTableTexture, vec2(normilaziedX, myindex.y));\n  float alpha = texture(alphaTexture, vec2(texCoord.x, 1.0 - texCoord.y)).r;\n\n  fragColor = vec4(texel.rgb, alpha);   //Output the color\n}\n"),m=_(t,"#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D outTexture;\n\nin vec2 texCoord;\n\nout vec4 fragColor;\n\nvoid main()\n{\n  fragColor = texture(outTexture, texCoord);\n}\n"),d=_(t,"#version 300 es\n\nprecision mediump float;\n\nuniform sampler2D IndexTexture;\n\nuniform float TransperancyIndex;\nuniform float ScreenHeight;\nuniform vec4 Rect;\n\nin vec2 texCoord;\n\nout vec4 fragColor;\n\nvoid main()\n{\n  float imageLeft = Rect.x;\n  float imageTop = Rect.y;\n  float width = Rect.z;\n  float hieght = Rect.w;\n  float x = gl_FragCoord.x;\n  float y = ScreenHeight - gl_FragCoord.y;\n\n  vec4 myindex = texture(IndexTexture, texCoord);\n\n  float alpha = step(imageLeft, x) - (2.0 * step(imageLeft + width, x)) + step(imageTop, y) - (2.0 * step(imageTop + hieght, y)) - (1.0 - (step(imageLeft, x)))- (1.0 - (step(imageTop, y)));\n  // TODO: check for better the best way with performance\n  alpha = alpha * (1.0 - (step(TransperancyIndex, myindex.x * 255.0) - step(TransperancyIndex + 1.0, myindex.x * 255.0)));\n\n  fragColor = vec4(alpha, 0.0, 0.0, 1.0);   //Output the color\n}\n"),p=new S(t,f,h),g=new S(t,l,m),T=new S(t,l,d);this.gifProgram=p,this.textureProgram=g,this.alphaProgram=T,B(t,l),B(t,f),B(t,h),B(t,m),B(t,d),this.alphaFrameBuffer=new X(t,s,c),this.alphaTexture=new H(t,s,c,null),this.alphaTexture.setTextureUnit(F.TEXTURE2),this.alphaFrameBuffer.bind(t),this.alphaFrameBuffer.setTexture(t,this.alphaTexture),this.alphaFrameBuffer.unbind(t),this.frameBuffer=new X(t,s,c),this.outTexture=new H(t,s,c,null),this.outTexture.setTextureUnit(F.TEXTURE0),this.frameBuffer.bind(t),this.frameBuffer.setTexture(t,this.outTexture),this.frameBuffer.unbind(t),this.prevFrameBuffer=new X(t,s,c),this.prevOutTexture=new H(t,s,c,null),this.prevOutTexture.setTextureUnit(F.TEXTURE0),this.prevFrameBuffer.bind(t),this.prevFrameBuffer.setTexture(t,this.prevOutTexture),this.prevFrameBuffer.unbind(t),this.vboToTexture=new C(t,P),this.vboToTexture.bind(t),this.vboToTexture.setData(t,U),this.vboToTexture.activateAllAttribPointers(t);var x=n.reduce((function(e,t){return t.M&&t.colorMap.entriesCount>e?t.colorMap.entriesCount:e}),u.entriesCount);this.colorTableTexture=new H(t,x,1,null),this.texture=new H(t,s,c,null,{imageFormat:{internalFormat:w.R8,format:w.RED,type:A.UNSIGNED_BYTE}}),this.colorTableTexture.setTextureUnit(F.TEXTURE0),this.texture.setTextureUnit(F.TEXTURE1),p.useProgram(t),p.setTextureUniform(t,"ColorTableTexture",this.colorTableTexture),p.setTextureUniform(t,"IndexTexture",this.texture),p.setTextureUniform(t,"alphaTexture",this.alphaTexture),this.gifProgram.setUniform1f(t,"ColorTableSize",x),g.useProgram(t),g.setTextureUniform(t,"outTexture",this.outTexture),T.useProgram(t),T.setTextureUniform(t,"IndexTexture",this.texture),T.setUniform1f(t,"ScreenHeight",c),T.setUniform1fv(t,"Rect",0,0,o.imageWidth,o.imageHeight)}return x()(e,[{key:"drawToTexture",value:function(e,t,r){this.lzw_uncompress(t),this.texture.bind(e),this.texture.setData(e,t.imageLeft,t.imageTop,t.imageWidth,t.imageHeight,this.uncompressedData),this.drawToAlphaTexture(e,t);var n=t.M?t.colorMap:r;this.gifProgram.useProgram(e),this.frameBuffer.bind(e),this.colorTableTexture.bind(e),this.colorTableTexture.putData(e,0,0,n.entriesCount,1,n.getRawData()),this.texture.bind(e),this.texture.setData(e,t.imageLeft,t.imageTop,t.imageWidth,t.imageHeight,this.uncompressedData),this.colorTableTexture.activeTexture(e),this.colorTableTexture.bind(e),this.texture.activeTexture(e),this.texture.bind(e),this.alphaTexture.activeTexture(e),this.alphaTexture.bind(e),e.drawArrays(e.TRIANGLES,0,U.length)}},{key:"drawPrevToTexture",value:function(e){this.frameBuffer.bind(e),this.textureProgram.useProgram(e),this.prevOutTexture.activeTexture(e),this.prevOutTexture.bind(e),e.drawArrays(e.TRIANGLES,0,U.length)}},{key:"drawToScreen",value:function(e){this.frameBuffer.unbind(e),this.textureProgram.useProgram(e),this.outTexture.activeTexture(e),this.outTexture.bind(e),e.drawArrays(e.TRIANGLES,0,U.length)}},{key:"drawToAlphaTexture",value:function(e,t){var r;this.alphaFrameBuffer.bind(e),this.alphaProgram.useProgram(e),null!==(r=t.graphicControl)&&void 0!==r&&r.isTransparent?this.alphaProgram.setUniform1f(e,"TransperancyIndex",t.graphicControl.transparentColorIndex):this.alphaProgram.setUniform1f(e,"TransperancyIndex",512),this.texture.activeTexture(e),this.texture.bind(e),this.alphaProgram.setUniform1fv(e,"Rect",t.imageLeft,t.imageTop,t.imageWidth,t.imageHeight),e.drawArrays(e.TRIANGLES,0,U.length)}},{key:"savePrevFrame",value:function(e){this.prevFrameBuffer.bind(e),this.textureProgram.useProgram(e),this.outTexture.activeTexture(e),this.outTexture.bind(e),e.drawArrays(e.TRIANGLES,0,U.length)}},{key:"getCanvasPixels",value:function(e,t,r){this.frameBuffer.bind(e),e.readPixels(0,0,t.screenWidth,t.screenHeight,e.RGBA,e.UNSIGNED_BYTE,r),this.frameBuffer.unbind(e)}},{key:"getPrevCanvasPixels",value:function(e,t,r){this.prevFrameBuffer.bind(e),e.readPixels(0,0,t.screenWidth,t.screenHeight,e.RGBA,e.UNSIGNED_BYTE,r),this.prevFrameBuffer.unbind(e)}}]),e}(),W=function(){function e(t,r,n){var i=this;v()(this,e),this.gif=t,this.currentFrame=0,this.ctx=r.getContext("webgl2"),this.timer=new y,this.algorithm=new z(this.ctx,this.gif.screenDescriptor,this.gif.images,this.gif.colorMap,n.uncompress);var a=this.gif.screenDescriptor,o=a.screenWidth,u=a.screenHeight;r.width=o,r.height=u,r.style.width="".concat(o,"px"),r.style.height="".concat(u,"px"),this.gif.images.length&&this.timer.once((function(){i.drawFrame()}))}return x()(e,[{key:"setFrame",value:function(e){var t=this;return new Promise((function(r){e>-1&&e<t.gif.images.length&&e!==t.currentFrame?(t.timer.clear(),t.timer.once((function(){for(var n=0;n<e;n++)t.drawToTexture(n),t.performeDisposalMethod(n);t.currentFrame=e,t.drawFrame(),r()}))):r()}))}},{key:"autoplayStart",value:function(){var e,t=this;return this.gif.images.length>1&&(this.timer.once((function e(){var r,n=(t.currentFrame+1)%t.gif.images.length;t.timer.once(e,(null===(r=t.gif.images[n].graphicControl)||void 0===r?void 0:r.delayTime)||40),t.currentFrame=n,t.drawFrame()}),(null===(e=this.gif.images[this.currentFrame].graphicControl)||void 0===e?void 0:e.delayTime)||40),!0)}},{key:"autoplayEnd",value:function(){this.timer.clear()}},{key:"drawToTexture",value:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.currentFrame,r=this.gif.images[t];console.log("frame = ",t),this.algorithm.drawToTexture(this.ctx,r,this.gif.colorMap),(null===(e=r.graphicControl)||void 0===e?void 0:e.disposalMethod)!==c.prev&&this.algorithm.savePrevFrame(this.ctx)}},{key:"getCanvasPixel",value:function(e){return this.algorithm.getCanvasPixels(this.ctx,this.gif.screenDescriptor,e)}},{key:"getPrevCanvasPixel",value:function(e){return this.algorithm.getPrevCanvasPixels(this.ctx,this.gif.screenDescriptor,e)}},{key:"drawToScreen",value:function(){this.algorithm.drawToScreen(this.ctx)}},{key:"drawFrame",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.currentFrame;this.drawToTexture(e),this.drawToScreen(),this.performeDisposalMethod(e)}},{key:"performeDisposalMethod",value:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.currentFrame,r=this.gif.images[t];(null===(e=r.graphicControl)||void 0===e?void 0:e.disposalMethod)===c.prev&&this.algorithm.drawPrevToTexture(this.ctx)}}]),e}(),Y=r(102),j=r.n(Y);const q=r.p+"1f220a855cd1204e55a4d8f6748d6283.wasm";var V=document.getElementById("main"),$=document.createElement("input");$.type="file",$.addEventListener("change",(function(){var e=new FileReader;e.onload=function(e){var t=function(e){var t=String.fromCharCode,r=new Uint8Array(e);if(r[0]===n.G&&r[1]===n.I&&r[2]===n.F){var c=10*Number(t(r[3]))+Number(t(r[4])),p="GIF".concat(c).concat(t(r[5])),g=function(e){var t=new Uint8Array(e);return 0!==t[o.start+o.size-1]&&console.warn("Invalid Screen Descriptor section: last byte should be 0"),{screenWidth:t[o.start+0]|t[o.start+1]<<8,screenHeight:t[o.start+2]|t[o.start+3]<<8,M:t[o.start+4]>>7,cr:1+((112&t[o.start+4])>>4),pixel:1+(7&t[o.start+4]),background:t[o.start+5]}}(e),v=u.start,T=null;g.M&&(v+=(T=function(e,t){return l(e,u.start,t)}(e,g.pixel)).entriesCount*u.entriesCount);for(var x=function(e,t){for(var r=new Uint8Array(e),n=[],o=null,c=null;t<r.byteLength&&-1!==t;)switch(r[t]){case i.blockLabel:if(t++,r[t++]===i.graphicControl){var p=r[t];o=m(e,t+1),t=t+p+1}else t=h(e,t);break;case a.imageSeparator:c=f(e,t),n.push(c),t+=s.size,c.M&&(c.colorMap=l(e,t,c.pixel),t+=c.colorMap.entriesCount*u.entriesCount),o&&(c.graphicControl=o),c.compressedData=r.subarray(t,d(e,t)),c.startPointer=t,t+=c.compressedData.byteLength;break;default:t++}return{images:n,blockEnd:t}}(e,v),y=x.images,b=x.blockEnd;b<r.length&&r[b]!==a.gifTermination;)b++;return b>r.length&&console.warn("GIF doens`t terminate with proper symbol. It may be corrapted."),{signature:p,version:c,screenDescriptor:g,colorMap:T,images:y,buffer:r}}}(e.target.result);console.log(t);var r=document.createElement("div"),c=document.createElement("canvas"),p=document.createElement("input");p.type="text",p.value="0",r.append(c),r.append(p),V.append(r),function(e){var t,r,n,i,a,o=0;return(t=e.buffer,r=e.screenDescriptor.screenWidth*e.screenDescriptor.screenHeight,n=Math.floor((t.byteLength+r+131072)/65536)+1,i=new WebAssembly.Memory({initial:n,maximum:n}),a=new Uint8Array(i.buffer),j()({wasmMemory:i,locateFile:function(e){return e.endsWith(".wasm")?q:e}}).then((function(e){var n=e.cwrap("lzw_uncompress","void",["number","number","number","number"]),i=e._malloc(t.byteLength),o=e._malloc(r);return a.set(t,i),{module:e,lzw_uncompress:n,gifStartPointer:i,outBuffer:a.subarray(o,o+r),outStartPointer:o}}))).then((function(e){return o=e.gifStartPointer,{lzw_uncompress:function(t){e.lzw_uncompress(o+t.startPointer,t.compressedData.length,e.outStartPointer,e.outBuffer.length)},out:e.outBuffer}}))}(t).then((function(e){var r=new W(t,c,{uncompress:e});r.autoplayStart(),p.addEventListener("change",(function(e){var n=parseInt(e.target.value);!isNaN(n)&&n<t.images.length&&n>=0&&r.setFrame(n)}))}))},e.readAsArrayBuffer(this.files[0])}),!1),V.append($)},102:e=>{var t,r=(t="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0,function(e){var r,n,i=void 0!==(e=e||{})?e:{},a=Object.assign;i.ready=new Promise((function(e,t){r=e,n=t}));var o=a({},i),u=[],s="";"undefined"!=typeof document&&document.currentScript&&(s=document.currentScript.src),t&&(s=t),s=0!==s.indexOf("blob:")?s.substr(0,s.replace(/[?#].*/,"").lastIndexOf("/")+1):"",i.print||console.log.bind(console);var c,l,f=i.printErr||console.warn.bind(console);a(i,o),o=null,i.arguments&&(u=i.arguments),i.thisProgram&&i.thisProgram,i.quit&&i.quit,i.wasmBinary&&(c=i.wasmBinary),i.noExitRuntime,"object"!=typeof WebAssembly&&S("no native wasm support detected");var h=!1;function m(e){return i["_"+e]}function d(e,t,r,n,i){var a={string:function(e){var t=0;if(null!=e&&0!==e){var r=1+(e.length<<2);!function(e,t,r){!function(e,t,r,n){if(!(n>0))return 0;for(var i=r+n-1,a=0;a<e.length;++a){var o=e.charCodeAt(a);if(o>=55296&&o<=57343&&(o=65536+((1023&o)<<10)|1023&e.charCodeAt(++a)),o<=127){if(r>=i)break;t[r++]=o}else if(o<=2047){if(r+1>=i)break;t[r++]=192|o>>6,t[r++]=128|63&o}else if(o<=65535){if(r+2>=i)break;t[r++]=224|o>>12,t[r++]=128|o>>6&63,t[r++]=128|63&o}else{if(r+3>=i)break;t[r++]=240|o>>18,t[r++]=128|o>>12&63,t[r++]=128|o>>6&63,t[r++]=128|63&o}}t[r]=0}(e,v,t,r)}(e,t=H(r),r)}return t},array:function(e){var t=H(e.length);return function(e,t){g.set(e,t)}(e,t),t}};var o=m(e),u=[],s=0;if(n)for(var c=0;c<n.length;c++){var l=a[r[c]];l?(0===s&&(s=G()),u[c]=l(n[c])):u[c]=n[c]}var f=o.apply(null,u);return function(e){return 0!==s&&O(s),function(e){return"string"===t?(r=e)?function(e,t,r){for(var n=t+void 0,i=t;e[i]&&!(i>=n);)++i;if(i-t>16&&e.subarray&&T)return T.decode(e.subarray(t,i));for(var a="";t<i;){var o=e[t++];if(128&o){var u=63&e[t++];if(192!=(224&o)){var s=63&e[t++];if((o=224==(240&o)?(15&o)<<12|u<<6|s:(7&o)<<18|u<<12|s<<6|63&e[t++])<65536)a+=String.fromCharCode(o);else{var c=o-65536;a+=String.fromCharCode(55296|c>>10,56320|1023&c)}}else a+=String.fromCharCode((31&o)<<6|u)}else a+=String.fromCharCode(o)}return a}(v,r):"":"boolean"===t?Boolean(e):e;var r}(e)}(f)}var p,g,v,T="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function x(e){p=e,i.HEAP8=g=new Int8Array(e),i.HEAP16=new Int16Array(e),i.HEAP32=new Int32Array(e),i.HEAPU8=v=new Uint8Array(e),i.HEAPU16=new Uint16Array(e),i.HEAPU32=new Uint32Array(e),i.HEAPF32=new Float32Array(e),i.HEAPF64=new Float64Array(e)}var y,b=i.INITIAL_MEMORY||65536;(l=i.wasmMemory?i.wasmMemory:new WebAssembly.Memory({initial:b/65536,maximum:32768}))&&(p=l.buffer),b=p.byteLength,x(p);var E,R,w=[],A=[],F=[],C=0,P=null,U=null;function S(e){i.onAbort&&i.onAbort(e),f(e="Aborted("+e+")"),h=!0,e+=". Build with -s ASSERTIONS=1 for more info.";var t=new WebAssembly.RuntimeError(e);throw n(t),t}function D(e){return e.startsWith("data:application/octet-stream;base64,")}function I(e){try{if(e==E&&c)return new Uint8Array(c);throw"both async and sync fetching of the wasm failed"}catch(e){S(e)}}function _(e){for(;e.length>0;){var t=e.shift();if("function"!=typeof t){var r=t.func;"number"==typeof r?void 0===t.arg?k(r)():k(r)(t.arg):r(void 0===t.arg?null:t.arg)}else t(i)}}i.preloadedImages={},i.preloadedAudios={},D(E="out.wasm")||(R=E,E=i.locateFile?i.locateFile(R,s):s+R);var B=[];function k(e){var t=B[e];return t||(e>=B.length&&(B.length=e+1),B[e]=t=y.get(e)),t}function N(e){try{return l.grow(e-p.byteLength+65535>>>16),x(l.buffer),1}catch(e){}}var L,M={b:function(e){var t,r=v.length,n=2147483648;if((e>>>=0)>n)return!1;for(var i=1;i<=4;i*=2){var a=r*(1+.2/i);if(a=Math.min(a,e+100663296),N(Math.min(n,((t=Math.max(e,a))%65536>0&&(t+=65536-t%65536),t))))return!0}return!1},a:l},G=(function(){var e={a:M};function t(e,t){var r,n=e.exports;i.asm=n,y=i.asm.f,r=i.asm.c,A.unshift(r),function(e){if(C--,i.monitorRunDependencies&&i.monitorRunDependencies(C),0==C&&(null!==P&&(clearInterval(P),P=null),U)){var t=U;U=null,t()}}()}function r(e){t(e.instance)}function a(t){return(c||"function"!=typeof fetch?Promise.resolve().then((function(){return I(E)})):fetch(E,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+E+"'";return e.arrayBuffer()})).catch((function(){return I(E)}))).then((function(t){return WebAssembly.instantiate(t,e)})).then((function(e){return e})).then(t,(function(e){f("failed to asynchronously prepare wasm: "+e),S(e)}))}if(C++,i.monitorRunDependencies&&i.monitorRunDependencies(C),i.instantiateWasm)try{return i.instantiateWasm(e,t)}catch(e){return f("Module.instantiateWasm callback failed with error: "+e),!1}(c||"function"!=typeof WebAssembly.instantiateStreaming||D(E)||"function"!=typeof fetch?a(r):fetch(E,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,e).then(r,(function(e){return f("wasm streaming compile failed: "+e),f("falling back to ArrayBuffer instantiation"),a(r)}))}))).catch(n)}(),i.___wasm_call_ctors=function(){return(i.___wasm_call_ctors=i.asm.c).apply(null,arguments)},i._lzw_uncompress=function(){return(i._lzw_uncompress=i.asm.d).apply(null,arguments)},i._malloc=function(){return(i._malloc=i.asm.e).apply(null,arguments)},i.stackSave=function(){return(G=i.stackSave=i.asm.g).apply(null,arguments)}),O=i.stackRestore=function(){return(O=i.stackRestore=i.asm.h).apply(null,arguments)},H=i.stackAlloc=function(){return(H=i.stackAlloc=i.asm.i).apply(null,arguments)};function X(e){function t(){L||(L=!0,i.calledRun=!0,h||(_(A),r(i),i.onRuntimeInitialized&&i.onRuntimeInitialized(),function(){if(i.postRun)for("function"==typeof i.postRun&&(i.postRun=[i.postRun]);i.postRun.length;)e=i.postRun.shift(),F.unshift(e);var e;_(F)}()))}e=e||u,C>0||(function(){if(i.preRun)for("function"==typeof i.preRun&&(i.preRun=[i.preRun]);i.preRun.length;)e=i.preRun.shift(),w.unshift(e);var e;_(w)}(),C>0||(i.setStatus?(i.setStatus("Running..."),setTimeout((function(){setTimeout((function(){i.setStatus("")}),1),t()}),1)):t()))}if(i.cwrap=function(e,t,r,n){var i=(r=r||[]).every((function(e){return"number"===e}));return"string"!==t&&i&&!n?m(e):function(){return d(e,t,r,arguments)}},U=function e(){L||X(),L||(U=e)},i.run=X,i.preInit)for("function"==typeof i.preInit&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();return X(),e.ready});e.exports=r}},t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.m=e,r.x=e=>{},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e})(),(()=>{var e={179:0},t=[[511,736]],n=e=>{},i=(i,a)=>{for(var o,u,[s,c,l,f]=a,h=0,m=[];h<s.length;h++)u=s[h],r.o(e,u)&&e[u]&&m.push(e[u][0]),e[u]=0;for(o in c)r.o(c,o)&&(r.m[o]=c[o]);for(l&&l(r),i&&i(a);m.length;)m.shift()();return f&&t.push.apply(t,f),n()},a=self.webpackChunkcustom_gif=self.webpackChunkcustom_gif||[];function o(){for(var n,i=0;i<t.length;i++){for(var a=t[i],o=!0,u=1;u<a.length;u++){var s=a[u];0!==e[s]&&(o=!1)}o&&(t.splice(i--,1),n=r(r.s=a[0]))}return 0===t.length&&(r.x(),r.x=e=>{}),n}a.forEach(i.bind(null,0)),a.push=i.bind(null,a.push.bind(a));var u=r.x;r.x=()=>(r.x=u||(e=>{}),(n=o)())})(),r.x()})();