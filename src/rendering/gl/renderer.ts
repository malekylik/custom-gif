import { GIF } from 'src/parsing/gif/parser';
import { Timer } from '../base/timer';
import { Renderer } from '../renderer';
import { GLRenderAlgorithm } from './render_algorithm/gl';
import { RenderAlgorithm } from './render_algorithm/render_algorithm';

const FPS = 1 / 25 * 1000;

export class GLRenderer implements Renderer {
  private gif: GIF;
  private ctx: WebGL2RenderingContext;
  private currentFrame: number;
  private timer: Timer;
  private algorithm: RenderAlgorithm;

  constructor(gif: GIF, canvas: HTMLCanvasElement) {
    this.gif = gif;
    this.currentFrame = 0;
    this.ctx = canvas.getContext('webgl2');
    this.timer = new Timer();
    this.algorithm = new GLRenderAlgorithm(this.ctx, this.gif.screenDescriptor, this.gif.images[0], this.gif.colorMap);
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

  setFrame(frame: number): void {
    if (frame > -1 && frame < this.gif.images.length) {
      this.currentFrame = frame;

      for (let i = 0; i < frame; i++) {
        this.drawFrame(i);
      }

      this.drawFrame();
    }
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
    this.algorithm.drawToTexture(this.ctx, this.gif.screenDescriptor, image, this.gif.colorMap);
  }

  private drawToScreen(): void {
    this.algorithm.drawToScreen(this.ctx);
  }

  private drawFrame(frame = this.currentFrame): void {
    this.drawToTexture(frame);
    this.drawToScreen();
  }
}
