import { parseGif } from './parsing/gif';
import { Renderer } from './rendering/renderer';
import { GLRenderer } from './rendering/gl/renderer';
import { lzw_uncompress } from './parsing/lzw/uncompress/uncompress_debug';
import { createLZWFuncFromJS } from './parsing/lzw/factory/uncompress_factory_js';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

let gifRenderer: Renderer = null;

function handleFiles() {
  // if (gifRenderer) {
  //   gifRenderer.autoplayEnd();
  //   gifRenderer = null;
  // }

  const reader = new FileReader();
  reader.onload = function (e) {

    const arrayBuffer = e.target.result as ArrayBuffer;
    const gif = parseGif(arrayBuffer);

    console.log(gif);

    // createModule(gif.buffer, gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight)
    // .then((m) => {
    //   let currentIndx = 0;
    //   // let start = 0;

    //   const un = () => {
    //     // start = performance.now();
    //     m.lzw_uncompress(gif.images[currentIndx].startPointer + m.gifStartPointer, gif.images[currentIndx].compressedData.length, m.outStartPointer, m.outBuffer.length);
    //     // console.log('module unc', performance.now() - start);

    //     currentIndx = (currentIndx + 1) % gif.images.length;

    //     setTimeout(un, gif.images[currentIndx].graphicControl?.delayTime);
    //   }


    //   setTimeout(un, gif.images[0].graphicControl?.delayTime);
    // });

    const gifVisualizer = document.createElement('canvas');
    gifVisualizer.addEventListener('click', (e) => {
      const offset = e.offsetY * gifVisualizer.width + e.offsetX;
      const image = gif.images[13];
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

    createLZWFuncFromWasm(gif)
      .then((lzw_uncompress) => {
        gifRenderer = new GLRenderer(gif, gifVisualizer, { uncompress: lzw_uncompress });
        // gifRenderer.setFrame(67);
        gifRenderer.autoplayStart();
      });
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
