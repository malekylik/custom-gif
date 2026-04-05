import { effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, reScale, toComponent } from "../utils";
import { createGLDrawer } from "../../../rendering/gl/gl_api/gl-drawer";
import { BasicRenderer } from "../../../rendering/gl/renderer";
import { RendererGifDescriptor } from "src/rendering/renderer";
import { disposeGLSystem, getGLSystem, initGLSystem } from "../../../rendering/gl/gl-system";
import { ShaderPromgramId } from "../../../rendering/api/shader-manager";
import { createGLScreenDrawingTarget, GLBufferDrawingTarget } from "../../../rendering/gl/gl_api/gl-drawing-target";
import { GifEntity } from "../../../parsing/new_gif/gif_entity";
import { CopyRenderResultRenderPass } from "../../../rendering/gl/render-pass/copy-render-result-pass";
import { FlipRenderResultsRenderPass } from "../../../rendering/gl/render-pass/flip-render-pass";
import { IGLTexture } from "../../../rendering/gl/gl_api/texture";
import { getCurrentVisibleFrame, getNextThumbnailFrames, ScrollRenderData } from "./timeline.utils";
import { LZWThread } from "../../../parallel_computation/main/lzw_facade";
import { Effect as GifEffect } from '../../../rendering/api/effect';
import { getEffectName } from "../GifEffectData/utils";

export type TimelineDataProps = {
  gif: GifEntity,
  currentFrameNumber: WriteSignal<number>;
  isPlay: ReadSignal<boolean>;
  timelineHeight: number;
  render: (frame: number) => void;

  effects: ReadSignal<GifEffect[]>;
};

let id = 0;

export function TimelineData(props: TimelineDataProps): Component {
  return root((dispose) => {
    const { timelineHeight, gif } = props;
    const height = timelineHeight;

    const gifWidth = gif.gif.screenDescriptor.screenWidth;
    const gifHeight = gif.gif.screenDescriptor.screenHeight;

    const adjGifWidth = reScale(gifWidth, gifHeight, height) | 0;
    const allGifFramesWidth = adjGifWidth * gif.gif.images.length;
    const totalTimelineWidth = allGifFramesWidth + adjGifWidth * 2;

    const possibleMaxFrameCount = 4;
    let width = 0;
    let offset = 0;
    let maxFrameInTimeline = 0;

    let currentScrollPosition = signal(0);
    let scrollRenderData: ScrollRenderData = {
      currentFrame: 0,
      thumbnailFrames: [],
      frameStartOffset: 0,
      normilizedStartPadding: 0,
    };

    let requestAnimationFrameId = -1;

    let renderer = new BasicRenderer();
    let disposeGL = () => {};
    let getDescriptor = (() => {}) as (() => RendererGifDescriptor);
  
    let glSystemId = `Timeline_${id++}`;
    let prevThubnailFrames: number[] = [];
    let frameTextures: GLBufferDrawingTarget[] = [];
    let frameCount = signal(0);
    let canvasWidth = signal(0);
    let frameWidth = signal(0);
    let frameNumbersOffset = signal(0);
    let frameStart = signal(0);
    let redraw: () => Promise<void> = () => { return Promise.resolve(); };
    let setCurrentFrame = (e: MouseEvent) => {
      if (props.isPlay()) {
        return;
      }

      const clickFrame = ((e.offsetX - frameNumbersOffset()) / frameWidth() + frameStart()) | 0;

      if (clickFrame !== props.currentFrameNumber() - 1 && clickFrame < renderer.getGif(getDescriptor()).gif.images.length ) {
        props.render(clickFrame);
      }
    };

    let recalculateScrollState = (scrollLeft: number): void => {
      currentScrollPosition.set(scrollLeft);

      scrollRenderData.currentFrame = getCurrentVisibleFrame(currentScrollPosition(), adjGifWidth);
      // TODO: potentionally should be possibleMaxFrameCount + 1, because when we scroll, in some situation the use should be able to see part of first thumbnail and part of last thumbnail
      // need to update shader for that
      scrollRenderData.thumbnailFrames = getNextThumbnailFrames(scrollRenderData.currentFrame, offset, possibleMaxFrameCount).filter(v => v < gif.gif.images.length);
      scrollRenderData.normilizedStartPadding = scrollRenderData.currentFrame * adjGifWidth - currentScrollPosition();
      scrollRenderData.frameStartOffset = 0;

      if (scrollRenderData.thumbnailFrames.length > 0) {
        scrollRenderData.frameStartOffset = scrollRenderData.thumbnailFrames[0] - scrollRenderData.currentFrame;
      }
    }

    let scroll = (e: Event) => {
      recalculateScrollState((e.target as any).scrollLeft);
    }

    let froms: WriteSignal<number>[] = [];
    let tos: WriteSignal<number>[] = [];

    // TODO: remove
    effect(() => {
    // TODO: think how to dirty function to define
      froms = props.effects().map((effect: GifEffect) => signal(effect.getFrom(), { dirty(prev, nexy) { return true; } }));
      tos = props.effects().map((effect: GifEffect) => signal(effect.getTo(), { dirty(prev, nexy) { return true; } }));
    });

    const view = html`
      <div style="${() => `max-height: ${5 * height + 20}px; overflow-y: scroll;`}">
        <ul style="position: relative; padding: 0; height: 20px; list-style: none; overflow: hidden">
            ${toChild(() =>
              Array.from({ length: frameCount() })
                .map((_, i) => html`<li style="${() => "position: absolute; left: " + (frameWidth() * i + frameNumbersOffset()) + "px"}">${frameStart() + i + 1}</li>`))
            }
          </ul>
        <div style="${() => `display: flex; width: 100%; height: ${height}px;` + (props.isPlay() ? ' cursor: defualt': ' cursor: pointer')}">
            <canvas onClick="${toEvent(setCurrentFrame)}"></canvas>
        </div>
        <div style="${() => `position: relative; height: ${props.effects().length * height}px`}">
          ${toChild(() => 
            props.effects().map((effect, i) => {
              const styles = () => {
                return (
                  `position: absolute; display: flex; width: ${(tos[i]() - froms[i]()) * frameWidth()}px; height: ${height}px; justify-content: center; align-items: center; border: 1px solid black;` +
                  `left: ${((frameWidth() * froms[i]()) - currentScrollPosition())}px;` +
                  `margin-top: ${i * height}px;` +
                  `background-color: ${i % 2 === 0 ? 'black' : 'white'}; color: ${i % 2 === 0 ? 'white' : 'black'};`
                );
              }

              return html`<div style="${styles}">
              ${getEffectName(effect.getId())}
            </div>`;
          }))}
        </div>
        <div style="overflow: scroll; margin-top: -1px; position: sticky; bottom: 0;" onScroll="${toEvent(scroll)}">
            <div style="${() => `width: ${totalTimelineWidth}` + 'px; height: 1px'}"></div>
        </div>
      </div>
    `;

    setTimeout(async () => {
        const canvas = view.element.querySelector('canvas');
        const descriptor = await renderer.addGifToRender(gif, canvas, { algorithm: 'GL', thread: LZWThread.timeline });

        disposeGL = () => { renderer.dispose(); };
        getDescriptor = () => descriptor;
        const container = canvas.parentElement;

        width = container.getBoundingClientRect().width;
        maxFrameInTimeline = Math.ceil(width / adjGifWidth);
        offset = Math.max(1.0, Math.ceil((maxFrameInTimeline - possibleMaxFrameCount) / Math.max(1.0, possibleMaxFrameCount - 1)));

        recalculateScrollState(0);

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

        frameWidth.set(adjGifWidth);

        const _frameCount = frameCount;

        const _redraw = async () => {
          // rerender should be async and doens't prevent scrolling
          // therefore scrolling data may change during rerender
          // to avoid this, make a copy
          const currentScrollRenderData: ScrollRenderData = { ...scrollRenderData };
          const _currentScrollPosition = currentScrollPosition();

          // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
          // +       +       +          +     
          if (
            prevThubnailFrames.length === currentScrollRenderData.thumbnailFrames.length &&
            prevThubnailFrames[0] === currentScrollRenderData.thumbnailFrames[0] &&
            prevThubnailFrames.at(-1) === currentScrollRenderData.thumbnailFrames.at(-1)) {
              // DO NOTHING
          } else {
            let reuseFrames = [];
            for (let i = 0; i < Math.min(prevThubnailFrames.length, frameTextures.length); i++) {
              if (!currentScrollRenderData.thumbnailFrames.includes(prevThubnailFrames[i])) {
                const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator();
                allocator.dispose(frameTextures[i]);
              } else {
                reuseFrames.push({ frameNumber: prevThubnailFrames[i], frame: frameTextures[i] });
              }
            }

            for (let i = Math.min(prevThubnailFrames.length, frameTextures.length); i < frameTextures.length; i++) {
                const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator();
                allocator.dispose(frameTextures[i]);
            }
            frameTextures = [];

            for (let i = 0; i < currentScrollRenderData.thumbnailFrames.length; i++) {
              const newFrameNumber = currentScrollRenderData.thumbnailFrames[i];
              const reuseIndex = reuseFrames.findIndex(v => v.frameNumber === newFrameNumber);
              if (reuseIndex !== -1) {
                frameTextures.push(reuseFrames[reuseIndex].frame);
              } else {
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
                }
            }

          prevThubnailFrames = currentScrollRenderData.thumbnailFrames;
          }

          const drawingTarget = createGLScreenDrawingTarget(drawer.getGL());

          // TODO: Add this to drawer
          drawingTarget.bind();
          gl.clear(gl.COLOR_BUFFER_BIT);

          // --- draw timeline width

          gl.viewport(0, 0, width, height);

          const timelineWidthGpuProgram = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimelineWidth);

          timelineWidthGpuProgram.useProgram(gl);

          timelineWidthGpuProgram.setUniform3f(gl, 'color', 35 / 255, 35 / 255, 35 / 255);

          timelineWidthGpuProgram.setUniform1f(gl, 'totalWidth', width);
          timelineWidthGpuProgram.setUniform1f(gl, 'timelineFrameWidth', Math.min(width, allGifFramesWidth - _currentScrollPosition));
          timelineWidthGpuProgram.setUniform1f(gl, 'offset', 0);
          timelineWidthGpuProgram.setUniform1f(gl, 'startPadding', 0);
          timelineWidthGpuProgram.setUniform1f(gl, 'frameStartOffset', 0);

          drawer.drawTriangles(drawingTarget, 0, 6 * 1, 0);

          // ---

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
            // TODO: try to use TEXTURE_2D_ARRAY
            for (let i = 0; i < gpuProgramTextures.length; i++) {
              const texture = gpuProgramTextures[i];
              gpuProgram.setTextureUniform(gl, `targetTexture${i + 1}`, texture);
            }

            gpuProgram.setUniform1f(gl, 'totalWidth', width);
            gpuProgram.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
            gpuProgram.setUniform1f(gl, 'offset', offset);
            gpuProgram.setUniform1f(gl, 'startPadding', currentScrollRenderData.normilizedStartPadding);
            gpuProgram.setUniform1f(gl, 'frameStartOffset', currentScrollRenderData.frameStartOffset);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.viewport(0, 0, width, height);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            drawer.drawTriangles(drawingTarget, 0, 6 * currentScrollRenderData.thumbnailFrames.length, 0);
          });

          const maxFrameInTimelineWithoutOffset = Math.min(gif.gif.images.length - currentScrollRenderData.currentFrame, maxFrameInTimeline + 1);

          const currentSelectedFrame = props.currentFrameNumber() - currentScrollRenderData.currentFrame - 1;
          if (!(currentSelectedFrame < 0 || currentSelectedFrame > currentScrollRenderData.currentFrame + maxFrameInTimelineWithoutOffset)) {

            const gpuProgramCurrentFrame = getGLSystem(glSystemId).shaderManager.getProgram(ShaderPromgramId.GifTimelineCurrentFrame);

            gpuProgramCurrentFrame.useProgram(gl);

            gpuProgramCurrentFrame.setUniform1f(gl, 'totalWidth', width);
            gpuProgramCurrentFrame.setUniform1f(gl, 'timelineFrameWidth', adjGifWidth);
            gpuProgramCurrentFrame.setUniform1f(gl, 'startPadding', currentScrollRenderData.normilizedStartPadding);
            gpuProgramCurrentFrame.setUniform1f(gl, 'frameStartOffset', currentSelectedFrame);
            gpuProgramCurrentFrame.setUniform1f(gl, 'ratio', height / adjGifWidth);

            drawer.drawTriangles(drawingTarget, 0, 6 * 1, 0);
          }

          frameNumbersOffset.set(currentScrollRenderData.normilizedStartPadding);
          _frameCount.set(maxFrameInTimelineWithoutOffset);
          frameStart.set(currentScrollRenderData.currentFrame);
        }

        let rendrawResult: Promise<void> | null = null;
        redraw = () => {
          if (rendrawResult === null) {
            rendrawResult = _redraw().finally(() => { rendrawResult = null; });
            return rendrawResult;
          }

          return rendrawResult;
        }


        const loop = () => {
          requestAnimationFrameId = requestAnimationFrame(loop);
          redraw();
        }
        requestAnimationFrameId = requestAnimationFrame(loop);
    }, 0);

    return toComponent(view.element, () => { cancelAnimationFrame(requestAnimationFrameId); dispose(); view.dispose(); frameTextures.forEach(v => { const allocator = getGLSystem(glSystemId).resouceManager.getLastingAllocator(); allocator.dispose(v); }); getGLSystem(glSystemId).shaderManager.dispose(); disposeGLSystem(glSystemId); disposeGL(); });
  });
}