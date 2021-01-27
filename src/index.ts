// GIF-87
const G = 71;
const I = 73;
const F = 70;

const descriptorsStart = 6;
const colorMapStart = descriptorsStart + 7;

function parseScreenDescriptor(buffer: ArrayBuffer) {
  const HEAP8 = new Uint8Array(buffer);
  const HEAP16 = new Uint16Array(buffer);

  if (HEAP8[descriptorsStart + 6] !== 0) {
    console.warn('Invalid Screen Descriptor section: last byte should be 0');
  }

  const screenWidth = HEAP16[(descriptorsStart + 0) >> 1];
  const screenHeight = HEAP16[(descriptorsStart + 2) >> 1];

  const M = HEAP8[descriptorsStart + 4] >> 7;
  const cr = ((HEAP8[descriptorsStart + 4] & 0b01110000) >> 4) + 1;
  const pixel = (HEAP8[descriptorsStart + 4] & 0b00000111) + 1;
  const background = HEAP8[descriptorsStart + 5]

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
    entriesCount: 2 ** bitsPerPixel,

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

function parseGif(buffer: ArrayBuffer) {
  if (buffer.byteLength & 1) {
    const _buffer = new ArrayBuffer(buffer.byteLength + 1);
    new Uint8Array(_buffer).set(new Uint8Array(buffer));
    buffer = _buffer;
  }

  const fromCharCode = String.fromCharCode;
  const HEAP8 = new Uint8Array(buffer);
  const HEAP16 = new Uint16Array(buffer);

  if (HEAP8[0] === G && HEAP8[1] === I && HEAP8[2] === F) {
    const version = `${fromCharCode(HEAP8[3])}${fromCharCode(HEAP8[4])}${fromCharCode(HEAP8[5])}`;
    const signature  = `GIF${version}`;

    const screenDescriptor = parseScreenDescriptor(buffer);
    let colorMap = null;

    if (screenDescriptor.M) {
      colorMap = parseColorMap(buffer, screenDescriptor.pixel);
    }

    return {
      signature,
      version,

      screenDescriptor,
      colorMap,
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

function handleFiles() {
  var reader = new FileReader();
  reader.onload = function(e) {

    const arrayBuffer = e.target.result as ArrayBuffer;

    console.log(arrayBuffer);

    const gif = parseGif(arrayBuffer);

    console.log('descriptor', gif.signature);
    console.log('version', gif.version);

    console.log('screenDescriptor', gif.screenDescriptor);
    console.log('colorMap', gif.colorMap);

    for (let i = 0; i < gif.colorMap.entriesCount; i++) {
      colorMapImageData.data[i * 4 + 0] = gif.colorMap.getRed(i);
      colorMapImageData.data[i * 4 + 1] = gif.colorMap.getGreen(i);
      colorMapImageData.data[i * 4 + 2] = gif.colorMap.getBlue(i);
      colorMapImageData.data[i * 4 + 3] = 255;
    }

    colorMapVisualizerCtx.putImageData(colorMapImageData, 0, 0);
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener("change", handleFiles, false);

main.append(fileInput);
main.append(colorMapVisualizer);
