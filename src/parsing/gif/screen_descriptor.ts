import { GIFDescriptorBlock } from './consts';

export function parseScreenDescriptor(buffer: ArrayBuffer) {
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[GIFDescriptorBlock.start + GIFDescriptorBlock.size - 1] !== 0) {
    console.warn('Invalid Screen Descriptor section: last byte should be 0');
  }

  const screenWidth = HEAP8[GIFDescriptorBlock.start + 0] | (HEAP8[GIFDescriptorBlock.start + 1] << 8);
  const screenHeight = HEAP8[GIFDescriptorBlock.start + 2] | (HEAP8[GIFDescriptorBlock.start + 3] << 8);

  const M = HEAP8[GIFDescriptorBlock.start + 4] >> 7;
  const cr = ((HEAP8[GIFDescriptorBlock.start + 4] & 0b01110000) >> 4) + 1;
  const pixel = (HEAP8[GIFDescriptorBlock.start + 4] & 0b00000111) + 1;
  const background = HEAP8[GIFDescriptorBlock.start + 5];

  return {
    screenWidth,
    screenHeight,

    M,
    cr,
    pixel,
    background,
  }
}
