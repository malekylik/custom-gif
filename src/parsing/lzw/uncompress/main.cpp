// emcc .\main.cpp -o out.js --minify 0 -s ENVIRONMENT="web" -O3 -s MODULARIZE=1 -s 'EXPORT_NAME="createLZWModule"' -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"cwrap\"]' -s 'ALLOW_MEMORY_GROWTH=true' -s 'TOTAL_MEMORY=65536' -s ASSERTIONS=1 -s SAFE_HEAP=1 -s 'TOTAL_STACK=32768' -s "EXPORTED_FUNCTIONS=['_lzw_uncompress', '_malloc']"

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define GIF_MAX_CODE_SIZE_BITS 12
#define GIF_MAX_TABLE_SIZE (1 << GIF_MAX_CODE_SIZE_BITS)

struct CodeTable {
	int16_t prev;
	int16_t byte;
	int32_t length;
};

extern "C" {
	void lzw_uncompress(uint8_t *buffer, uint32_t bufferLength, uint8_t *outBuffer, uint32_t outBufferLength)
	{
		CodeTable *codeTable = (CodeTable *)malloc(sizeof(CodeTable)* GIF_MAX_TABLE_SIZE);
		uint32_t indx = 0;
		uint32_t outIndx = 0;
		uint32_t code = 0;
		uint32_t codeSize = buffer[indx++];
		uint32_t clearCode = 1 << codeSize;
		uint32_t stopCode = clearCode + 1;
		uint32_t codeBitSize = codeSize + 1;
		uint32_t currentMaxTableSize = 1 << codeBitSize;
		uint32_t codeMask = (1 << codeBitSize) - 1;
		uint32_t prev = -1;
		uint32_t restCode = 0;
		uint32_t readedBits = 0;
		uint32_t currentTableIndex = 1 << codeSize;
		uint32_t blockSize = 0;

		for (uint32_t i = 0; i < currentTableIndex; i++) {
			codeTable[i].prev = -1;
			codeTable[i].byte = i;
			codeTable[i].length = 1;
		}

		currentTableIndex++; // clear code
		currentTableIndex++; // stop code

		while (indx < bufferLength && buffer[indx] != 0) {
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
				}
				else if (code == stopCode) {
					free(codeTable);
					return;
				}
				else {
					int32_t ptr = code == currentTableIndex ? prev : code;

					if (prev != -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
						while (codeTable[ptr].prev != -1) {
							ptr = codeTable[ptr].prev;
						}

						codeTable[currentTableIndex].prev = prev; // prev
						codeTable[currentTableIndex].byte = codeTable[ptr].byte; // byte
						codeTable[currentTableIndex].length = codeTable[prev].length + 1; // length

						currentTableIndex++;

						if (currentTableIndex == currentMaxTableSize && currentMaxTableSize != GIF_MAX_TABLE_SIZE) {
							codeBitSize++;
							codeMask = (1 << codeBitSize) - 1;
							currentMaxTableSize = 1 << codeBitSize;
						}
					}

					prev = code;

					ptr = code;

					if (outIndx + codeTable[ptr].length < outBufferLength) {
						while (ptr != -1) {
							outBuffer[outIndx + codeTable[ptr].length - 1] = codeTable[ptr].byte;
							ptr = codeTable[ptr].prev;
						}

						outIndx += codeTable[code].length;
					}
					else {
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
