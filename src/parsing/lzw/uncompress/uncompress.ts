import { GIF_MAX_TABLE_SIZE } from '../consts';

// codeTable
// prev - 2 Byte
// byte - 2 byte
// length - 4 byte

export function lzw_uncompress(buffer: Uint8Array, outBuffer: Uint8Array | Uint8ClampedArray) {
  let indx = 0;
  let outIndx = 0;
  let code = 0;
  const codeSize = buffer[indx++];
  const clearCode = 1 << codeSize;
  const stopCode = clearCode + 1;
  const codeTable = new ArrayBuffer(GIF_MAX_TABLE_SIZE * 8);
  const codeTable16 = new Int16Array(codeTable);
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
    codeTable16[((i * 8) + 0) >> 1] = -1; // prev
    codeTable16[((i * 8) + 2) >> 1] = i; // byte
    codeTable32[((i * 8) + 4) >> 2] = 1; // length
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
          while (codeTable16[((ptr * 8) + 0) >> 1] !== -1) {
            ptr = codeTable16[((ptr * 8) + 0) >> 1];
          }

          codeTable16[((currentTableIndex * 8) + 0) >> 1] = prev; // prev
          codeTable16[((currentTableIndex * 8) + 2) >> 1] = codeTable16[((ptr * 8) + 2) >> 1]; // byte
          codeTable32[((currentTableIndex * 8) + 4) >> 2] = codeTable32[((prev * 8) + 4) >> 2] + 1; // length

          currentTableIndex++;

          if (currentTableIndex === currentMaxTableSize && currentMaxTableSize !== GIF_MAX_TABLE_SIZE) {
            codeBitSize++;
            codeMask = (1 << codeBitSize) - 1;
            currentMaxTableSize = 1 << codeBitSize;
          }
        }

        prev = code;

        ptr = code;

        if (outIndx + codeTable32[((ptr * 8) + 4) >> 2] < outBuffer.length) {
          while (ptr !== -1) {
            outBuffer[outIndx + codeTable32[((ptr * 8) + 4) >> 2] - 1] = codeTable16[((ptr * 8) + 2) >> 1];
            ptr = codeTable16[((ptr * 8) + 0) >> 1];
          }

          outIndx += codeTable32[((code * 8) + 4) >> 2];
        } else {
          return;
        }
      }
    }
  }

  return;
}
