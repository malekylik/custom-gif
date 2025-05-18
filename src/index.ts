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

          const glGifVisualizerContainer = document.createElement('div');
          const glGifVisualizer = document.createElement('canvas');

          const gifMetaData = document.createElement('div');

          const glGifFrameNumber = document.createElement('span');

          const glGifStopButton = document.createElement('button');
          const glGifNextButton = document.createElement('button');

          gifMetaData.append(glGifFrameNumber);
          gifMetaData.append(glGifStopButton);

          const getCurrentFrameText = (currentFrame: number, totalNumber: number) => `${currentFrame} / ${totalNumber}`;
          const getPlayButtonText = (isRunning: boolean) => isRunning ? 'stop' : 'play';

          glGifStopButton.textContent = getPlayButtonText(false);
          glGifFrameNumber.textContent = getCurrentFrameText(1, gif.gif.images.length);
          glGifNextButton.textContent = 'Next';

          glGifNextButton.disabled = true;

          glGifVisualizerContainer.append(glGifVisualizer);
          glGifVisualizerContainer.append(gifMetaData);
          glGifVisualizerContainer.append(glGifNextButton);

          container.append(glGifVisualizerContainer);

          renderer.addGifToRender(gif, glGifVisualizer, { uncompress: lzw_uncompress, algorithm: 'GL' })
            .then((descriptor) => {
              let isRun = false;

              if (renderer.autoplayStart(descriptor)) {
                isRun = true;
                glGifStopButton.textContent = getPlayButtonText(isRun);
              } else {
                glGifNextButton.disabled = false;
              }

              let setting = false;
              glGifNextButton.addEventListener('click', () => {
                if (!setting) {
                  setting = true;
                  renderer.setFrame(descriptor, (renderer.getCurrentFrame(descriptor) + 1) % gif.gif.images.length)
                    .then(() => setting = false);
                }
              });

              glGifStopButton.addEventListener('click', () => {
                if (isRun) {
                  renderer.autoplayEnd(descriptor);
                  isRun = false;
                } else {
                  if (renderer.autoplayStart(descriptor)) {
                    isRun = true;
                  }
                }

                glGifStopButton.textContent = getPlayButtonText(isRun);
                glGifNextButton.disabled = isRun;
              });

              renderer.onFrameRender(descriptor, (data) => {
                glGifFrameNumber.innerText = getCurrentFrameText(data.frameNumber + 1, data.totalFrameNumber);
              })
          });

          main.append(container);


          console.log('new gif: ', gif);

          gifs.push(gif);
        });
    }
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
