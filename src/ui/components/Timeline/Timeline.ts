import { root } from "@maverick-js/signals";
import { html } from "../../parsing";
import { Component, toComponent } from "../utils";
import { createGLDrawer } from "../../../rendering/gl/gl_api/gl-drawer";
import { BasicRenderer } from "src/rendering/gl/renderer";
import { RendererGifDescriptor } from "src/rendering/renderer";
import { GLTexture } from "../../../rendering/gl/gl_api/texture";
import { getGLSystem, initGLSystem } from "../../../rendering/gl/gl-system";
import { ShaderPromgramId } from "../../../rendering/api/shader-manager";
import { createGLScreenDrawingTarget } from "../../../rendering/gl/gl_api/gl-drawing-target";
import { INDECIES_COUNT_NUMBER, QUAD_WITH_TEXTURE_COORD_DATA_INVERTED, VBO_LAYOUT } from "../../../rendering/gl/consts";
import { GLVBO } from "../../../rendering/gl/gl_api/vbo";

export type TimelineDataProps = {
  renderer: BasicRenderer;
  descriptor: RendererGifDescriptor;
};

export function TimelineData(props: TimelineDataProps): Component {
  return root((dispose) => {
    const { renderer, descriptor } = props
    const height = 80;

    // TODO: fix disabled property, it wants me to just write "disabled";
    const view = html`
      <div style="${() => `display: flex; width: 100%; height: ${height}`}">
          <canvas></canvas>
      </div>
    `;

    setTimeout(async () => {
        const canvas = view.element.querySelector('canvas');
        const container = canvas.parentElement;

        const width = container.getBoundingClientRect().width;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const gl = canvas.getContext('webgl2');

        const glSystemId = 'random_stuff'

        initGLSystem(gl, glSystemId);

        const drawer = createGLDrawer(gl);
        drawer.startFrame();

        gl.viewport(0, 0, width, height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Otherwise will get - WebGL: INVALID_OPERATION: texImage2D: ArrayBufferView not big enough for request
        // Since RGB is not align by 4
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        const gifWidth = renderer.getGif(descriptor).gif.screenDescriptor.screenWidth;
        const gifHeight = renderer.getGif(descriptor).gif.screenDescriptor.screenHeight;
        const gifSize = gifWidth * gifHeight;

        let buff1 = new Uint8Array(gifSize * 4);
        await renderer.setFrame(descriptor, 0);
        renderer.readCurrentFrame(descriptor, buff1);
        buff1 = buff1.filter((v, i) => !Number.isInteger((i + 1) / 4)).slice(0, gifSize * gifSize * 3);

        let buff2 = new Uint8Array(gifSize * 4);
        await renderer.setFrame(descriptor, 1);
        renderer.readCurrentFrame(descriptor, buff2);
        buff2 = buff2.filter((v, i) => !Number.isInteger((i + 1) / 4)).slice(0, gifSize * gifSize * 3);

        let buff3 = new Uint8Array(gifSize * 4);
        await renderer.setFrame(descriptor, 2);
        renderer.readCurrentFrame(descriptor, buff3);
        buff3 = buff3.filter((v, i) => !Number.isInteger((i + 1) / 4)).slice(0, gifSize * gifSize * 3);

        let buff4 = new Uint8Array(gifSize * 4);
        await renderer.setFrame(descriptor, 3);
        renderer.readCurrentFrame(descriptor, buff4);
        buff4 = buff4.filter((v, i) => !Number.isInteger((i + 1) / 4)).slice(0, gifSize * gifSize * 3);

        console.log(buff1, buff2, buff3, buff4);

        const frame1Texture = new GLTexture(gl, gifWidth, gifHeight, buff1);
        const frame2Texture = new GLTexture(gl, gifWidth, gifHeight, buff2);
        const frame3Texture = new GLTexture(gl, gifWidth, gifHeight, buff3);
        const frame4Texture = new GLTexture(gl, gifWidth, gifHeight, buff4);

        const vboToTexture = new GLVBO(gl, VBO_LAYOUT);
    
        vboToTexture.bind(gl);
        vboToTexture.setData(gl, QUAD_WITH_TEXTURE_COORD_DATA_INVERTED);
        vboToTexture.activateAllAttribPointers(gl);

        const drawingTarget = createGLScreenDrawingTarget(drawer.getGL());

        const gpuProgram = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimeline);

        gpuProgram.useProgram(gl);

        gpuProgram.setTextureUniform(gl, 'targetTexture', frame1Texture);

        drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER, drawer.getNumberOfDrawCalls(frame1Texture));
    }, 1000);


    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}