import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';
import { lzw_uncompress } from '../../../parsing/lzw/uncompress';
import { triangle, VBO_LAYOUT } from '../../consts/consts';
import { GLProgram } from '../shader/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../shader/shader';
import { GLVBO } from '../shader/vbo';
import { RenderAlgorithm } from './render_algorithm';

import MainVertText from '../shader_assets/main.vert';
import MainFlippedVertText from '../shader_assets/mainFlipped.vert';
import TextureFragText from '../shader_assets/texture.frag';
import TextureWithPalleteFragText from '../shader_assets/textureWithPallete.frag';

export class GLBaseRenderAlgorithm implements RenderAlgorithm {
  private texture: WebGLTexture;
  private colorTableTexture: WebGLTexture;
  private outTexture: WebGLTexture;
  private gifProgram: GLProgram;
  private textureProgram: GLProgram;
  private frameBuffer: WebGLFramebuffer;
  private uncompressedData: Uint8Array;
  private offscreenData: Uint8Array;
  private vboToTexture: GLVBO;

  constructor (gl: WebGL2RenderingContext, screenDescriptor: ScreenDescriptor, firstFrame: ImageDecriptor, globalColorMap: ColorMap) {
    const colorMap = firstFrame.M ? firstFrame.colorMap : globalColorMap;
    const { screenWidth, screenHeight } = screenDescriptor;

    this.uncompressedData = new Uint8Array(screenWidth * screenHeight);
    this.offscreenData = new Uint8Array(screenWidth * screenHeight);

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.viewport(0, 0, screenWidth, screenHeight);

    const vertShader = createVertexGLShader(gl, MainVertText);
    const vertFlippedShader = createVertexGLShader(gl, MainFlippedVertText);
    const fragShader = createFragmentGLShader(gl, TextureWithPalleteFragText);
    const fragBaseShader = createFragmentGLShader(gl, TextureFragText);

    const gifProgram = new GLProgram(gl, vertShader, fragShader);
    const textureProgram = new GLProgram(gl, vertFlippedShader, fragBaseShader);

    this.gifProgram = gifProgram;
    this.textureProgram = textureProgram;

    deleteShader(gl, vertShader);
    deleteShader(gl, vertFlippedShader);
    deleteShader(gl, fragShader);
    deleteShader(gl, fragBaseShader);

    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    this.frameBuffer = frameBuffer;

    const outTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, outTexture);

    this.outTexture = outTexture;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, screenWidth, screenHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outTexture, 0);

    const rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, screenWidth, screenHeight);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);

    this.vboToTexture = new GLVBO(gl, VBO_LAYOUT);

    this.vboToTexture.bind(gl);
    this.vboToTexture.setData(gl, triangle);

    const colorTableTexture = gl.createTexture();
    this.colorTableTexture = colorTableTexture;
    gl.bindTexture(gl.TEXTURE_2D, colorTableTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, colorMap.entriesCount, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, colorMap.getRawData());

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.texture = texture;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, firstFrame.imageWidth, firstFrame.imageHeight, 0, gl.RED, gl.UNSIGNED_BYTE, null);

    gifProgram.useProgram(gl);

    gifProgram.setUniform1i(gl, 'ColorTableTexture', 0);
    gifProgram.setUniform1i(gl, 'IndexTexture', 1);

    textureProgram.useProgram(gl);

    textureProgram.setUniform1i(gl, 'outTexture', 0);
  }

  drawToTexture(gl: WebGL2RenderingContext, screenDescriptor: ScreenDescriptor, image: ImageDecriptor, globalColorMap: ColorMap): void {
    const colorMap = image.M ? image.colorMap : globalColorMap;

    // console.log('frame = ', this.currentFrame);

    // if (image.graphicControl) {
    //   if (image.graphicControl.disposalMethod === DisposalMethod.noAction) {
    //     console.log('dispose no action');
    //   }
    //   if (image.graphicControl.disposalMethod === DisposalMethod.noDispose) {
    //     console.log('dispose no dispose');
    //   }
    //   if (image.graphicControl.disposalMethod === DisposalMethod.prev) {
    //     console.log('dispose prev');
    //   }
    // }

    this.gifProgram.useProgram(gl);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

    this.vboToTexture.bind(gl);
    this.vboToTexture.activateAllAttribPointers(gl);

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
          let offset = y * screenDescriptor.screenWidth + x;

          image.imageTop * screenDescriptor.screenWidth + (j + image.imageLeft)

          this.uncompressedData[offset] = this.offscreenData[localOffset];
        }
      }
    }

    if (image.graphicControl?.isTransparent) {
      this.gifProgram.setUniform1f(gl, 'TransperancyIndex', image.graphicControl.transparentColorIndex);
    } else {
      this.gifProgram.setUniform1f(gl, 'TransperancyIndex', 512);
    }

    this.gifProgram.setUniform1f(gl, 'ColorTableSize', colorMap.entriesCount);

    gl.bindTexture(gl.TEXTURE_2D, this.colorTableTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, colorMap.entriesCount, 1, gl.RGB, gl.UNSIGNED_BYTE, colorMap.getRawData());

    // TODO: for debug, check 1a8.gif frame = 76, it has some copurapted pixels
    // const b = new Uint8Array(this.gif.screenDescriptor.screenWidth * this.gif.screenDescriptor.screenHeight * 4);
    // gl.readPixels(0, 0, this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight, gl.RGBA, gl.UNSIGNED_BYTE, b);
    // console.log('out', b);

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, screenDescriptor.screenWidth, screenDescriptor.screenHeight, gl.RED, gl.UNSIGNED_BYTE, this.uncompressedData);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTableTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.drawArrays(gl.TRIANGLES, 0, triangle.length);
  }

  drawToScreen(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.textureProgram.useProgram(gl);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.outTexture);

    gl.drawArrays(gl.TRIANGLES, 0, triangle.length);
  }
}
