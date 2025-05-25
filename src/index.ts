import { parseGif } from './parsing/gif';
import { BasicRenderer } from './rendering/gl/renderer';
import { lzw_uncompress } from './parsing/lzw/uncompress/uncompress_debug';
import { createLZWFuncFromJS } from './parsing/lzw/factory/uncompress_factory_js';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { createGifEntity, GifEntity } from './parsing/new_gif/gif_entity';
import { createMadnessEffect, GLMadnessEffect, isMadnessEffect, MadnessEffectId } from './rendering/gl/effects/madness-effect';
import { BlackAndWhiteEffectId, createBlackAndWhiteEffect, GLBlackAndWhiteEffect, isBlackAndWhiteEffect } from './rendering/gl/effects/black-and-white-effect ';
import { Effect } from './rendering/api/effect';

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

          const effectListContent = document.createElement('div');
          const effectListData = document.createElement('div');
          const effectEditContainer = document.createElement('div');
          let effectEditor: HTMLDivElement | null;

          effectListContent.append(effectListData);
          effectListContent.append(effectEditContainer);

          function getEffectName(effectId: number): string | null {
            if (effectId === MadnessEffectId) {
              return 'Madness Effect';
            }

            if (effectId === BlackAndWhiteEffectId) {
              return 'Black And White Effect';
            }

            return null;
          }

          function addEffectNumberListener(fromInput: HTMLInputElement, li: HTMLElement, effect: Effect, setValue: (v: number) => void, index: number): void {
            fromInput.addEventListener('input', () => {
              const valueS = fromInput.value;
              if (!isNaN(Number(valueS))) {
                const value = Number(valueS);
                setValue(value);
                li.innerHTML = getEffectDesc(effect, index);
              }
            });
          }

          function createBlackAndWhiteEditorElement(effect: GLBlackAndWhiteEffect, li: HTMLElement, index: number): HTMLElement {
            const container = document.createElement('div');

            container.innerHTML = `<div>
              <div>
                <span>From</span>
                <input class="from-input" value="${effect.getFrom()}" />
              </div>
              <div>
                <span>To</span>
                <input class="to-input" value="${effect.getTo()}" />
              </div>
            </div>
            `;

            const fromInput: HTMLInputElement = container.querySelector('.from-input');
            addEffectNumberListener(fromInput, li, effect, v => effect.setFrom(v), index);

            const toInput: HTMLInputElement = container.querySelector('.to-input');
            addEffectNumberListener(toInput, li, effect, v => effect.setTo(v), index);

            return container;
          }

          function createMadnessEditorElement(effect: GLMadnessEffect, li: HTMLElement, index: number): HTMLElement {
            const container = document.createElement('div');

            container.innerHTML = `<div>
              <div>
                <span>From</span>
                <input class="from-input" value="${effect.getFrom()}" />
              </div>
              <div>
                <span>To</span>
                <input class="to-input" value="${effect.getTo()}" />
              </div>
              <div>
                <span>Alpha</span>
                <input class="alpha-input" value="${effect.getAlpha()}" />
              </div>
            </div>
            `;

            const fromInput: HTMLInputElement = container.querySelector('.from-input');
            addEffectNumberListener(fromInput, li, effect, v => effect.setFrom(v), index);

            const toInput: HTMLInputElement = container.querySelector('.to-input');
            addEffectNumberListener(toInput, li, effect, v => effect.setTo(v), index);

            const alphaInput: HTMLInputElement = container.querySelector('.alpha-input');
            addEffectNumberListener(alphaInput, li, effect, v => effect.setAlpha(v), index);

            return container;
          }

          function getEffectEditorComponent(effect: Effect, li: HTMLElement, index: number): HTMLElement | null {
            const container = document.createElement('div');

            if (isMadnessEffect(effect)) {
              container.append(createMadnessEditorElement(effect, li, index));
            }

            if (isBlackAndWhiteEffect(effect)) {
              container.append(createBlackAndWhiteEditorElement(effect, li, index));
            }

            return container;
          }

          function upodateEffectListListeners(effectListData: HTMLDivElement, effects: Effect[]) {
            const lis = effectListData.querySelectorAll('li');

            lis.forEach((li, i) => {
              li.addEventListener('click', () => {
                const effect = effects[i];

                if (effectEditor) {
                  effectEditContainer.removeChild(effectEditor);
                  effectEditor = null;
                }

                effectEditor = document.createElement('div');
                effectEditor.innerHTML = `<span>Editing: ${getEffectName(effect.getId())}</span>`;

                const editorElement = getEffectEditorComponent(effect, li, i);

                if (editorElement) {
                  effectEditor.append(editorElement);
                }

                effectEditContainer.append(effectEditor);
              });
            })
          }

          const getEffectDesc = (effect: Effect, index: number): string => `${index + 1}. ${getEffectName(effect.getId()) || 'Unknown Effect'} - from: ${effect.getFrom()}; to: ${effect.getTo()}`;
          const getEffectListContent = (effects: Effect[]): string => effects.length === 0 ? 'No effects' : '<ul>' +(effects.map((effect, i) => `<li> ${getEffectDesc(effect, i)} </li>`).join('\n')) + '</ul>';

          effectListData.innerHTML = getEffectListContent([]);
          upodateEffectListListeners(effectListData, []);

          glGifVisualizerContainer.append(glGifVisualizer);
          glGifVisualizerContainer.append(gifMetaData);
          glGifVisualizerContainer.append(glGifNextButton);

          container.append(glGifVisualizerContainer);
          container.append(effectListContent);

          renderer.addGifToRender(gif, glGifVisualizer, { uncompress: lzw_uncompress, algorithm: 'GL' })
            .then((descriptor) => {
              renderer.onEffectAdded(descriptor, (data) => {
                effectListData.innerHTML = getEffectListContent(data.effects);
                upodateEffectListListeners(effectListData, data.effects);
              });

              renderer.addEffectToGif(descriptor, 2, 30, data => createMadnessEffect(data));
              renderer.addEffectToGif(descriptor, 25, 45, data => createBlackAndWhiteEffect(data));

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
