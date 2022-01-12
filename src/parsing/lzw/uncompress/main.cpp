#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

// emcc ./main.cpp -o out.js --minify 0 -s ENVIRONMENT="web" -O3 -s MODULARIZE=1 -s 'EXPORT_NAME="createLZWModule"' -s EXPORTED_RUNTIME_METHODS='cwrap' -s 'ALLOW_MEMORY_GROWTH=true' -s 'TOTAL_MEMORY=65536' -s 'TOTAL_STACK=32768' -s "EXPORTED_FUNCTIONS=['_lzw_uncompress', '_malloc']" -s IMPORTED_MEMORY

#define GIF_MAX_TABLE_SIZE (1 << 12)

typedef struct {
  uint32_t start;
  uint32_t length;
} Gif_Desc;

typedef struct  
{
  int32_t prev;
  uint32_t byte;
  uint32_t length;
  uint32_t first;
} Table_Entry;

typedef struct  
{
  int16_t prev;
  uint8_t byte[4];
  uint32_t curr_length;
  uint32_t length;
  uint32_t first;
} Table_Entry_Suffix;

extern "C" {
  void lzw_uncompress(uint8_t* buffer, uint32_t buffer_length, uint8_t* out_buffer, uint32_t out_lenght) {
    int32_t indx = 0;
    int32_t outIndx = 0;
    uint32_t code = 0;
    int32_t codeSize = buffer[indx++];
    int32_t clearCode = 1 << codeSize;
    int32_t stopCode = clearCode + 1;
    Table_Entry* codeTable = (Table_Entry*)malloc(GIF_MAX_TABLE_SIZE * sizeof(Table_Entry));
    int32_t codeBitSize = codeSize + 1;
    int32_t currentMaxTableSize = 1 << codeBitSize;
    int32_t codeMask = (1 << codeBitSize) - 1;
    int32_t prev = -1;
    uint32_t restCode = 0;
    int32_t readedBits = 0;
    int32_t currentTableIndex = 1 << codeSize;
    int32_t blockSize = indx;


    for (uint32_t i = 0; i < currentTableIndex; i++) {
      codeTable[i].prev = -1;
      codeTable[i].byte = i;
      codeTable[i].length = 1;
      codeTable[i].first = i;
    }

    currentTableIndex++; // clear code
    currentTableIndex++; // stop code

    while (indx < buffer_length && indx < out_lenght) {
      blockSize = indx + buffer[blockSize] + 1;
      indx++;

      while (indx < blockSize) {
        // Variant 4 (Reading bits in far too many ways (part 2))
        // https://fgiesen.wordpress.com/2018/02/20/reading-bits-in-far-too-many-ways-part-2/
        if (indx + 2 >= blockSize) { // codeBitSize has max size of 12 bit, which is 2 byte, need to check this 2 byte to not overflow 
          restCode |= buffer[indx] << readedBits;
      
          indx += 1;
      
          readedBits += 8;
        } else {
          uint32_t word = (buffer[indx + 3] << 24) | (buffer[indx + 2] << 16) | (buffer[indx + 1] << 8) | (buffer[indx]);

          restCode |= word << readedBits;
      
          indx += (31 - readedBits) >> 3;
      
          readedBits |= 24; // now readedBits is in [24,31]
        }

        code = restCode & codeMask;

        restCode >>= codeBitSize;
        readedBits -= codeBitSize;

        if (code == clearCode) {
          currentTableIndex = (1 << codeSize) + 2;

          codeBitSize = codeSize + 1;
          codeMask = (1 << codeBitSize) - 1;
          currentMaxTableSize = 1 << codeBitSize;
          prev = -1;
        } else if (code == stopCode) {
          free(codeTable);
          return;
        } else {
          int32_t ptr = code == currentTableIndex ? prev : code;

          if (prev != -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
            ptr = codeTable[ptr].first;

            codeTable[currentTableIndex].prev = prev;
            codeTable[currentTableIndex].byte = codeTable[ptr].byte;
            codeTable[currentTableIndex].length = codeTable[prev].length + 1;
            codeTable[currentTableIndex].first = codeTable[prev].first;

            currentTableIndex++;

            if (currentTableIndex == currentMaxTableSize && currentMaxTableSize != GIF_MAX_TABLE_SIZE) {
              codeBitSize++;
              codeMask = (1 << codeBitSize) - 1;
              currentMaxTableSize = 1 << codeBitSize;
            }
          }

          prev = code;

          ptr = code;

          uint32_t length = codeTable[code].length;

          if (outIndx + length < out_lenght) {
            for (int32_t i = length - 1; i >= 0; i--) {
              out_buffer[outIndx + i] = codeTable[ptr].byte;
              ptr = codeTable[ptr].prev;
            }

            outIndx += length;
          } else {
            free(codeTable);
            return;
          }
        }
      }
    }

    free(codeTable);
    return;
  }

  void lzw_uncompress_suffix(uint8_t* buffer, uint32_t buffer_length, uint8_t* out_buffer, uint32_t out_lenght) {
    int32_t indx = 0;
    int32_t outIndx = 0;
    uint32_t code = 0;
    int32_t codeSize = buffer[indx++];
    int32_t clearCode = 1 << codeSize;
    int32_t stopCode = clearCode + 1;
    Table_Entry_Suffix* codeTable = (Table_Entry_Suffix*)malloc(GIF_MAX_TABLE_SIZE * sizeof(Table_Entry_Suffix));
    int32_t codeBitSize = codeSize + 1;
    int32_t currentMaxTableSize = 1 << codeBitSize;
    int32_t codeMask = (1 << codeBitSize) - 1;
    int32_t prev = -1;
    uint32_t restCode = 0;
    int32_t readedBits = 0;
    int32_t currentTableIndex = 1 << codeSize;
    int32_t blockSize = 0;

    for (uint32_t i = 0; i < currentTableIndex; i++) {
      codeTable[i].prev = -1;
      ((uint32_t*)codeTable[i].byte)[0] = i;
      codeTable[i].length = 1;
      codeTable[i].curr_length = 1;
      codeTable[i].first = i;
    }

    currentTableIndex++; // clear code
    currentTableIndex++; // stop code

    while (indx < buffer_length && buffer[indx] != 0) {
      blockSize = indx + buffer[indx] + 1;
      indx++;

      while (indx < blockSize) {
        code = restCode;
        for (; readedBits < codeBitSize && indx + (readedBits >> 3) < blockSize; readedBits += 8) {
          code = (buffer[indx + (readedBits >> 3)] << readedBits) | code;
        }

        if (readedBits < codeBitSize && !(indx + (readedBits >> 3) < blockSize)) {
          indx++;
          blockSize = indx + buffer[indx] + 1;

          for (; readedBits < codeBitSize && indx + (readedBits >> 3) < blockSize; readedBits += 8) {
            code = (buffer[indx + (readedBits >> 3)] << readedBits) | code;
          }
        }

        restCode = code >> codeBitSize;
        indx += readedBits >> 3;
        readedBits -= codeBitSize;

        code = code & codeMask;

        if (code == clearCode) {
          currentTableIndex = (1 << codeSize) + 2;

          codeBitSize = codeSize + 1;
          codeMask = (1 << codeBitSize) - 1;
          currentMaxTableSize = 1 << codeBitSize;
          prev = -1;
        } else if (code == stopCode) {
          return;
        } else {
          int32_t ptr = code == currentTableIndex ? prev : code;

          if (prev != -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
            ptr = codeTable[ptr].first; // first

            codeTable[currentTableIndex].first = codeTable[prev].first;
            codeTable[currentTableIndex].length = codeTable[prev].length + 1;

            if (codeTable[prev].curr_length + 1 > 4) { // length_curr
              codeTable[currentTableIndex].curr_length = 1;
              codeTable[currentTableIndex].byte[0] = codeTable[ptr].byte[0];
              codeTable[currentTableIndex].prev = prev;
            } else {
              codeTable[currentTableIndex].curr_length = codeTable[prev].curr_length + 1;
              ((uint32_t*)codeTable[currentTableIndex].byte)[0] = ((uint32_t*)codeTable[prev].byte)[0];
              codeTable[currentTableIndex].byte[codeTable[prev].curr_length] = codeTable[ptr].byte[0];
              codeTable[currentTableIndex].prev = codeTable[prev].prev;
            }

            currentTableIndex++;


            if (currentTableIndex == currentMaxTableSize && currentMaxTableSize != GIF_MAX_TABLE_SIZE) {
              codeBitSize++;
              codeMask = (1 << codeBitSize) - 1;
              currentMaxTableSize = 1 << codeBitSize;
            }
          }

          prev = code;

          ptr = code;

          uint32_t length = codeTable[code].length;

          if (outIndx + length < out_lenght) {
            uint32_t curr_lenght = codeTable[ptr].curr_length;

            out_buffer[outIndx + length - curr_lenght + 0] = codeTable[ptr].byte[0];
            out_buffer[outIndx + length - curr_lenght + 1] = codeTable[ptr].byte[1];
            out_buffer[outIndx + length - curr_lenght + 2] = codeTable[ptr].byte[2];
            out_buffer[outIndx + length - curr_lenght + 3] = codeTable[ptr].byte[3];

            ptr = codeTable[ptr].prev;

            for (int32_t i = length - curr_lenght - 4; i >= 0; i -= 4) {
              out_buffer[outIndx + i + 0] = codeTable[ptr].byte[0];
              out_buffer[outIndx + i + 1] = codeTable[ptr].byte[1];
              out_buffer[outIndx + i + 2] = codeTable[ptr].byte[2];
              out_buffer[outIndx + i + 3] = codeTable[ptr].byte[3];

              ptr = codeTable[ptr].prev;
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

  void lzw_uncompress_clz(uint8_t* buffer, uint32_t buffer_length, uint8_t* out_buffer, uint32_t out_lenght) {
    int32_t indx = 0;
    int32_t outIndx = 0;
    uint32_t code = 0;
    int32_t codeSize = buffer[indx++];
    int32_t clearCode = 1 << codeSize;
    int32_t stopCode = clearCode + 1;
    Table_Entry* codeTable = (Table_Entry*)malloc(GIF_MAX_TABLE_SIZE * sizeof(Table_Entry));
    int32_t codeBitSize = codeSize + 1;
    int32_t currentMaxTableSize = 1 << codeBitSize;
    int32_t codeMask = (1 << codeBitSize) - 1;
    int32_t prev = -1;
    uint32_t restCode = 1 << 31;
    int32_t currentTableIndex = 1 << codeSize;
    int32_t blockSize = indx;


    for (uint32_t i = 0; i < currentTableIndex; i++) {
      codeTable[i].prev = -1;
      codeTable[i].byte = i;
      codeTable[i].length = 1;
      codeTable[i].first = i;
    }

    currentTableIndex++; // clear code
    currentTableIndex++; // stop code

    while (indx < buffer_length && indx < out_lenght) {
      blockSize = blockSize + buffer[blockSize] + 1;
      indx++;

      while (1) {
        // Variant 5 (Reading bits in far too many ways (part 3))
        // https://fgiesen.wordpress.com/2018/09/27/reading-bits-in-far-too-many-ways-part-3/
        // clz32 - slow, compiled to lzcntl
        uint32_t bits_consumed = __builtin_clz(restCode);

        if (indx + (bits_consumed >> 3) >= blockSize) {
          break;
        }

        // Advance the pointer
        indx += bits_consumed >> 3; // div by 8
    
        if (indx + 3 >= blockSize) {
          uint32_t diff = (blockSize - indx) * 8;
          uint32_t word1 = (buffer[indx + 3] << 24) | (buffer[indx + 2] << 16) | (buffer[indx + 1] << 8) | (buffer[indx]);
          uint32_t word2 = (buffer[blockSize + 4] << 24) | (buffer[blockSize + 3] << 16) | (buffer[blockSize + 2] << 8) | (buffer[blockSize + 1]);
          uint32_t word = (word1 & ((1 << diff) - 1)) | (word2 << diff);
    
          restCode = word | (1 << 31);
        } else {
          uint32_t word = (buffer[indx + 3] << 24) | (buffer[indx + 2] << 16) | (buffer[indx + 1] << 8) | (buffer[indx]);

          // put the marker
          restCode = word | (1 << 31);
        }
    
        // after dev bits_consumed by 8, reminder should be also considered
        restCode >>= bits_consumed & 7;


        code = restCode & codeMask;
        restCode >>= codeBitSize;

        if (code == clearCode) {
          currentTableIndex = (1 << codeSize) + 2;

          codeBitSize = codeSize + 1;
          codeMask = (1 << codeBitSize) - 1;
          currentMaxTableSize = 1 << codeBitSize;
          prev = -1;
        } else if (code == stopCode) {
          free(codeTable);
          return;
        } else {
          int32_t ptr = code == currentTableIndex ? prev : code;

          if (prev != -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
            ptr = codeTable[ptr].first;

            codeTable[currentTableIndex].prev = prev;
            codeTable[currentTableIndex].byte = codeTable[ptr].byte;
            codeTable[currentTableIndex].length = codeTable[prev].length + 1;
            codeTable[currentTableIndex].first = codeTable[prev].first;

            currentTableIndex++;

            if (currentTableIndex == currentMaxTableSize && currentMaxTableSize != GIF_MAX_TABLE_SIZE) {
              codeBitSize++;
              codeMask = (1 << codeBitSize) - 1;
              currentMaxTableSize = 1 << codeBitSize;
            }
          }

          prev = code;

          ptr = code;

          uint32_t length = codeTable[code].length;

          if (outIndx + length < out_lenght) {
            for (int32_t i = length - 1; i >= 0; i--) {
              out_buffer[outIndx + i] = codeTable[ptr].byte;
              ptr = codeTable[ptr].prev;
            }

            outIndx += length;
          } else {
            free(codeTable);
            return;
          }
        }
      }
    }

    free(codeTable);
    return;
  }
}
