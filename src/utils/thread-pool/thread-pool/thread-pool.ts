export interface ThreadPool {
  isReady(): Promise<boolean>;
  passGifBuffer(buffer: ArrayBuffer, id: string): Promise<void>;
  doWork(gifId: string, uncompressPointerStart: number, size: number): Promise<ArrayBuffer>;
}
