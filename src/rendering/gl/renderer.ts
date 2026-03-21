import { Timer } from '../timer';
import { Renderer, RendererGifDescriptor } from '../renderer';
import { BaseRenderAlgorithm } from './render_algorithm/software_render_algorithm';
import { GLRenderAlgorithm } from './render_algorithm/gl_render_algorithm';
import { RenderAlgorithm } from './render_algorithm/render_algorithm';
import { DisposalMethod } from '../../parsing/gif/graphic_control';
import { GifEntity } from 'src/parsing/new_gif/gif_entity';
import { Effect } from '../api/effect';
import { LZWThread } from 'src/parallel_computation/main/lzw_facade';

type RendererEntity = {
  gifEntity: GifEntity;
  currentFrame: number;
  timer: Timer;
  algorithm: RenderAlgorithm;
  canvas: HTMLCanvasElement;
  effects: Effect[];
};

const FPS = 1 / 25 * 1000;

export interface RendererOptions {
  algorithm: 'GL' | 'Software';
  thread: LZWThread,
}

type FrameSubsription = (r: { frameNumber: number; totalFrameNumber: number; gifDescription: RendererGifDescriptor }) => void;
type EffectSubsription = (r: { effect: Effect; effects: Effect[]; from: number, to: number; gifDescription: RendererGifDescriptor }) => void;

export class BasicRenderer implements Renderer {
  private gifs: RendererEntity[];
  private frameSubsriptions: FrameSubsription[];
  private effectSubsriptions: EffectSubsription[];

  constructor() {
    this.gifs = [];
    this.frameSubsriptions = [];
    this.effectSubsriptions = [];
  }

  addGifToRender(gifEntity: GifEntity, canvas: HTMLCanvasElement, options: RendererOptions): Promise<RendererGifDescriptor> {
    const descriptop: RendererGifDescriptor = {
      id: this.gifs.length
    };
    const gif: RendererEntity = {
      gifEntity,
      currentFrame: -1,
      algorithm: options.algorithm === 'GL' ?
        new GLRenderAlgorithm(canvas, gifEntity.gif.screenDescriptor, gifEntity.gif.images, gifEntity.gif.colorMap, gifEntity.gif, options.thread) :
        new BaseRenderAlgorithm(canvas, gifEntity.gif.screenDescriptor, gifEntity.gif.images, gifEntity.gif.colorMap, gifEntity.gif),
      timer: new Timer,
      canvas,
      effects: [],
    };

    const { screenWidth, screenHeight } = gif.gifEntity.gif.screenDescriptor;

    gif.canvas.width = screenWidth;
    gif.canvas.height = screenHeight;
    // For offset canvas
    if (gif.canvas.style) {
      gif.canvas.style.width = `${screenWidth}px`;
      gif.canvas.style.height = `${screenHeight}px`;
    }

    this.gifs.push(gif);

    if (gif.gifEntity.gif.images.length) {
      return new Promise(resolve => gif.timer.once(() => {
        this.setFrame(descriptop, 0)
          .then(() => resolve(descriptop));
      }));
    }

    return Promise.resolve(descriptop);
  }

  addEffectToGif(descriptor: RendererGifDescriptor, from: number, to: number, effectFactory: (data: {
                screenWidth: number;
                screenHeight: number;
                from: number;
                to: number;
              }) => Effect) {
    // assert
    if (from > to) {
      console.warn('from cannot be greater than to', from, to);
    }

    const gif = this.gifs[descriptor.id];

    if (from < 0) {
      console.warn('from should be greater than 0', from);
    }

    if (to >= gif.gifEntity.gif.images.length) {
      console.warn('to should be less than number of gif frames', to, gif.gifEntity.gif.images.length);
    }

    const effect = effectFactory({
      screenWidth: gif.gifEntity.gif.screenDescriptor.screenWidth,
      screenHeight: gif.gifEntity.gif.screenDescriptor.screenHeight,
      from: from,
      to: to,
    });

    gif.effects.push(effect);

    this.notifyEffectSubscribers(descriptor, effect, from, to);
  }

  removeEffectFromGif(descriptor: RendererGifDescriptor, effect: Effect) {
    const gif = this.gifs[descriptor.id];
    gif.effects = gif.effects.filter(e => e !== effect);

    this.notifyEffectSubscribers(descriptor, effect, effect.getFrom(), effect.getTo());
  }

  setFrame(descriptor: RendererGifDescriptor, frame: number): Promise<void> {
    const gif = this.gifs[descriptor.id];

    return new Promise((resolve) => {
      if (frame > -1 && frame < gif.gifEntity.gif.images.length) {
          gif.timer.clear();

          gif.timer.once(async () => {
            const from = Math.max(0, frame < gif.currentFrame ? 0 : gif.currentFrame);
            const to = frame

            for (let i = from; i < to; i++) {
              await this.drawToTexture(gif, i);
              this.performeDisposalMethod(gif, i);
            }

            gif.currentFrame = frame;
            await this._drawFrame(gif, gif.currentFrame);

            resolve();

            this.notifyFrameSubscribers(descriptor);
          });
      } else {
        resolve();
      }
    });
  }

  setFrameSilent(descriptor: RendererGifDescriptor, frame: number): Promise<void> {
    const gif = this.gifs[descriptor.id];

    return new Promise((resolve) => {
      if (frame > -1 && frame < gif.gifEntity.gif.images.length) {
          gif.timer.clear();

          gif.timer.once(async () => {
            const from = Math.max(0, frame < gif.currentFrame ? 0 : gif.currentFrame);
            const to = frame

            for (let i = from; i < to; i++) {
              await this.drawToTexture(gif, i);
              this.performeDisposalMethod(gif, i);
            }

            gif.currentFrame = frame;
            await this._drawFrameSilent(gif, gif.currentFrame);

            resolve();

            this.notifyFrameSubscribers(descriptor);
          });
      } else {
        resolve();
      }
    });
  }

  autoplayStart(descriptor: RendererGifDescriptor): boolean {
    const gif = this.gifs[descriptor.id];

    if (gif.gifEntity.gif.images.length > 1) {
      const callback = async () => {
        const nextFrame = (gif.currentFrame + 1) % gif.gifEntity.gif.images.length;

        gif.timer.once(callback, gif.gifEntity.gif.images[nextFrame].graphicControl?.delayTime || FPS) as unknown as number;

        gif.currentFrame = nextFrame;
        await this._drawFrame(gif, gif.currentFrame);

        this.notifyFrameSubscribers(descriptor);
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

  onFrameRender(descriptor: RendererGifDescriptor, callback: FrameSubsription): { clear: () => void } {
    this.frameSubsriptions.push((data) => {
      if (data.gifDescription.id === descriptor.id) {
        callback(data);
      }
    });

    return {
      clear: () => {
        this.frameSubsriptions = this.frameSubsriptions.filter(c => c !== callback);
      }
    }
  }

  onEffectAdded(descriptor: RendererGifDescriptor, callback: EffectSubsription): { clear: () => void } {
    this.effectSubsriptions.push((data) => {
      if (data.gifDescription.id === descriptor.id) {
        callback(data);
      }
    });

    return {
      clear: () => {
        this.effectSubsriptions = this.effectSubsriptions.filter(c => c !== callback);
      }
    }
  }

  getCurrentFrame(descriptor: RendererGifDescriptor): number {
    const gif = this.gifs[descriptor.id];

    return gif.currentFrame;
  }

  dispose(): void {
    this.gifs.forEach((gif) => {
      gif.timer.clear();
      gif.algorithm.dispose();
    });
  }


  getGif(descriptor: RendererGifDescriptor): GifEntity {
    return this.gifs[descriptor.id].gifEntity;
  }

  public readCurrentFrame(descriptor: RendererGifDescriptor, buffer: ArrayBufferView<ArrayBufferLike>): void {
    const gif = this.gifs[descriptor.id];
    gif.algorithm.getCanvasPixels(buffer);
  }

  public getCurrentTexture(descriptor: RendererGifDescriptor) {
    const gif = this.gifs[descriptor.id];
    return gif.algorithm.getCurrentTexture();
  }

  private async drawToTexture(gif: RendererEntity, frame: number): Promise<void> {
    const image = gif.gifEntity.gif.images[frame];

    // render current
    await gif.algorithm.drawToTexture(image, gif.gifEntity.gif.colorMap);

    // TODO: add support of DisposalMethod.clear
    if (image.graphicControl?.disposalMethod !== DisposalMethod.prev) {
      gif.algorithm.saveDisposalPrev();
    }
  }

  private notifyFrameSubscribers(descriptor: RendererGifDescriptor) {
    const gif = this.gifs[descriptor.id];

    this.frameSubsriptions.forEach(c => {
      c({ gifDescription: descriptor, frameNumber: gif.currentFrame, totalFrameNumber: gif.gifEntity.gif.images.length });
    });
  }

  private notifyEffectSubscribers(descriptor: RendererGifDescriptor, effect: Effect, from: number, to: number) {
    const gif = this.gifs[descriptor.id];

    this.effectSubsriptions.forEach(c => {
      c({ gifDescription: descriptor, effect, effects: gif.effects, from: from, to: to });
    });
  }

  // TODO: fix later
  // getCanvasPixel(buffer: ArrayBufferView) {
  //   return this.algorithm.getCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  // }

  // getPrevCanvasPixel(buffer: ArrayBufferView) {
  //   return this.algorithm.getPrevCanvasPixels(this.ctx as unknown as WebGL2RenderingContext, this.gif.screenDescriptor, buffer);
  // }

  private drawToScreen(gif: RendererEntity): void {
    const effects = gif.effects.filter(effect => effect.shouldBeApplied(gif.currentFrame));

    gif.algorithm.drawToScreen(effects, gif.currentFrame);
  }

  private async _drawFrame(gif: RendererEntity, frame: number): Promise<void> {
    await this.drawToTexture(gif, frame);

    this.drawToScreen(gif);

    this.performeDisposalMethod(gif, frame);
  }

    private async _drawFrameSilent(gif: RendererEntity, frame: number): Promise<void> {
    await this.drawToTexture(gif, frame);

    this.performeDisposalMethod(gif, frame);
  }

  private performeDisposalMethod(gif: RendererEntity, frame: number): void {
    const image = gif.gifEntity.gif.images[frame];

    if (image.graphicControl?.disposalMethod === DisposalMethod.prev) {
      gif.algorithm.restorePrevDisposal();
    }
  }
}
