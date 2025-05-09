import { DrawingTarget } from '../../api/drawing-target';
import { Drawer } from '../../api/drawer';

export interface GLDrawer extends Drawer {
    getGL(): WebGL2RenderingContext;
}

export function createGLDrawer(gl: WebGL2RenderingContext): GLDrawer {
    let drawCallNumber = new WeakMap<DrawingTarget, number>();

    return {
        drawTriangles(renderTarget, first, count) {
            renderTarget.bind();

            gl.drawArrays(gl.TRIANGLES, first, count);

            if (drawCallNumber.has(renderTarget)) {
                drawCallNumber.set(renderTarget, drawCallNumber.get(renderTarget) + 1);
            } else {
                drawCallNumber.set(renderTarget, 0);
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

        getNumberOfDrawCalls(renderTarget: DrawingTarget) {
            return drawCallNumber.has(renderTarget) ? drawCallNumber.get(renderTarget) : 0;
        },
    }
}