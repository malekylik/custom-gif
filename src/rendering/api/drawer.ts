import { DrawingTarget } from "./drawing-target";

export interface Drawer {
    startFrame(): void;
    endFrame(): void;

    drawTriangles(renderTarget: DrawingTarget, first: number, count: number): void;

    getNumberOfDrawCalls(renderTarget: DrawingTarget): number;
}
