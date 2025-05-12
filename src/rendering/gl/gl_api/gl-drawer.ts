import { Drawer } from '../../api/drawer';
import { IGLTexture } from './texture';

export interface GLDrawer extends Drawer {
    getGL(): WebGL2RenderingContext;
}

export function createGLDrawer(gl: WebGL2RenderingContext): GLDrawer {
    let drawCallNumber = new WeakMap<IGLTexture, number>();

    return {
        drawTriangles(renderTarget, first, count, flipCount) {
            renderTarget.bind();

            gl.drawArrays(gl.TRIANGLES, first, count);

            const buffer = renderTarget.getBuffer();

            if (drawCallNumber.has(buffer)) {
                drawCallNumber.set(buffer, flipCount + drawCallNumber.get(buffer) + 1);
            } else {
                drawCallNumber.set(buffer, flipCount + 1);
            }
        },

        getGL() {
            return gl;
        },

        startFrame() {
            drawCallNumber = new Map();
        },

        endFrame() {
            drawCallNumber = new Map();
        },

        getNumberOfDrawCalls(renderTarget) {
            return drawCallNumber.has(renderTarget) ? drawCallNumber.get(renderTarget) : 0;
        },
    }
}