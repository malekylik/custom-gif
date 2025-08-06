import { html, toChild } from "../../parsing";
import { Component } from "../utils";
import { root } from "@maverick-js/signals";
import { GifMetaData, GifMetaDataProps } from "../GifMetaData/GifMetaData";

type GifVisualizerProps = GifMetaDataProps;

export type GifVisualizerComponent = Component & {
    getCanvas: () => HTMLCanvasElement;
};

export function GifVisualizer(props: GifVisualizerProps): GifVisualizerComponent {
  return root((dispose) => {
    const view = html`
      <div>
        <canvas></canvas>
        <span>${toChild(() => GifMetaData(props))}</span>
      </div>
    `;

    return ({ element: view.element, dispose: () => { dispose(); view.dispose(); }, getCanvas: () => view.element.querySelector('canvas'), });
  });
}
