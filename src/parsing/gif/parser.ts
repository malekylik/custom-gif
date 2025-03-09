import { ASCIIByte } from './consts';
import { ColorMap, parseGlobalColorMap } from './color_map';
import { parseImageList } from './image_list';
import { parseScreenDescriptor, ScreenDescriptor } from './screen_descriptor';
import { GIFSpecialSymbol, ColorMapBlock } from './consts';
import { ImageDecriptor } from './image_descriptor';

export interface GIF {
  signature: string;
  version: number;

  screenDescriptor: ScreenDescriptor;
  colorMap: ColorMap;

  images: Array<ImageDecriptor>;

  buffer: Uint8Array,
}

export function parseGif(buffer: ArrayBuffer): GIF | undefined {
  const fromCharCode = String.fromCharCode;
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[0] === ASCIIByte.G && HEAP8[1] === ASCIIByte.I && HEAP8[2] === ASCIIByte.F) {
    const version = Number(fromCharCode(HEAP8[3])) * 10 + Number(fromCharCode(HEAP8[4]));
    const signature = `GIF${version}${fromCharCode(HEAP8[5])}`;

    const screenDescriptor = parseScreenDescriptor(buffer);
    let imagesDescriptorStart = ColorMapBlock.start;
    let colorMap = null;

    if (screenDescriptor.M) {
      colorMap = parseGlobalColorMap(buffer, screenDescriptor.pixel);
      imagesDescriptorStart += (colorMap.entriesCount * ColorMapBlock.entriesCount);
    }

    let { images, blockEnd } = parseImageList(buffer, imagesDescriptorStart)

    while (blockEnd < HEAP8.length && HEAP8[blockEnd] !== GIFSpecialSymbol.gifTermination) blockEnd++;

    if (blockEnd > HEAP8.length) {
      console.warn('GIF doens`t terminate with proper symbol. It may be corrapted.')
    }

    return {
      signature,
      version,

      screenDescriptor,
      colorMap,

      images,

      buffer: HEAP8,
    }
  }
}
