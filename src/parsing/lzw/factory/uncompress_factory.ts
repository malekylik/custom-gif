export type FactoryOut = (image: { startPointer: number; compressedDataSize: number }) => void;

export interface FactoryResult {
  lzw_uncompress: FactoryOut;
  out: Uint8Array;
}
