import { LZWWorkerMessage, LZWWorkerMessageSaveGif, LZWWorkerMessageSetId, LZWWorkerMessageType } from '../../../parsing/worker/lzw_worker_message';
import { DoubleBuffer } from '../double-buffer';
import { Task } from '../task/task';

export class GifWorker {
  private id: string;
  private worker: Worker;
  private buffer: DoubleBuffer;
  private busy: boolean;
  private _isReady: Promise<boolean>;

  constructor(size: number, id: string) {
    this.id = id;

    this.worker = new Worker(new URL('../../../parsing/worker/lzw_uncompress.worker.ts', import.meta.url));
  
    this._isReady = new Promise((r) => {
      const handler = (e: MessageEvent<LZWWorkerMessage>) => {
        if (e.data.type === LZWWorkerMessageType.ready) {
          this.worker.postMessage({ type: LZWWorkerMessageType.setId, id } as LZWWorkerMessageSetId);
        }

        if (e.data.type === LZWWorkerMessageType.idSetted) {
          this.worker.removeEventListener('message', handler);
          r(true)
        }
      };

      this.worker.addEventListener('message', handler);
    });

    this.buffer = new DoubleBuffer(size);
  }

  passGifBuffer(buffer: ArrayBuffer, id: string) {
    this.worker.postMessage({ type: LZWWorkerMessageType.saveGif, id, gif: buffer } as LZWWorkerMessageSaveGif);

    return new Promise((resolve) => {
      const _this = this;

      function handler(e: MessageEvent<LZWWorkerMessage>) {
        if (e.data.type === LZWWorkerMessageType.gifSaved) {
          _this.worker.removeEventListener('message', handler);
          resolve(undefined);
        }
      }

      this.worker.addEventListener('message', handler);
    });
  }

  doWork(task: Task) {
    const out = this.buffer.get();
    this.worker.postMessage({ type: LZWWorkerMessageType.uncompress, gifId: task.gifId, pointer: task.pointer, size: task.size, out: out }, [out]);
    this.busy = true;

    const _this = this;

    function handler(e: MessageEvent<LZWWorkerMessage>) {
      // console.log(`handle message with type ${e.data.type} from worker ${e.data.workerId}`);

      if (e.data.type === LZWWorkerMessageType.uncompressDone) {
        _this.worker.removeEventListener('message', handler);
        
        const out = e.data.out;

        _this.buffer.return(out);
        _this.busy = false;

        task._resolve(out);
      }
    }

    _this.worker.addEventListener('message', handler);

    return task.done;
  }

  isBusy(): boolean {
    return this.busy;
  }

  isReady(): Promise<boolean> {
    return this._isReady;
  }
}
