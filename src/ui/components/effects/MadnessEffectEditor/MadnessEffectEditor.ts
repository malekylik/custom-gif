import { root, signal } from "@maverick-js/signals";
import { Component, toComponent } from "../../utils";
import { html, toEvent } from "../../../../ui/parsing";
import { GLMadnessEffect } from "../../../../rendering/gl/effects/madness-effect";
import { onInputNumber } from "../../../../ui/parsing/utils";

export type MadnessEffectEditorProps = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
  effect: GLMadnessEffect;
};

export function MadnessEffectEditor(props: MadnessEffectEditorProps): Component {
  return root((dispose) => {
    const {
      effect,
      fromValue, setFromValue,
      toValue, setToValue,
    } = props;

    const alpha = signal(effect.getAlpha(), { dirty(prev, nexy) { return true; } });

    const onInputFrom = onInputNumber(
      (v: number) => { v = Math.max(1, v); setFromValue(v); },
      () => { setFromValue(fromValue()); }
    );

    const onInputTo = onInputNumber(
      (v: number) => { v = Math.max(1, v); setToValue(v); },
      () => { setToValue(toValue()); }
    );

    const onAplhaTo = onInputNumber(
      (v: number) => { v = Math.max(0, v); alpha.set(v); effect.setAlpha(v) },
      () => { alpha.set(effect.getAlpha()); }
    );

    const view = html`
            <div>
              <div>
                <span>From</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputFrom(e) } })}" onFocusOut="${toEvent(onInputFrom)}" class="from-input" value="${() => fromValue()}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputTo(e) } })}" onFocusOut="${toEvent(onInputTo)}" class="to-input" value="${() => toValue()}"/>
              </div>
              <div>
                <span>Alpha</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onAplhaTo(e) } })}" onFocusOut="${toEvent(onAplhaTo)}" class="alpha-input" value="${() => alpha()}"/>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
