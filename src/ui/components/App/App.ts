import { html, toChild, toEvent } from "../../parsing";
import { Component, readFile, toComponent } from "../utils";
import { effect, root, signal } from "@maverick-js/signals";
import { parseGif } from "../../../parsing/gif";
import { createGifEntity, GifEntity } from "../../../parsing/new_gif/gif_entity";
import { createLZWFuncFromWasm } from "../../../parsing/lzw/factory/uncompress_factory_wasm";
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

export type AppComponent = Component;

export function App(props: {}): AppComponent {
    let gifs: GifEntity[] = [];
    const gifList = signal<Component[]>([]);

    const selectedEffect = signal(null);

    const selectEffect = (effectId: number): void => {
        selectedEffect.set(effectId);
    };

    const getEffectFactory = (effectId: number): (data: { screenWidth: number; screenHeight: number; from: number; to: number; }) => Effect | null => {
        if (effectId === MadnessEffectId) return (data) => createMadnessEffect(data);
        else if (effectId === DarkingEffectId) return (data) => createDarkingEffect(data, { direction: DarkingDirection.in, color: getBlackRGBA() });
        else if (effectId === BlackAndWhiteEffectId) return (data) => createBlackAndWhiteEffect(data);
        else if (effectId === EdgeDetectionEffectId) return (data) => createEdgeDetectionEffect(data);

        return null;
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
                let renderer1 = new BasicRenderer();
                const lzw_uncompress = await createLZWFuncFromWasm(gif.gif);
                const lzw_uncompress_timeline = lzw_uncompress;
                let close = () => {};
                let rerender = () => {};

                const isPlay = signal(false);
                const currentFrameNumber = signal(1);
                const totalFrameNumber = signal(gif.gif.images.length);
                const effects = signal([]);
                const renderNext = signal(() => Promise.resolve());

                const removeSelectedEffect = (effectIndex: number) => {
                    renderer.removeEffectFromGif(descriptor, effects()[effectIndex]);
                };

                const gifVisualizer1 = GifVisualizer({
                    isPlay, renderNext, currentFrameNumber, totalFrameNumber, effects: effects,
                    rerender: () => rerender(), onClose: () => close(), removeSelectedEffect: removeSelectedEffect,
                    isEffectSelectedToAdd: () => selectedEffect() !== null, addSelectedEffect: () => { const factor = getEffectFactory(selectedEffect()); renderer.addEffectToGif(descriptor, 0, 1, data => factor(data)); }
                });

                const gifVisualizer2 = GifVisualizer({
                    isPlay: signal(false), renderNext: signal(() => Promise.resolve()), currentFrameNumber: signal(0), totalFrameNumber, effects: signal([]),
                    rerender: () => rerender(), onClose: () => close(), removeSelectedEffect: () => {},
                    isEffectSelectedToAdd: () => selectedEffect() !== null, addSelectedEffect: () => { }
                });

                const descriptor1 = await renderer1.addGifToRender(gif, gifVisualizer2.getCanvas(), { uncompress: lzw_uncompress_timeline, algorithm: 'GL' });

                const gifVisualizer = html`
                    <div>
                        <div>
                            ${toChild(() => gifVisualizer1)}
                        </div>
                        <div style="display: none">
                            ${toChild(() => gifVisualizer2)}
                        </div>
                        <div>
                            ${toChild(() => TimelineData({ renderer: renderer1, descriptor: descriptor1 }))}
                        </div>
                    </div>
                `

                close = () => {
                    renderer.dispose();
                    renderer1.dispose();
                    dispose();
                    gifList.set(gifList().filter(c => c !== gifVisualizer));
                    gifs = gifs.filter(_g => _g !== gif);
                };

                gifList.set(gifList().concat(gifVisualizer));

                const descriptor = await renderer.addGifToRender(gif, gifVisualizer1.getCanvas(), { uncompress: lzw_uncompress, algorithm: 'GL' });

                rerender = () => {
                    if (!isPlay()) {
                        renderer.setFrame(descriptor, renderer.getCurrentFrame(descriptor));
                    }
                };

                renderer.onEffectAdded(descriptor, (data) => {
                    effects.set([...data.effects]);
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
