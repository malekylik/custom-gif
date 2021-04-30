export enum TaskType {
  uncompress = 'uncompress-task',
}

export type UncompressTask = {
  id: number;
  gifId: string,
  type: TaskType.uncompress;
  pointer: number;
  size: number;
  done: Promise<ArrayBuffer>;
  _resolve: (out: ArrayBuffer) => void;
};

export type Task = UncompressTask;
