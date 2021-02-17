import { GIF } from 'src/parsing/gif/parser';
import { lzw_uncompress } from '../../parsing/lzw/uncompress';
import { Timer } from '../base/timer';
import { Renderer } from '../renderer';
import { GLProgram } from './shader/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from './shader/shader';

import MainVertText from './shader_assets/main.vert';
import TextureFragText from './shader_assets/texture.frag';
import TextureWithPalleteFragText from './shader_assets/textureWithPallete.frag';

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

const FPS = 1 / 20 * 1000;

export class GLRenderer implements Renderer {
  private gif: GIF;
  private ctx: WebGL2RenderingContext;
  private currentFrame: number;
  private texture: WebGLTexture;
  private colorTableTexture: WebGLTexture;
  private outTexture: WebGLTexture;
  private gifProgram: GLProgram;
  private textureProgram: GLProgram;
  private frameBuffer: WebGLFramebuffer;
  private uncompressedData: Uint8Array;
  private offscreenData: Uint8Array;
  private vbo: WebGLBuffer;
  private timer: Timer;

  constructor (gif: GIF, canvas: HTMLCanvasElement) {
    this.gif = gif;
    this.currentFrame = 0;
    this.ctx = canvas.getContext('webgl2');
    this.timer = new Timer();
    const { screenWidth, screenHeight } = this.gif.screenDescriptor;
    this.uncompressedData = new Uint8Array(screenWidth * screenHeight);
    this.offscreenData = new Uint8Array(screenWidth * screenHeight);

    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;

    this.initGL();

    if (this.gif.images.length) {
      this.timer.once(() => {
        this.drawFrame();
      });
    }
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
    if (this.gif.images.length > 1) {
      const callback = () => {
        const nextFrame = (this.currentFrame + 1) % this.gif.images.length;

        this.timer.once(callback, this.gif.images[nextFrame].graphicControl?.delayTime || FPS) as unknown as number;

        this.currentFrame = nextFrame;
        this.drawFrame();
      };

      this.timer.once(callback, this.gif.images[this.currentFrame].graphicControl?.delayTime || FPS) as unknown as number;

      return true;
    } else {
      return false;
    }
  }

  autoplayEnd(): void {
    this.timer.clear();
  }

  private initGL(): void {
    const ctx = this.ctx;
    const image = this.gif.images[0];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;
    const { screenWidth, screenHeight } = this.gif.screenDescriptor;

    ctx.enable(ctx.BLEND);
    ctx.blendEquation(ctx.FUNC_ADD);
    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 1);

    ctx.viewport(0, 0, screenWidth, screenHeight);

    const vertShader = createVertexGLShader(ctx, MainVertText);
    const fragShader = createFragmentGLShader(ctx, TextureWithPalleteFragText);
    const fragBaseShader = createFragmentGLShader(ctx, TextureFragText);

    const gifProgram = new GLProgram(ctx, vertShader, fragShader);
    const textureProgram = new GLProgram(ctx, vertShader, fragBaseShader);

    this.gifProgram = gifProgram;
    this.textureProgram = textureProgram;

    deleteShader(ctx, vertShader);
    deleteShader(ctx, fragShader);
    deleteShader(ctx, fragBaseShader);

    const frameBuffer = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, frameBuffer);

    this.frameBuffer = frameBuffer;

    const outTexture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, outTexture);

    this.outTexture = outTexture;

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, screenWidth, screenHeight, 0, ctx.RGB, ctx.UNSIGNED_BYTE, null);

    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, outTexture, 0);

    const rbo = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, rbo);
    ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH24_STENCIL8, screenWidth, screenHeight);
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

    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.R8, image.imageWidth, image.imageHeight, 0, ctx.RED, ctx.UNSIGNED_BYTE, null);

    gifProgram.useProgram(ctx);

    gifProgram.setUniform1i(ctx, 'ColorTable', 0);
    gifProgram.setUniform1i(ctx, 'MyIndexTexture', 1);

    textureProgram.useProgram(ctx);

    textureProgram.setUniform1i(ctx, 'text', 0);
  }

  private drawToTexture(frame = this.currentFrame): void {
    const image = this.gif.images[frame];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;

    this.gifProgram.useProgram(this.ctx);

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
      this.gifProgram.setUniform1f(this.ctx, 'transperancyIndex', image.graphicControl.transparentColorIndex);
    } else {
      this.gifProgram.setUniform1f(this.ctx, 'transperancyIndex', 512);
    }

    this.gifProgram.setUniform1f(this.ctx, 'colorTableSize', colorMap.entriesCount);

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
  }

  private drawToScreen(): void {
    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vbo);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, triangleFlipped, this.ctx.STATIC_DRAW);

    this.ctx.vertexAttribPointer(VERTEX_ATTRIB_LOCATION, VERTEX_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, 0);
    this.ctx.vertexAttribPointer(TEX_COORD_ATTRIB_LOCATION, TEX_CORD_COMPONENTS_COUNT, this.ctx.FLOAT, false, TOTAL_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT, VERTEX_COMPONENTS_COUNT * Float32Array.BYTES_PER_ELEMENT);
    this.ctx.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);
    this.ctx.enableVertexAttribArray(TEX_COORD_ATTRIB_LOCATION);

    this.textureProgram.useProgram(this.ctx);

    this.ctx.activeTexture(this.ctx.TEXTURE0);
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.outTexture);

    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, triangleFlipped.length);
  }

  private drawFrame(frame = this.currentFrame): void {
    this.drawToTexture(frame);
    this.drawToScreen();
  }
}
