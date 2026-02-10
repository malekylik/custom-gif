import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';
import { QUAD_WITH_TEXTURE_COORD_DATA, VBO_LAYOUT } from '../consts';
import { GLVBO } from '../gl_api/vbo';
import { RenderAlgorithm } from './render_algorithm';
import { GLTexture, TextureFiltering, TextureFormat, TextureType, TextureUnit } from '../gl_api/texture';
import { FactoryOut, FactoryResult } from 'src/parsing/lzw/factory/uncompress_factory';
import { FlipRenderResultsRenderPass } from '../render-pass/flip-render-pass';
import { DrawingToScreenRenderPass } from '../render-pass/drawing-to-screen-pass';
import { GifAlphaRenderPass } from '../render-pass/gif-alpha-pass';
import { GifRenderPass } from '../render-pass/gif-frame-pass';
import { CopyRenderResultRenderPass } from '../render-pass/copy-render-result-pass';
import { RenderResult } from '../../api/render-result';
import { createGLDrawer, GLDrawer } from '../gl_api/gl-drawer';
import { disposeGLSystem, getGLSystem, initGLSystem } from '../gl-system';
import { BufferDrawingTarget } from '../../api/drawing-target';
import { GLBufferDrawingTarget } from '../gl_api/gl-drawing-target';
import { GLFrameDrawingTargetTemporaryAllocator } from '../gl_api/gl-resource-manager';
import { GLEffect } from '../gl_api/gl-effect';

let id = -1;

export class GLRenderAlgorithm implements RenderAlgorithm {
  private gifFrameTexture: GLTexture;
  private colorTableTexture: GLTexture;

  private currentFrameBuffer: GLBufferDrawingTarget;
  private disposalPrevFrameBuffer: GLBufferDrawingTarget;
  private prevFrameBuffer: GLBufferDrawingTarget;

  private currentFrame: RenderResult;
  private disposalPrevFrame: RenderResult;
  private prevFrame: RenderResult;

  private vboToTexture: GLVBO;

  private uncompressedData: Uint8Array;
  private lzw_uncompress: FactoryOut;
  private gl: WebGL2RenderingContext;
  private drawer: GLDrawer;

  private screenWidth: number;
  private screenHeight: number;

  private maxColorMapSize: number;

  private id: string;

  private resultOutputDimension: { screenWidth: number; screenHeight: number; };

  constructor(canvas: HTMLCanvasElement, screenDescriptor: ScreenDescriptor, images: Array<ImageDescriptor>, globalColorMap: ColorMap, uncompressed: FactoryResult, resultOutputDimension?: { screenWidth: number; screenHeight: number; }) {
    const gl = canvas.getContext('webgl2');
    this.id = String(++id);

    initGLSystem(gl, String(this.id));

    this.drawer = createGLDrawer(gl);
    this.drawer.startFrame();

    const firstFrame = images[0];
    const colorMap = firstFrame.M ? firstFrame.colorMap : globalColorMap;
    const { screenWidth, screenHeight } = screenDescriptor;

    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    this.resultOutputDimension = resultOutputDimension;

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
    this.gifFrameTexture = new GLTexture(gl, screenWidth, screenHeight, null, { imageFormat: { internalFormat: TextureFormat.R8, format: TextureFormat.RED, type: TextureType.UNSIGNED_BYTE } });

    this.colorTableTexture.setTextureUnit(TextureUnit.TEXTURE0);
    this.gifFrameTexture.setTextureUnit(TextureUnit.TEXTURE1);

    this.gl = gl;
  }

  drawToTexture(image: ImageDescriptor, globalColorMap: ColorMap): void {
    const gl = this.gl;

    this.lzw_uncompress(image);

    this.gifFrameTexture.bind(gl);
    this.gifFrameTexture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);

    getGLSystem(this.id).resouceManager.allocateFrameDrawingTarget((allocator) => {
      const alphaRenderPassResult: RenderResult = this.drawToAlphaTexture(allocator.allocate(this.screenWidth, this.screenHeight), image);
      const colorMap = image.M ? image.colorMap : globalColorMap;
  
      this.colorTableTexture.bind(gl);
      this.colorTableTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());
  
      this.gifFrameTexture.bind(gl);
      this.gifFrameTexture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);
  
      if (this.currentFrameBuffer) {
        getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer);
      }
      this.currentFrameBuffer = getGLSystem(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth, this.screenHeight, { filtering: { min: TextureFiltering.LINEAR, mag: TextureFiltering.LINEAR } });

      this.currentFrame = new GifRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
        .execute({
          memory: {},
          globals: { colorTableSize: this.maxColorMapSize },
          textures: {
            colorTableTexture: this.colorTableTexture,
            indexTexture: this.gifFrameTexture,
            alphaTexture: alphaRenderPassResult.texture,
            prevFrameTexture: this.prevFrame ? this.prevFrame.texture : null
          },
          drawingTarget: this.currentFrameBuffer
        });

        if (this.prevFrameBuffer) {
          getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer);
        }
        this.prevFrameBuffer = getGLSystem(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth, this.screenHeight);

        this.prevFrame = new CopyRenderResultRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
        .execute({
          memory: {},
          globals: {},
          textures: { targetTexture: this.currentFrame.texture },
          drawingTarget: this.prevFrameBuffer,
        });
    });
  }

  restorePrevDisposal(): void {
      this.currentFrame = this.disposalPrevFrame;
      this.prevFrame = this.disposalPrevFrame;
  }

  drawToScreen(effects: GLEffect[], currentFrame: number): void {
    getGLSystem(this.id).resouceManager.allocateFrameDrawingTarget((allocator) => {
      let newResult = this.postProcessing(this.currentFrame, allocator, effects, currentFrame);

      if (this.resultOutputDimension) {
        newResult = new CopyRenderResultRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
          .execute({
            memory: {},
            globals: {},
            textures: { targetTexture: this.currentFrame.texture },
            drawingTarget:  allocator.allocate(this.resultOutputDimension.screenWidth, this.resultOutputDimension.screenHeight, { filtering: { min: TextureFiltering.LINEAR, mag: TextureFiltering.LINEAR } }),
          });
      }

      if (this.drawer.getNumberOfDrawCalls(newResult.texture) % 2 === 1) {
        newResult = new FlipRenderResultsRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
          .execute({
            memory: {},
            globals: {},
            textures: { targetTexture: newResult.texture },
            drawingTarget: allocator.allocate(this.screenWidth, this.screenHeight),
          });
      }

      new DrawingToScreenRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
        .execute({
          memory: {},
          globals: {},
          textures: {targetTexture: newResult.texture},
        });
    });

    this.drawer.endFrame();
    getGLSystem(this.id).resouceManager.endFrame();

    this.drawer.startFrame();
    getGLSystem(this.id).resouceManager.startFrame();
  }

  private postProcessing(frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator, effects: GLEffect[], currentFrame: number): RenderResult {
    let newResult = frame;

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];

      newResult = effect.apply(this.drawer, getGLSystem(this.id).shaderManager, newResult, allocator, currentFrame);
    }

    return newResult;
  }

  private drawToAlphaTexture(drawingTarget: BufferDrawingTarget, image: ImageDescriptor): RenderResult {
    const globals = {
      screenHeight: this.screenHeight,
      transperancyIndex: image.graphicControl?.isTransparent ? image.graphicControl.transparentColorIndex : 512,
      alphaSquarCoord: [image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight] as [number, number, number, number],
    };

    // TODO: maybe it worth to draw it in one shader pass
    const result = new GifAlphaRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
    .execute({
      memory: {},
      globals: globals,
      textures: {gifFrame: this.gifFrameTexture},
      drawingTarget: drawingTarget,
    });

    return result;
  }

  saveDisposalPrev(): void {
    if (this.disposalPrevFrameBuffer) {
      getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer);
    }
    this.disposalPrevFrameBuffer = getGLSystem(this.id).resouceManager.getLastingAllocator().allocate(this.screenWidth, this.screenHeight);

    this.disposalPrevFrame = new CopyRenderResultRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
    .execute({
      memory: {},
      globals: {},
      textures: { targetTexture: this.currentFrame.texture },
      drawingTarget: this.disposalPrevFrameBuffer,
    });
  }

  getCanvasPixels(buffer: ArrayBufferView) {
    if (this.currentFrame) {
      // TODO: remove this.resultOutputDimension, try to use generator and just map texture to whatever you want before read
      if (this.resultOutputDimension) {
            getGLSystem(this.id).resouceManager.allocateFrameDrawingTarget((allocator) => {
              this.gl.viewport(0, 0, this.resultOutputDimension.screenWidth, this.resultOutputDimension.screenHeight);

              let result = new CopyRenderResultRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
              .execute({
                memory: {},
                globals: {},
                textures: { targetTexture: this.currentFrame.texture },
                drawingTarget: allocator.allocate(this.resultOutputDimension.screenWidth, this.resultOutputDimension.screenHeight),
              });

              if (this.drawer.getNumberOfDrawCalls(result.texture) % 2 === 1) {
                result = new FlipRenderResultsRenderPass(this.drawer, getGLSystem(this.id).shaderManager)
                  .execute({
                    memory: {},
                    globals: {},
                    textures: { targetTexture: result.texture },
                    drawingTarget: allocator.allocate(this.resultOutputDimension.screenWidth, this.resultOutputDimension.screenHeight),
                  });
              }

              this.gl.viewport(0, 0, this.screenWidth, this.screenHeight);

              result.readResultToBuffer(buffer, this.gl.RGBA);
            });
      } else {
        this.currentFrame.readResultToBuffer(buffer);
      }
    }
  }

  getPrevCanvasPixels(buffer: ArrayBufferView) {
    if (this.prevFrame) {
      this.prevFrame.readResultToBuffer(buffer);
    }
  }

  dispose(): void {
    // TODO: seems like not everything is disposed. Investigate later
    this.vboToTexture.dispose(this.drawer.getGL());

    this.currentFrame.texture.dispose(this.gl);
    this.disposalPrevFrame.texture.dispose(this.gl);
    this.prevFrame.texture.dispose(this.gl);

    this.gifFrameTexture.dispose(this.gl);
    this.colorTableTexture.dispose(this.gl);

    getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.currentFrameBuffer);
    getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.disposalPrevFrameBuffer);
    getGLSystem(this.id).resouceManager.getLastingAllocator().dispose(this.prevFrameBuffer);

    getGLSystem(this.id).shaderManager.dispose();

    disposeGLSystem(this.id);
  }
}
