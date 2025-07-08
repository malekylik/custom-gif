import { parseGif } from './parsing/gif';
import { BasicRenderer } from './rendering/gl/renderer';
import { createLZWFuncFromWasm } from './parsing/lzw/factory/uncompress_factory_wasm';
import { createGifEntity, GifEntity } from './parsing/new_gif/gif_entity';
import { createMadnessEffect, GLMadnessEffect, isMadnessEffect, MadnessEffectId } from './rendering/gl/effects/madness-effect';
import { BlackAndWhiteEffectId, createBlackAndWhiteEffect, GLBlackAndWhiteEffect, isBlackAndWhiteEffect } from './rendering/gl/effects/black-and-white-effect ';
import { Effect } from './rendering/api/effect';
import { effect, onDispose, ReadSignal, root, signal, WriteSignal } from '@maverick-js/signals';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

const gifs: GifEntity[] = [];
const renderer = new BasicRenderer();

let parseId = 0;



function getParseId() {
  return parseId++;
}

function getNewId() {
  let id = 0;

  return () => id++;
}

let elementStart: '<' = '<';
let intermediateStart: '</' = '</';
let intermediateEnd: '>' = '>';
let elementEnd: '/>' = '/>';
let skipableSymbol = new Set<string>(['\n', ' ']);

// let skipableSymbol = new Set<string>(['\n', ' ']);

type ParsedElement = {
  tag: 'div' | 'span' | string | undefined;
  properties: unknown[];
  bindings: [];
  events: [],
  children: ParsedElement[];
}

function parseHTML(templateParts: TemplateStringsArray, ...values: unknown[]): ParsedElement {
  const root: ParsedElement = {
    tag: undefined,
    properties: [],
    bindings: [],
    events: [],
    children: [],
  };
  let currentParsingElement = root;
  let currentTemplateStringIndex = 0;
  let currentValueIndex = 0;

  parseElement();

  return root;

    function getCurrentChar(slice = 1): string {
    return templateParts[currentTemplateStringIndex].slice(currentValueIndex, currentValueIndex + slice) || '';
  }

  function advanceIndex(advance = 1): void {
    currentValueIndex += advance;
  }

  function skip() {
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    // TODO: check if we reach end of template string by skiping
    while (currentValueIndex < currentTemplateString.length && skipableSymbol.has(currentTemplateString[currentValueIndex])) {
      currentValueIndex++;
    }
  }

  function parseElementTag(): string {
    let tagStart = currentValueIndex;
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentValueIndex < currentTemplateString.length && !skipableSymbol.has(currentTemplateString[currentValueIndex]) && currentTemplateString[currentValueIndex] !== intermediateEnd) {
      currentValueIndex++;
    }

    return currentTemplateString.slice(tagStart, currentValueIndex);
  }

  function parseElement() {
    skip();

    parseElementStart();

    // function parse children
    parseChildren();

    parseElementEnd();
  }

  function parseElementStart() {
    if (getCurrentChar() === elementStart) {
      advanceIndex();
    } else {
      console.warn('Error during parseElementStart 1');
    }

    const tag = parseElementTag();

    currentParsingElement.tag = tag;

    skip();

    parseAttribs();

    if (getCurrentChar() === intermediateEnd) {
      advanceIndex();
    } else {
      console.warn('Error during parseElementStart 2');
    }

    return tag;
  }

  function parseAttribs() {
    while (getCurrentChar() !== intermediateEnd) {
      skip();

      const attribName = parseAttribName();

      if (getCurrentChar() !== '=') {
        console.warn('Error during parseAttribs 1');
      }

      advanceIndex();

      const attibValue = parseAttribValue();

      currentParsingElement.properties.push([[attribName, attibValue]]);

      skip();
    }
  }

  function parseAttribName(): string {
    let tagStart = currentValueIndex;
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentValueIndex < currentTemplateString.length && currentTemplateString[currentValueIndex] !== '=') {
      currentValueIndex++;
    }

    return currentTemplateString.slice(tagStart, currentValueIndex);
  }

  function parseAttribValue() {
    if (getCurrentChar() !== '"') {
      console.warn('Error during parseAttribValue 1');
    }

    advanceIndex();

    if (isNextTemplateValue()) {
      // const templateValue = getNextTemplateValue();

      // // do some stuff with template value

      // advanceTemplateValueIndex();
    } else {
      // we just have a string value, just parse it

      let tagStart = currentValueIndex;
      let currentTemplateString = templateParts[currentTemplateStringIndex];

      while (currentValueIndex < currentTemplateString.length && (currentTemplateString[currentValueIndex] !== '"')) {
        currentValueIndex++;
      }

      let attibValue = currentTemplateString.slice(tagStart, currentValueIndex);

      end();

      return attibValue;
    }

    function end() {
      if (getCurrentChar() !== '"') {
        console.warn('Error during parseAttribValue 2');
      }

      advanceIndex();
    }
  }

  function isNextTemplateValue(): boolean {
    return templateParts[currentTemplateStringIndex].length - 1 === currentValueIndex;
  }

  function parseChildren() {
    while (true) {
      skip();

      if (getCurrentChar() === elementStart && getCurrentChar(2) !== intermediateStart) {
        const parent = currentParsingElement;

        currentParsingElement = {
          tag: undefined,
          properties: [],
          bindings: [],
          events: [],
          children: [],
        }

        parent.children.push(currentParsingElement);

        parseElement();

        currentParsingElement = parent;
      } else {
        break;
      }
    }

    skip();
  }

  function parseElementEnd() {
    if (getCurrentChar(2) === intermediateStart) {
      advanceIndex(2);
    } else {
      console.warn('Error during parseElementEnd 1');
    }

    const closingTag = parseElementTag();

    if (closingTag !== currentParsingElement.tag) {
      console.warn('Error during parseElementEnd 2');
    }

    skip();

    if (getCurrentChar() === intermediateEnd) {
      advanceIndex();
    } else {
      console.warn('Error during parseElementEnd 4');
    }
  }
}

// TODO: implement and check with trees
function parsedToStr(root: ParsedElement): string {
  let result = '';
  let currentElement: ParsedElement | null = root;
  let level = 1;

  elementToStr();

  return result;

  function elementToStr() {
      result += `${new Array(level).join(' ')}${elementStart}${currentElement.tag}`;

      result += intermediateEnd;

      if (currentElement.children.length > 0) {
        result += '\n';
      }

      renderChildren();

      if (currentElement.children.length > 0) {
        result += new Array(level).join(' ');
      }

      result += `${intermediateStart}${currentElement.tag}${intermediateEnd}`;

      result += '\n';
  }

  function renderChildren() {
    level += 1;

    let savedElement = currentElement;

    for (let i = 0; i < currentElement.children.length; i++) {
      currentElement = currentElement.children[i];

      elementToStr();

      currentElement = savedElement;
    }

    level -= 1;
  }
}

function html(templateParts: TemplateStringsArray, ...values: unknown[]): { element: HTMLElement; dispose: () => void; } {
  let tree = parseHTML(templateParts, values);
  let strTree = parsedToStr(tree);

  console.log(tree);
  console.log(strTree);

  const templateId = getParseId();
  const idGetter = getNewId();

  console.log('html', values, templateParts);
  const container = document.createElement('div');
  let dispose = () => {};

  let signalsToUpdate: Array<{ selector: string; signal: ReadSignal<unknown> }> = [];

  let resultHtml = templateParts.length > 0 ? templateParts[0] : '';

  for (let i = 1; i < templateParts.length; i++) {
    const value = values[i - 1];
    if (typeof value === 'function') {
      const selector = `parsed-element-${templateId}-${idGetter()}`;

      resultHtml = resultHtml.slice(0, resultHtml.length - 2) + ` class="${selector}" >`;

      signalsToUpdate.push({ selector, signal: value as ReadSignal<unknown> });

      resultHtml += templateParts[i];
    } else {
      resultHtml += String(value) + templateParts[i];
    }
  }

  console.log('result html', resultHtml);

  container.innerHTML = resultHtml;

  if (signalsToUpdate.length > 0) {
    root((_dispose) => {
      dispose = _dispose;

      for (let i = 0; i < signalsToUpdate.length; i++) {
        const signalToUpdate = signalsToUpdate[0];
        let elemet = container.querySelector('.' + signalToUpdate.selector);

        if (elemet) {
          effect(() => {
            elemet.innerHTML = String(signalToUpdate.signal());
          });
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + signalToUpdate.selector);
        }
      }
    });
  }

  return { element: container, dispose };
}

function toEvent(f: Function): string {
  return f as unknown as string;
}

html`

  <div  >   
    <div class="some class shit"></div>
    <span input="input-value" ></span  >

  </div>

  `;


// const listen = <T extends Element> (element: T, type: string, callback: () => void) => {
//   element.addEventListener(type, callback);
//   // Called when the effect is re-run or finally disposed.
//   onDispose(() => element.removeEventListener(type, callback));
// };

// function getGifMeta(props: { totalFrameNumber: ReadSignal<number>; currentFrameNumber: ReadSignal<number>; isPlay: WriteSignal<boolean>; renderNext: ReadSignal<() => Promise<void>> }): { element: HTMLElement; dispose: () => void; } {
//   return root((dispose) => {
//     const isSetting = signal(false);

//     const gifMetaData = document.createElement('div');

//     const view = html`
//       <div>
//         <div onClick="${toEvent(props.currentFrameNumber)}">${() => `${props.currentFrameNumber()} / ${props.totalFrameNumber()}`}</div>
//         <div>
//           <button class="gif-meta-button-play">Stop</button>
//           <button class="gif-meta-button-next">Next</button>
//         </div>
//       </div>
//     `;

//     gifMetaData.appendChild(view.element);

//     const playButton = gifMetaData.querySelector('.gif-meta-button-play');
//     effect(() => { playButton.textContent = props.isPlay() ? 'Stop' : 'Play'; });
//     effect(() => {
//       listen(playButton, 'click', () => {
//         props.isPlay.set((v) => !v);
//       })
//     });

//     const nextButton: HTMLButtonElement = gifMetaData.querySelector('.gif-meta-button-next');
//     effect(() => { nextButton.disabled = props.isPlay(); });
//     effect(() => {
//       listen(nextButton, 'click', () => {
//         if (!isSetting()) {
//           isSetting.set(true);
//           props.renderNext()().then(() => isSetting.set(false));
//         }
//       })
//     });

//     return ({ element: gifMetaData, dispose: () => { dispose(); view.dispose(); } });
//   });
// }

// function handleFiles() {
//   const reader = new FileReader();
//   reader.onload = function (e: ProgressEvent<FileReader>): void {
//     const arrayBuffer = e.target.result as ArrayBuffer;

//     const parsedGifData = parseGif(arrayBuffer);

//     if (parsedGifData) {
//       const gif = createGifEntity(parsedGifData);

//       createLZWFuncFromWasm(gif.gif)
//         .then((lzw_uncompress) => {
//           const container = document.createElement('div');

//           const glGifVisualizerContainer = document.createElement('div');
//           const glGifVisualizer = document.createElement('canvas');

//           const isPlay = signal(false);
//           const currentFrameNumber = signal(1);
//           const totalFrameNumber = signal(gif.gif.images.length);
//           const renderNext = signal(() => Promise.resolve());
//           const gifMetaElement = getGifMeta({ isPlay, renderNext, currentFrameNumber, totalFrameNumber });

//           const effectListContent = document.createElement('div');
//           const effectListData = document.createElement('div');
//           const effectEditContainer = document.createElement('div');
//           let effectEditor: HTMLDivElement | null;

//           effectListContent.append(effectListData);
//           effectListContent.append(effectEditContainer);

//           function getEffectName(effectId: number): string | null {
//             if (effectId === MadnessEffectId) {
//               return 'Madness Effect';
//             }

//             if (effectId === BlackAndWhiteEffectId) {
//               return 'Black And White Effect';
//             }

//             return null;
//           }

//           function addEffectNumberListener(fromInput: HTMLInputElement, li: HTMLElement, effect: Effect, setValue: (v: number) => void, index: number): void {
//             fromInput.addEventListener('input', () => {
//               const valueS = fromInput.value;
//               if (!isNaN(Number(valueS))) {
//                 const value = Number(valueS);
//                 setValue(value);
//                 li.innerHTML = getEffectDesc(effect, index);
//               }
//             });
//           }

//           function createBlackAndWhiteEditorElement(effect: GLBlackAndWhiteEffect, li: HTMLElement, index: number): HTMLElement {
//             const container = document.createElement('div');

//             container.innerHTML = `<div>
//               <div>
//                 <span>From</span>
//                 <input class="from-input" value="${effect.getFrom()}" />
//               </div>
//               <div>
//                 <span>To</span>
//                 <input class="to-input" value="${effect.getTo()}" />
//               </div>
//             </div>
//             `;

//             const fromInput: HTMLInputElement = container.querySelector('.from-input');
//             addEffectNumberListener(fromInput, li, effect, v => effect.setFrom(v), index);

//             const toInput: HTMLInputElement = container.querySelector('.to-input');
//             addEffectNumberListener(toInput, li, effect, v => effect.setTo(v), index);

//             return container;
//           }

//           function createMadnessEditorElement(effect: GLMadnessEffect, li: HTMLElement, index: number): HTMLElement {
//             const container = document.createElement('div');

//             container.innerHTML = `<div>
//               <div>
//                 <span>From</span>
//                 <input class="from-input" value="${effect.getFrom()}" />
//               </div>
//               <div>
//                 <span>To</span>
//                 <input class="to-input" value="${effect.getTo()}" />
//               </div>
//               <div>
//                 <span>Alpha</span>
//                 <input class="alpha-input" value="${effect.getAlpha()}" />
//               </div>
//             </div>
//             `;

//             const fromInput: HTMLInputElement = container.querySelector('.from-input');
//             addEffectNumberListener(fromInput, li, effect, v => effect.setFrom(v), index);

//             const toInput: HTMLInputElement = container.querySelector('.to-input');
//             addEffectNumberListener(toInput, li, effect, v => effect.setTo(v), index);

//             const alphaInput: HTMLInputElement = container.querySelector('.alpha-input');
//             addEffectNumberListener(alphaInput, li, effect, v => effect.setAlpha(v), index);

//             return container;
//           }

//           function getEffectEditorComponent(effect: Effect, li: HTMLElement, index: number): HTMLElement | null {
//             const container = document.createElement('div');

//             if (isMadnessEffect(effect)) {
//               container.append(createMadnessEditorElement(effect, li, index));
//             }

//             if (isBlackAndWhiteEffect(effect)) {
//               container.append(createBlackAndWhiteEditorElement(effect, li, index));
//             }

//             return container;
//           }

//           function upodateEffectListListeners(effectListData: HTMLDivElement, effects: Effect[]) {
//             const lis = effectListData.querySelectorAll('li');

//             lis.forEach((li, i) => {
//               li.addEventListener('click', () => {
//                 const effect = effects[i];

//                 if (effectEditor) {
//                   effectEditContainer.removeChild(effectEditor);
//                   effectEditor = null;
//                 }

//                 effectEditor = document.createElement('div');
//                 effectEditor.innerHTML = `<span>Editing: ${getEffectName(effect.getId())}</span>`;

//                 const editorElement = getEffectEditorComponent(effect, li, i);

//                 if (editorElement) {
//                   effectEditor.append(editorElement);
//                 }

//                 effectEditContainer.append(effectEditor);
//               });
//             })
//           }

//           const getEffectDesc = (effect: Effect, index: number): string => `${index + 1}. ${getEffectName(effect.getId()) || 'Unknown Effect'} - from: ${effect.getFrom()}; to: ${effect.getTo()}`;
//           const getEffectListContent = (effects: Effect[]): string => effects.length === 0 ? 'No effects' : '<ul>' +(effects.map((effect, i) => `<li> ${getEffectDesc(effect, i)} </li>`).join('\n')) + '</ul>';

//           effectListData.innerHTML = getEffectListContent([]);
//           upodateEffectListListeners(effectListData, []);

//           glGifVisualizerContainer.append(glGifVisualizer);
//           glGifVisualizerContainer.append(gifMetaElement.element);

//           container.append(glGifVisualizerContainer);
//           container.append(effectListContent);

//           renderer.addGifToRender(gif, glGifVisualizer, { uncompress: lzw_uncompress, algorithm: 'GL' })
//             .then((descriptor) => {
//               renderer.onEffectAdded(descriptor, (data) => {
//                 effectListData.innerHTML = getEffectListContent(data.effects);
//                 upodateEffectListListeners(effectListData, data.effects);
//               });

//               renderer.addEffectToGif(descriptor, 2, 30, data => createMadnessEffect(data));
//               renderer.addEffectToGif(descriptor, 25, 45, data => createBlackAndWhiteEffect(data));

//               // TODO: call inside root - ?
//               effect(() => {
//                 if (isPlay()) {
//                   if (!renderer.autoplayStart(descriptor)) {
//                     // TODO: hm use onError ?
//                     console.warn('Error to stop');
//                   }
//                 } else {
//                   renderer.autoplayEnd(descriptor);
//                 }
//               });
//               isPlay.set(true);

//               renderNext.set(() => () => renderer.setFrame(descriptor, (renderer.getCurrentFrame(descriptor) + 1) % gif.gif.images.length));

//               renderer.onFrameRender(descriptor, (data) => {
//                 currentFrameNumber.set(data.frameNumber + 1);
//               })
//           });

//           main.append(container);

//           console.log('new gif: ', gif);

//           gifs.push(gif);
//         });
//     }
//   }
//   reader.readAsArrayBuffer(this.files[0]);
// }

// fileInput.addEventListener('change', handleFiles, false);

// main.append(fileInput);
