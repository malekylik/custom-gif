import { html, toChild, toEvent } from "../../parsing";
import { Component, readFile, toComponent } from "../utils";
import { effect, root, signal, WriteSignal } from "@maverick-js/signals";
import { parseGif } from "../../../parsing/gif";
import { createGifEntity, GifEntity } from "../../../parsing/new_gif/gif_entity";
import { BasicRenderer } from "../../../rendering/gl/renderer";
import { GifVisualizer } from "../GifVisualizer/GifVisualizer";
import { AllEffectList } from "../AllEffectList/AllEffectList";
import { createMadnessEffect, MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { createDarkingEffect, DarkingEffectId } from "../../../rendering/gl/effects/darking-effect";
import { BlackAndWhiteEffectId, createBlackAndWhiteEffect } from "../../../rendering/gl/effects/black-and-white-effect";
import { Effect } from "../../../rendering/api/effect";
import { DarkingDirection } from "../../../../src/rendering/gl/render-pass/darking-pass";
import { getBlackRGBA } from "../../../../src/rendering/gl/effects/utils/rgba";
import { EdgeDetectionEffectId, createEdgeDetectionEffect } from "../../../rendering/gl/effects/edge-detection-effect";
import { TimelineData } from "../Timeline/Timeline";
import { LZWParallelFacade, LZWThread } from "../../../parallel_computation/main/lzw_facade";

export type AppComponent = Component;

export function App(props: {}): AppComponent {
    let gifs: GifEntity[] = [];
    const gifList = signal<Component[]>([]);

    const selectedEffect = signal<number | null>(null);

    const selectEffect = (effectId: number): void => {
        selectedEffect.set(effectId);
    };

    const getEffectFactory = (effectId: number | null): (data: { screenWidth: number; screenHeight: number; from: number; to: number; }) => Effect | null => {
        if (effectId === MadnessEffectId) return (data) => createMadnessEffect(data);
        else if (effectId === DarkingEffectId) return (data) => createDarkingEffect(data, { direction: DarkingDirection.in, color: getBlackRGBA() });
        else if (effectId === BlackAndWhiteEffectId) return (data) => createBlackAndWhiteEffect(data);
        else if (effectId === EdgeDetectionEffectId) return (data) => createEdgeDetectionEffect(data);

        return () => null;
    }

    const fileChange = async (e: Event): Promise<void> => {
        const fileDescriptor = ((e.target as any).files as FileList).item(0);
        const file = await readFile(fileDescriptor);

        const parsedGifData = parseGif(file);

        if (parsedGifData) {
            const gif = createGifEntity(parsedGifData);
            gifs.push(gif);

            root(async (dispose) => {
                let renderer = new BasicRenderer();
                await LZWParallelFacade.init(gif.gif);
                let close = () => {};
                let rerender = () => {};
                let render = (frame: number) => {};

                const isPlay = signal(false);
                const currentFrameNumber = signal(1);
                const totalFrameNumber = signal(gif.gif.images.length);
                const effects = signal<({ effect: Effect; to: WriteSignal<number>; from: WriteSignal<number>; })[]>([]);
                const renderNext = signal(() => Promise.resolve());

                const selectedEffectNumber = signal(-1);

                const removeSelectedEffect = (effectIndex: number) => {
                    renderer.removeEffectFromGif(descriptor, effects()[effectIndex].effect);
                };

                const gifVisualizer = GifVisualizer({
                    isPlay, renderNext, currentFrameNumber, totalFrameNumber, effects: effects, selectedEffect: selectedEffectNumber,
                    rerender: () => rerender(), onClose: () => close(), removeSelectedEffect: removeSelectedEffect,
                    isEffectSelectedToAdd: () => selectedEffect() !== null, addSelectedEffect: () => { const factor = getEffectFactory(selectedEffect()); renderer.addEffectToGif(descriptor, 0, 1, data => factor(data)); }
                });

                const timelineHeight = 80;

                const gifVisualizerWrapper = html`
                    <div>
                        <div>
                            ${toChild(() => gifVisualizer)}
                        </div>
                        <div>
                            ${toChild(() => TimelineData({ gif: gif, currentFrameNumber, isPlay, timelineHeight: timelineHeight, render: (frame: number) => render(frame), effects, selectedEffect: selectedEffectNumber }))}
                        </div>
                    </div>
                `

                close = () => {
                    renderer.dispose();
                    dispose();
                    gifList.set(gifList().filter(c => c !== gifVisualizerWrapper));
                    gifs = gifs.filter(_g => _g !== gif);
                    LZWParallelFacade.freeGif(gif.gif);
                };

                gifList.set(gifList().concat(gifVisualizerWrapper));

                const descriptor = await renderer.addGifToRender(gif, gifVisualizer.getCanvas(), { algorithm: 'GL', thread: LZWThread.main });

                rerender = () => {
                    if (!isPlay()) {
                        renderer.setFrame(descriptor, renderer.getCurrentFrame(descriptor));
                    }
                };

                render = (frame: number) => {
                    if (!isPlay()) {
                        renderer.setFrame(descriptor, frame);
                    }
                };

                renderer.onEffectAdded(descriptor, (data) => {
                    if (data.effects.length > effects().length) {
                        // TODO: think how to dirty function to define
                        const from = signal(data.effect.getFrom(), { dirty(prev, nexy) { return true; } });
                        const to = signal(data.effect.getTo(), { dirty(prev, nexy) { return true; } });

                        effects.set([...effects(), { effect: data.effect, from, to }]);
                    } else {
                        effects.set(effects().filter(e => e.effect !== data.effect));
                    }
                });

                renderer.onFrameRender(descriptor, (data) => {
                    currentFrameNumber.set(data.frameNumber + 1);
                });

                effect(() => {
                    if (isPlay()) {
                        if (!renderer.autoplayStart(descriptor)) {
                            console.warn('Error to stop');
                        }
                    } else {
                        renderer.autoplayEnd(descriptor);
                    }
                });
                isPlay.set(true);

                renderNext.set(() => () => renderer.setFrame(descriptor, (renderer.getCurrentFrame(descriptor) + 1) % gif.gif.images.length));
            });
        }

    }

  return root((dispose) => {
    const view = html`
      <div>
        <div>
            <input type="file" onChange="${toEvent(fileChange)}" />
        </div>
        <div style="display: flex">
            <div style="min-width: 80%; border: 1px solid black;">${toChild(() => gifList())}</div>
            <div style="width: 100%; height: 100%; position: sticky; top: 0">${toChild(() => AllEffectList({ selectedEffect, selectEffect: selectEffect }))}</div>
        </div>
      </div>
    `;

    const component = toComponent(view.element, () => { dispose(); view.dispose()}) as AppComponent;

    return component;
  });
}
