export class DoubleBuffer {
  private readyBuffer: number;
  private buffets: Array<ArrayBuffer>;

  constructor(size: number) {
    this.buffets = [
      new ArrayBuffer(size),
      new ArrayBuffer(size),
    ];

    this.readyBuffer = 0;
  }

  get() {
    // console.log('get buffer', this.readyBuffer);
    const buffer = this.buffets[this.readyBuffer];

    this.readyBuffer = (this.readyBuffer + 1) % this.buffets.length;

    return buffer;
  }

  return(buffer: ArrayBuffer) {
    const readyBuffer = (this.readyBuffer + 1) % this.buffets.length;

    // console.log('return buffer', readyBuffer);

    this.buffets[readyBuffer] = buffer;
  }
}
