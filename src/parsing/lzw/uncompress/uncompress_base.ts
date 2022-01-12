import { GIF_MAX_TABLE_SIZE } from '../consts';

// codeTable
// prev - 4 Byte
// byte - 4 byte
// length - 4 byte
// first - 4 byte

const STRUCT_SIZE = 16;

export function lzw_uncompress(buffer: Uint8Array, outBuffer: Uint8Array | Uint8ClampedArray) {
  let indx = 0;
  let outIndx = 0;
  let code = 0;
  const codeSize = buffer[indx++];
  const clearCode = 1 << codeSize;
  const stopCode = clearCode + 1;
  const codeTable = new ArrayBuffer(GIF_MAX_TABLE_SIZE * STRUCT_SIZE);
  const codeTable32 = new Uint32Array(codeTable);
  let codeBitSize = codeSize + 1;
  let currentMaxTableSize = 1 << codeBitSize;
  let codeMask = (1 << codeBitSize) - 1;
  let prev = -1;
  let restCode = 0;
  let readedBits = 0;
  let currentTableIndex = 1 << codeSize;
  let blockSize = 0;

  for (let i = 0; i < currentTableIndex; i++) {
    codeTable32[((i * STRUCT_SIZE) + 0) >> 2] = -1; // prev
    codeTable32[((i * STRUCT_SIZE) + 4) >> 2] = i; // byte
    codeTable32[((i * STRUCT_SIZE) + 8) >> 2] = 1; // length
    codeTable32[((i * STRUCT_SIZE) + 12) >> 2] = i; // first
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
          ptr = codeTable32[((ptr * STRUCT_SIZE) + 12) >> 2];

          // codeTable[currentTableIndex] = {
          //   prev: prev, first: codeTable[prev].first, byte: codeTable[ptr].byte, length: codeTable[prev].length + 1
          // };

          codeTable32[((currentTableIndex * STRUCT_SIZE) + 0) >> 2] = prev; // prev
          codeTable32[((currentTableIndex * STRUCT_SIZE) + 4) >> 2] = codeTable32[((ptr * STRUCT_SIZE) + 4) >> 2]; // byte
          codeTable32[((currentTableIndex * STRUCT_SIZE) + 8) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 8) >> 2] + 1; // length
          codeTable32[((currentTableIndex * STRUCT_SIZE) + 12) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 12) >> 2]; // first

          currentTableIndex++;

          if (currentTableIndex === currentMaxTableSize && currentMaxTableSize !== GIF_MAX_TABLE_SIZE) {
            codeBitSize++;
            codeMask = (1 << codeBitSize) - 1;
            currentMaxTableSize = 1 << codeBitSize;
          }
        }

        prev = code;

        ptr = code;

        const length = codeTable32[((code * STRUCT_SIZE) + 8) >> 2];

        if (outIndx + length < outBuffer.length) {
          for (let i = length - 1; i >= 0; i--) {
            outBuffer[outIndx + i] = codeTable32[((ptr * STRUCT_SIZE) + 4) >> 2];
            ptr = codeTable32[((ptr * STRUCT_SIZE) + 0) >> 2];
          }

          outIndx += length;
        } else {
          return;
        }
      }
    }
  }

  return;
}
