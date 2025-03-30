import { IGLTexture } from "../gl/gl_api/texture";

export interface DrawingTarget {
    bind(): void;
}

export type ScreenDrawingTarget = DrawingTarget;

export interface BufferDrawingTarget extends DrawingTarget {
    // TODO: should be abstract
    getBuffer(): IGLTexture;
    // dispose(): void;
};
