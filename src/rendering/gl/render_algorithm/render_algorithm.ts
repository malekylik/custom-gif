import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';
import { Effect } from 'src/rendering/api/effect';

export interface RenderAlgorithm {
  drawToTexture(image: ImageDescriptor, globalColorMap: ColorMap): void;
  drawToScreen(effects: Effect[], currentFrame: number): void;
  restorePrevDisposal(): void;
  saveDisposalPrev(): void;
  getCanvasPixels(buffer: ArrayBufferView): void;
  getPrevCanvasPixels(buffer: ArrayBufferView): void;
}
