import { ColorMap } from 'src/parsing/gif/color_map';
import { ImageDecriptor } from 'src/parsing/gif/image_descriptor';
import { ScreenDescriptor } from 'src/parsing/gif/screen_descriptor';

export interface RenderAlgorithm {
  drawToTexture(gl: WebGL2RenderingContext, screenDescriptor: ScreenDescriptor, image: ImageDecriptor, globalColorMap: ColorMap): void;
  drawToScreen(gl: WebGL2RenderingContext): void;
}
