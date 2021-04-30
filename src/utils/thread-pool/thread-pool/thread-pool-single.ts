import { lzw_uncompress } from '../../../parsing/lzw/uncompress/uncompress';
import { ThreadPool } from './thread-pool';

const MAX_SCREEN_SIZE = 2000 * 2000;

export class ThreadPoolSingle implements ThreadPool {
  private out: Uint8Array;
  private gifs: Map<string, ArrayBuffer>;

  constructor() {
    this.gifs = new Map();
    this.out = new Uint8Array(MAX_SCREEN_SIZE);
  }

  isReady(): Promise<boolean> {
    return Promise.resolve(true);
  }

  passGifBuffer(buffer: ArrayBuffer, id: string): Promise<void> {
    this.gifs.set(id, buffer);

    return Promise.resolve();
  }

  doWork(gifId: string, uncompressPointerStart: number, size: number) {
    const gif = this.gifs.get(gifId);
    const inBuffer = new Uint8Array(gif).subarray(uncompressPointerStart, uncompressPointerStart + size);
    const out = this.out;

    lzw_uncompress(inBuffer, out);

    return Promise.resolve(this.out.buffer);
  }
}
