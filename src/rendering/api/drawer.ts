import { IGLTexture } from "../gl/gl_api/texture";
import { BufferDrawingTarget } from "./drawing-target";

export interface Drawer {
    startFrame(): void;
    endFrame(): void;

    drawTriangles(renderTarget: BufferDrawingTarget, first: number, count: number, flipCount: number): void;

    getNumberOfDrawCalls(renderTarget: IGLTexture): number;
}
