export interface Drawer {
    startFrame(): void;
    endFrame(): void;

    drawTriangles(first: number, count: number): void;

    getNumberOfDrawCalls(): number;
}
