import { effect, root, signal } from "@maverick-js/signals";
import { Component, toComponent } from "../../utils";
import { html, toEvent } from "../../../../ui/parsing";
import { onInputNumber, onSelectChange } from "../../../parsing/utils";
import { GLDarkingEffect } from "../../../../rendering/gl/effects/darking-effect";
import { DarkingDirection } from "../../../../rendering/gl/render-pass/darking-pass";

export type DarkingEffectEditorProps = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
  rerender: () => void;
  effect: GLDarkingEffect;
};

export function DarkingEffectEditor(props: DarkingEffectEditorProps): Component {
  return root((dispose) => {
    const {
      fromValue, setFromValue,
      toValue, setToValue,
      rerender,
      effect,
    } = props;

    const direction = signal(effect.getDirection(), { dirty(prev, nexy) { return true; } });

    const onInputFrom = onInputNumber(
      (v: number) => { v = Math.max(0, v - 1); setFromValue(v); },
      () => { setFromValue(fromValue()); }
    );

    const onInputTo = onInputNumber(
      (v: number) => { v = Math.max(0, v - 1); setToValue(v); },
      () => { setToValue(toValue()); }
    );

    const inChangeDirection = onSelectChange(
      (newValue) => { direction.set(newValue === 'in' ? DarkingDirection.in : DarkingDirection.out); effect.setDirection(direction()); rerender() }
    );

    const view = html`
            <div>
              <span>Editing In and Out Effect</span>
              <div>
                <span>From</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputFrom(e) } })}" onFocusOut="${toEvent(onInputFrom)}" class="from-input" value="${() => fromValue() + 1}"/>
              </div>
              <div>
                <span>To</span>
                <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputTo(e) } })}" onFocusOut="${toEvent(onInputTo)}" class="to-input" value="${() => toValue() + 1}"/>
              </div>
              <div>
                <span>Direction</span>
                <select name="Direction" value="${() => direction() === DarkingDirection.in ? 'in' : 'out'}"
                  onChange="${toEvent(inChangeDirection)}"
                >
                  <option value="in">In</option>
                  <option value="out">Out</option>
                </select>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
