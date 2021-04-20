import { ImageDecriptor } from "src/parsing/gif/image_descriptor";

export type FactoryOut = (image: ImageDecriptor) => void;

export interface FactoryResult {
  lzw_uncompress: FactoryOut;
  out: Uint8Array;
}
