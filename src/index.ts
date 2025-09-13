import { parseGif } from './parsing/gif';
import { BasicRenderer } from './rendering/gl/renderer';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { createGifEntity, GifEntity } from './parsing/new_gif/gif_entity';
import { createMadnessEffect } from './rendering/gl/effects/madness-effect';
import { createBlackAndWhiteEffect } from './rendering/gl/effects/black-and-white-effect ';
import { Effect } from './rendering/api/effect';
import { effect, signal } from '@maverick-js/signals';
import { GifVisualizer } from './ui/components/GifVisualizer/GifVisualizer';

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

          const isPlay = signal(false);
          const currentFrameNumber = signal(1);
          const totalFrameNumber = signal(gif.gif.images.length);
          const effects = signal([]);
          const renderNext = signal(() => Promise.resolve());
          const gifVisualizer = GifVisualizer({ isPlay, renderNext, currentFrameNumber, totalFrameNumber, effects: effects });

          container.append(gifVisualizer.element);

          renderer.addGifToRender(gif, gifVisualizer.getCanvas(), { uncompress: lzw_uncompress, algorithm: 'GL' })
            .then((descriptor) => {
              renderer.onEffectAdded(descriptor, (data) => {
                effects.set([...data.effects]);
              });

              renderer.addEffectToGif(descriptor, 2, 30, data => createMadnessEffect(data));
              renderer.addEffectToGif(descriptor, 25, 45, data => createBlackAndWhiteEffect(data));

              // TODO: call inside root - ?
              effect(() => {
                if (isPlay()) {
                  if (!renderer.autoplayStart(descriptor)) {
                    // TODO: hm use onError ?
                    console.warn('Error to stop');
                  }
                } else {
                  renderer.autoplayEnd(descriptor);
                }
              });
              isPlay.set(true);

              renderNext.set(() => () => renderer.setFrame(descriptor, (renderer.getCurrentFrame(descriptor) + 1) % gif.gif.images.length));

              renderer.onFrameRender(descriptor, (data) => {
                currentFrameNumber.set(data.frameNumber + 1);
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
