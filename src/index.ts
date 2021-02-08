import { Rendered } from './rendering/base/renderer';

const main = document.getElementById('main');

const fileInput = document.createElement('input');
fileInput.type = 'file';

const gifVisualizer = document.createElement('canvas');
let gifRenderer: Rendered = null;

function handleFiles() {
  if (gifRenderer) {
    gifRenderer.autoplayEnd();
    gifRenderer = null;
  }

  const reader = new FileReader();
  reader.onload = function (e) {

    const arrayBuffer = e.target.result as ArrayBuffer;

    gifRenderer = new Rendered(arrayBuffer, gifVisualizer);
    gifRenderer.autoplayStart();
  }
  reader.readAsArrayBuffer(this.files[0]);
}

fileInput.addEventListener('change', handleFiles, false);

main.append(fileInput);
main.append(gifVisualizer);
