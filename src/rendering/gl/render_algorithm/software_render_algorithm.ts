import { ColorMap } from '../../../parsing/gif/color_map';
import { ImageDescriptor } from '../../../parsing/gif/image_descriptor';
import { ScreenDescriptor } from '../../../parsing/gif/screen_descriptor';
import { IGLTexture } from '../gl_api/texture';
import { GrapgicMemory } from './graphic_memory';
import { RenderAlgorithm } from './render_algorithm';

export class BaseRenderAlgorithm implements RenderAlgorithm {
  private graphicMemory: GrapgicMemory;
  private prevGraphicMemory: GrapgicMemory;
  private ctx: CanvasRenderingContext2D;

  constructor (canvas: HTMLCanvasElement, screenDescriptor: ScreenDescriptor, images: Array<ImageDescriptor>, globalColorMap: ColorMap) {
    this.ctx = canvas.getContext('2d');

    this.graphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
    this.prevGraphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
  }

  drawToTexture(image: ImageDescriptor, globalColorMap: ColorMap, uncompressedData: Uint8Array): void {
    const graphicControl = image.graphicControl;

    if (graphicControl?.isTransparent) {
      this.updateFrameData89(image, globalColorMap, uncompressedData);
    } else {
      this.updateFrameData87(image, globalColorMap, uncompressedData);
    }
  }

  drawToScreen(): void {
    const graphicMemory = this.graphicMemory;

    this.ctx.putImageData(graphicMemory.getRawMemory(), 0, 0);
  }

  restorePrevDisposal(): void {
    this.graphicMemory.set(this.prevGraphicMemory);
  }

  saveDisposalPrev(): void {
    this.prevGraphicMemory.set(this.graphicMemory);
  }

  getCanvasPixels( buffer: ArrayBufferView): void {
    new Uint8ClampedArray(buffer.buffer).set(this.graphicMemory.getRawMemory().data);
  }

  getPrevCanvasPixels(buffer: ArrayBufferView): void {
    new Uint8ClampedArray(buffer.buffer).set(this.prevGraphicMemory.getRawMemory().data);
  }

  dispose(): void {
  }

  getCurrentTexture(): IGLTexture {
    // TODO: fix
    throw new Error('Method not implemented.');
  }

  private updateFrameData87(image: ImageDescriptor, globalColorMap: ColorMap, uncompressedData: Uint8Array): void {
    const graphicMemory = this.graphicMemory;
    const colorMap = image.M ? image.colorMap : globalColorMap;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;
        x = j + imageLeft;
        y = i + imageTop;

        graphicMemory.setRedInPixel(x, y, colorMap.getRed(uncompressedData[offset]));
        graphicMemory.setGreenInPixel(x, y, colorMap.getGreen(uncompressedData[offset]));
        graphicMemory.setBlueInPixel(x, y, colorMap.getBlue(uncompressedData[offset]));
        graphicMemory.setAlphaInPixel(x, y, 255);
      }
    }
  }

  private updateFrameData89(image: ImageDescriptor, globalColorMap: ColorMap, uncompressedData: Uint8Array): void {
    const graphicMemory = this.graphicMemory;
    const colorMap = image.M ? image.colorMap : globalColorMap;
    const graphicControl = image.graphicControl;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;

        if (!(uncompressedData[offset] === graphicControl.transparentColorIndex)) {
          x = j + imageLeft;
          y = i + imageTop;

          graphicMemory.setRedInPixel(x, y, colorMap.getRed(uncompressedData[offset]));
          graphicMemory.setGreenInPixel(x, y, colorMap.getGreen(uncompressedData[offset]));
          graphicMemory.setBlueInPixel(x, y, colorMap.getBlue(uncompressedData[offset]));
          graphicMemory.setAlphaInPixel(x, y, 255);
        }
      }
    }
  }
}
