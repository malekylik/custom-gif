import { addNewTask, createNode, ListNode, unlinkHead } from '../../list';
import { Task, TaskType, UncompressTask } from '../task/task';
import { GifWorker } from '../worker/gif-worker';
import { ThreadPool } from './thread-pool';

let worker_id = 0;
const getWorkerId = () => worker_id++;

const MAX_SCREEN_SIZE = 2000 * 2000;

export class ThreadPoolMulity implements ThreadPool {
  private workerPull: Array<GifWorker>
  private tasks: { list: ListNode<Task>, length: number };
  private _isReady: Promise<boolean>;

  constructor() {
    this.tasks = { list: null, length: 0 };
    this.workerPull = [
      new GifWorker(MAX_SCREEN_SIZE, '0'),
      new GifWorker(MAX_SCREEN_SIZE, '1'),
      new GifWorker(MAX_SCREEN_SIZE, '2'),
      new GifWorker(MAX_SCREEN_SIZE, '3'),
    ];

    this._isReady = Promise.all(this.workerPull.map(worker => worker.isReady())).then(() => Promise.resolve(true));
  }

  passGifBuffer(buffer: ArrayBuffer, id: string) {
    return Promise.all(this.workerPull.map(worker => worker.passGifBuffer(buffer, id))).then(() => {});
  }

  doWork(gifId: string, uncompressPointerStart: number, size: number) {
    const workers = this.workerPull.filter(worker => !worker.isBusy());
    const worker = workers[Date.now() % workers.length];

    const taskValue: UncompressTask = {
      id: getWorkerId(), type: TaskType.uncompress,
      pointer: uncompressPointerStart, gifId,
      size, _resolve: null, done: null,
    };
    taskValue.done = new Promise((r) => {
      taskValue._resolve = (out: ArrayBuffer) => r(out);
    });

    if (this.tasks.length > 0) {
      const task = createNode<UncompressTask>(taskValue);

      addNewTask(this.tasks.list, task);

      this.tasks.length += 1;

      return taskValue.done;
    }

    if (worker) {
      // console.log('ready worker', worker, taskValue);

      return worker.doWork(taskValue)
        .then(out => {
          this.onTaskEnd();

          // console.log('task done', taskValue, this.tasks.length);

          return out;
        })
    }

    const task = createNode<Task>(taskValue);

    this.tasks.list = task;

    this.tasks.length += 1;
    // console.log('none worker are ready, task is added to waiting list', taskValue, this.tasks.length);

    return taskValue.done;
  }

  isReady(): Promise<boolean> {
    return this._isReady;
  }

  private onTaskEnd(out?: ArrayBuffer) {
    if (this.tasks.length > 0) {
      const workers = this.workerPull.filter(worker => !worker.isBusy());
      // console.log('onTaskEnd', workers, this.workerPull);

      for (let length = workers.length, i = Date.now() % length; length > 0; i = (i + 1) % workers.length, length -= 1) {
        const worker = workers[i];
        const task = this.tasks.list;
        this.tasks.list = unlinkHead(task);
        this.tasks.length -= 1;

        // console.log('take task in work', task.value, worker);

        worker.doWork(task.value).then((out) => {
          // console.log('task done', task.value);
          this.onTaskEnd(out);
          return out;
        });
      }
    }

    return out;
  }
}
