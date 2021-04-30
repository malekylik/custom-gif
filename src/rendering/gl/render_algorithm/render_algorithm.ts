import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';

export interface RenderAlgorithm {
  drawToTexture(gl: CanvasRenderingContext2D | WebGL2RenderingContext, image: ImageDecriptor, globalColorMap: ColorMap, gifId: string): Promise<void>;
  drawToScreen(gl: CanvasRenderingContext2D | WebGL2RenderingContext): void;
  drawPrevToTexture(gl: CanvasRenderingContext2D | WebGL2RenderingContext): void;
  savePrevFrame(gl: CanvasRenderingContext2D | WebGL2RenderingContext): void;
  getCanvasPixels(gl: CanvasRenderingContext2D | WebGL2RenderingContext, screen: ScreenDescriptor, buffer: ArrayBufferView): void;
  getPrevCanvasPixels(gl: CanvasRenderingContext2D | WebGL2RenderingContext, screen: ScreenDescriptor, buffer: ArrayBufferView): void;
}
