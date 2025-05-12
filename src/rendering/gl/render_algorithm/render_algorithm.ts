import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';

export interface RenderAlgorithm {
  drawToTexture(image: ImageDescriptor, globalColorMap: ColorMap): void;
  drawToScreen(): void;
  restorePrevDisposal(): void;
  saveDisposalPrev(): void;
  getCanvasPixels(buffer: ArrayBufferView): void;
  getPrevCanvasPixels(buffer: ArrayBufferView): void;
}
