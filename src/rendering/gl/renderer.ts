import { GIF } from 'src/parsing/gif/parser';
import { FactoryResult } from 'src/parsing/lzw/factory/uncompress_factory';
import { Timer } from '../timer';
import { Renderer, RendererGifDescriptor } from '../renderer';
import { BaseRenderAlgorithm } from './render_algorithm/base';
import { GLRenderAlgorithm } from './render_algorithm/gl';
import { RenderAlgorithm } from './render_algorithm/render_algorithm';
import { DisposalMethod } from '../../parsing/gif/graphic_control';
import { GifEntity } from 'src/parsing/new_gif/gif_entity';

type RendererEntity = {
  gifEntity: GifEntity;
  currentFrame: number;
  timer: Timer;
  algorithm: RenderAlgorithm;
  canvas: HTMLCanvasElement;
};

const FPS = 1 / 25 * 1000;

export interface RendererOptions {
  uncompress: FactoryResult;
  algorithm: 'GL' | 'Software'
}

export class BasicRenderer implements Renderer {
  private gifs: RendererEntity[];

  constructor() {
    this.gifs = [];
  }

  addGifToRender(gifEntity: GifEntity, canvas: HTMLCanvasElement, options: RendererOptions): Promise<RendererGifDescriptor> {
    const descriptop: RendererGifDescriptor = {
      id: this.gifs.length
    };
    const gif: RendererEntity = {
      gifEntity,
      currentFrame: -1,
      algorithm: options.algorithm === 'GL' ?
        new GLRenderAlgorithm(canvas, gifEntity.gif.screenDescriptor, gifEntity.gif.images, gifEntity.gif.colorMap, options.uncompress) :
        new BaseRenderAlgorithm(canvas, gifEntity.gif.screenDescriptor, gifEntity.gif.images, gifEntity.gif.colorMap, options.uncompress),
      timer: new Timer,
      canvas,
    };

    const { screenWidth, screenHeight } = gif.gifEntity.gif.screenDescriptor;

    gif.canvas.width = screenWidth;
    gif.canvas.height = screenHeight;
    gif.canvas.style.width = `${screenWidth}px`;
    gif.canvas.style.height = `${screenHeight}px`;

    this.gifs.push(gif);

    if (gif.gifEntity.gif.images.length) {
      return new Promise(resolve => gif.timer.once(() => {
        this.setFrame(descriptop, 0)
          .then(() => resolve(descriptop));
      }));
    }

    return Promise.resolve(descriptop);
  }

  setFrame(descriptor: RendererGifDescriptor, frame: number): Promise<void> {
    const gif = this.gifs[descriptor.id];

    return new Promise((resolve) => {
      if (frame > -1 && frame < gif.gifEntity.gif.images.length) {
        if (frame !== gif.currentFrame) {
          gif.timer.clear();

          gif.timer.once(() => {
            for (let i = 0; i < frame; i++) {
              this.drawToTexture(gif, i);
              this.performeDisposalMethod(gif, i);
            }

            gif.currentFrame = frame;
            this._drawFrame(gif, gif.currentFrame);
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

  autoplayStart(descriptor: RendererGifDescriptor): boolean {
    const gif = this.gifs[descriptor.id];

    if (gif.gifEntity.gif.images.length > 1) {
      const callback = () => {
        const nextFrame = (gif.currentFrame + 1) % gif.gifEntity.gif.images.length;

        gif.timer.once(callback, gif.gifEntity.gif.images[nextFrame].graphicControl?.delayTime || FPS) as unknown as number;

        gif.currentFrame = nextFrame;
        this._drawFrame(gif, gif.currentFrame);
      };

      gif.timer.once(callback, gif.gifEntity.gif.images[gif.currentFrame].graphicControl?.delayTime || FPS) as unknown as number;

      return true;
    } else {
      return false;
    }
  }

  autoplayEnd(descriptor: RendererGifDescriptor): void {
    const gif = this.gifs[descriptor.id];

    gif.timer.clear();
  }

  private drawToTexture(gif: RendererEntity, frame: number): void {
    const image = gif.gifEntity.gif.images[frame];

    console.log('frame = ', frame);

    gif.algorithm.drawToTexture(image, gif.gifEntity.gif.colorMap);

    // TODO: add support of DisposalMethod.clear
    if (image.graphicControl?.disposalMethod !== DisposalMethod.prev) {
      gif.algorithm.savePrevFrame();
    }
  }

  // TODO: fix later
  // getCanvasPixel(buffer: ArrayBufferView) {
  //   return this.algorithm.getCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  // }

  // getPrevCanvasPixel(buffer: ArrayBufferView) {
  //   return this.algorithm.getPrevCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  // }

  private drawToScreen(gif: RendererEntity): void {
    gif.algorithm.drawToScreen();
  }

  private _drawFrame(gif: RendererEntity, frame: number): void {
    this.drawToTexture(gif, frame);

    this.drawToScreen(gif);

    this.performeDisposalMethod(gif, frame);
  }

  private performeDisposalMethod(gif: RendererEntity, frame: number): void {
    const image = gif.gifEntity.gif.images[frame];

    if (image.graphicControl?.disposalMethod === DisposalMethod.prev) {
      gif.algorithm.drawPrevToTexture();
    }
  }
}
