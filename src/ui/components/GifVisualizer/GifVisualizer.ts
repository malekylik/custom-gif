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
      <div style="border-bottom: 1px solid black; padding-top: 5px;">
        <div style="position: relative; display: flex; justify-content: center; margin-bottom: 5px;">
            <canvas></canvas>
          <div style="position: absolute; top: 0; right: 5px;">
            <button onClick="${toEvent(() => props.onClose())}">close</button>
          </div>
        </div>
        <div>
          <div style="border-bottom: 1px solid black">${toChild(() => GifMetaData(props))}</div>
          <div>${toChild(() => GifEffectData(props))}</div>
        </div>
      </div>
    `;

    const component = toComponent(view.element, () => { dispose(); view.dispose()}) as GifVisualizerComponent;
    component.getCanvas = () => view.element.querySelector('canvas');

    return component;
  });
}
