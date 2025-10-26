import { html, toChild, toEvent } from "../../parsing";
import { Component, readFile, toComponent } from "../utils";
import { effect, root, signal } from "@maverick-js/signals";
import { parseGif } from "../../../parsing/gif";
import { createGifEntity, GifEntity } from "../../../parsing/new_gif/gif_entity";
import { createLZWFuncFromWasm } from "../../../parsing/lzw/factory/uncompress_factory_wasm";
import { BasicRenderer } from "../../../rendering/gl/renderer";
import { GifVisualizer } from "../GifVisualizer/GifVisualizer";

export type AppComponent = Component;

export function App(props: {}): AppComponent {
    let gifs: GifEntity[] = [];
    const gifList = signal<Component[]>([]);

    const fileChange = async (e: Event): Promise<void> => {
        const fileDescriptor = ((e.target as any).files as FileList).item(0);
        const file = await readFile(fileDescriptor);

        const parsedGifData = parseGif(file);

        if (parsedGifData) {
            const gif = createGifEntity(parsedGifData);
            gifs.push(gif);
            const lzw_uncompress = await createLZWFuncFromWasm(gif.gif);

            const renderer = new BasicRenderer();

            root(async (dispose) => {
                let close = () => {};
                let rerender = () => {};

                const isPlay = signal(false);
                const currentFrameNumber = signal(1);
                const totalFrameNumber = signal(gif.gif.images.length);
                const effects = signal([]);
                const renderNext = signal(() => Promise.resolve());
                const gifVisualizer = GifVisualizer({ isPlay, renderNext, currentFrameNumber, totalFrameNumber, effects: effects, rerender: () => rerender(), onClose: () => close() });

                close = () => {
                    renderer.dispose();
                    dispose();
                    gifList.set(gifList().filter(c => c !== gifVisualizer));
                    gifs = gifs.filter(_g => _g !== gif);
                };

                gifList.set(gifList().concat(gifVisualizer));

                const descriptor = await renderer.addGifToRender(gif, gifVisualizer.getCanvas(), { uncompress: lzw_uncompress, algorithm: 'GL' });

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

                // renderer.addEffectToGif(descriptor, 2, 30, data => createMadnessEffect(data));
                // renderer.addEffectToGif(descriptor, 25, 45, data => createBlackAndWhiteEffect(data));
                // renderer.addEffectToGif(descriptor, 1, 4, data => createDarkingEffect(data, { direction: DarkingDirection.in, color: WhiteRGBA }));

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
        <div>${toChild(() => gifList())}</div>
      </div>
    `;

    const component = toComponent(view.element, () => { dispose(); view.dispose()}) as AppComponent;
    // component.getCanvas = () => view.element.querySelector('canvas');

    return component;
  });
}
