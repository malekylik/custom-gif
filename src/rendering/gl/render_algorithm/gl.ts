import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';
import { QUAD_WITH_TEXTURE_COORD_DATA, VBO_LAYOUT } from '../../consts/consts';
import { GLVBO } from '../gl_api/vbo';
import { RenderAlgorithm } from './render_algorithm';
import { GLTexture, TextureFormat, TextureType, TextureUnit } from '../gl_api/texture';
import { FactoryOut, FactoryResult } from 'src/parsing/lzw/factory/uncompress_factory';
import { RenderResult } from '../../render-pass/render-pass';
import { FlipRenderResultsRenderPass } from '../../render-pass/flip-render-pass';
import { DrawingToScreenRenderPass } from '../../render-pass/drawing-to-screen-pass';
import { GifAlphaRenderPass } from '../../render-pass/gif-alpha-pass';
import { GifRenderPass } from '../../render-pass/gif-frame-pass';
import { CopyRenderResultRenderPass } from '../../render-pass/copy-render-result-pass';
import { BackAndWhiteRenderPass } from '../../render-pass/black-and-white-pass';

export class GLRenderAlgorithm implements RenderAlgorithm {
  private gifFrametexture: GLTexture;
  private colorTableTexture: GLTexture;

  private currentFrame: RenderResult;
  private disposalPrev: RenderResult;
  private prevFrame: RenderResult;

  private uncompressedData: Uint8Array;
  private vboToTexture: GLVBO;
  private lzw_uncompress: FactoryOut;
  private gl: WebGL2RenderingContext;

  // TODO: remove
  private screenWidth: number;
  private screenHeight: number;

  // TODO: remove
  private maxColorMapSize: number;

  constructor(canvas: HTMLCanvasElement, screenDescriptor: ScreenDescriptor, images: Array<ImageDecriptor>, globalColorMap: ColorMap, uncompressed: FactoryResult) {
    const gl = canvas.getContext('webgl2');

    const firstFrame = images[0];
    const colorMap = firstFrame.M ? firstFrame.colorMap : globalColorMap;
    const { screenWidth, screenHeight } = screenDescriptor;

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.uncompressedData = uncompressed.out;
    this.lzw_uncompress = uncompressed.lzw_uncompress;

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.viewport(0, 0, screenWidth, screenHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.vboToTexture = new GLVBO(gl, VBO_LAYOUT);

    this.vboToTexture.bind(gl);
    this.vboToTexture.setData(gl, QUAD_WITH_TEXTURE_COORD_DATA);
    this.vboToTexture.activateAllAttribPointers(gl);

    const maxColorMapSize = images.reduce((currentColorMapSize, image) => {
      if (image.M && image.colorMap.entriesCount > currentColorMapSize) {
        return image.colorMap.entriesCount;
      }

      return currentColorMapSize;
    }, colorMap.entriesCount);

    this.maxColorMapSize = maxColorMapSize;

    this.colorTableTexture = new GLTexture(gl, maxColorMapSize, 1, null);
    this.gifFrametexture = new GLTexture(gl, screenWidth, screenHeight, null, { imageFormat: { internalFormat: TextureFormat.R8, format: TextureFormat.RED, type: TextureType.UNSIGNED_BYTE } });

    this.colorTableTexture.setTextureUnit(TextureUnit.TEXTURE0);
    this.gifFrametexture.setTextureUnit(TextureUnit.TEXTURE1);

    this.gl = gl;
  }

  drawToTexture(image: ImageDecriptor, globalColorMap: ColorMap): void {
    const gl = this.gl;

    this.lzw_uncompress(image);

    this.gifFrametexture.bind(gl);
    this.gifFrametexture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);

    const alphaRenderPassResult: RenderResult = this.drawToAlphaTexture(gl, image);
    const colorMap = image.M ? image.colorMap : globalColorMap;

    this.colorTableTexture.bind(gl);
    this.colorTableTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());

    this.gifFrametexture.bind(gl);
    this.gifFrametexture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);

    this.currentFrame = new GifRenderPass(gl, this.screenWidth, this.screenHeight)
      .execute({}, { colorTableSize: this.maxColorMapSize }, {
        colorTableTexture: this.colorTableTexture,
        indexTexture: this.gifFrametexture,
        alphaTexture: alphaRenderPassResult.texture,
        prevFrameTexture: this.prevFrame ? this.prevFrame.texture : null
      });

      this.prevFrame = new CopyRenderResultRenderPass(this.gl, this.screenWidth, this.screenHeight)
      .execute({}, {}, { targetTexture: this.currentFrame.texture });
  }

  restorePrevDisposal(): void {
      this.currentFrame = this.disposalPrev;
      this.prevFrame = this.disposalPrev;
  }

  drawToScreen(): void {
    let newResult = this.currentFrame;
    // newResult = new BackAndWhiteRenderPass(this.gl, this.screenWidth, this.screenHeight).execute({}, {}, { targetTexture: newResult.texture });
    newResult = new FlipRenderResultsRenderPass(this.gl, this.screenWidth, this.screenHeight).execute({}, {}, { targetTexture: newResult.texture });

    new DrawingToScreenRenderPass(this.gl)
      .execute({}, {}, { targetTexture: newResult.texture } );
  }

  private drawToAlphaTexture(gl: WebGL2RenderingContext, image: ImageDecriptor): RenderResult {
    const globals = {
      screenHeight: this.screenHeight,
      transperancyIndex: image.graphicControl?.isTransparent ? image.graphicControl.transparentColorIndex : 512,
      alphaSquarCoord: [image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight] as [number, number, number, number],
    };

    return new GifAlphaRenderPass(gl, this.screenWidth, this.screenHeight)
      .execute({}, globals, {gifFrame: this.gifFrametexture});
  }

  saveDisposalPrev(): void {
    this.disposalPrev = new CopyRenderResultRenderPass(this.gl, this.screenWidth, this.screenHeight)
      .execute({}, {}, { targetTexture: this.currentFrame.texture });
  }

  getCanvasPixels(screen: ScreenDescriptor, buffer: ArrayBufferView) {
    // TODO: think how to improve
    if (this.currentFrame) {
      this.currentFrame.frameBuffer.getPixels(screen.screenWidth, screen.screenHeight, buffer);
    }
  }

  getPrevCanvasPixels(screen: ScreenDescriptor, buffer: ArrayBufferView) {
    // TODO: think how to improve
    if (this.prevFrame) {
      this.prevFrame.frameBuffer.getPixels(screen.screenWidth, screen.screenHeight, buffer);
    }
  }
}
