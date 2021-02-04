import { Extension, GIFSpecialSymbol, ColorMapBlock, ImageDecriptorBlock } from './consts';
import { parseImageDescriptor } from './image_descriptor';
import { findEndOfSubData } from './utils';

function findEndOfImageCompressedData(buffer: ArrayBuffer, start: number) {
  start += 1; // LZW Minimum Code Size byte

  return findEndOfSubData(buffer, start);
}

export function parseImageList(buffer: ArrayBuffer, start: number) {
  const HEAP8 = new Uint8Array(buffer);
  const images = [];
  let image = null;

  while (start < HEAP8.byteLength && start !== -1) {
    switch (HEAP8[start]) {
      case Extension.blockLabel: {
        start++;

        const extensionType = HEAP8[start++];

        start = findEndOfSubData(buffer, start);
        break;
      }

      case GIFSpecialSymbol.imageSeparator: {
        image = parseImageDescriptor(buffer, start);
        images.push(image);

        start += ImageDecriptorBlock.size;

        if (image.M) {
          start += (1 << image.pixel) * ColorMapBlock.entriesCount;
        }

        image.compressedData = HEAP8.subarray(start, findEndOfImageCompressedData(buffer, start));
        start += image.compressedData.byteLength;

        break;
      }

      default: {
        start++;
        break;
      }
    }
  }

  return { images, blockEnd: start };
}
