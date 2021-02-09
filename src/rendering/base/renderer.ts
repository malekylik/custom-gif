import { parseGif } from '../../parsing/gif';
import { lzw_uncompress } from '../../parsing/lzw/uncompress';

export class Rendered {
  private gifBuffer: ArrayBuffer;
  private canvas: HTMLCanvasElement;
  private currentFrame: number;
  private gif;
  private ctx: CanvasRenderingContext2D;
  private graphicMemory: ImageData;
  private uncompressedData: Uint8Array;
  private loopId: number;
  private frameRate: number;

  constructor(gif: ArrayBuffer, canvas: HTMLCanvasElement) {
    this.gifBuffer = gif;
    this.gif = parseGif(gif);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentFrame = 0;
    this.graphicMemory = new ImageData(this.gif.screenDescriptor.screenWidth, this.gif.screenDescriptor.screenHeight);
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
    const imageWidth = this.gif.screenDescriptor.screenWidth;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let screenOffset = 0;
    let offset = 0;

    lzw_uncompress(image.compressedData, this.uncompressedData);

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;
        screenOffset = ((i + imageTop) * imageWidth + (j + imageLeft)) * 4;

        graphicMemory.data[screenOffset + 0] = colorMap.getRed(this.uncompressedData[offset]);
        graphicMemory.data[screenOffset + 1] = colorMap.getGreen(this.uncompressedData[offset]);
        graphicMemory.data[screenOffset + 2] = colorMap.getBlue(this.uncompressedData[offset]);
        graphicMemory.data[screenOffset + 3] = 255;
      }
    }
  }

  private updateFrameData89() {
    const frame = this.currentFrame;
    const graphicMemory = this.graphicMemory;
    const image = this.gif.images[frame];
    const colorMap = image.M ? image.colorMap : this.gif.colorMap;
    const graphicControl = image.graphicControl;
    const imageWidth = this.gif.screenDescriptor.screenWidth;
    const imageLeft = image.imageLeft;
    const imageTop = image.imageTop;
    const localImageHeight = image.imageHeight;
    const localImageWidth = image.imageWidth;
    let offset = 0;

    lzw_uncompress(image.compressedData, this.uncompressedData);

    for (let i = 0; i < localImageHeight; i++) {
      for (let j = 0; j < localImageWidth; j++) {
        offset = i * localImageWidth + j;

        if (!(this.uncompressedData[offset] === graphicControl.transparentColorIndex)) {
          const screenOffset = ((i + imageTop) * imageWidth + (j + imageLeft)) * 4;

          graphicMemory.data[screenOffset + 0] = colorMap.getRed(this.uncompressedData[offset]);
          graphicMemory.data[screenOffset + 1] = colorMap.getGreen(this.uncompressedData[offset]);
          graphicMemory.data[screenOffset + 2] = colorMap.getBlue(this.uncompressedData[offset]);
          graphicMemory.data[screenOffset + 3] = 255;
        }
      }
    }
  }

  private drawFrame() {
    const graphicMemory = this.graphicMemory;

    this.ctx.putImageData(graphicMemory, 0, 0);
  }
}
