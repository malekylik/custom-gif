import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';

export interface RenderAlgorithm {
  drawToTexture(image: ImageDecriptor, globalColorMap: ColorMap): void;
  drawToScreen(): void;
  restorePrevDisposal(): void;
  saveDisposalPrev(): void;
  getCanvasPixels(screen: ScreenDescriptor, buffer: ArrayBufferView): void;
  getPrevCanvasPixels(screen: ScreenDescriptor, buffer: ArrayBufferView): void;
}
