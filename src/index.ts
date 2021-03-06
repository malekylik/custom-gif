import { parseGif } from './parsing/gif';
import { Renderer } from './rendering/renderer';
import { GLRenderer } from './rendering/gl/renderer';
import { lzw_uncompress } from './parsing/lzw/uncompress/uncompress_debug';
import { createLZWFuncFromJS } from './parsing/lzw/factory/uncompress_factory_js';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { ColorMapVisualizer, renderColorMap } from './rendering/color_map/color_map';
import { ColorMap } from './parsing/gif/color_map';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

function handleFiles() {
  const reader = new FileReader();
  reader.onload = function (e) {
    const arrayBuffer = e.target.result as ArrayBuffer;
    const gif = parseGif(arrayBuffer);

    console.log(gif);

    const container = document.createElement('div');
    const gifVisualizer = document.createElement('canvas');

    const changeInput = document.createElement('input');
    changeInput.type = 'text';
    changeInput.value = '0';

    container.append(gifVisualizer);
    container.append(changeInput);

    main.append(container);

    createLZWFuncFromWasm(gif)
      .then((lzw_uncompress) => {
        let gifRenderer = new GLRenderer(gif, gifVisualizer, { uncompress: lzw_uncompress });
        gifRenderer.autoplayStart();

        changeInput.addEventListener('change', (e: InputEvent) => {
          const value = parseInt((e.target as any).value);

          if (!isNaN(value) && (value < gif.images.length && value >= 0)) {
            const setFramePromise = gifRenderer.setFrame(value);
          }
        });
      });
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
