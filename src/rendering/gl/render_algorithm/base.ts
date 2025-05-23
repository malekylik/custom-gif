import { ColorMap } from '../../../parsing/gif/color_map';
import { ImageDescriptor } from '../../../parsing/gif/image_descriptor';
import { ScreenDescriptor } from '../../../parsing/gif/screen_descriptor';
import { FactoryOut, FactoryResult } from '../../../parsing/lzw/factory/uncompress_factory';
import { GrapgicMemory } from './graphic_memory';
import { RenderAlgorithm } from './render_algorithm';

export class BaseRenderAlgorithm implements RenderAlgorithm {
  private uncompressedData: Uint8Array;
  private lzw_uncompress: FactoryOut;
  private graphicMemory: GrapgicMemory;
  private prevGraphicMemory: GrapgicMemory;
  private ctx: CanvasRenderingContext2D;

  constructor (canvas: HTMLCanvasElement, screenDescriptor: ScreenDescriptor, images: Array<ImageDescriptor>, globalColorMap: ColorMap, uncompressed: FactoryResult) {
    this.ctx = canvas.getContext('2d');

    this.uncompressedData = uncompressed.out;
    this.lzw_uncompress = uncompressed.lzw_uncompress;
    this.graphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
    this.prevGraphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
  }

  drawToTexture(image: ImageDescriptor, globalColorMap: ColorMap): void {
    const graphicControl = image.graphicControl;

    if (graphicControl?.isTransparent) {
      this.updateFrameData89(image, globalColorMap);
    } else {
      this.updateFrameData87(image, globalColorMap);
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

  private updateFrameData87(image: ImageDescriptor, globalColorMap: ColorMap) {
    const graphicMemory = this.graphicMemory;
    const colorMap = image.M ? image.colorMap : globalColorMap;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    this.lzw_uncompress(image);

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;
        x = j + imageLeft;
        y = i + imageTop;

        graphicMemory.setRedInPixel(x, y, colorMap.getRed(this.uncompressedData[offset]));
        graphicMemory.setGreenInPixel(x, y, colorMap.getGreen(this.uncompressedData[offset]));
        graphicMemory.setBlueInPixel(x, y, colorMap.getBlue(this.uncompressedData[offset]));
        graphicMemory.setAlphaInPixel(x, y, 255);
      }
    }
  }

  private updateFrameData89(image: ImageDescriptor, globalColorMap: ColorMap) {
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

    this.lzw_uncompress(image);

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;

        if (!(this.uncompressedData[offset] === graphicControl.transparentColorIndex)) {
          x = j + imageLeft;
          y = i + imageTop;

          graphicMemory.setRedInPixel(x, y, colorMap.getRed(this.uncompressedData[offset]));
          graphicMemory.setGreenInPixel(x, y, colorMap.getGreen(this.uncompressedData[offset]));
          graphicMemory.setBlueInPixel(x, y, colorMap.getBlue(this.uncompressedData[offset]));
          graphicMemory.setAlphaInPixel(x, y, 255);
        }
      }
    }
  }
}
