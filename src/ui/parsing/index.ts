import { effect, onDispose, root } from "@maverick-js/signals";
import { Component, isComponent, toComponent } from "../components/utils";
import { Either, isError } from "utils/either";

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
let skipableSymbol = new Set<string>(['\r', '\n', ' ']);


const onClickEventName: 'onClick' = 'onClick';
const onInputEventName: 'onInput' = 'onInput';
const onKeyDownEventName: 'onKeyDown' = 'onKeyDown';
const onFocusOutEventName: 'onFocusOut' = 'onFocusOut';
let eventNames = new Set<string>([onClickEventName, onInputEventName, onKeyDownEventName, onFocusOutEventName]);

let simpleAttribNames = new Set<string>(['disabled']);
let defaultValueAttribNames = new Set<string>(['value']);

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

type ParsingError = {
  description: string;
  line: number;
  column: number;
  templatesIndex: number;
  valuesIndex: number;
}

export type ParseResult = Either<ParsingError, ParsedElement>


/**
 * TODO: doesnt support:
 * 1. comments
 * 2. <span> some text ${toChildren(() => 'value')} </span>
 * 3. <span> some text ${() => 'value'} </span>
 * 4. self closign elements <span />
 * 5. <span> some text ${toChildren(() => another component)} </span>
 */
// TODO: add error handling
// shoudn't go into infinit loop
function parseHTML(templateParts: TemplateStringsArray, values: unknown[]): ParseResult {
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
  let line = 0;
  let debugColumn = 0;

  console.log(values);

  const res = parseChildren();

  if (res) {
    return { error: res };
  }

  return { value: root };

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
    debugColumn += advance;
  }

  function advanceTemplateStringIndex(): void {
    currentTemplateStringIndex += 1;
    currentCharIndex = 0;
  }

  function skip() {
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentCharIndex < currentTemplateString.length && skipableSymbol.has(currentTemplateString[currentCharIndex])) {
      // TODO: move to const
      if (currentTemplateString[currentCharIndex] === '\n') {
        line += 1;
        debugColumn = 0;
      }

      // TODO: use advanceIndex
      advanceIndex();
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
      advanceIndex();
    }

    return currentTemplateString.slice(tagStart, currentCharIndex);
  }

  function parseElement(): null | ParsingError {
    skip();

    const parseElementStartResult = parseElementStart();

    if (isError(parseElementStartResult)) {
      return parseElementStartResult.error;
    }

    if (parseElementStartResult.value.selfClosing) {
      return null;
    }

    const parseChildrenResult = parseChildren();

    if (parseChildrenResult) {
      return parseChildrenResult;
    }

    const parseElementEndResult =  parseElementEnd();

    if (parseElementEndResult) {
      return parseElementEndResult;
    }
  }

  function parseElementStart(): Either<ParsingError, { selfClosing: boolean; tag: string }> {
    if (getCurrentChar() === elementStart) {
      advanceIndex();
    } else {
      return { error: createError(`Error during parseElementStart: expect start of opening element "${elementStart}", but got "${getCurrentChar()}"`)};
    }

    const tag = parseElementTag();

    currentParsingElement.tag = tag;

    skip();

    const parseAttribsResult = parseAttribs();

    if (parseAttribsResult) {
      return { error: parseAttribsResult };
    }

    let selfClosing = false;

    if (getCurrentChar() === intermediateEnd) {
      advanceIndex();
    } else if (getCurrentChar(2) === elementEnd) {
      selfClosing = true;
      advanceIndex(2);
    } else {
      return { error: createError(`Error during parseElementStart: expect end of opening element "${intermediateEnd}" or "${elementEnd}", but got "${getCurrentChar()}"`) };
    }

    return { value: { selfClosing, tag } };
  }

  function parseAttribs(): null | ParsingError {
    while (getCurrentChar() !== intermediateEnd && getCurrentChar(2) !== elementEnd) {
      skip();

      const attribName = parseAttribName();

      if (getCurrentChar() !== '=') {
        return createError(`Error during parseAttribs: invalid char between attrib name and value; expect "=", but got "${getCurrentChar()}"`);
      }

      advanceIndex();

      const attribValueResult = parseAttribValue();

      if (isError(attribValueResult)) {
        return attribValueResult.error;
      }

      const attribValue = attribValueResult.value;

      if (eventNames.has(attribName)) {
        if (typeof attribValue !== 'function') {
          return createError( `Error during parseAttribs: "${attribName}" event attrib; expect value to be function, but got "${typeof attribValue}"`);
        } else {
          currentParsingElement.events.push([attribName, attribValue]);
        }
      } else if (typeof attribValue === 'function') {
        currentParsingElement.bindings.push([attribName, attribValue]);
      } else if (typeof attribValue === 'number' || typeof attribValue === 'string' || typeof attribValue === 'boolean') {
        currentParsingElement.properties.push([attribName, attribValue]);
      } else {
        return createError(`Error during parseAttribs: unknown atrib value type`);
      }

      skip();
    }
  }

  function parseAttribName(): string {
    let tagStart = currentCharIndex;
    let currentTemplateString = templateParts[currentTemplateStringIndex];

    while (currentCharIndex < currentTemplateString.length && currentTemplateString[currentCharIndex] !== '=' && !skipableSymbol.has(currentTemplateString[currentCharIndex])) {
      advanceIndex();
    }

    return currentTemplateString.slice(tagStart, currentCharIndex);
  }

  function parseStrAttribValue() {
      let tagStart = currentCharIndex;
      let currentTemplateString = templateParts[currentTemplateStringIndex];

      while (currentCharIndex < currentTemplateString.length && (currentTemplateString[currentCharIndex] !== '"')) {
        advanceIndex();
      }

      return currentTemplateString.slice(tagStart, currentCharIndex);
  }

  function parseAttribValue(): Either<ParsingError, unknown> {
    if (getCurrentChar() !== '"') {
      return { error: createError(`Error during parseAttribValue: value should be enclosing in '"', but got "${getCurrentChar()}"`) };
    }

    advanceIndex();

    if (isNextTemplateValue()) {
      advanceTemplateStringIndex();

      const templateValue = getNextTemplateValue();

      advanceTemplateValueIndex();

      return end() ?? { value: templateValue };
    } else {
      // we just have a string value, just parse it

      let attibValue = parseStrAttribValue();

      return  end() ?? { value: attibValue };
    }

    function end(): Either<ParsingError, unknown> {
      if (getCurrentChar() !== '"') {
        return { error: createError(`Error during parseAttribValue: value should be enclosing in '"', but got "${getCurrentChar()}"`)};
      }

      advanceIndex();
    }
  }

  function isNextTemplateValue(): boolean {
    return templateParts[currentTemplateStringIndex].length === currentCharIndex;
  }

  function parseChildren(): null | ParsingError {
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
          return createError('Error during parseChildren: unknown atrib value type');
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

        const parseElementResult = parseElement();

        if (parseElementResult) {
          return parseElementResult;
        }

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
        advanceIndex();
      }

      return currentTemplateString.slice(start, currentCharIndex);
  }

  function parseElementEnd(): null | ParsingError {
    if (getCurrentChar(2) === intermediateStart) {
      advanceIndex(2);
    } else {
      return createError(`Error during parseElementEnd: expect start of closing element "${intermediateStart}", but got "${getCurrentChar(2)}"`);
    }

    const closingTag = parseElementTag();

    if (closingTag !== currentParsingElement.tag) {
      return createError(`Error during parseElementEnd: expect closing element to be "${currentParsingElement.tag}", but got "${closingTag}"` );
    }

    skip();

    if (getCurrentChar() === intermediateEnd) {
      advanceIndex();
    } else {
      return createError(`Error during parseElementEnd: expect end of closing element "${intermediateEnd}", but got "${getCurrentChar()}"`);
    }
  }

  function createError(description: string): ParsingError {
    return ({
        description,
        line: line, templatesIndex: currentTemplateStringIndex, column: debugColumn, valuesIndex: currentValueIndex,
    });
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
export function html(templateParts: TemplateStringsArray, ...values: unknown[]): Component {
  let tree: ParseResult = parseHTML(templateParts, values);

  if (isError(tree)) {
    let resultTemplate = new Array(templateParts.length + values.length);

    for (let i = 0; i < templateParts.length - 1; i++) {
      resultTemplate[i * 2 + 0] = templateParts[i];
      resultTemplate[i * 2 + 1] = String(values[i]);
    }

    resultTemplate[(templateParts.length - 1) * 2 + 0] = templateParts[templateParts.length - 1];
    const resultTemplateStr = resultTemplate.join('');

    console.warn('Error for template\n' + resultTemplateStr);
    console.warn('html parsing error: ', tree.error.description);

    // TODO: add color
    const lines = resultTemplateStr.split('\n');
    if (tree.error.line < lines.length) {
      const pointError: string[] = [];

      const predictColumnStart = tree.error.column - 15;
      const predictColumnEnd = tree.error.column + 15;

      console.warn(`Error at line - ${tree.error.line} column - ${tree.error.column}`);

      if (tree.error.line !== 0) {
        console.warn(`${tree.error.line - 1}: ${lines[tree.error.line - 1]}`);
      }

      console.warn(`${tree.error.line}: ${lines[tree.error.line].slice(0, predictColumnStart) + '%c' + lines[tree.error.line].slice(predictColumnStart)}`, 'color: red');

      if (tree.error.line < lines.length - 1) {
        console.warn(`${tree.error.line + 1}: ${lines[tree.error.line + 1]}`);
      }

      console.warn(`Error at line - ${lines[tree.error.line].slice(predictColumnStart, predictColumnEnd)}`);
    }


    return { element: document.createElement('div'), dispose: () => {} };
  }

  let strTree = parsedToStr(tree.value);

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

  const resultHtml = parsedToStr(tree.value, onBindings, onEvents);

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
          const getChildrenEffect = () => {
            // TODO: check that it works correctly
            let prevChild: Component | Array<Component> | string | number | boolean | null = null;

            const clearChild = (child: Component | Array<Component> | string | number | boolean | null): void => {
                  if (isComponent(child)) {
                    child.dispose();
                  }
            }

            return () => {
              if (isChildComponent(childToUpdate.child)) {
                  const child = childToUpdate.child();

                  if (isComponent(child)) {
                      clearChild(prevChild);

                      // For now just clear
                      element.innerHTML = '';
                      element.appendChild(child.element);
                  } else if (child === null) {
                      clearChild(prevChild);
                      element.innerHTML = '';
                  } else if (Array.isArray(child)) {
                      clearChild(prevChild);

                      if (Array.isArray(prevChild)) {
                        prevChild.forEach(clearChild);
                      }

                      element.innerHTML = '';
                      // TODO: check how improve
                      child.forEach((v) => {
                          element.appendChild(v.element);
                      });
                  } else {
                      element.innerHTML = String(child);
                  }

                  prevChild = child;
              } else {
                  // TODO: probably can be removed
                  element.innerHTML = String(childToUpdate.child());
              }
          }
        }

          effect(getChildrenEffect());
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + childToUpdate.selector);
          console.warn('Error for template\n' + strTree);
          console.warn('Error for result template\n' + resultHtml);
        }
      }

      for (let i = 0; i < bindingsToUpdate.length; i++) {
        const binding = bindingsToUpdate[i];
        let element = elementMap.has(binding.selector) ? elementMap.get(binding.selector) : container.querySelector(binding.selector);

        elementMap.set(binding.selector, element);

        if (element) {
          effect(() => {
            if (simpleAttribNames.has(binding.binding[0])) {
              const value = binding.binding[1]();
              if (value) {
                element.setAttribute(binding.binding[0], String(value));
              } else {
                element.removeAttribute(binding.binding[0]);
              }
            } else if (defaultValueAttribNames.has(binding.binding[0])) {
              const value = binding.binding[1]();
              (element as any)[binding.binding[0]] = String(value);
            } else {
              const value = binding.binding[1]();
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
          if (event.event[0] === onClickEventName) {
            const callback = (e: PointerEvent) => { event.event[1](e); };

            element.addEventListener('click', callback);
            onDispose(() => element.removeEventListener('click', callback));
          }

          if (event.event[0] === onInputEventName) {
            const callback = (e: InputEvent) => { event.event[1](e); };

            element.addEventListener('input', callback);
            onDispose(() => element.removeEventListener('input', callback));
          }

          if (event.event[0] === onKeyDownEventName) {
            const callback = (e: KeyboardEvent) => { event.event[1](e); };

            element.addEventListener('keydown', callback);
            onDispose(() => element.removeEventListener('clkeydownick', callback));
          }

          if (event.event[0] === onFocusOutEventName) {
            const callback = (e: FocusEvent) => { event.event[1](e); };

            element.addEventListener('focusout', callback);
            onDispose(() => element.removeEventListener('focusout', callback));
          }
        } else {
          console.warn('Error during parsing template: cannot find element with id ' + event.selector);
        }
      }
    });
  }

  return toComponent(container, dispose);
}

export function toEvent(f: Function): string {
  return f as unknown as string;
}

export function toChild(f: () => Component | Array<Component> | string | number | boolean | null): string {
    (f as any).__child = true;

  return f as unknown as string;
}

export function isChildComponent(f: Function): f is () => Component | Array<Component> | string | number | boolean | null {
    return (f as any).__child;
}
