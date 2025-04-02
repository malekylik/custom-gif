import { Drawer } from '../../api/drawer';

export interface GLDrawer extends Drawer {
    getGL(): WebGL2RenderingContext;
}

export function createGLDrawer(gl: WebGL2RenderingContext): GLDrawer {
    let drawCallNumber: number = 0;

    return {
        drawTriangles(first, count) {
            gl.drawArrays(gl.TRIANGLES, first, count);

            drawCallNumber += 1;
        },

        getGL() {
            return gl;
        },

        startFrame() {
            drawCallNumber = 0;
        },

        endFrame() {
            drawCallNumber = 0;
        },

        getNumberOfDrawCalls() {
            return drawCallNumber;
        },
    }
}