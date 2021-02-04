import { ColorMapBlock } from './consts';

export function parseColorMap(buffer: ArrayBuffer, bitsPerPixel: number) {
  const HEAP8 = new Uint8Array(buffer);

  return {
    entriesCount: 1 << bitsPerPixel,

    getRed(index: number): number {
      return HEAP8[ColorMapBlock.start + (index * 3 + 0)];
    },

    getGreen(index: number): number {
      return HEAP8[ColorMapBlock.start + (index * 3 + 1)];
    },

    getBlue(index: number): number {
      return HEAP8[ColorMapBlock.start + (index * 3 + 2)];
    },

    getColor(index: number) {
      return {
        red: this.getRed(index),
        green: this.getGreen(index),
        blue: this.getBlue(index),
      }
    },
  }
}
