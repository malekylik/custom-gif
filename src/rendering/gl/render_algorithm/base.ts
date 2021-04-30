import { ColorMap } from '../../../parsing/gif/color_map';
import { ImageDecriptor } from '../../../parsing/gif/image_descriptor';
import { ScreenDescriptor } from '../../../parsing/gif/screen_descriptor';
import { FactoryOut, FactoryResult } from '../../../parsing/lzw/factory/uncompress_factory';
import { GrapgicMemory } from './graphic_memory';
import { RenderAlgorithm } from './render_algorithm';
import { WorkingPool } from 'utils/thread-pool/thread-pool';

export class BaseRenderAlgorithm implements RenderAlgorithm {
  private graphicMemory: GrapgicMemory;
  private prevGraphicMemory: GrapgicMemory;

  constructor (ctx: CanvasRenderingContext2D, screenDescriptor: ScreenDescriptor, images: Array<ImageDecriptor>, globalColorMap: ColorMap) {
    this.graphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
    this.prevGraphicMemory = new GrapgicMemory(screenDescriptor.screenWidth, screenDescriptor.screenHeight);
  }

  async drawToTexture(ctx: CanvasRenderingContext2D, image: ImageDecriptor, globalColorMap: ColorMap, gifId: string): Promise<void> {
    const graphicControl = image.graphicControl;

    if (graphicControl?.isTransparent) {
      await this.updateFrameData89(image, globalColorMap, gifId);
    } else {
      await this.updateFrameData87(image, globalColorMap, gifId);
    }
  }

  drawToScreen(ctx: CanvasRenderingContext2D): void {
    const graphicMemory = this.graphicMemory;

    ctx.putImageData(graphicMemory.getRawMemory(), 0, 0);
  }

  drawPrevToTexture(ctx: CanvasRenderingContext2D): void {
    this.graphicMemory.set(this.prevGraphicMemory);
  }

  savePrevFrame(ctx: CanvasRenderingContext2D): void {
    this.prevGraphicMemory.set(this.graphicMemory);
  }

  getCanvasPixels(ctx: CanvasRenderingContext2D, screen: ScreenDescriptor, buffer: ArrayBufferView): void {
    new Uint8ClampedArray(buffer.buffer).set(this.graphicMemory.getRawMemory().data);
  }

  getPrevCanvasPixels(ctx: CanvasRenderingContext2D, screen: ScreenDescriptor, buffer: ArrayBufferView): void {
    new Uint8ClampedArray(buffer.buffer).set(this.prevGraphicMemory.getRawMemory().data);
  }

  private async updateFrameData87(image: ImageDecriptor, globalColorMap: ColorMap, gifId: string) {
    const graphicMemory = this.graphicMemory;
    const colorMap = image.M ? image.colorMap : globalColorMap;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    const uncompressedData = new Uint8Array(await WorkingPool.doWork(gifId, image.startPointer, image.compressedData.length));

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

  private async updateFrameData89(image: ImageDecriptor, globalColorMap: ColorMap, gifId: string) {
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

    const uncompressedData = new Uint8Array(await WorkingPool.doWork(gifId, image.startPointer, image.compressedData.length));

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
