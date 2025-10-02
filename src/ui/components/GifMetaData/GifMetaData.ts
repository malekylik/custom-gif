import { ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";

export type GifMetaDataProps = {
    totalFrameNumber: ReadSignal<number>;
    currentFrameNumber: ReadSignal<number>;
    isPlay: WriteSignal<boolean>;
    renderNext: ReadSignal<() => Promise<void>>;
};

export function GifMetaData(props: GifMetaDataProps): Component {
  return root((dispose) => {
    const isSetting = signal(false);

    const nextHandler = () => {
      if (!isSetting()) {
          isSetting.set(true);
          props.renderNext()().then(() => isSetting.set(false));
      }
    };

    // TODO: fix disabled property, it wants me to just write "disabled";
    const view = html`
      <div>
        <div>${() => `${props.currentFrameNumber()} / ${props.totalFrameNumber()}`}</div>
        <div>
          <button onClick="${() => props.isPlay.set((v) => !v)}">${() => props.isPlay() ? 'Stop' : 'Play'}</button>
          <button disabled="${() => props.isPlay()}" onClick="${toEvent(nextHandler)}">Next</button>
        </div>
      </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}