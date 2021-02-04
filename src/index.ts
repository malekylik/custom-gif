import { parseGif } from './parsing/gif';
import { lzw_uncompress } from './parsing/lzw/uncompress';

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

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
main.append(colorMapVisualizer);
main.append(gifVisualizer);
