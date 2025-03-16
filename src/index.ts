import { parseGif } from './parsing/gif';
import { BasicRenderer } from './rendering/gl/renderer';
import { lzw_uncompress } from './parsing/lzw/uncompress/uncompress_debug';
import { createLZWFuncFromJS } from './parsing/lzw/factory/uncompress_factory_js';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { createGifEntity, GifEntity } from './parsing/new_gif/gif_entity';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

const gifs: GifEntity[] = [];
const renderer = new BasicRenderer();

function handleFiles() {
  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>): void {
    const arrayBuffer = e.target.result as ArrayBuffer;

    const parsedGifData = parseGif(arrayBuffer);

    if (parsedGifData) {
      const gif = createGifEntity(parsedGifData);

      createLZWFuncFromWasm(gif.gif)
        .then((lzw_uncompress) => {
          const container = document.createElement('div');
          const gifVisualizer = document.createElement('canvas');

          container.append(gifVisualizer);

          main.append(container);

          renderer.addGifToRender(gif, gifVisualizer, { uncompress: lzw_uncompress, algorithm: 'Software' })
            .then((descriptor) => {
              renderer.autoplayStart(descriptor);
            });


          // changeInput.addEventListener('change', (e: InputEvent) => {
          //   const value = parseInt((e.target as any).value);

          //   if (!isNaN(value) && (value < gif.images.length && value >= 0)) {
          //     const setFramePromise = gifRenderer.setFrame(value);
          //   }
          // });

          console.log('new gif: ', gif);

          gifs.push(gif);
        });
    }

    // const arrayBuffer = e.target.result as ArrayBuffer;
    // const gif = parseGif(arrayBuffer);

    // console.log(gif);

    // const container = document.createElement('div');
    // const gifVisualizer = document.createElement('canvas');

    // const changeInput = document.createElement('input');
    // changeInput.type = 'text';
    // changeInput.value = '0';

    // container.append(gifVisualizer);
    // container.append(changeInput);

    // main.append(container);

    // createLZWFuncFromWasm(gif)
    //   .then((lzw_uncompress) => {
    //     let gifRenderer = new GLRenderer(gif, gifVisualizer, { uncompress: lzw_uncompress });
    //     gifRenderer.autoplayStart();

    //     changeInput.addEventListener('change', (e: InputEvent) => {
    //       const value = parseInt((e.target as any).value);

    //       if (!isNaN(value) && (value < gif.images.length && value >= 0)) {
    //         const setFramePromise = gifRenderer.setFrame(value);
    //       }
    //     });
    //   });
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
