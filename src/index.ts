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

let eventNames = new Set<string>(['onClick']);

let simpleAttribNames = new Set<string>(['disabled']);

// TODO: think to make more standart
const childrenAttribName: 'children' = 'children';

// let skipableSymbol = new Set<string>(['\n', ' ']);

type ParsedTextElement = {
  type: 'text',
  value: string,
}

type ParsedHTMLElement = {
  type: 'element',
  tag: 'div' | 'span' | string | undefined;
  properties: Array<[string, string | number | boolean]>;
  bindings: Array<[string, Function]>;
  events: Array<[string, Function]>,
  children: ParsedElement[];
}

type ParsedElement =
  | ParsedHTMLElement
  | ParsedTextElement;


/**
 * TODO: doesnt support:
 * 1. comments
 * 2. <span> some text ${toChildren(() => 'value')} </span>
 * 3. <span> some text ${() => 'value'} </span>
 * 4. self closign elements <span />
 */
// TODO: add error handling
// shoudn't go into infinit loop
function parseHTML(templateParts: TemplateStringsArray, values: unknown[]): ParsedElement {
  const root: ParsedElement = {
    type: 'element',
    tag: 'div',
    properties: [],
    bindings: [],
    events: [],
    children: [],
  };
  let currentParsingElement = root;
  let currentTemplateStringIndex = 0;
  let currentCharIndex = 0;
  let currentValueIndex = 0;

  console.log(values);

  parseChildren();

  return root;

  function getCurrentChar(slice = 1): string {
    return templateParts[currentTemplateStringIndex].slice(currentCharIndex, currentCharIndex + slice) || '';
  }

  function getNextTemplateValue(): unknown {
    return values[currentValueIndex];
  }

  function advanceTemplateValueIndex(): void {
    currentValueIndex += 1;
  }

  function advanceIndex(advance = 1): void {
    currentCharIndex += advance;
  }

  function advanceTemplateStringIndex(): void {
    currentTemplateStringIndex += 1;
    currentCharIndex = 0;
  }

  function skip() {
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    // TODO: check if we reach end of template string by skiping
    while (currentCharIndex < currentTemplateString.length && skipableSymbol.has(currentTemplateString[currentCharIndex])) {
      currentCharIndex++;
    }
  }

  function isParsingStrEnd() {
    const currentTemplateString = templateParts[currentTemplateStringIndex];

     return currentCharIndex >= currentTemplateString.length && currentTemplateStringIndex >= templateParts.length - 1;
  }

  function parseElementTag(): string {
    let tagStart = currentCharIndex;
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentCharIndex < currentTemplateString.length && !skipableSymbol.has(currentTemplateString[currentCharIndex]) && currentTemplateString[currentCharIndex] !== intermediateEnd) {
      currentCharIndex++;
    }

    return currentTemplateString.slice(tagStart, currentCharIndex);
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

      const attribValue = parseAttribValue();

      if (eventNames.has(attribName)) {
        if (typeof attribValue !== 'function') {
          console.warn(`Error during parseAttribs: event handler should be of type function, please use ${toEvent.name}`);
        } else {
          currentParsingElement.events.push([attribName, attribValue]);
        }
      } else if (typeof attribValue === 'function') {
        currentParsingElement.bindings.push([attribName, attribValue]);
      } else if (typeof attribValue === 'number' || typeof attribValue === 'string' || typeof attribValue === 'boolean') {
        currentParsingElement.properties.push([attribName, attribValue]);
      } else {
        console.warn('Error during parseAttribs: unknown atrib value type');
      }

      skip();
    }
  }

  function parseAttribName(): string {
    let tagStart = currentCharIndex;
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentCharIndex < currentTemplateString.length && currentTemplateString[currentCharIndex] !== '=') {
      currentCharIndex++;
    }

    return currentTemplateString.slice(tagStart, currentCharIndex);
  }

  function parseStrAttribValue() {
      let tagStart = currentCharIndex;
      let currentTemplateString = templateParts[currentTemplateStringIndex];

      while (currentCharIndex < currentTemplateString.length && (currentTemplateString[currentCharIndex] !== '"')) {
        currentCharIndex++;
      }

      return currentTemplateString.slice(tagStart, currentCharIndex);
  }

  function parseAttribValue() {
    if (getCurrentChar() !== '"') {
      console.warn('Error during parseAttribValue 1');
    }

    advanceIndex();

    if (isNextTemplateValue()) {
      advanceTemplateStringIndex();

      const templateValue = getNextTemplateValue();

      advanceTemplateValueIndex();

      end();

      return templateValue;
    } else {
      // we just have a string value, just parse it

      let attibValue = parseStrAttribValue();

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
    return templateParts[currentTemplateStringIndex].length === currentCharIndex;
  }

  function parseChildren() {
    while (true) {
      skip();

      if (isParsingStrEnd()) {
        break;
      }

      if (isNextTemplateValue()) {
        const templateValue = getNextTemplateValue();

        if (typeof templateValue === 'function') {
          currentParsingElement.bindings.push([childrenAttribName, templateValue]);
        } else if (typeof templateValue === 'number' || typeof templateValue === 'string' || typeof templateValue === 'boolean') {
          currentParsingElement.properties.push([childrenAttribName, templateValue]);
        } else {
          console.warn('Error during parseChildren: unknown atrib value type');
        }

        advanceTemplateStringIndex();
        advanceTemplateValueIndex();
      } else if (getCurrentChar(2) === intermediateStart) {
        break;
      } else if (getCurrentChar() === elementStart) {
        const parent = currentParsingElement;

        currentParsingElement = {
          type: 'element',
          tag: undefined,
          properties: [],
          bindings: [],
          events: [],
          children: [],
        };

        parent.children.push(currentParsingElement);

        parseElement();

        currentParsingElement = parent;
      // TODO: check if we face template value
      } else {
        const v = parseStrChilrend();

        currentParsingElement.children.push({
          type: 'text',
          value: v,
        });
      }
    }

    skip();
  }

  function parseStrChilrend() {
      let start = currentCharIndex;
      let currentTemplateString = templateParts[currentTemplateStringIndex];

      while (currentCharIndex < currentTemplateString.length && (currentTemplateString[currentCharIndex] !== elementStart)) {
        currentCharIndex++;
      }

      return currentTemplateString.slice(start, currentCharIndex);
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

function parsedToStr(root: ParsedElement, onBindings?: (getSelector: () => string, bindings: [string, Function][]) => void, onEvents?: (getSelector: () => string, events: [string, Function][]) => void): string {
  let result = '';
  let currentElement: ParsedElement | null = root;
  let level = 1;

  const templateId = getParseId();
  const idGetter = getNewId();

  elementToStr();

  return result;

  function elementToStr(): void {
      if (currentElement.type === 'text') {
        result += `${new Array(level + 1).join(' ')}${currentElement.value}\n`;
        return;
      }

      let selectorString: null | string = null;
      const getSelector = () => {
        if (selectorString === null) {
          selectorString = `parsed-element-${templateId}-${idGetter()}`;
        }

        return `[${selectorString}]`;
      };

      const bindingText = '@{reactive binding}';
      const eventHandlerText = '@{event handler}';

      result += `${new Array(level).join(' ')}${elementStart}${currentElement.tag}`;

      const strandartBindings = currentElement.bindings.filter(([attribName]) => attribName !== childrenAttribName).sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0));
      const strandartEvents = currentElement.events.toSorted(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0));

      const strandartProperties = currentElement.properties.filter(([attribName]) => attribName !== childrenAttribName).sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0));
      if (strandartProperties.length > 0) {
        const propertiesSerilization = strandartProperties.map(([attribName, attribValue]) => `${attribName}="${String(attribValue)}"`).join(' ');

        result += ` ${propertiesSerilization}`;
      }

      if (currentElement.bindings.length > 0 && onBindings) {
          onBindings(getSelector, currentElement.bindings);
      } else if (strandartBindings.length > 0) {
        const propertiesSerilization = strandartBindings.map(([attribName]) => `${attribName}="${bindingText}"`).join(' ');

        result += ` ${propertiesSerilization}`;
      }

      if (strandartEvents.length > 0) {
        if (onEvents) {
          onEvents(getSelector, strandartEvents);
        } else {
          const propertiesSerilization = strandartEvents.map(([attribName]) => `${attribName}="${eventHandlerText}"`).join(' ');

          result += ` ${propertiesSerilization}`;
        }
      }

      if (selectorString) {
          result += ` ${selectorString}`;
      }

      result += intermediateEnd;

      if (currentElement.children.length > 0) {
        result += '\n';
      }

      const childrenBinding = currentElement.bindings.find(([attribName]) => attribName === childrenAttribName);
      const childrenProperty = currentElement.properties.find(([attribName]) => attribName === childrenAttribName);
      if (childrenBinding && !onBindings) {
        result += bindingText;
      } else if (childrenProperty) {
        result += String(childrenProperty[1]);
      } else {
        renderChildren();
      }

      if (currentElement.children.length > 0) {
        result += new Array(level).join(' ');
      }

      result += `${intermediateStart}${currentElement.tag}${intermediateEnd}`;

      result += '\n';
  }

  function renderChildren() {
    if (currentElement.type === 'text') {
      return;
    }

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

// TODO: every new event listener type should be added
function html(templateParts: TemplateStringsArray, ...values: unknown[]): { element: HTMLElement; dispose: () => void; } {
  let tree = parseHTML(templateParts, values);
  let strTree = parsedToStr(tree);

  console.log(tree);
  console.log(strTree);

  const container = document.createElement('div');
  let dispose = () => {};

  let bindingsToUpdate: Array<{ selector: string; binding: [string, Function] }> = [];
  let eventsToUpdate: Array<{ selector: string; event: [string, Function] }> = [];
  let childrenToUpdate: Array<{ selector: string; child: Function }> = [];

  const onBindings = (getSelector: () => string, bindings: [string, Function][]) => {
    const childrenBinding = bindings.find(([attribName]) => attribName === childrenAttribName);
    const standartBinding = bindings.filter(([attribName]) => attribName !== childrenAttribName);

    if (childrenBinding) {
      childrenToUpdate.push({ selector: getSelector(), child: childrenBinding[1] });
    }

    if (standartBinding.length > 0) {
      standartBinding.forEach((binding) => {
        bindingsToUpdate.push({ selector: getSelector(), binding: binding });
      });
    }
  };
  const onEvents = (getSelector: () => string, events: [string, Function][]) => {
    if (events.length > 0) {
      events.forEach((event) => {
        eventsToUpdate.push({ selector: getSelector(), event: event });
      });
    }
  };

  const resultHtml = parsedToStr(tree, onBindings, onEvents);

  container.innerHTML = resultHtml;

  if (childrenToUpdate.length > 0 || bindingsToUpdate.length > 0 || eventsToUpdate.length) {
    root((_dispose) => {
      const elementMap: Map<string, Element> = new Map();

      dispose = () => { _dispose(); };

      for (let i = 0; i < childrenToUpdate.length; i++) {
        const childToUpdate = childrenToUpdate[i];
        let element = elementMap.has(childToUpdate.selector) ? elementMap.get(childToUpdate.selector) : container.querySelector(childToUpdate.selector);

        elementMap.set(childToUpdate.selector, element);

        if (element) {
          effect(() => {
            element.innerHTML = String(childToUpdate.child());
          });
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + childToUpdate.selector);
        }
      }

      for (let i = 0; i < bindingsToUpdate.length; i++) {
        const binding = bindingsToUpdate[i];
        let element = elementMap.has(binding.selector) ? elementMap.get(binding.selector) : container.querySelector(binding.selector);

        elementMap.set(binding.selector, element);

        if (element) {
          effect(() => {
            const value = binding.binding[1]();

            if (simpleAttribNames.has(binding.binding[0])) {
              if (value) {
                element.setAttribute(binding.binding[0], String(value));
              } else {
                element.removeAttribute(binding.binding[0]);
              }
            } else {
              element.setAttribute(binding.binding[0], String(value));
            }
          });
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + binding.selector);
        }
      }

      // TODO: verify everything clear correctly
      for (let i = 0; i < eventsToUpdate.length; i++) {
        const event = eventsToUpdate[i];
        let element = elementMap.has(event.selector) ? elementMap.get(event.selector) : container.querySelector(event.selector);

        elementMap.set(event.selector, element);

        if (element) {
          if (event.event[0] === 'onClick') {
            const callback = (e: Event) => { event.event[1](e); };

            element.addEventListener('click', callback);
            onDispose(() => element.removeEventListener('click', callback));
          }
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + event.selector);
        }
      }
    });
  }

  return { element: container, dispose };
}

function toEvent(f: Function): string {
  return f as unknown as string;
}

function getGifMeta(props: { totalFrameNumber: ReadSignal<number>; currentFrameNumber: ReadSignal<number>; isPlay: WriteSignal<boolean>; renderNext: ReadSignal<() => Promise<void>> }): { element: HTMLElement; dispose: () => void; } {
  return root((dispose) => {
    const isSetting = signal(false);

    const gifMetaData = document.createElement('div');

    const nextHandler = () => {
      if (!isSetting()) {
          isSetting.set(true);
          props.renderNext()().then(() => isSetting.set(false));
      }
    };

    const view = html`
      <div>
        <div>${() => `${props.currentFrameNumber()} / ${props.totalFrameNumber()}`}</div>
        <div>
          <button onClick="${toEvent(() => props.isPlay.set((v) => !v))}">${() => props.isPlay() ? 'Stop' : 'Play'}</button>
          <button disabled="${() => props.isPlay()}" onClick="${toEvent(nextHandler)}">Next</button>
        </div>
      </div>
    `;

    gifMetaData.appendChild(view.element);

    return ({ element: gifMetaData, dispose: () => { dispose(); view.dispose(); } });
  });
}

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

          const isPlay = signal(false);
          const currentFrameNumber = signal(1);
          const totalFrameNumber = signal(gif.gif.images.length);
          const renderNext = signal(() => Promise.resolve());
          const gifMetaElement = getGifMeta({ isPlay, renderNext, currentFrameNumber, totalFrameNumber });

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
          glGifVisualizerContainer.append(gifMetaElement.element);

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
