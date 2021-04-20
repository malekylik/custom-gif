import { GIF } from 'src/parsing/gif/parser';
import { FactoryResult } from 'src/parsing/lzw/factory/uncompress_factory';
import { Timer } from '../timer';
import { Renderer } from '../renderer';
import { BaseRenderAlgorithm } from './render_algorithm/base';
import { GLRenderAlgorithm } from './render_algorithm/gl';
import { RenderAlgorithm } from './render_algorithm/render_algorithm';
import { DisposalMethod } from '../../parsing/gif/graphic_control';

const FPS = 1 / 25 * 1000;

export interface RendererOptions {
  uncompress: FactoryResult;
}

export class GLRenderer implements Renderer {
  private gif: GIF;
  private ctx: WebGL2RenderingContext | CanvasRenderingContext2D;
  private currentFrame: number;
  private timer: Timer;
  private algorithm: RenderAlgorithm;

  constructor(gif: GIF, canvas: HTMLCanvasElement, options: RendererOptions) {
    this.gif = gif;
    this.currentFrame = 0;
    this.ctx = canvas.getContext('webgl2');
    // this.ctx = canvas.getContext('2d');
    this.timer = new Timer();
    this.algorithm = new GLRenderAlgorithm(this.ctx, this.gif.screenDescriptor, this.gif.images, this.gif.colorMap, options.uncompress);
    // this.algorithm = new BaseRenderAlgorithm(this.ctx, this.gif.screenDescriptor, this.gif.images, this.gif.colorMap, options.uncompress);
    const { screenWidth, screenHeight } = this.gif.screenDescriptor;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;

    if (this.gif.images.length) {
      this.timer.once(() => {
        this.drawFrame();
      });
    }
  }

  setFrame(frame: number): Promise<void> {
    return new Promise((resolve) => {
      if (frame > -1 && frame < this.gif.images.length) {
        if (frame !== this.currentFrame) {
          this.timer.clear();

          this.timer.once(() => {
            for (let i = 0; i < frame; i++) {
              this.drawToTexture(i);
              this.performeDisposalMethod(i);
            }

            this.currentFrame = frame;
            this.drawFrame();
            resolve();
          });
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  autoplayStart(): boolean {
    if (this.gif.images.length > 1) {
      const callback = () => {
        const nextFrame = (this.currentFrame + 1) % this.gif.images.length;

        this.timer.once(callback, this.gif.images[nextFrame].graphicControl?.delayTime || FPS) as unknown as number;

        this.currentFrame = nextFrame;
        this.drawFrame();
      };

      this.timer.once(callback, this.gif.images[this.currentFrame].graphicControl?.delayTime || FPS) as unknown as number;

      return true;
    } else {
      return false;
    }
  }

  autoplayEnd(): void {
    this.timer.clear();
  }

  private drawToTexture(frame = this.currentFrame): void {
    const image = this.gif.images[frame];

    console.log('frame = ', frame);

    this.algorithm.drawToTexture(this.ctx, image, this.gif.colorMap);

    // TODO: add support of DisposalMethod.clear
    if (image.graphicControl?.disposalMethod !== DisposalMethod.prev) {
      this.algorithm.savePrevFrame(this.ctx);
    }
  }

  getCanvasPixel(buffer: ArrayBufferView) {
    return this.algorithm.getCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  }

  getPrevCanvasPixel(buffer: ArrayBufferView) {
    return this.algorithm.getPrevCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  }

  private drawToScreen(): void {
    this.algorithm.drawToScreen(this.ctx);
  }

  private drawFrame(frame = this.currentFrame): void {
    this.drawToTexture(frame);

    this.drawToScreen();

    this.performeDisposalMethod(frame);
  }

  private performeDisposalMethod(frame = this.currentFrame): void {
    const image = this.gif.images[frame];

    if (image.graphicControl?.disposalMethod === DisposalMethod.prev) {
      this.algorithm.drawPrevToTexture(this.ctx);
    }
  }
}
