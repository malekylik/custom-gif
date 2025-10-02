import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";
import { root } from "@maverick-js/signals";
import { GifMetaData, GifMetaDataProps } from "../GifMetaData/GifMetaData";
import { GifEffectData, GifEffectDataProps } from "../GifEffectData/GifEffectData";

type GifVisualizerProps = GifMetaDataProps & GifEffectDataProps & {
  onClose: () => void;
};

export type GifVisualizerComponent = Component & {
    getCanvas: () => HTMLCanvasElement;
};

export function GifVisualizer(props: GifVisualizerProps): GifVisualizerComponent {
  return root((dispose) => {
    const view = html`
      <div>
        <canvas></canvas>
        <button onClick="${toEvent(() => props.onClose())}">close</button>
        <span>${toChild(() => GifMetaData(props))}</span>
        <span>${toChild(() => GifEffectData(props))}</span>
      </div>
    `;

    const component = toComponent(view.element, () => { dispose(); view.dispose()}) as GifVisualizerComponent;
    component.getCanvas = () => view.element.querySelector('canvas');

    return component;
  });
}
