import { ImageDescriptor } from '../../gif/image_descriptor';
import { GIF } from '../../gif/parser';
import { createModule, LZWUncompressModule } from '../uncompress/uncompress_wasm';
import { FactoryResult } from './uncompress_factory';

export function createLZWFuncFromWasm(gif: GIF): Promise<FactoryResult> {
  let module: LZWUncompressModule = null;
  let startPointer = 0;

  return createModule(gif.buffer, gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight)
    .then((m) => {
      module = m;
      startPointer = m.gifStartPointer;

      function _lzw_uncompress(image: ImageDescriptor) {
        m.lzw_uncompress(startPointer + image.startPointer, image.compressedData.length, m.outStartPointer, m.outBuffer.length);
      }

      return ({ lzw_uncompress: _lzw_uncompress, out: m.outBuffer });
    });
}
