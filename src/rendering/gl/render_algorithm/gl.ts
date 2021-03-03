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
import TextureWithPalleteFragText from '../shader_assets/textureWithPallete.frag';
import TextureAlpha from '../shader_assets/textureAlpha.frag';

export class GLRenderAlgorithm implements RenderAlgorithm {
  private texture: GLTexture;
  private alphaTexture: GLTexture;
  private colorTableTexture: GLTexture;
  private outTexture: GLTexture;
  private gifProgram: GLProgram;
  private textureProgram: GLProgram;
  private alphaProgram: GLProgram;
  private alphaFrameBuffer: GLFramebuffer;
  private frameBuffer: GLFramebuffer;
  private uncompressedData: Uint8Array;
  private vboToTexture: GLVBO;
  private lzw_uncompress: FactoryOut;

  constructor(gl: WebGL2RenderingContext, screenDescriptor: ScreenDescriptor, firstFrame: ImageDecriptor, globalColorMap: ColorMap, uncompressed: FactoryResult) {
    const colorMap = firstFrame.M ? firstFrame.colorMap : globalColorMap;
    const { screenWidth, screenHeight } = screenDescriptor;

    this.uncompressedData = uncompressed.out;
    this.lzw_uncompress = uncompressed.lzw_uncompress;

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.viewport(0, 0, screenWidth, screenHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const vertShader = createVertexGLShader(gl, MainVertText);
    const vertFlippedShader = createVertexGLShader(gl, MainFlippedVertText);
    const fragShader = createFragmentGLShader(gl, TextureWithPalleteFragText);
    const fragBaseShader = createFragmentGLShader(gl, TextureFragText);
    const fragAlphaShader = createFragmentGLShader(gl, TextureAlpha);

    const gifProgram = new GLProgram(gl, vertShader, fragShader);
    const textureProgram = new GLProgram(gl, vertFlippedShader, fragBaseShader);
    const alphaProgram = new GLProgram(gl, vertShader, fragAlphaShader);

    this.gifProgram = gifProgram;
    this.textureProgram = textureProgram;
    this.alphaProgram = alphaProgram;

    deleteShader(gl, vertShader);
    deleteShader(gl, vertFlippedShader);
    deleteShader(gl, fragShader);
    deleteShader(gl, fragBaseShader);
    deleteShader(gl, fragAlphaShader);

    this.alphaFrameBuffer = new GLFramebuffer(gl, screenWidth, screenHeight);

    this.alphaTexture = new GLTexture(gl, screenWidth, screenHeight, null);
    this.alphaTexture.setTextureUnit(TextureUnit.TEXTURE2);

    this.alphaFrameBuffer.bind(gl);
    this.alphaFrameBuffer.setTexture(gl, this.alphaTexture);
    this.alphaFrameBuffer.unbind(gl);

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
    gifProgram.setTextureUniform(gl, 'alphaTexture', this.alphaTexture);

    textureProgram.useProgram(gl);

    textureProgram.setTextureUniform(gl, 'outTexture', this.outTexture);

    alphaProgram.useProgram(gl);

    alphaProgram.setTextureUniform(gl, 'IndexTexture', this.texture);
    alphaProgram.setUniform1f(gl, 'ScreenHeight', screenHeight);
    alphaProgram.setUniform1fv(gl, 'Rect', 0, 0, firstFrame.imageWidth, firstFrame.imageHeight);
  }

  drawToTexture(gl: WebGL2RenderingContext, image: ImageDecriptor, globalColorMap: ColorMap): void {
    this.lzw_uncompress(image);

    this.texture.bind(gl);
    this.texture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);

    this.drawToAlphaTexture(gl, image);
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

    this.gifProgram.setUniform1f(gl, 'ColorTableSize', colorMap.entriesCount);

    this.colorTableTexture.bind(gl);
    this.colorTableTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());

    this.texture.bind(gl);
    this.texture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);

    this.colorTableTexture.activeTexture(gl);
    this.colorTableTexture.bind(gl);
    this.texture.activeTexture(gl);
    this.texture.bind(gl);
    this.alphaTexture.activeTexture(gl);
    this.alphaTexture.bind(gl);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }

  drawToScreen(gl: WebGL2RenderingContext): void {
    this.frameBuffer.unbind(gl);

    this.textureProgram.useProgram(gl);

    this.outTexture.activeTexture(gl);
    this.outTexture.bind(gl);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }

  private drawToAlphaTexture(gl: WebGL2RenderingContext, image: ImageDecriptor): void {
    this.alphaFrameBuffer.bind(gl);
    this.alphaProgram.useProgram(gl);
    
    if (image.graphicControl?.isTransparent) {
      this.alphaProgram.setUniform1f(gl, 'TransperancyIndex', image.graphicControl.transparentColorIndex);
    } else {
      this.alphaProgram.setUniform1f(gl, 'TransperancyIndex', 512);
    }

    this.texture.activeTexture(gl);
    this.texture.bind(gl);

    this.alphaProgram.setUniform1fv(gl, 'Rect', image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }
}
