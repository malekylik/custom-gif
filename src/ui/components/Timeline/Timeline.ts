import { effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, reScale, toComponent } from "../utils";
import { createGLDrawer } from "../../../rendering/gl/gl_api/gl-drawer";
import { BasicRenderer } from "../../../rendering/gl/renderer";
import { RendererGifDescriptor } from "src/rendering/renderer";
import { disposeGLSystem, getGLSystem, initGLSystem } from "../../../rendering/gl/gl-system";
import { ShaderPromgramId } from "../../../rendering/api/shader-manager";
import { createGLScreenDrawingTarget, GLBufferDrawingTarget } from "../../../rendering/gl/gl_api/gl-drawing-target";
import { GifEntity } from "src/parsing/new_gif/gif_entity";
import { FactoryResult } from "src/parsing/lzw/factory/uncompress_factory";
import { CopyRenderResultRenderPass } from "../../../rendering/gl/render-pass/copy-render-result-pass";
import { FlipRenderResultsRenderPass } from "../../../rendering/gl/render-pass/flip-render-pass";
import { GLTexture, IGLTexture, TextureFormat, TextureType } from "../../../rendering/gl/gl_api/texture";

export type TimelineDataProps = {
  gif: GifEntity,
  uncompress: FactoryResult,
  currentFrameNumber: WriteSignal<number>;
  isPlay: ReadSignal<boolean>;
  timelineHeight: number;
  render: (frame: number) => void;
};

let id = 0;

export function TimelineData(props: TimelineDataProps): Component {
  return root((dispose) => {
    const { timelineHeight, gif, uncompress } = props;
    const height = timelineHeight;
    let renderer = new BasicRenderer();
    let disposeGL = () => {};
    let getDescriptor = (() => {}) as (() => RendererGifDescriptor);
    let glSystemId = `Timeline_${id++}`;
    let currentTexturesRange: { start: number; length: number; lastFrameNumber: number; } = { start: 0, length: -1, lastFrameNumber: -1 };
    let frameTextures: GLBufferDrawingTarget[] = [];
    let frameCount = signal(0);
    let canvasWidth = signal(0);
    let frameWidth = signal(0);
    let offset = signal(0);
    let frameStart = signal(0);
    let redrawDisabled = signal(true);
    let redraw: () => Promise<void> = () => { return Promise.resolve(); };
    let drawNext: () => Promise<void> = () => { return Promise.resolve(); };
    let setCurrentFrame = (e: MouseEvent) => {
      if (props.isPlay()) {
        return;
      }

      const clickFrame = ((e.offsetX - offset()) / frameWidth() + frameStart()) | 0;

      if (clickFrame !== props.currentFrameNumber() - 1 && clickFrame < renderer.getGif(getDescriptor()).gif.images.length ) {
        props.render(clickFrame);
      }

    };

    const view = html`
      <div>
        <ul style="position: relative; padding: 0; height: 20px; list-style: none;">
            ${toChild(() =>
              Array.from({ length: frameCount() })
                .map((_, i) => html`<li style="${() => "position: absolute; left: " + (frameWidth() * i + offset()) + "px"}">${frameStart() + i + 1}</li>`))
            }
          </ul>
        <div style="${() => `display: flex; width: 100%; height: ${height}px;` + (props.isPlay() ? ' cursor: defualt': ' cursor: pointer')}">
            <canvas onClick="${toEvent(setCurrentFrame)}"></canvas>
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
        const descriptor = await renderer.addGifToRender(gif, canvas, { uncompress: uncompress, algorithm: 'GL' });

        disposeGL = () => { renderer.dispose(); };
        getDescriptor = () => descriptor;
        const container = canvas.parentElement;

        const width = container.getBoundingClientRect().width;

        canvasWidth.set(width);

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const gl = canvas.getContext('webgl2');

        initGLSystem(gl, glSystemId);

        const drawer = createGLDrawer(gl);
        drawer.startFrame();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, width, height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const gifWidth = renderer.getGif(descriptor).gif.screenDescriptor.screenWidth;
        const gifHeight = renderer.getGif(descriptor).gif.screenDescriptor.screenHeight;

        const adjGifWidth = reScale(gifWidth, gifHeight, height) | 0;

        const gifSize = adjGifWidth * height;

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

          // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          // +       +       +          +     
          let lastFrameNumber: number = 0;
          if (currentTexturesRange.start === adjustedCurrentFrame && currentTexturesRange.length === maxFrameInTimelineWithoutOffset) {
            lastFrameNumber = currentTexturesRange.lastFrameNumber;
          } else {
            for (let i = 0; i < frameTextures.length; i++) {
              const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator();
              allocator.dispose(frameTextures[i]);
            }
            frameTextures = [];

            for (let i = 0; i < frameCount; i++) {
              const newFrameNumber = adjustedCurrentFrame + startOffset + i * offset;
              await renderer.setFrameSilent(descriptor, newFrameNumber);

              const currentFrame = renderer.getCurrentTexture(descriptor);
              currentFrame.setTextureWrap(gl, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              currentFrame.setTextureWrap(gl, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              currentFrame.setTextureFilter(gl, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
              currentFrame.setTextureFilter(gl, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

              const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator();
              const drawingTarget = allocator.allocate(adjGifWidth, height);

              frameTextures.push(drawingTarget);

              gl.viewport(0, 0, adjGifWidth, height);

              new CopyRenderResultRenderPass(drawer, getGLSystem(glSystemId).shaderManager)
                .execute({
                  memory: {},
                  globals: {},
                  textures: {
                    targetTexture: currentFrame,
                  },
                  drawingTarget: drawingTarget,
                });

              lastFrameNumber = newFrameNumber;
            }

            currentTexturesRange.start = adjustedCurrentFrame;
            currentTexturesRange.length = maxFrameInTimelineWithoutOffset;
            currentTexturesRange.lastFrameNumber = lastFrameNumber;
          }

          // in pixels
          const nextPadding = Math.min(Math.max(0, -(width - (maxFrameInTimelineWithoutOffset * adjGifWidth + startPadding))), adjGifWidth);
          const nextOffset = Math.max(0, (offset + lastFrameNumber) - (adjustedCurrentFrame + maxFrameInTimelineWithoutOffset));

          const drawingTarget = createGLScreenDrawingTarget(drawer.getGL());

          const gpuProgram = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimeline);

          getGLSystem(glSystemId).resouceManager.allocateFrameDrawingTarget((allocator) => {
            const gpuProgramTextures: IGLTexture[] = [];

            for (let i = 0; i < frameTextures.length; i++) {
              let texture = frameTextures[i].getBuffer();

              if (drawer.getNumberOfDrawCalls(texture) % 2 === 1) {
                gl.viewport(0, 0, adjGifWidth, height);

                const result = new FlipRenderResultsRenderPass(drawer, getGLSystem(glSystemId).shaderManager)
                  .execute({
                    memory: {},
                    globals: {},
                    textures: { targetTexture: texture },
                    drawingTarget: allocator.allocate(adjGifWidth, height),
                  });

                gpuProgramTextures.push(result.texture);
              } else {
                gpuProgramTextures.push(texture);
              }
            }

            gpuProgram.useProgram(gl);
            for (let i = 0; i < gpuProgramTextures.length; i++) {
              const texture = gpuProgramTextures[i];
              gpuProgram.setTextureUniform(gl, `targetTexture${i + 1}`, texture);
            }

            gpuProgram.setUniform1f(gl, 'totalWidth', width);
            gpuProgram.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
            gpuProgram.setUniform1f(gl, 'offset', offset);
            gpuProgram.setUniform1f(gl, 'startPadding', startPadding);
            gpuProgram.setUniform1f(gl, 'startOffset', startOffset);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.viewport(0, 0, width, height);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // TODO: Add this to drawer
            drawingTarget.bind();
            gl.clear(gl.COLOR_BUFFER_BIT);

            drawer.drawTriangles(drawingTarget, 0, 6 * frameCount, 0);
          });

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

        drawNext()
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
    }, 0);

    return toComponent(view.element, () => { dispose(); view.dispose(); frameTextures.forEach(v => { const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator(); allocator.dispose(v); }); getGLSystem(glSystemId).shaderManager.dispose(); disposeGLSystem(glSystemId); disposeGL(); });
  });
}