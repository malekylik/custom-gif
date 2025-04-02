import { IGLTexture } from '../gl/gl_api/texture';
import { BufferDrawingTarget } from './drawing-target';

export interface ResourceManager {
    startFrame(): void;
    endFrame(): void;

    allocateFrameDrawingTarget(width: number, height: number): BufferDrawingTarget;
    // TODO: abstract
    // allocateFrameTexture(): IGLTexture;
}