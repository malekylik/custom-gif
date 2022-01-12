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
  let restCode = 1 << 31;
  let currentTableIndex = 1 << codeSize;
  let blockSize = indx;

  for (let i = 0; i < currentTableIndex; i++) {
    codeTable32[((i * STRUCT_SIZE) + 0) >> 2] = -1; // prev
    codeTable32[((i * STRUCT_SIZE) + 4) >> 2] = i; // byte
    codeTable32[((i * STRUCT_SIZE) + 8) >> 2] = 1; // length
    codeTable32[((i * STRUCT_SIZE) + 12) >> 2] = i; // first
  }

  currentTableIndex++; // clear code
  currentTableIndex++; // stop code

  while (indx < buffer.length && indx < outBuffer.length) {
    blockSize = blockSize + buffer[blockSize] + 1;
    indx++;

    while (true) {
      // Variant 5 (Reading bits in far too many ways (part 3))
      // https://fgiesen.wordpress.com/2018/09/27/reading-bits-in-far-too-many-ways-part-3/
      // clz32 - slow, compiled to lzcntl
      const bits_consumed = Math.clz32(restCode);

      if (indx + (bits_consumed >>> 3) >= blockSize) {
        break;
      }

      // Advance the pointer
      indx += bits_consumed >>> 3; // div by 8
  
      if (indx + 3 >= blockSize) {
        const diff = (blockSize - indx) * 8;
        const word1 = (buffer[indx + 3] << 24) | (buffer[indx + 2] << 16) | (buffer[indx + 1] << 8) | (buffer[indx]);
        const word2 = (buffer[blockSize + 4] << 24) | (buffer[blockSize + 3] << 16) | (buffer[blockSize + 2] << 8) | (buffer[blockSize + 1]);
        const word = (word1 & ((1 << diff) - 1)) | (word2 << diff);
  
        restCode = word | (1 << 31);
      } else {
        const word = (buffer[indx + 3] << 24) | (buffer[indx + 2] << 16) | (buffer[indx + 1] << 8) | (buffer[indx]);

        // put the marker
        restCode = word | (1 << 31);
      }
  
      // after dev bits_consumed by 8, reminder should be also considered
      restCode >>>= bits_consumed & 7;


      code = restCode & codeMask;
      restCode >>>= codeBitSize;

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
