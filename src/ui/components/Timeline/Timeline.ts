import { effect, ReadSignal, root, signal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";
import { createGLDrawer } from "../../../rendering/gl/gl_api/gl-drawer";
import { BasicRenderer } from "src/rendering/gl/renderer";
import { RendererGifDescriptor } from "src/rendering/renderer";
import { GLTexture } from "../../../rendering/gl/gl_api/texture";
import { disposeGLSystem, getGLSystem, initGLSystem } from "../../../rendering/gl/gl-system";
import { ShaderPromgramId } from "../../../rendering/api/shader-manager";
import { createGLScreenDrawingTarget } from "../../../rendering/gl/gl_api/gl-drawing-target";

export type TimelineDataProps = {
  renderer: BasicRenderer;
  descriptor: RendererGifDescriptor;
  currentFrameNumber: ReadSignal<number>;
  isPlay: ReadSignal<boolean>;
};

let id = 0;

export function TimelineData(props: TimelineDataProps): Component {
  return root((dispose) => {
    const { renderer, descriptor } = props
    const height = 80;
    let glSystemId = `Timeline_${id++}`;
    let frameTextures: GLTexture[] = [];
    let frameCount = signal(0);
    let canvasWidth = signal(0);
    let frameWidth = signal(0);
    let offset = signal(0);
    let frameStart = signal(0);
    let redrawDisabled = signal(true);
    let redraw: () => Promise<void> = () => { return Promise.resolve(); };
    let drawNext: () => Promise<void> = () => { return Promise.resolve(); };

    const view = html`
      <div>
        <ul style="position: relative; padding: 0; height: 20px; list-style: none;">
            ${toChild(() =>
              Array.from({ length: frameCount() })
                .map((_, i) => html`<li style="${() => "position: absolute; left: " + (frameWidth() * i + offset()) + "px"}">${frameStart () + i + 1}</li>`))
            }
          </ul>
        <div style="${() => `display: flex; width: 100%; height: ${height}px`}">
            <canvas></canvas>
        </div>
        <button disabled="${() => redrawDisabled()}" onClick="${toEvent(() => {
          redrawDisabled.set(true);
          drawNext()
          .then(() => {
            redrawDisabled.set(false);
          });
          })}">next</button>
      </div>
    `;

    setTimeout(async () => {
        const canvas = view.element.querySelector('canvas');
        const container = canvas.parentElement;

        const width = container.getBoundingClientRect().width;

        canvasWidth.set(width);

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const gl = canvas.getContext('webgl2');

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

        const adjGifWidth = gifWidth * (height / gifHeight);
        const maxFrameInTimeline = Math.ceil(width / adjGifWidth);
        const possibleMaxFrameCount = 4;

        frameWidth.set(adjGifWidth);

        const _offset = offset;
        const _frameCount = frameCount;

        let prevDrawResult: { first: number; length: number; nextOffset: number; nextPadding: number } = { first: 0, length: 0, nextOffset: 0, nextPadding: 0 };
        let lastDrawResult: { first: number; length: number; nextOffset: number; nextPadding: number } = prevDrawResult;

        const _redraw = async (currentFrame: number, startPadding: number, startOffset: number) => {
          const offset = Math.max(1.0, Math.ceil((maxFrameInTimeline - possibleMaxFrameCount) / Math.max(1.0, possibleMaxFrameCount - 1)));
          const adjustedCurrentFrame = currentFrame
          const maxFrameInTimelineWithoutOffset = Math.min(Math.ceil((width - startPadding) / adjGifWidth), renderer.getGif(descriptor).gif.images.length - adjustedCurrentFrame);
          
          const frameCount = Math.ceil((maxFrameInTimelineWithoutOffset - startOffset) / offset);

          for (let i = 0; i < frameTextures.length; i++) {
            frameTextures[i].dispose(gl);
          }
          frameTextures = [];

          // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          // +       +       +          +     

          let lastFrameNumber: number = 0;
          for (let i = 0; i < frameCount; i++) {
            let buff = new Uint8Array(gifSize * 4);
            const newFrameNumber = adjustedCurrentFrame + startOffset + i * offset;
            await renderer.setFrame(descriptor, newFrameNumber);
            renderer.readCurrentFrame(descriptor, buff);
            buff = buff.filter((v, i) => !Number.isInteger((i + 1) / 4)).slice(0, gifSize * gifSize * 3);

            const frameTexture = new GLTexture(gl, gifWidth, gifHeight, buff);
            frameTexture.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            frameTexture.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            frameTexture.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            frameTexture.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            frameTextures.push(frameTexture);

            lastFrameNumber = newFrameNumber;
          }

          // in pixels
          const nextPadding = Math.min(Math.max(0, -(width - (maxFrameInTimelineWithoutOffset * adjGifWidth + startPadding))), adjGifWidth);
          const nextOffset = Math.max(0, (offset + lastFrameNumber) - (adjustedCurrentFrame + maxFrameInTimelineWithoutOffset));

          const drawingTarget = createGLScreenDrawingTarget(drawer.getGL());

          const gpuProgram = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimeline);

          gpuProgram.useProgram(gl);

          for (let i = 0; i < frameTextures.length; i++) {
            const texture = frameTextures[i];
            gpuProgram.setTextureUniform(gl, `targetTexture${i + 1}`, texture);
          }

          gpuProgram.setUniform1f(gl, 'totalWidth', width);
          gpuProgram.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
          gpuProgram.setUniform1f(gl, 'offset', offset);
          gpuProgram.setUniform1f(gl, 'startPadding', startPadding);
          gpuProgram.setUniform1f(gl, 'startOffset', startOffset);

          gl.clear(gl.COLOR_BUFFER_BIT)

          drawer.drawTriangles(drawingTarget, 0, 6 * frameCount, 0);

          const currentSelectedFrame = props.currentFrameNumber() - adjustedCurrentFrame - 1;
          if (!(currentSelectedFrame < 0 || currentSelectedFrame > adjustedCurrentFrame + maxFrameInTimelineWithoutOffset)) {

            const gpuProgramCurrentFrame = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimelineCurrentFrame);

            gpuProgramCurrentFrame.useProgram(gl);

            gpuProgramCurrentFrame.setUniform1f(gl, 'totalWidth', width);
            gpuProgramCurrentFrame.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
            gpuProgramCurrentFrame.setUniform1f(gl, 'startPadding', startPadding);
            gpuProgramCurrentFrame.setUniform1f(gl, 'startOffset', currentSelectedFrame);

            drawer.drawTriangles(drawingTarget, 0, 6 * 1, 0);
          }

          _offset.set(startPadding);
          _frameCount.set(maxFrameInTimelineWithoutOffset);
          frameStart.set(adjustedCurrentFrame);

          return { first: adjustedCurrentFrame, length: maxFrameInTimelineWithoutOffset, nextOffset: nextOffset, nextPadding };
        }

        redrawDisabled.set(true);

        redraw = () => {
          return _redraw(prevDrawResult.first + prevDrawResult.length, prevDrawResult.nextPadding, prevDrawResult.nextOffset).then(() => {})
        }

        drawNext = () => {
          if (lastDrawResult.first + lastDrawResult.length >= renderer.getGif(descriptor).gif.images.length) {
          prevDrawResult = { first: 0, length: 0, nextOffset: 0, nextPadding: 0 };
          return _redraw(0, 0, 0)
          .then((v) => {
            lastDrawResult = v;
          });
          } else {
          prevDrawResult = lastDrawResult;
          return _redraw(lastDrawResult.first + lastDrawResult.length, lastDrawResult.nextPadding, lastDrawResult.nextOffset)
          .then((v) => {
            lastDrawResult = v;
          });
          }
        }

        redraw()
          .then(() => {
            redrawDisabled.set(false);

            effect(() => {
              if (!props.isPlay()) {
                props.currentFrameNumber();
                redrawDisabled.set(true);
                redraw().then(() => {
                  redrawDisabled.set(false);
                });
              }
            })
          });
    }, 1000);

    return toComponent(view.element, () => { dispose(); view.dispose(); getGLSystem(this.id).shaderManager.dispose(); disposeGLSystem(glSystemId); });
  });
}