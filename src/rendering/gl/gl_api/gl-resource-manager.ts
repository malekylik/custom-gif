import { ResourceManager } from '../../api/resource-manager';
import { createGLBufferDrawingTarget, GLBufferDrawingTarget } from './gl-drawing-target';

export interface GLFrameDrawingLastinAllocator {
    allocate(width: number, height: number): GLBufferDrawingTarget;
    dispose(buffer: GLBufferDrawingTarget): void;
}

export interface GLFrameDrawingTargetTemporaryAllocator {
    allocate(width: number, height: number): GLBufferDrawingTarget;
}
export interface GLResourceManager extends ResourceManager {
    allocateFrameDrawingTarget(callback: (allocator: GLFrameDrawingTargetTemporaryAllocator) => void): void;
    getLastingAllocator(): GLFrameDrawingLastinAllocator;
}

export function createGLResourceManager(gl: WebGL2RenderingContext, id: string): GLResourceManager {
    let frameDrawingTargets: GLBufferDrawingTarget[][] = [];
    let globalDrawingTargets: GLBufferDrawingTarget[] = [];
    let allocationDepth: number = -1;
    let allocationCount = 0;

    const lastingAllocator: GLFrameDrawingLastinAllocator = {
        allocate(width, height) {
            const drawingTarget = createGLBufferDrawingTarget(gl, width, height);

            globalDrawingTargets.push(drawingTarget);

            allocationCount += 1;

            return drawingTarget;
        },

        dispose(buffer) {
            const bufferIndex = globalDrawingTargets.findIndex(t => t === buffer);

            if (bufferIndex === -1) {
                console.warn(`${id}: buffer was already disposed or never created with current allocator`);
            }

            globalDrawingTargets[bufferIndex] = null;
            globalDrawingTargets = globalDrawingTargets.filter(v => v !== null);

            buffer.dispose();
        },
    };


    return {
        startFrame() {
            clearFrameData();

            allocationCount = 0;
        },

        endFrame() {
            clearFrameData();

            allocationCount = 0;
        },

        allocateFrameDrawingTarget(callback) {
            allocationDepth += 1;
            frameDrawingTargets[allocationDepth] = [];

            const allocator: GLFrameDrawingTargetTemporaryAllocator & { depth: number } = {
                depth: allocationDepth,

                allocate(width, height) {
                    if (this.depth !== allocationDepth) {
                        console.warn(`${id}: allocator should be called inside own callback`);
                    }

                    const drawingTarget = createGLBufferDrawingTarget(gl, width, height);

                    frameDrawingTargets[allocationDepth].push(drawingTarget);

                    allocationCount += 1;

                    return drawingTarget;
                },
            };

            try {
                callback(allocator);

                clearCurrentLevelData();
            } catch (e) {
                console.warn(e);
                clearCurrentLevelData();
            }

            function clearCurrentLevelData() {
                for (let i = 0; i < frameDrawingTargets[allocationDepth].length; i++) {
                    frameDrawingTargets[allocationDepth][i].dispose();
                }

                frameDrawingTargets[allocationDepth] = [];
                allocationDepth -= 1;
            }
        },

        getLastingAllocator() {
            return lastingAllocator;
        },
    };

    function clearFrameData() {
        for (let i = 0; i < frameDrawingTargets.length; i++) {
            for (let j = 0; j < frameDrawingTargets[i].length; j++) {
                frameDrawingTargets[i][j].dispose();
            }
        }

        frameDrawingTargets = [];
    }
}