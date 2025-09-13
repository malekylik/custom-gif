import { root } from "@maverick-js/signals";
import { Component, toComponent } from "../../utils";
import { html, toEvent } from "../../../../ui/parsing";

export type BlackAndWhiteGifEffectEditorProps = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
};

export function BlackAndWhiteGifEffectEditor(props: BlackAndWhiteGifEffectEditorProps): Component {
  return root((dispose) => {
    const {
      fromValue, setFromValue,
      toValue, setToValue,
    } = props;

    function onInputNumber(action: (n: number) => void, error: (s: string) => void) {
      return (event: InputEvent) => {
          const valueS = (event.target as any).value;
          if (!isNaN(Number(valueS))) {
            const value = Number(valueS);
            action(value)
          } else {
            error(valueS)
          }
      }
    }

    const onInputFrom = onInputNumber(
      (v: number) => { v = Math.max(1, v); setFromValue(v); },
      () => { setFromValue(fromValue()); }
    );

    const onInputTo = onInputNumber(
      (v: number) => { v = Math.max(1, v); setToValue(v); },
      () => { setToValue(toValue()); }
    );

    const view = html`
            <div>
              <div>
                <span>From</span>
                <input onInput="${toEvent(onInputFrom)}" class="from-input" value="${() => fromValue()}"/>
              </div>
              <div>
                <span>To</span>
                <input onInput="${toEvent(onInputTo)}" class="to-input" value="${() => toValue()}"/>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
