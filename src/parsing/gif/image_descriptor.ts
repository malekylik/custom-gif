import { ColorMap } from './color_map';
import { GIFSpecialSymbol } from './consts';
import { GraphicControl } from './graphic_control';

export interface ImageDescriptor {
  imageLeft: number;
  imageTop: number;
  imageWidth: number;
  imageHeight: number;

  M: number;
  I: number;
  pixel: number;

  compressedData: Uint8Array;

  graphicControl: GraphicControl | null;

  colorMap: ColorMap;

  startPointer: number;
}

export function parseImageDescriptor(buffer: ArrayBuffer, imagesDescriptorOffset: number): ImageDescriptor {
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[imagesDescriptorOffset] !== GIFSpecialSymbol.imageSeparator) {
    console.warn(`Invalid image descriptor: ${imagesDescriptorOffset}. Image desriptor doesn't start with ','`);
  }

  const imageLeft = HEAP8[imagesDescriptorOffset + 1] | (HEAP8[imagesDescriptorOffset + 2] << 8);
  const imageTop = HEAP8[imagesDescriptorOffset + 3] | (HEAP8[imagesDescriptorOffset + 4] << 8);
  const imageWidth = HEAP8[imagesDescriptorOffset + 5] | (HEAP8[imagesDescriptorOffset + 6] << 8);
  const imageHeight = HEAP8[imagesDescriptorOffset + 7] | (HEAP8[imagesDescriptorOffset + 8] << 8);

  const M = HEAP8[imagesDescriptorOffset + 9] >> 7;
  const I = (HEAP8[imagesDescriptorOffset + 9] >> 6) & 0b1;
  const pixel = (HEAP8[imagesDescriptorOffset + 9] & 0b00000111) + 1;

  return {
    imageLeft,
    imageTop,
    imageWidth,
    imageHeight,

    M,
    I,
    pixel,

    compressedData: null,

    graphicControl: null,

    colorMap: null,

    startPointer: 0,
  }
}
