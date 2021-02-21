import { ColorMapBlock } from './consts';

export interface ColorMap {
  entriesCount: number;

  getRed: (index: number) => number;
  getGreen: (index: number) => number;
  getBlue: (index: number) => number;

  getColor: (index: number) => {
    red: number;
    green: number;
    blue: number;
  };

  getRawData: () => Uint8Array;
}

export function parseGlobalColorMap(buffer: ArrayBuffer, bitsPerPixel: number) {
  return parseColorMap(buffer, ColorMapBlock.start, bitsPerPixel);
}

export function parseColorMap(buffer: ArrayBuffer, offset: number, bitsPerPixel: number) {
  const HEAP8 = new Uint8Array(buffer);
  const entriesCount = 1 << bitsPerPixel;
  let rawPointer = HEAP8.subarray(offset, offset + entriesCount * 3);

  return {
    entriesCount,

    getRed(index: number): number {
      return HEAP8[offset + (index * 3 + 0)];
    },

    getGreen(index: number): number {
      return HEAP8[offset + (index * 3 + 1)];
    },

    getBlue(index: number): number {
      return HEAP8[offset + (index * 3 + 2)];
    },

    getColor(index: number) {
      return {
        red: this.getRed(index),
        green: this.getGreen(index),
        blue: this.getBlue(index),
      }
    },

    getRawData() {
      return rawPointer;
    }
  }
}
