import { parseGif } from './parsing/gif';
import { Renderer } from './rendering/renderer';
import { GLRenderer } from './rendering/gl/renderer';
import { BaseRenderer } from './rendering/base/renderer';
import { renderColorMap } from './rendering/color_map/color_map';
import { lzw_uncompress } from './parsing/lzw/uncompress';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

let gifRenderer: Renderer = null;

function handleFiles() {
  if (gifRenderer) {
    gifRenderer.autoplayEnd();
    gifRenderer = null;
  }

  const reader = new FileReader();
  reader.onload = function (e) {

    const arrayBuffer = e.target.result as ArrayBuffer;
    const gif = parseGif(arrayBuffer);

    const gifVisualizer = document.createElement('canvas');
    gifVisualizer.addEventListener('click', (e) => {
      const offset = e.offsetY * gifVisualizer.width + e.offsetX;
      const image = gif.images[0];
      const colorMap = image.colorMap ?? gif.colorMap;
      console.log(e.offsetX, e.offsetY, offset);
      console.log(image.graphicControl);
      const buffer = new Uint8Array(image.imageWidth * image.imageHeight);
      lzw_uncompress(image.compressedData, buffer);

      const start = Math.max(0, offset - 10)
      console.log(`color`, colorMap.getColor(buffer[offset]));
      console.log(buffer);
      console.log('indexes', offset - start, buffer.subarray(start, start + 20));
    });
    main.append(gifVisualizer);

    // gifRenderer = new BaseRenderer(gif, gifVisualizer);
    gifRenderer = new GLRenderer(gif, gifVisualizer);
    // gifRenderer.setFrame(67);
    gifRenderer.autoplayStart();
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
