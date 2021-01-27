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

function parseColorMap(buffer: ArrayBuffer) {
  return {
  }
}

function parseGif(buffer: ArrayBuffer) {
  const fromCharCode = String.fromCharCode;
  const HEAP8 = new Uint8Array(buffer);
  const HEAP16 = new Uint16Array(buffer);

  if (HEAP8[0] === G && HEAP8[1] === I && HEAP8[2] === F) {
    const version = `${fromCharCode(HEAP8[3])}${fromCharCode(HEAP8[4])}${fromCharCode(HEAP8[5])}`;
    const signature  = `GIF${version}`;

    const screenDescriptor = parseScreenDescriptor(buffer);
    let colorMap = null;

    if (screenDescriptor.M) {
      colorMap = parseColorMap(buffer);
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

function handleFiles() {
  var reader = new FileReader();
  reader.onload = function(e) {

    const arrayBuffer = e.target.result as ArrayBuffer;
    // const array = new Uint8Array(arrayBuffer);

    console.log(arrayBuffer);

    const gif = parseGif(arrayBuffer);

    console.log('descriptor', gif.signature);
    console.log('version', gif.version);

    console.log('screenDescriptor', gif.screenDescriptor);
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener("change", handleFiles, false);

main.append(fileInput);
