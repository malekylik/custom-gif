import { parseGif } from '../../parsing/gif';
import { lzw_uncompress } from '../../parsing/lzw/uncompress';
import { GrapgicMemory } from './graphic_memory';

export class Rendered {
  private gifBuffer: ArrayBuffer;
  private canvas: HTMLCanvasElement;
  private currentFrame: number;
  private gif;
  private ctx: CanvasRenderingContext2D;
  private graphicMemory: GrapgicMemory;
  private uncompressedData: Uint8Array;
  private loopId: number;
  private frameRate: number;

  constructor(gif: ArrayBuffer, canvas: HTMLCanvasElement) {
    this.gifBuffer = gif;
    this.gif = parseGif(gif);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentFrame = 0;
    this.graphicMemory = new GrapgicMemory(this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight);
    this.uncompressedData = new Uint8Array(this.gif.screenDescriptor.screenWidth * this.gif.screenDescriptor.screenHeight);
    this.loopId = 0;
    this.frameRate = 1 / 25 * 1000;

    canvas.width = this.gif.screenDescriptor.screenWidth;
    canvas.height = this.gif.screenDescriptor.screenHeight;
    canvas.style.width = `${this.gif.screenDescriptor.screenWidth}px`;
    canvas.style.height = `${this.gif.screenDescriptor.screenHeight}px`;

    if (this.gif.images.length) {
      setTimeout(() => {
        this.updateFrameData();
        this.drawFrame();
      });
    }
  }

  setFrame(frame: number): void {
    if (frame > -1 && frame < this.gif.images.length) {
      this.currentFrame = frame;
    }
  }

  autoplayStart(): boolean {
    if (this.gif.images.length > 1) {
      const callback = () => {
        const nextFrame = (this.currentFrame + 1) % this.gif.images.length;

        this.loopId = setTimeout(callback, this.gif.images[nextFrame].graphicControl?.delayTime || this.frameRate) as unknown as number;

        this.currentFrame = nextFrame;
        this.updateFrameData();
        this.drawFrame();
      };

      this.loopId = setTimeout(callback, this.gif.images[this.currentFrame].graphicControl?.delayTime || this.frameRate) as unknown as number;

      return true;
    } else {
      return false;
    }
  }

  autoplayEnd(): void {
    clearTimeout(this.loopId);
  }

  update(): void {
    this.updateFrameData();
    this.drawFrame();
  }

  private updateFrameData(): void {
    const frame = this.currentFrame;
    const image = this.gif.images[frame];
    const graphicControl = image.graphicControl;

    if (graphicControl?.isTransparent) {
      this.updateFrameData89();
    } else {
      this.updateFrameData87();
    }
  }

  private updateFrameData87() {
    const frame = this.currentFrame;
    const graphicMemory = this.graphicMemory;
    const image = this.gif.images[frame];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    lzw_uncompress(image.compressedData, this.uncompressedData);

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

  private updateFrameData89() {
    const frame = this.currentFrame;
    const graphicMemory = this.graphicMemory;
    const image = this.gif.images[frame];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;
    const graphicControl = image.graphicControl;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let x = 0;
    let y = 0;
    let offset = 0;

    lzw_uncompress(image.compressedData, this.uncompressedData);

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

  private drawFrame() {
    const graphicMemory = this.graphicMemory;

    this.ctx.putImageData(graphicMemory.getRawMemory(), 0, 0);
  }
}
