import { Extension, GIFSpecialSymbol, ColorMapBlock, ImageDecriptorBlock } from './consts';
import { ImageDecriptor, parseImageDescriptor } from './image_descriptor';
import { parseColorMap } from './color_map';
import { findEndOfSubData } from './utils';
import { GraphicControl, parseGraphicControl } from './graphic_control';

function findEndOfImageCompressedData(buffer: ArrayBuffer, start: number) {
  start += 1; // LZW Minimum Code Size byte

  return findEndOfSubData(buffer, start);
}

export function parseImageList(buffer: ArrayBuffer, start: number) {
  const HEAP8 = new Uint8Array(buffer);
  const images: Array<ImageDecriptor> = [];
  let graphicControl: GraphicControl = null;
  let image: ImageDecriptor = null;

  while (start < HEAP8.byteLength && start !== -1) {
    switch (HEAP8[start]) {
      case Extension.blockLabel: {
        start++;

        const extensionType = HEAP8[start++];

        if (extensionType === Extension.graphicControl) {
          const blockSize = HEAP8[start];

          graphicControl = parseGraphicControl(buffer, start + 1);

          start = start + blockSize + 1;
        } else {
          start = findEndOfSubData(buffer, start);
        }

        break;
      }

      case GIFSpecialSymbol.imageSeparator: {
        image = parseImageDescriptor(buffer, start);
        images.push(image);

        start += ImageDecriptorBlock.size;

        if (image.M) {
          image.colorMap = parseColorMap(buffer, start, image.pixel);
          start += (image.colorMap.entriesCount * ColorMapBlock.entriesCount);
        }

        if (graphicControl) {
          image.graphicControl = graphicControl;
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
