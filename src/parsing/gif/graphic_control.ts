export enum DisposalMethod {
  noAction = 0,
  noDispose = 1,
  clear = 2,
  prev = 3,
}

export interface GraphicControl {
  isTransparent: number;
  isUserInputRequired: number;
  disposalMethod: DisposalMethod;
  delayTime: number;
  transparentColorIndex: number;
}

export function parseGraphicControl(buffer: ArrayBuffer, offset: number): GraphicControl {
  const HEAP8 = new Uint8Array(buffer);

  const isTransparent = HEAP8[offset] & 0b1;
  const isUserInputRequired = HEAP8[offset] >>> 1;
  const disposalMethod = (HEAP8[offset] >>> 2) & 0b111;
  const delayTime = (HEAP8[offset + 1] | (HEAP8[offset + 2] << 8)) * 10;
  const transparentColorIndex = HEAP8[offset + 3];

  return {
    isTransparent,
    isUserInputRequired,
    disposalMethod,
    delayTime,
    transparentColorIndex,
  }
}
