import { ResourceManager } from '../../api/resource-manager';
import { createGLBufferDrawingTarget, GLBufferDrawingTarget } from './gl-drawing-target';

export interface GLResourceManager extends ResourceManager {
    allocateFrameDrawingTarget(width: number, height: number): GLBufferDrawingTarget;
}

export function createGLResourceManager(gl: WebGL2RenderingContext): GLResourceManager {
    const frameDrawingTargets: GLBufferDrawingTarget[] = [];

    return {
        startFrame() {
            clearFrameData();
        },

        endFrame() {
            clearFrameData();
        },

        allocateFrameDrawingTarget(width: number, height: number) {
            const drawingTarget = createGLBufferDrawingTarget(gl, width, height);

            frameDrawingTargets.push(drawingTarget);

            return drawingTarget;
        },

        // allocateFrameTexture() {
            
        // },
    };

    function clearFrameData() {
        for (let i = 0; i < frameDrawingTargets.length; i++) {
            frameDrawingTargets[i].dispose();
        }
    }
}