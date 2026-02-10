import { root } from "@maverick-js/signals";
import { Component, toComponent } from "../../utils";
import { html, toEvent } from "../../../../ui/parsing";
import { onInputNumber } from "../../../parsing/utils";

export type EdgeDetectionGifEffectEditorProps = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
};

export function EdgeDetectionGifEffectEditor(props: EdgeDetectionGifEffectEditorProps): Component {
  return root((dispose) => {
    const {
      fromValue, setFromValue,
      toValue, setToValue,
    } = props;

    const onInputFrom = onInputNumber(
      (v: number) => { v = Math.max(0, v - 1); setFromValue(v); },
      () => { setFromValue(fromValue()); }
    );

    const onInputTo = onInputNumber(
      (v: number) => { v = Math.max(0, v - 1); setToValue(v); },
      () => { setToValue(toValue()); }
    );

    const view = html`
            <div>
              <span>Editing Edge Detection Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputFrom(e) } })}" onFocusOut="${toEvent(onInputFrom)}" class="from-input" value="${() => fromValue() + 1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputTo(e) } })}" onFocusOut="${toEvent(onInputTo)}" class="to-input" value="${() => toValue() + 1}"/>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
