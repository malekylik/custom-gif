import { parseGif } from './parsing/gif';
import { BasicRenderer } from './rendering/gl/renderer';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { createGifEntity, GifEntity } from './parsing/new_gif/gif_entity';
import { createMadnessEffect } from './rendering/gl/effects/madness-effect';
import { createBlackAndWhiteEffect } from './rendering/gl/effects/black-and-white-effect ';
import { effect, root, signal } from '@maverick-js/signals';
import { GifVisualizer } from './ui/components/GifVisualizer/GifVisualizer';
import { attactComponent } from './ui/parsing/dom_utils';
import { createDarkingEffect } from './rendering/gl/effects/darking-effect ';
import { DarkingDirection } from './rendering/gl/render-pass/darking-pass';
import { WhiteRGBA } from './rendering/gl/effects/utils/rgba';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

let gifs: GifEntity[] = [];

function handleFiles() {
  const renderer = new BasicRenderer();

  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>): void {
    const arrayBuffer = e.target.result as ArrayBuffer;

    const parsedGifData = parseGif(arrayBuffer);

    if (parsedGifData) {
      const gif = createGifEntity(parsedGifData);

      createLZWFuncFromWasm(gif.gif)
        .then((lzw_uncompress) => {
          root((dispose) => {
            const container = document.createElement('div');

            let close = () => {};
            let rerender = () => {};

            const isPlay = signal(false);
            const currentFrameNumber = signal(1);
            const totalFrameNumber = signal(gif.gif.images.length);
            const effects = signal([]);
            const renderNext = signal(() => Promise.resolve());
            const gifVisualizer = GifVisualizer({ isPlay, renderNext, currentFrameNumber, totalFrameNumber, effects: effects, rerender: () => rerender(), onClose: () => close() });

            const remove = attactComponent(container, gifVisualizer);

            close = () => {
              renderer.dispose();
              remove();
              dispose();
              gifs = gifs.filter(_g => _g !== gif);
            };

            renderer.addGifToRender(gif, gifVisualizer.getCanvas(), { uncompress: lzw_uncompress, algorithm: 'GL' })
              .then((descriptor) => {
                rerender = () => {
                  if (!isPlay()) {
                    renderer.setFrame(descriptor, renderer.getCurrentFrame(descriptor));
                  }
                };

                renderer.onEffectAdded(descriptor, (data) => {
                  effects.set([...data.effects]);
                });

                renderer.onFrameRender(descriptor, (data) => {
                  currentFrameNumber.set(data.frameNumber + 1);
                });

                renderer.addEffectToGif(descriptor, 2, 30, data => createMadnessEffect(data));
                renderer.addEffectToGif(descriptor, 25, 45, data => createBlackAndWhiteEffect(data));
                renderer.addEffectToGif(descriptor, 1, 4, data => createDarkingEffect(data, { direction: DarkingDirection.in, color: WhiteRGBA }));

                effect(() => {
                  if (isPlay()) {
                    if (!renderer.autoplayStart(descriptor)) {
                      console.warn('Error to stop');
                    }
                  } else {
                    renderer.autoplayEnd(descriptor);
                  }
                });
                isPlay.set(true);

                renderNext.set(() => () => renderer.setFrame(descriptor, (renderer.getCurrentFrame(descriptor) + 1) % gif.gif.images.length));
            });

            main.append(container);

            // console.log('new gif: ', gif);

            gifs.push(gif);
        });
        });
    }
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
