import lzw from './uncompress_wasm_glue';
import lzwModule from './uncompress_wasm_code.wasm';

import { GIF_MAX_TABLE_SIZE } from '../consts';

export interface LZWUncompressModule {
  module: Record<string, unknown>;
  lzw_uncompress: (startCompressedPointer: number, compressedSize: number, outPointer: number, outSize: number) => void;
  gifStartPointer: number;
  outBuffer: Uint8Array;
  outStartPointer: number;
}

const PAGE_SIZE = 65536;

const LZW_THREAD_COUNT = 24;

const additionalHeapSize = GIF_MAX_TABLE_SIZE * 8 * LZW_THREAD_COUNT + (PAGE_SIZE / 2);

function createModule(gifBuffer: Uint8Array, maxFrameBufferSize: number) {
  const pageSize = Math.floor((gifBuffer.byteLength + maxFrameBufferSize + additionalHeapSize) / PAGE_SIZE) + 1;

  const memory = new WebAssembly.Memory({
    'initial': pageSize,
    'maximum': pageSize,
  });

  const lzwHEAP = new Uint8Array(memory.buffer);

  const module = lzw({
    wasmMemory: memory,

    locateFile(path: string) {
      if (path.endsWith('.wasm')) {
        return lzwModule;
      }

      return path;
    },
  });

  module.onRuntimeInitialized = () => { };

  return new Promise<LZWUncompressModule>((resolve) => {
    module.onRuntimeInitialized = () => {
      const lzw_uncompress = module.cwrap('lzw_uncompress', 'void', ['number', 'number', 'number', 'number']);

      const gifStartPointer = module._malloc(gifBuffer.byteLength);
      const outStartPointer = module._malloc(maxFrameBufferSize);

      lzwHEAP.set(gifBuffer, gifStartPointer);

      resolve({
        module, lzw_uncompress,
        gifStartPointer,
        outBuffer: lzwHEAP.subarray(outStartPointer, outStartPointer + maxFrameBufferSize),
        outStartPointer,
      });
    }
  });
}

export { createModule };
