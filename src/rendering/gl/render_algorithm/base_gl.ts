import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';
import { QUAD_WITH_TEXTURE_COORD_DATA, VBO_LAYOUT } from '../../consts/consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { GLVBO } from '../gl_api/vbo';
import { RenderAlgorithm } from './render_algorithm';
import { GLTexture, TextureFormat, TextureType, TextureUnit } from '../gl_api/texture';
import { GLFramebuffer } from '../gl_api/framebuffer';
import { FactoryOut, FactoryResult } from 'src/parsing/lzw/factory/uncompress_factory';

import MainVertText from '../shader_assets/main.vert';
import MainFlippedVertText from '../shader_assets/mainFlipped.vert';
import TextureFragText from '../shader_assets/texture.frag';
import TextureWithPalleteFragText from '../shader_assets/textureWithPalleteBase.frag';

export class GLBaseRenderAlgorithm implements RenderAlgorithm {
  private texture: GLTexture;
  private colorTableTexture: GLTexture;
  private outTexture: GLTexture;
  private gifProgram: GLProgram;
  private textureProgram: GLProgram;
  private frameBuffer: GLFramebuffer;
  private uncompressedData: Uint8Array;
  private offscreenData: Uint8Array;
  private vboToTexture: GLVBO;
  private lzw_uncompress: FactoryOut;

  constructor (gl: WebGL2RenderingContext, screenDescriptor: ScreenDescriptor, firstFrame: ImageDecriptor, globalColorMap: ColorMap, uncompressed: FactoryResult) {
    const colorMap = firstFrame.M ? firstFrame.colorMap : globalColorMap;
    const { screenWidth, screenHeight } = screenDescriptor;

    this.lzw_uncompress = uncompressed.lzw_uncompress;
    this.uncompressedData = new Uint8Array(screenWidth * screenHeight);
    this.offscreenData = uncompressed.out;

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

    this.frameBuffer = new GLFramebuffer(gl, screenWidth, screenHeight);

    this.outTexture = new GLTexture(gl, screenWidth, screenHeight, null);
    this.outTexture.setTextureUnit(TextureUnit.TEXTURE0);

    this.frameBuffer.bind(gl);
    this.frameBuffer.setTexture(gl, this.outTexture);
    this.frameBuffer.unbind(gl);

    this.vboToTexture = new GLVBO(gl, VBO_LAYOUT);

    this.vboToTexture.bind(gl);
    this.vboToTexture.setData(gl, QUAD_WITH_TEXTURE_COORD_DATA);
    this.vboToTexture.activateAllAttribPointers(gl);

    this.colorTableTexture = new GLTexture(gl, colorMap.entriesCount, 1, colorMap.getRawData());
    this.texture = new GLTexture(gl, firstFrame.imageWidth, firstFrame.imageHeight, null, { imageFormat: { internalFormat: TextureFormat.R8, format: TextureFormat.RED, type: TextureType.UNSIGNED_BYTE } });

    this.colorTableTexture.setTextureUnit(TextureUnit.TEXTURE0);
    this.texture.setTextureUnit(TextureUnit.TEXTURE1);

    gifProgram.useProgram(gl);

    gifProgram.setTextureUniform(gl, 'ColorTableTexture', this.colorTableTexture);
    gifProgram.setTextureUniform(gl, 'IndexTexture', this.texture);

    textureProgram.useProgram(gl);

    textureProgram.setTextureUniform(gl, 'outTexture', this.outTexture);
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

    this.frameBuffer.bind(gl);

    this.lzw_uncompress(image);
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

    this.colorTableTexture.bind(gl);
    this.colorTableTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());

    this.texture.bind(gl);
    this.texture.setData(gl, 0, 0, screenDescriptor.screenWidth, screenDescriptor.screenHeight, this.uncompressedData);

    this.colorTableTexture.activeTexture(gl);
    this.colorTableTexture.bind(gl);
    this.texture.activeTexture(gl);
    this.texture.bind(gl);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }

  drawToScreen(gl: WebGL2RenderingContext): void {
    this.frameBuffer.unbind(gl);

    this.textureProgram.useProgram(gl);

    this.outTexture.activeTexture(gl);
    this.outTexture.bind(gl);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }
}
