import { IGLTexture } from '../gl/gl_api/texture'; // TODO: abstract

// TODO check if it's needed it
export interface RenderResult {
    texture: IGLTexture;
    readResultToBuffer(buffer: ArrayBufferView): void;
}
