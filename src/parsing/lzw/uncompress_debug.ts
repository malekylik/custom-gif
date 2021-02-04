import { GIF_MAX_TABLE_SIZE } from './consts';

export function lzw_uncompress_debug(buffer: Uint8Array, outBuffer: Uint8Array | Uint8ClampedArray) {
  let indx = 0;
  let outIndx = 0;
  let code = 0;
  const codeSize = buffer[indx++];
  const clearCode = 1 << codeSize;
  const stopCode = clearCode + 1;
  const codeTable = new Array(GIF_MAX_TABLE_SIZE).fill(null);
  let codeBitSize = codeSize + 1;
  let currentMaxTableSize = 1 << codeBitSize;
  let codeMask = (1 << codeBitSize) - 1;
  let prev = -1;
  let restCode = 0;
  let readedBits = 0;
  let currentTableIndex = 1 << codeSize;
  let blockSize = 0;

  for (let i = 0; i < currentTableIndex; i++) {
    codeTable[i] = { prev: -1, byte: i, length: 1 };
  }

  currentTableIndex++; // clear code
  currentTableIndex++; // stop code

  while (indx < buffer.length && buffer[indx] !== 0) {
    blockSize = indx + buffer[indx] + 1;
    indx++;

    while (indx < blockSize) {
      code = restCode;
      for (; readedBits < codeBitSize && indx + (readedBits >>> 3) < blockSize; readedBits += 8) {
        code = (buffer[indx + (readedBits >>> 3)] << readedBits) | code;
      }

      if (readedBits < codeBitSize && !(indx + (readedBits >>> 3) < blockSize)) {
        indx++;
        blockSize = indx + buffer[indx] + 1;

        for (; readedBits < codeBitSize && indx + (readedBits >>> 3) < blockSize; readedBits += 8) {
          code = (buffer[indx + (readedBits >>> 3)] << readedBits) | code;
        }
      }

      restCode = code >>> codeBitSize;
      indx += readedBits >>> 3;
      readedBits -= codeBitSize;

      code = code & codeMask;

      if (code === clearCode) {
        for (let end = currentTableIndex, start = (1 << codeSize) + 2; start < end; start++) {
          codeTable[start] = null;
        }

        currentTableIndex = (1 << codeSize) + 2;

        codeBitSize = codeSize + 1;
        codeMask = (1 << codeBitSize) - 1;
        currentMaxTableSize = 1 << codeBitSize;
        prev = -1;
      } else if (code === stopCode) {
        return;
      } else {
        let ptr = code === currentTableIndex ? prev : code;

        if (prev !== -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
          if (ptr > currentTableIndex) {
            console.warn('Invalid table code');
          }

          while (codeTable[ptr].prev !== -1) {
            ptr = codeTable[ptr].prev;
          }

          codeTable[currentTableIndex] = {
            prev: prev, byte: codeTable[ptr].byte, length: codeTable[prev].length + 1
          };

          currentTableIndex++;

          if (currentTableIndex === currentMaxTableSize && currentMaxTableSize !== GIF_MAX_TABLE_SIZE) {
            codeBitSize++;
            codeMask = (1 << codeBitSize) - 1;
            currentMaxTableSize = 1 << codeBitSize;
          }
        }

        prev = code;

        ptr = code;

        if (outIndx + codeTable[ptr].length <= outBuffer.length) {
          while (ptr !== -1) {
            outBuffer[outIndx + codeTable[ptr].length - 1] = codeTable[ptr].byte;
            ptr = codeTable[ptr].prev;
          }

          outIndx += codeTable[code].length;
        } else {
          return;
        }
      }
    }
  }

  return;
}
