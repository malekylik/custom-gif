import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';

export interface RenderAlgorithm {
  drawToTexture(gl: CanvasRenderingContext2D | WebGL2RenderingContext, image: ImageDecriptor, globalColorMap: ColorMap): void;
  drawToScreen(gl: CanvasRenderingContext2D | WebGL2RenderingContext): void;
}
