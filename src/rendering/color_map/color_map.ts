import { GIF } from 'src/parsing/gif/parser';
import { GrapgicMemory } from '../base/graphic_memory';

export function renderColorMap(gif: GIF, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  const colorMap = gif.colorMap;
  const screenWidth = colorMap.entriesCount;
  const screenHeight = 5;
  const memory = new GrapgicMemory(screenWidth, screenHeight);

  canvas.width = screenWidth;
  canvas.height = screenHeight;
  canvas.style.width = `${screenWidth}px`;
  canvas.style.height = `${screenHeight}px`;

  for (let i = 0; i < screenWidth; i++) {
    memory.setRedInPixel(i, 0, colorMap.getRed(i));
    memory.setGreenInPixel(i, 0, colorMap.getGreen(i));
    memory.setBlueInPixel(i, 0, colorMap.getBlue(i));
    memory.setAlphaInPixel(i, 0, 255);

    memory.setRedInPixel(i, 1, colorMap.getRed(i));
    memory.setGreenInPixel(i, 1, colorMap.getGreen(i));
    memory.setBlueInPixel(i, 1, colorMap.getBlue(i));
    memory.setAlphaInPixel(i, 1, 255);

    memory.setRedInPixel(i, 2, colorMap.getRed(i));
    memory.setGreenInPixel(i, 2, colorMap.getGreen(i));
    memory.setBlueInPixel(i, 2, colorMap.getBlue(i));
    memory.setAlphaInPixel(i, 2, 255);

    memory.setRedInPixel(i, 3, colorMap.getRed(i));
    memory.setGreenInPixel(i, 3, colorMap.getGreen(i));
    memory.setBlueInPixel(i, 3, colorMap.getBlue(i));
    memory.setAlphaInPixel(i, 3, 255);

    memory.setRedInPixel(i, 4, colorMap.getRed(i));
    memory.setGreenInPixel(i, 4, colorMap.getGreen(i));
    memory.setBlueInPixel(i, 4, colorMap.getBlue(i));
    memory.setAlphaInPixel(i, 4, 255);
  }

  ctx.putImageData(memory.getRawMemory(), 0, 0);
}
