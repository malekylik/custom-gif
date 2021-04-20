export class GrapgicMemory {
  private width: number;
  private height: number;
  private memory: ImageData;


  constructor (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.memory = new ImageData(width, height);
  }

  getRawMemory(): ImageData {
    return this.memory;
  }

  setRedInPixel(x: number, y: number, red: number) {
    const offset = (y * this.width + x) * 4;

    this.memory.data[offset + 0] = red;
  }

  setGreenInPixel(x: number, y: number, green: number) {
    const offset = (y * this.width + x) * 4;

    this.memory.data[offset + 1] = green;
  }

  setBlueInPixel(x: number, y: number, blue: number) {
    const offset = (y * this.width + x) * 4;

    this.memory.data[offset + 2] = blue;
  }

  setAlphaInPixel(x: number, y: number, alpha: number) {
    const offset = (y * this.width + x) * 4;

    this.memory.data[offset + 3] = alpha;
  }

  set(graphic: GrapgicMemory) {
    this.memory.data.set(graphic.getRawMemory().data);
  }
}
