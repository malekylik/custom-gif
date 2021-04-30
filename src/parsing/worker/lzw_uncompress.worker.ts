import { lzw_uncompress } from '../lzw/uncompress/uncompress';
import { LZWWorkerMessage, LZWWorkerMessageGifSaved, LZWWorkerMessageIdSetted, LZWWorkerMessageReady, LZWWorkerMessageType, LZWWorkerMessageUncompress, LZWWorkerMessageUncompressDone } from './lzw_worker_message';

let workerId = '-1';

const gifs = new Map<string, ArrayBuffer>();

console.log('worker start');

self.addEventListener('message', (e: MessageEvent<LZWWorkerMessage>) => {
  if (e.data.type === LZWWorkerMessageType.saveGif) {
    const { id, gif } = e.data;
    gifs.set(id, gif);

    console.log('worker init with gif', id, workerId);

    self.postMessage({ type: LZWWorkerMessageType.gifSaved, id } as LZWWorkerMessageGifSaved);
  }

  if (e.data.type === LZWWorkerMessageType.setId) {
    workerId = e.data.id;

    self.postMessage({ type: LZWWorkerMessageType.idSetted, id: workerId } as LZWWorkerMessageIdSetted);
  }

  if (e.data.type === LZWWorkerMessageType.uncompress) {
    const { gifId, pointer, size } = e.data;
    const gif = gifs.get(gifId);
    const inBuffer = new Uint8Array(gif).subarray(pointer, pointer + size);
    const out = new Uint8Array(e.data.out);
    // const start = performance.now();

    // console.log('worker uncompress frame', pointer);
    // console.log('uncompress gif', gifId, gif, workerId);
    lzw_uncompress(inBuffer, out);
    // console.log('worker uncompress frame end in', performance.now() - start, workerId);

    self.postMessage({ type: LZWWorkerMessageType.uncompressDone, gifId, out: e.data.out } as LZWWorkerMessageUncompressDone, [e.data.out]);
  }
});

self.postMessage({ type: LZWWorkerMessageType.ready } as LZWWorkerMessageReady);
