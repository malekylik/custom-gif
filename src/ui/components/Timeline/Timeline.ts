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
      <div style="${() => `display: flex; width: 100%; height: ${height}px`}">
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
        frame1Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        frame1Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        frame1Texture.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        frame1Texture.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const frame2Texture = new GLTexture(gl, gifWidth, gifHeight, buff2);
        frame2Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        frame2Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        frame2Texture.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        frame2Texture.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const frame3Texture = new GLTexture(gl, gifWidth, gifHeight, buff3);
        frame3Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        frame3Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        frame3Texture.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        frame3Texture.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const frame4Texture = new GLTexture(gl, gifWidth, gifHeight, buff4);
        frame4Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        frame4Texture.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        frame4Texture.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        frame4Texture.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const drawingTarget = createGLScreenDrawingTarget(drawer.getGL());

        const gpuProgram = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimeline);

        gpuProgram.useProgram(gl);

        gpuProgram.setTextureUniform(gl, 'targetTexture1', frame1Texture);
        gpuProgram.setTextureUniform(gl, 'targetTexture2', frame2Texture);
        gpuProgram.setTextureUniform(gl, 'targetTexture3', frame3Texture);
        gpuProgram.setTextureUniform(gl, 'targetTexture4', frame4Texture);


        const frameCount = 4;
        const adjGifWidth = gifWidth * (height / gifHeight);
        console.log('total width', width);
        console.log('gif width', gifWidth);
        console.log('gif width adj', adjGifWidth);
        gpuProgram.setUniform1f(gl, 'totalWidth', width);
        gpuProgram.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
        gpuProgram.setUniform1f(gl, 'offset', Math.max(1.0, Math.ceil((Math.floor(width / adjGifWidth) - frameCount) / Math.max(1.0, frameCount - 1))));


        gl.clear(gl.COLOR_BUFFER_BIT)

        drawer.drawTriangles(drawingTarget, 0, 6 * frameCount, drawer.getNumberOfDrawCalls(frame1Texture));
    }, 1000);


    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}