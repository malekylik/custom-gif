import { effect, Effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";

export type GifEffectDataProps = { effects: ReadSignal<Effect[]> };

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const list = html`
      <ul>
        ${toChild(() => props.effects().map((v, i) => html`<li>${i}</li>`))}
      </ul>
    `;

    const view = html`
      <div>
        ${toChild(() => props.effects().length === 0 ? 'No effects' : list)}
      </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
