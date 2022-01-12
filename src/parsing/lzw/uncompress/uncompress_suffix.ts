import { GIF_MAX_TABLE_SIZE } from '../consts';

// codeTable
// prev - 4 Byte
// first - 4 byte
// length_curr - 4 byte
// length - 4 byte
// sufix - 8 byte

const STRUCT_SIZE = 24;

export function lzw_uncompress(buffer: Uint8Array, outBuffer: Uint8Array | Uint8ClampedArray) {
  let indx = 0;
  let outIndx = 0;
  let code = 0;
  const codeSize = buffer[indx++];
  const clearCode = 1 << codeSize;
  const stopCode = clearCode + 1;
  const codeTable = new ArrayBuffer(GIF_MAX_TABLE_SIZE * STRUCT_SIZE);
  const codeTable8 = new Uint8Array(codeTable);
  const codeTable32 = new Int32Array(codeTable);
  let codeBitSize = codeSize + 1;
  let currentMaxTableSize = 1 << codeBitSize;
  let codeMask = (1 << codeBitSize) - 1;
  let prev = -1;
  let restCode = 0;
  let readedBits = 0;
  let currentTableIndex = 1 << codeSize;
  let blockSize = 0;

  // Prefix+Suffix Representation
  // https://github.com/google/wuffs/tree/main/std/lzw#prefixsuffix-representation
  for (let i = 0; i < currentTableIndex; i++) {
    codeTable32[((i * STRUCT_SIZE) + 0) >> 2] = -1; // prev
    codeTable32[((i * STRUCT_SIZE) + 4) >> 2] = i; // first
    codeTable32[((i * STRUCT_SIZE) + 8) >> 2] = 1; // length_curr
    codeTable32[((i * STRUCT_SIZE) + 12) >> 2] = 1; // length
    codeTable32[((i * STRUCT_SIZE) + 16) >> 2] = i; // byte
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

      indx += readedBits >>> 3;

      restCode = code >>> codeBitSize;
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
          ptr = codeTable32[((ptr * STRUCT_SIZE) + 4) >> 2]; // first

          codeTable32[((currentTableIndex * STRUCT_SIZE) + 4) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 4) >> 2]; // first
          codeTable32[((currentTableIndex * STRUCT_SIZE) + 12) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 12) >> 2] + 1; // length

          if (codeTable32[((prev * STRUCT_SIZE) + 8) >> 2] + 1 > 4) { // length_curr
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 8) >> 2] = 1; // length_curr
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 16) >> 2] = codeTable32[((ptr * STRUCT_SIZE) + 16) >> 2]; // byte
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 0) >> 2] = prev; // prev
          } else {
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 8) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 8) >> 2] + 1; // length_curr
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 16) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 16) >> 2]; // byte
            codeTable8 [((currentTableIndex * STRUCT_SIZE) + 16) + codeTable32[((prev * STRUCT_SIZE) + 8) >> 2]] = codeTable8[((ptr * STRUCT_SIZE) + 16)]; // byte
            codeTable32[((currentTableIndex * STRUCT_SIZE) + 0) >> 2] = codeTable32[((prev * STRUCT_SIZE) + 0) >> 2]; // prev
          }

          currentTableIndex++;

          if (currentTableIndex === currentMaxTableSize && currentMaxTableSize !== GIF_MAX_TABLE_SIZE) {
            codeBitSize++;
            codeMask = (1 << codeBitSize) - 1;
            currentMaxTableSize = 1 << codeBitSize;
          }
        }

        prev = code;

        ptr = code;

        const length = codeTable32[((code * STRUCT_SIZE) + 12) >> 2];

        if (outIndx + length < outBuffer.length) {
          const curr_lenght = codeTable32[((ptr * STRUCT_SIZE) + 8) >> 2];

          outBuffer[outIndx + length - curr_lenght + 0] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 0];
          outBuffer[outIndx + length - curr_lenght + 1] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 1];
          outBuffer[outIndx + length - curr_lenght + 2] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 2];
          outBuffer[outIndx + length - curr_lenght + 3] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 3];

          ptr = codeTable32[((ptr * STRUCT_SIZE) + 0) >> 2];

          for (let i = length - curr_lenght - 4; i >= 0; i -= 4) {
            outBuffer[outIndx + i + 0] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 0];
            outBuffer[outIndx + i + 1] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 1];
            outBuffer[outIndx + i + 2] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 2];
            outBuffer[outIndx + i + 3] = codeTable8[((ptr * STRUCT_SIZE) + 16) + 3];

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
