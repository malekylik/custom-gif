import { ImageDescriptor } from "src/parsing/gif/image_descriptor";

export type FactoryOut = (image: ImageDescriptor) => void;

export interface FactoryResult {
  lzw_uncompress: FactoryOut;
  out: Uint8Array;
}
