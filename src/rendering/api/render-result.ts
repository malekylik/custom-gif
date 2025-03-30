import { IGLTexture } from '../gl/gl_api/texture'; // TODO: abstract

export interface RenderResult {
    texture: IGLTexture;
    readResultToBuffer(buffer: ArrayBufferView): void;
}
