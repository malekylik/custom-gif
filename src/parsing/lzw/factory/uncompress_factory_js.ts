import { ImageDecriptor } from '../../gif/image_descriptor';
import { GIF } from '../../gif/parser';
import { lzw_uncompress } from '../uncompress/uncompress';
import { FactoryResult } from './uncompress_factory';

export function createLZWFuncFromJS(gif: GIF): Promise<FactoryResult> {
  const out = new Uint8Array(gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight);

  function _lzw_uncompress(image: ImageDecriptor) {
    lzw_uncompress(image.compressedData, out);
  }

  return Promise.resolve({ lzw_uncompress: _lzw_uncompress, out });
}
