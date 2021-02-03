// GIF-87
const G = 71;
const I = 73;
const F = 70;

// if (i - this.position > 146480 && i - this.position < 146500) {
//   console.log(i - this.position - 3, code);
// }

const EXTENSION_BLOCK_LABEL = 33;

const APPLICATION_EXTENSION_LABEL = 255;

const IMAGE_SEPARATOR = 44; // ','
const GIF_TERMINATION = 59; // ';'

const COLORS_IN_ENTRY = 3;
const IMAGE_DESCRIPTOR_LENGTH = 10;

const GIF_MAX_CODE_SIZE_BITS = 12;

const descriptorsStart = 6;
const colorMapStart = descriptorsStart + 7;

function findNextImageSeparator(buffer: ArrayBuffer, start = 0): number {
  const HEAP8 = new Uint8Array(buffer);

  for (; start < HEAP8.byteLength && HEAP8[start] !== GIF_TERMINATION; start++) {
    if (HEAP8[start] === IMAGE_SEPARATOR) {
      return start;
    }
  }

  return -1;
}

function parseScreenDescriptor(buffer: ArrayBuffer) {
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[descriptorsStart + 6] !== 0) {
    console.warn('Invalid Screen Descriptor section: last byte should be 0');
  }

  const screenWidth = HEAP8[descriptorsStart + 0] | (HEAP8[descriptorsStart + 1] << 8);
  const screenHeight = HEAP8[descriptorsStart + 2] | (HEAP8[descriptorsStart + 3] << 8);

  const M = HEAP8[descriptorsStart + 4] >> 7;
  const cr = ((HEAP8[descriptorsStart + 4] & 0b01110000) >> 4) + 1;
  const pixel = (HEAP8[descriptorsStart + 4] & 0b00000111) + 1;
  const background = HEAP8[descriptorsStart + 5];

  return {
    screenWidth,
    screenHeight,

    M,
    cr,
    pixel,
    background,
  }
}

function parseColorMap(buffer: ArrayBuffer, bitsPerPixel: number) {
  const HEAP8 = new Uint8Array(buffer);

  return {
    entriesCount: 1 << bitsPerPixel,

    getRed(index: number): number {
      return HEAP8[colorMapStart + (index * 3 + 0)];
    },

    getGreen(index: number): number {
      return HEAP8[colorMapStart + (index * 3 + 1)];
    },

    getBlue(index: number): number {
      return HEAP8[colorMapStart + (index * 3 + 2)];
    },

    getColor(index: number) {
      return {
        red: this.getRed(index),
        green: this.getGreen(index),
        blue: this.getBlue(index),
      }
    },
  }
}

function parseImageDescriptor(buffer: ArrayBuffer, imagesDescriptorOffset: number) {
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[imagesDescriptorOffset] !== IMAGE_SEPARATOR) {
    console.warn(`Invalid image descriptor: ${imagesDescriptorOffset}. Image desriptor doesn't start with ','`);
  }

  const imageLeft = HEAP8[imagesDescriptorOffset + 1] | (HEAP8[imagesDescriptorOffset + 2] << 8);
  const imageTop = HEAP8[imagesDescriptorOffset + 3] | (HEAP8[imagesDescriptorOffset + 4] << 8);
  const imageWidth = HEAP8[imagesDescriptorOffset + 5] | (HEAP8[imagesDescriptorOffset + 6] << 8);
  const imageHeight = HEAP8[imagesDescriptorOffset + 7] | (HEAP8[imagesDescriptorOffset + 8] << 8);

  const M = HEAP8[imagesDescriptorOffset + 9] >> 7;
  const I = (HEAP8[imagesDescriptorOffset + 9] >> 6) & 0b1;
  const pixel = (HEAP8[imagesDescriptorOffset + 9] & 0b00000111) + 1;

  return {
    imageLeft,
    imageTop,
    imageWidth,
    imageHeight,

    M,
    I,
    pixel,

    compressedData: (null as Uint8Array),
  }
}

function findEndOfSubData(buffer: ArrayBuffer, start: number) {
  const HEAP8 = new Uint8Array(buffer);

  while (HEAP8[start] && start < HEAP8.byteLength) {
    const chunkLength = HEAP8[start];

    start += chunkLength + 1;
  }

  return start + 1;
}

function findEndOfImageCompressedData(buffer: ArrayBuffer, start: number) {
  start += 1; // LZW Minimum Code Size byte

  return findEndOfSubData(buffer, start);
}

function parseImageList(buffer: ArrayBuffer, start: number) {
  const HEAP8 = new Uint8Array(buffer);
  const images = [];
  let image = null;

  while (start < HEAP8.byteLength && start !== -1) {
    switch (HEAP8[start]) {
      case EXTENSION_BLOCK_LABEL: {
        start++;

        const extensionType = HEAP8[start++];
        // console.log('extensionType', extensionType);

        start = findEndOfSubData(buffer, start);
        break;
      }

      case IMAGE_SEPARATOR: {
        image = parseImageDescriptor(buffer, start);
        images.push(image);

        start += IMAGE_DESCRIPTOR_LENGTH;

        if (image.M) {
          start += (1 << image.pixel) * COLORS_IN_ENTRY;
        }

        image.compressedData = HEAP8.subarray(start, findEndOfImageCompressedData(buffer, start));
        start += image.compressedData.byteLength;

        break;
      }

      default: {
        start++;
        break;
      }
    }
  }

  return images;
}

const GIF_MAX_TABLE_SIZE = 1 << GIF_MAX_CODE_SIZE_BITS;

function lzw_uncompress(buffer: Uint8Array, outBuffer: Uint8Array | Uint8ClampedArray) {
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
        return outBuffer;
      } else {
        let ptr = code === currentTableIndex ? prev : code;

        if (prev !== -1 && currentTableIndex < GIF_MAX_TABLE_SIZE) {
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
          return outBuffer;
        }
      }
    }
  }

  return outBuffer;
}

function parseGif(buffer: ArrayBuffer) {
  const fromCharCode = String.fromCharCode;
  const HEAP8 = new Uint8Array(buffer);

  if (HEAP8[0] === G && HEAP8[1] === I && HEAP8[2] === F) {
    const version = Number(fromCharCode(HEAP8[3])) * 10 + Number(fromCharCode(HEAP8[4]));
    const signature = `GIF${version}${fromCharCode(HEAP8[5])}`;

    const screenDescriptor = parseScreenDescriptor(buffer);
    let imagesDescriptorStart = colorMapStart;
    let colorMap = null;

    if (screenDescriptor.M) {
      colorMap = parseColorMap(buffer, screenDescriptor.pixel);
      imagesDescriptorStart += (colorMap.entriesCount * COLORS_IN_ENTRY);
    }

    const images = parseImageList(buffer, imagesDescriptorStart)

    return {
      signature,
      version,

      screenDescriptor,
      colorMap,

      images,
    }
  }
}

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

const colorMapVisualizer = document.createElement('canvas');
colorMapVisualizer.width = 16;
colorMapVisualizer.height = 16;
colorMapVisualizer.style.width = `${256}px`;
colorMapVisualizer.style.height = `${256}px`;
const colorMapVisualizerCtx = colorMapVisualizer.getContext('2d');
const colorMapImageData = new ImageData(16, 16);


const gifVisualizer = document.createElement('canvas');
gifVisualizer.width = 256;
gifVisualizer.height = 256;
gifVisualizer.style.width = `${256}px`;
gifVisualizer.style.height = `${256}px`;
const gifVisualizerCtx = gifVisualizer.getContext('2d');
let gifImageData = new ImageData(16, 16);

function handleFiles() {
  var reader = new FileReader();
  reader.onload = function (e) {

    const arrayBuffer = e.target.result as ArrayBuffer;

    console.log(arrayBuffer);

    const gif = parseGif(arrayBuffer);

    console.log('descriptor', gif.signature);
    console.log('version', gif.version);

    console.log('screenDescriptor', gif.screenDescriptor);
    console.log('colorMap', gif.colorMap);

    console.log('images', gif.images);

    gifImageData = new ImageData(gif.images[0].imageWidth, gif.images[0].imageHeight);

    gifVisualizer.width = gif.images[0].imageWidth;
    gifVisualizer.height = gif.images[0].imageHeight;
    gifVisualizer.style.width = `${gif.images[0].imageWidth}px`;
    gifVisualizer.style.height = `${gif.images[0].imageHeight}px`;

    const uncompressed = new Uint8Array(gif.images[0].imageWidth * gif.images[0].imageHeight);
    lzw_uncompress(gif.images[0].compressedData, uncompressed);

    console.log('uncompressed',);

    for (let i = 0; i < gif.colorMap.entriesCount; i++) {
      colorMapImageData.data[i * 4 + 0] = gif.colorMap.getRed(i);
      colorMapImageData.data[i * 4 + 1] = gif.colorMap.getGreen(i);
      colorMapImageData.data[i * 4 + 2] = gif.colorMap.getBlue(i);
      colorMapImageData.data[i * 4 + 3] = 255;
    }

    for (let i = 0; i < gifImageData.data.length; i++) {
      gifImageData.data[i * 4 + 0] = gif.colorMap.getRed(uncompressed[i]);
      gifImageData.data[i * 4 + 1] = gif.colorMap.getGreen(uncompressed[i]);
      gifImageData.data[i * 4 + 2] = gif.colorMap.getBlue(uncompressed[i]);
      gifImageData.data[i * 4 + 3] = 255;
    }

    colorMapVisualizerCtx.putImageData(colorMapImageData, 0, 0);
    gifVisualizerCtx.putImageData(gifImageData, 0, 0);
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener("change", handleFiles, false);

main.append(fileInput);
main.append(colorMapVisualizer);
main.append(gifVisualizer);
