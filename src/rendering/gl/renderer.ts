import { GIF } from 'src/parsing/gif/parser';
import { lzw_uncompress } from '../../parsing/lzw/uncompress';
import { Renderer } from '../renderer';

const vert = `\
#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

out vec2 texCoord;

void main()
{
  gl_Position = vPosition;
  texCoord = aTexCoord;
}
`;

const frag = `\
#version 300 es

precision mediump float;

uniform sampler2D ColorTable;     //256 x 1 pixels
uniform sampler2D MyIndexTexture;
uniform float colorTableSize;
uniform float transperancyIndex;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 myindex = texture(MyIndexTexture, texCoord);
  float maxCodeValue = colorTableSize - 1.0;
  float normilaziedTransperancyIndex = round(transperancyIndex / maxCodeValue);

  float normilaziedX = (myindex.x * 255.0) / colorTableSize;
  vec4 texel = texture(ColorTable, vec2(normilaziedX, myindex.y));

  // TODO: check for better the best way with performance
  float alpha = 1.0 - step(transperancyIndex, round(myindex.x * 255.0)) + step(transperancyIndex + 1.0, round(myindex.x * 255.0));

  fragColor = vec4(texel.rgb, alpha);   //Output the color
}
`;
const fragBase = `\
#version 300 es

precision mediump float;

uniform sampler2D text;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = texture(text, texCoord);
}
`;

const VERTEX_ATTRIB_LOCATION = 0;
const TEX_COORD_ATTRIB_LOCATION = 1;

const VERTEX_COMPONENTS_COUNT = 3;
const TEX_CORD_COMPONENTS_COUNT = 2;
const TOTAL_COMPONENTS_COUNT = VERTEX_COMPONENTS_COUNT + TEX_CORD_COMPONENTS_COUNT;

const triangle = Float32Array.from([
  // first triangle
  -1.0, 1.0, 0.0, // top-left v0
  0.0, 0.0, // texCoord v0

  1.0, 1.0, 0.0, // top-right v1
  1.0, 0.0, // texCoord v1

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 1.0, // texCoord v2

  // second triangle
  1.0, 1.0, 0.0, // top-rigth v1
  1.0, 0.0, // texCoord v1

  1.0, -1.0, 0.0, // bottom-right v4
  1.0, 1.0, // texCoord v4

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 1.0, // texCoord v2
]);

const triangleFlipped = Float32Array.from([
  // first triangle
  -1.0, 1.0, 0.0, // top-left v0
  0.0, 1.0, // texCoord v0

  1.0, 1.0, 0.0, // top-right v1
  1.0, 1.0, // texCoord v1

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 0.0, // texCoord v2

  // second triangle
  1.0, 1.0, 0.0, // top-rigth v1
  1.0, 1.0, // texCoord v1

  1.0, -1.0, 0.0, // bottom-right v4
  1.0, 0.0, // texCoord v4

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 0.0, // texCoord v2
]);

function createGLShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, shaderSrc: string): WebGLShader {
  const shader = gl.createShader(type);

  if (shader === 0) console.warn('Fail to create shader');

  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);

    console.warn(`Fail to compile shader: ${message}`);

    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

export function createGLProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);

    console.warn(`Fail to link program: ${info}`);

    gl.deleteProgram(program);

    return null;
  }

  return program;
}

export class GLRenderer implements Renderer {
  private gif: GIF;
  private ctx: WebGL2RenderingContext;
  private currentFrame: number;
  private texture: WebGLTexture;
  private colorTableTexture: WebGLTexture;
  private outTexture: WebGLTexture;
  private transperancyIndexU: WebGLUniformLocation;
  private colorTableSizeU: WebGLUniformLocation;
  private program: WebGLProgram;
  private programBase: WebGLProgram;
  private frameBuffer: WebGLFramebuffer;
  private uncompressedData: Uint8Array;
  private offscreenData: Uint8Array;
  private vbo: WebGLBuffer;

  constructor(gif: GIF, canvas: HTMLCanvasElement) {
    this.gif = gif;
    this.currentFrame = 0;
    const ctx = canvas.getContext('webgl2');
    this.ctx = ctx;

    const { screenWidth, screenHeight } = this.gif.screenDescriptor;
    const image = this.gif.images[0];
    const colorMap = image.M ? image.colorMap : gif.colorMap;

    ctx.enable(ctx.BLEND);
    ctx.blendEquation(ctx.FUNC_ADD);
    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;
    ctx.viewport(0, 0, screenWidth, screenHeight);

    const vertShader = createGLShader(ctx, ctx.VERTEX_SHADER, vert);
    const fragShader = createGLShader(ctx, ctx.FRAGMENT_SHADER, frag);
    const fragBaseShader = createGLShader(ctx, ctx.FRAGMENT_SHADER, fragBase);

    const program = createGLProgram(ctx, vertShader, fragShader);
    const programBase = createGLProgram(ctx, vertShader, fragBaseShader);

    this.program = program;
    this.programBase = programBase;


    ctx.deleteShader(vertShader);
    ctx.deleteShader(fragShader);
    ctx.deleteShader(fragBaseShader);

    const ColorTableUniformLocation = ctx.getUniformLocation(program, 'ColorTable');
    const MyIndexTextureUniformLocation = ctx.getUniformLocation(program, 'MyIndexTexture');
    const transperancyIndexU = ctx.getUniformLocation(program, 'transperancyIndex');
    const colorTableSizeU = ctx.getUniformLocation(program, 'colorTableSize');
    this.transperancyIndexU = transperancyIndexU;
    this.colorTableSizeU = colorTableSizeU;

    const baseTexture = ctx.getUniformLocation(programBase, 'text');

    const frameBuffer = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, frameBuffer);

    this.frameBuffer = frameBuffer;

    const outTexture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, outTexture);

    this.outTexture = outTexture;

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, image.imageWidth, image.imageHeight, 0, ctx.RGB, ctx.UNSIGNED_BYTE, null);

    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, outTexture, 0);

    const rbo = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, rbo);
    ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH24_STENCIL8, image.imageWidth, image.imageHeight);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);

    ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_STENCIL_ATTACHMENT, ctx.RENDERBUFFER, rbo);

    const buffer = ctx.createBuffer();
    this.vbo = buffer;

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, triangle, ctx.STATIC_DRAW);

    ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 1);

    const colorTableTexture = ctx.createTexture();
    this.colorTableTexture = colorTableTexture;
    ctx.bindTexture(ctx.TEXTURE_2D, colorTableTexture);

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, colorMap.entriesCount, 1, 0, ctx.RGB, ctx.UNSIGNED_BYTE, colorMap.getRawData());

    ctx.bindTexture(ctx.TEXTURE_2D, null);

    const texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    this.texture = texture;

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    const outTextureData = new Uint8Array(image.imageWidth * image.imageHeight);
    this.offscreenData = new Uint8Array(image.imageWidth * image.imageHeight);
    lzw_uncompress(image.compressedData, outTextureData);
    this.uncompressedData = outTextureData;
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.R8, image.imageWidth, image.imageHeight, 0, ctx.RED, ctx.UNSIGNED_BYTE, outTextureData);

    ctx.useProgram(program);

    ctx.uniform1i(ColorTableUniformLocation, 0);
    ctx.uniform1i(MyIndexTextureUniformLocation, 1);
    if (image.graphicControl?.isTransparent) {
      this.ctx.uniform1f(this.transperancyIndexU, image.graphicControl.transparentColorIndex);
    } else {
      this.ctx.uniform1f(this.transperancyIndexU, 512);
    }
    ctx.uniform1f(colorTableSizeU, colorMap.entriesCount);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, triangle, ctx.STATIC_DRAW);

    ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    ctx.activeTexture(ctx.TEXTURE0);
    ctx.bindTexture(ctx.TEXTURE_2D, colorTableTexture);
    ctx.activeTexture(ctx.TEXTURE1);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);

    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    ctx.drawArrays(ctx.TRIANGLES, 0, triangle.length);

    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, triangleFlipped, ctx.STATIC_DRAW);

    ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    ctx.useProgram(programBase);

    ctx.uniform1i(baseTexture, 0);

    ctx.activeTexture(ctx.TEXTURE0);
    ctx.bindTexture(ctx.TEXTURE_2D, outTexture);

    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.TRIANGLES, 0, triangle.length);
  }

  setFrame(frame: number): void {
    if (frame > -1 && frame < this.gif.images.length) {
      this.currentFrame = frame;

      for (let i = 0; i < frame; i++) {
        this.drawFrame(i);
      }

      this.drawFrame();
    }
  }

  autoplayStart(): boolean {
    const FPS = 1 / 15 * 1000;

    const callback = () => {
      setTimeout(callback, FPS);

      this.currentFrame = (this.currentFrame + 1) % this.gif.images.length;
      this.drawFrame();
    }

    setTimeout(callback, FPS);

    return false
  }

  autoplayEnd(): void {
  }

  private drawFrame(frame = this.currentFrame): void {
    const image = this.gif.images[frame];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;

    this.ctx.useProgram(this.program);

    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.frameBuffer);

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vbo);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, triangle, this.ctx.STATIC_DRAW);

    this.ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    this.ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    this.ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    this.ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    lzw_uncompress(image.compressedData, this.offscreenData);
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    const transparentColorIndex = image.graphicControl?.transparentColorIndex ?? -1;
    let localOffset = 0;

    // TODO: find a way to get rid of this loop
    // Its only needed to not polute texture with indecies with transparent color index.
    // It leads to problem when each next frame transparent color index changes.
    // In such case we render prev transparent color as an opaque color.
    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        localOffset = i * localImageWidth + j;

        if (!(this.offscreenData[localOffset] === transparentColorIndex)) {
          let x = j + image.imageLeft;
          let y = i + image.imageTop;
          let offset = y * this.gif.screenDescriptor.screenWidth + x;

          image.imageTop * this.gif.screenDescriptor.screenWidth + (j + image.imageLeft)

          this.uncompressedData[offset] = this.offscreenData[localOffset];
        }
      }
    }

    if (image.graphicControl?.isTransparent) {
      this.ctx.uniform1f(this.transperancyIndexU, image.graphicControl.transparentColorIndex);
    } else {
      this.ctx.uniform1f(this.transperancyIndexU, 512);
    }

    this.ctx.uniform1f(this.colorTableSizeU, colorMap.entriesCount);
    // console.log('new size', colorMap.entriesCount);

    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.colorTableTexture);
    this.ctx.texSubImage2D(this.ctx.TEXTURE_2D, 0, 0, 0, colorMap.entriesCount, 1, this.ctx.RGB, this.ctx.UNSIGNED_BYTE, colorMap.getRawData());

    // TODO: for debug, check 1a8.gif frame = 76, it has some copurapted pixels
    // const b = new Uint8Array(this.gif.screenDescriptor.screenWidth * this.gif.screenDescriptor.screenHeight * 4);
    // this.ctx.readPixels(0, 0, this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, b);
    // console.log('out', b);

    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
    this.ctx.texSubImage2D(this.ctx.TEXTURE_2D, 0, 0, 0, this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight, this.ctx.RED, this.ctx.UNSIGNED_BYTE, this.uncompressedData);

    this.ctx.activeTexture(this.ctx.TEXTURE0);
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.colorTableTexture);
    this.ctx.activeTexture(this.ctx.TEXTURE1);
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);

    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, triangle.length);

    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vbo);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, triangleFlipped, this.ctx.STATIC_DRAW);

    this.ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    this.ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    this.ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    this.ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    this.ctx.useProgram(this.programBase);

    this.ctx.activeTexture(this.ctx.TEXTURE0);
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.outTexture);

    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, triangle.length);
  }
}
