import { ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { Component, toComponent } from "../../utils";
import { html, toEvent } from "../../../../ui/parsing";
import { Effect } from "../../../../rendering/api/effect";

export type BlackAndWhiteGifEffectEditorProps = {
    effect: Effect
};

export function BlackAndWhiteGifEffectEditor(props: BlackAndWhiteGifEffectEditorProps): Component {
  return root((dispose) => {
    const { effect } = props;

    // const isSetting = signal(false);

    // const nextHandler = () => {
    //   if (!isSetting()) {
    //       isSetting.set(true);
    //       props.renderNext()().then(() => isSetting.set(false));
    //   }
    // };

    const view = html`
            <div>
              <div>
                <span>From</span>
                <input class="from-input" value="${effect.getFrom()}"/>
              </div>
              <div>
                <span>To</span>
                <input class="to-input" value="${effect.getTo()}"/>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
