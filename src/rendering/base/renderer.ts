import { GIF } from 'src/parsing/gif/parser';
import { lzw_uncompress } from '../../parsing/lzw/uncompress';
import { GrapgicMemory } from './graphic_memory';
import { Timer } from './timer';

export class Rendered {
  private canvas: HTMLCanvasElement;
  private currentFrame: number;
  private gif: GIF;
  private ctx: CanvasRenderingContext2D;
  private graphicMemory: GrapgicMemory;
  private uncompressedData: Uint8Array;
  private timer: Timer;
  private frameRate: number;

  constructor(gif: GIF, canvas: HTMLCanvasElement) {
    this.gif = gif;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentFrame = 0;
    this.graphicMemory = new GrapgicMemory(this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight);
    this.uncompressedData = new Uint8Array(this.gif.screenDescriptor.screenWidth * this.gif.screenDescriptor.screenHeight);
    this.timer = new Timer();
    this.frameRate = 1 / 25 * 1000;

    canvas.width = this.gif.screenDescriptor.screenWidth;
    canvas.height = this.gif.screenDescriptor.screenHeight;
    canvas.style.width = `${this.gif.screenDescriptor.screenWidth}px`;
    canvas.style.height = `${this.gif.screenDescriptor.screenHeight}px`;

    if (this.gif.images.length) {
      this.timer.once(() => {
        this.updateFrameData();
        this.drawFrame();
      });
    }
  }

  setFrame(frame: number): void {
    if (frame > -1 && frame < this.gif.images.length) {

      if (frame !== this.currentFrame) {
        this.timer.clear();

        this.timer.once(() => {
          for (let i = 0; i <= frame; i++) {
            this.updateFrameData(i);
          }

          this.currentFrame = frame;
          this.drawFrame();
        });
      }
    }
  }

  autoplayStart(): boolean {
    if (this.gif.images.length > 1) {
      const callback = () => {
        const nextFrame = (this.currentFrame + 1) % this.gif.images.length;

        this.timer.once(callback, this.gif.images[nextFrame].graphicControl?.delayTime || this.frameRate) as unknown as number;

        this.currentFrame = nextFrame;
        this.updateFrameData(13);
        this.drawFrame();
      };

      this.timer.once(callback, this.gif.images[this.currentFrame].graphicControl?.delayTime || this.frameRate) as unknown as number;

      return true;
    } else {
      return false;
    }
  }

  autoplayEnd(): void {
    this.timer.clear();
  }

  update(): void {
    this.updateFrameData();
    this.drawFrame();
  }

  private updateFrameData(frame = this.currentFrame): void {
    const image = this.gif.images[frame];
    const graphicControl = image.graphicControl;

    if (graphicControl?.isTransparent) {
      this.updateFrameData89(frame);
    } else {
      this.updateFrameData87(frame);
    }
  }

  private updateFrameData87(frame = this.currentFrame) {
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

  private updateFrameData89(frame = this.currentFrame) {
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
