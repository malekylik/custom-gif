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

function updateTable(tableElement: HTMLTableElement, colorMap: ColorMap) {
  const length = colorMap.entriesCount;

  if (length < tableElement.childElementCount) {
    while (tableElement.childElementCount && length < tableElement.childElementCount && tableElement.removeChild(tableElement.children[tableElement.childElementCount - 1]));
  } else if (length > tableElement.childElementCount) {
    const diff = length - tableElement.childElementCount;
    for (let i = 0; i < diff; i++) {
      const row = document.createElement('tr');
      const numberTh = document.createElement('th');
      const colorTh = document.createElement('th');

      colorTh.style.width = '50%';

      row.append(numberTh);
      row.append(colorTh);

      tableElement.append(row);
    }
  }

  for (let i = 0; i < length; i++) {
    const colorStyle = `rgb(${colorMap.getRed(i)}, ${colorMap.getGreen(i)}, ${colorMap.getBlue(i)})`;

    tableElement.rows.item(i).cells[0].innerText = `${String(i)} ${colorStyle}`;
    tableElement.rows.item(i).cells[1].style.backgroundColor = colorStyle;
  }
}

function addEventHandlerForVisuallizer(canvas: HTMLCanvasElement, colorMap: ColorMap, screenWidth: number, onClick: (clickedColor: number, colorStyle: string) => void) {
  const oneColorWidth = colorMap.entriesCount / screenWidth;

  function mouseDown(e: MouseEvent) {
    function updateColor(e: MouseEvent) {
      const offsetX = e.offsetX;
      const clickedColor = (offsetX * oneColorWidth) | 0;

      const colorStyle = `rgb(${colorMap.getRed(clickedColor)}, ${colorMap.getGreen(clickedColor)}, ${colorMap.getBlue(clickedColor)})`;

      onClick(clickedColor, colorStyle);
    }

    function removeHandlers() {
      canvas.removeEventListener('mousemove', updateColor);
      document.body.removeEventListener('mouseup', removeHandlers);
    }

    canvas.addEventListener('mousemove', updateColor);

    document.body.addEventListener('mouseup', removeHandlers);

    updateColor(e);
  }

  canvas.addEventListener('mousedown', mouseDown);

  return () => canvas.removeEventListener('mousedown', mouseDown);
}

function updateRulerIndexTable(table: HTMLTableElement, startX: number, endX: number, startY: number, endY: number) {
  for (let i = startX; i < endX; i++) {
    table.rows.item(0).cells[i - startX + 1].innerText = String(i);
  }

  for (let i = startY; i < endY; i++) {
    table.rows.item(i - startY + 1).cells[0].innerText = String(i);
  }
}

function updateTableValues(table: HTMLTableElement, startX: number, endX: number, startY: number, endY: number, stride: number, canvasBuffer: Uint8Array, colorMap: ColorMap) {
  const indexMap = new Map<string, number>();

  for (let j = startY; j < endY; j++) {
    for (let i = startX; i < endX; i++) {
      const r = canvasBuffer[(j * stride + i) * 4 + 0];
      const g = canvasBuffer[(j * stride + i) * 4 + 1];
      const b = canvasBuffer[(j * stride + i) * 4 + 2];

      if (!indexMap.has(`${r},${g},${b}`)) {
        for (let k = 0; k < colorMap.entriesCount; k++) {
          if (r === colorMap.getRed(k) && g === colorMap.getGreen(k) && b === colorMap.getBlue(k)) {
            indexMap.set(`${r},${g},${b}`, k);
          }
        }
      }

      if (!indexMap.has(`${r},${g},${b}`)) {
        console.warn('unknown color', `${r},${g},${b}`);
      }
    }
  }

  for (let j = startY; j < endY; j++) {
    for (let i = startX; i < endX; i++) {
      const r = canvasBuffer[(j * stride + i) * 4 + 0];
      const g = canvasBuffer[(j * stride + i) * 4 + 1];
      const b = canvasBuffer[(j * stride + i) * 4 + 2];

      const index = indexMap.get(`${r},${g},${b}`);

      const th = table.rows.item(j - startY + 1).cells[i - startX + 1];
      th.innerText = `${index} ${(j * stride + i)}`;
      th.style.color = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
      th.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
  }
}

function updateIndexTable(table: HTMLTableElement, startX: number, endX: number, startY: number, endY: number, stride: number, canvasBuffer: Uint8Array, colorMap: ColorMap) {
  updateRulerIndexTable(table, startX, endX, startY, endY);

  updateTableValues(table, startX, endX, startY, endY, stride, canvasBuffer, colorMap);
}

function addEventHandlerForIndexTable(canvas: HTMLCanvasElement, onClick: (x: number, y: number) => void) {
  function mouseDown(e: MouseEvent) {
    function updateColor(e: MouseEvent) {
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;

      onClick(offsetX, offsetY);
    }

    function removeHandlers() {
      canvas.removeEventListener('mousemove', updateColor);
      document.body.removeEventListener('mouseup', removeHandlers);
    }

    canvas.addEventListener('mousemove', updateColor);

    document.body.addEventListener('mouseup', removeHandlers);

    updateColor(e);
  }

  canvas.addEventListener('mousedown', mouseDown);

  return () => canvas.removeEventListener('mousedown', mouseDown);
}

function updateCanvas(canvas: HTMLCanvasElement, outBuffer: Uint8Array, width: number, height: number) {
  const ctx = canvas.getContext('2d');

  const image = new ImageData(width, height);

  for (let i = 0; i < outBuffer.length / 4; i++) {
    image.data[(i * 4) + 0] = outBuffer[(i * 4) + 0];
    image.data[(i * 4) + 1] = outBuffer[(i * 4) + 1];
    image.data[(i * 4) + 2] = outBuffer[(i * 4) + 2];
    image.data[(i * 4) + 3] = outBuffer[(i * 4) + 3];
  }

  ctx.putImageData(image, 0, 0);
}

function handleFiles() {
  const reader = new FileReader();
  reader.onload = function (e) {

    const arrayBuffer = e.target.result as ArrayBuffer;
    const gif = parseGif(arrayBuffer);

    console.log(gif);

    const container = document.createElement('div');
    const gifVisualizer = document.createElement('canvas');
    const prevVisualizer = document.createElement('canvas');

    prevVisualizer.width = gif.screenDescriptor.screenWidth;
    prevVisualizer.height = gif.screenDescriptor.screenHeight;
    prevVisualizer.style.width = `${gif.screenDescriptor.screenWidth}px`;
    prevVisualizer.style.height = `${gif.screenDescriptor.screenHeight}px`;
    prevVisualizer.style.transform = 'rotate3d(1, 0, 0, 180deg)';

    const colorMapGifVisualizer = document.createElement('canvas');
    const selecedColorFromMapVisualizer = document.createElement('canvas');
    selecedColorFromMapVisualizer.width = 150;
    selecedColorFromMapVisualizer.height = 150;
    selecedColorFromMapVisualizer.style.width = `${150}px`;
    selecedColorFromMapVisualizer.style.height = `${150}px`;
    const selecedColorFromMapVisualizerCtx = selecedColorFromMapVisualizer.getContext('2d');
    // fillStyle
    selecedColorFromMapVisualizerCtx.fillRect(0, 0, 150, 150);

    const changeInput = document.createElement('input');
    changeInput.type = 'text';
    changeInput.value = '0';

    const colorTableList = document.createElement('table');

    colorTableList.style.display = 'inline-block';
    colorTableList.style.overflowY = 'scroll';
    colorTableList.style.width = '330px';
    colorTableList.style.height = `${gif.screenDescriptor.screenHeight}px`;

    const colorMap = gif.images[0].M ? gif.images[0].colorMap : gif.colorMap;
    updateTable(colorTableList, colorMap);

    let unsibscribeColorVisiallizer = addEventHandlerForVisuallizer(colorMapGifVisualizer, colorMap, gif.screenDescriptor.screenWidth, (clickedColor, colorStyle) => {
      selecedColorInfo.innerText = `${String(clickedColor)} ${colorStyle}`;
      selecedColorFromMapVisualizerCtx.fillStyle = colorStyle;
      selecedColorFromMapVisualizerCtx.fillRect(0, 0, 150, 150);
    });

    const selecedColorWrapper = document.createElement('span');
    const selecedColorInfo = document.createElement('span');

    selecedColorInfo.innerText = '-1 rgb(0, 0, 0)';

    selecedColorWrapper.append(selecedColorInfo);
    selecedColorWrapper.append(selecedColorFromMapVisualizer);

    const indexImageTable = document.createElement('table');
    const indexRow = document.createElement('tr');
    indexRow.appendChild(document.createElement('th'));

    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('th');

      cell.innerText = String(i);
      cell.style.width = '150px';

      indexRow.appendChild(cell);
    }

    indexImageTable.appendChild(indexRow);

    for (let j = 0; j < 10; j++) {
      const row = document.createElement('tr');

      const cell = document.createElement('th');
      cell.innerText = String(j);
      cell.style.width = '150px';

      row.appendChild(cell);

      for (let i = 0; i < 10; i++) {
        const cell = document.createElement('th');

        cell.style.width = '150px';

        row.appendChild(cell);
      }

      indexImageTable.appendChild(row);
    }

    const outScreenBuffer = new Uint8Array(gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight * 4);
    const outPrevScreenBuffer = new Uint8Array(gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight * 4);

    let tableUnsibscribe = () => {};
    container.append(gifVisualizer);
    container.append(prevVisualizer);
    container.append(colorMapGifVisualizer);
    container.append(selecedColorWrapper);
    container.append(changeInput);
    container.append(colorTableList);
    container.append(indexImageTable);
    container.style.border = '2px solid black';

    main.append(container);

    let currentSlide = 0;

    createLZWFuncFromWasm(gif)
      .then((lzw_uncompress) => {
        let gifRenderer = new GLRenderer(gif, gifVisualizer, { uncompress: lzw_uncompress });
        gifRenderer.autoplayStart();
        setTimeout(() => gifRenderer.setFrame(0).then(() => {
          gifRenderer.getCanvasPixel(outScreenBuffer);
          gifRenderer.getPrevCanvasPixel(outPrevScreenBuffer);
          console.log('add handler', outScreenBuffer, outPrevScreenBuffer);
          addEventHandlerForIndexTable(gifVisualizer, (x, y) => {
            const startX = Math.max(Math.min((((x / 10) | 0) * 10), gif.screenDescriptor.screenWidth - 10), 0);
            const endX = startX + 10;
          
            const startY = Math.max(Math.min((((y / 10) | 0) * 10), gif.screenDescriptor.screenHeight - 10), 0);
            const endY = startY + 10;

            updateIndexTable(indexImageTable, startX, endX, startY, endY, gif.screenDescriptor.screenWidth, outScreenBuffer, colorMap);
          });
        }), 10);

        const colorMap = gif.images[currentSlide].M ? gif.images[currentSlide].colorMap : gif.colorMap;
        const colorMapVisualizer = new ColorMapVisualizer(colorMapGifVisualizer, gif.screenDescriptor.screenWidth, gif.screenDescriptor.screenHeight, gif.colorMap.entriesCount);
        colorMapVisualizer.drawToScreen(colorMap);
        changeInput.addEventListener('change', (e: InputEvent) => {
          const value = parseInt((e.target as any).value);

          if (!isNaN(value) && (value < gif.images.length && value >= 0)) {
            currentSlide = value;
            const setFramePromise = gifRenderer.setFrame(value);
            const colorMap = gif.images[value].M ? gif.images[value].colorMap : gif.colorMap;
            colorMapVisualizer.drawToScreen(colorMap);

            updateTable(colorTableList, colorMap);

            selecedColorInfo.innerText = '-1 rgb(0, 0, 0)';

            selecedColorFromMapVisualizerCtx.fillStyle = 'rgb(0, 0, 0)';
            selecedColorFromMapVisualizerCtx.fillRect(0, 0, 150, 150);

            unsibscribeColorVisiallizer();
            unsibscribeColorVisiallizer = addEventHandlerForVisuallizer(colorMapGifVisualizer, colorMap, gif.screenDescriptor.screenWidth, (clickedColor, colorStyle) => {
              selecedColorInfo.innerText = `${String(clickedColor)} ${colorStyle}`;
              selecedColorFromMapVisualizerCtx.fillStyle = colorStyle;
              selecedColorFromMapVisualizerCtx.fillRect(0, 0, 150, 150);
            });

            tableUnsibscribe();
            setFramePromise.then(() => {
              gifRenderer.getCanvasPixel(outScreenBuffer);
              gifRenderer.getPrevCanvasPixel(outPrevScreenBuffer);
              console.log('add handler', outScreenBuffer, outPrevScreenBuffer);
              console.log('out', lzw_uncompress.out);

              updateCanvas(prevVisualizer, outPrevScreenBuffer, gif.screenDescriptor.screenWidth, gif.screenDescriptor.screenHeight);

              tableUnsibscribe = addEventHandlerForIndexTable(gifVisualizer, (x, y) => {
                const startX = Math.max(Math.min((((x / 10) | 0) * 10), gif.screenDescriptor.screenWidth - 10), 0);
                const endX = startX + 10;
              
                const startY = Math.max(Math.min((((y / 10) | 0) * 10), gif.screenDescriptor.screenHeight - 10), 0);
                const endY = startY + 10;

                updateIndexTable(indexImageTable, startX, endX, startY, endY, gif.screenDescriptor.screenWidth, outScreenBuffer, colorMap);
              });
            });
          }
        });
      });
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
