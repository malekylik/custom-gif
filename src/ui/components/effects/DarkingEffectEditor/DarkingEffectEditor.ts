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

    const red = signal(effect.getColor().r * 255, { dirty(prev, nexy) { return true; } });
    const green = signal(effect.getColor().g * 255, { dirty(prev, nexy) { return true; } });
    const blue = signal(effect.getColor().b * 255, { dirty(prev, nexy) { return true; } });

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

    const onInputRed = onInputNumber(
      (v: number) => { v = Math.min(Math.max(0, v), 255); red.set(v); effect.getColor().r = v / 255; rerender() },
      () => { red.set(red()); }
    );
    const onInputGreen = onInputNumber(
      (v: number) => { v = Math.min(Math.max(0, v), 255); green.set(v); effect.getColor().g = v / 255; rerender() },
      () => { green.set(green()); }
    );
    const onInputBlue = onInputNumber(
      (v: number) => { v = Math.min(Math.max(0, v), 255); blue.set(v); effect.getColor().b = v / 255; rerender() },
      () => { blue.set(blue()); }
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
              <div>
                <span>
                  Color
                </span>
                <div style="display: flex">
                  <span>
                    <span>Red:</span>
                    <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputRed(e) } })}" onFocusOut="${toEvent(onInputRed)}" class="from-input" value="${() => red()}"/>
                  </span>
                  <span>
                    <span>Green:</span>
                    <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputGreen(e) } })}" onFocusOut="${toEvent(onInputGreen)}" class="from-input" value="${() => green()}"/>
                  </span>
                  <span>
                    <span>Blue:</span>
                    <input onKeyDown="${toEvent((e: KeyboardEvent) => { if (e.key === 'Enter') { onInputBlue(e) } })}" onFocusOut="${toEvent(onInputBlue)}" class="from-input" value="${() => blue()}"/>
                  </span>
                  <span style="display: flex; align-items: end;">
                    <span style="${() => `display: inline-block; width: 50px; height: 30px; background-color: rgb(${red()}, ${green()}, ${blue()})`}"></span>
                  </span>
                </div>
              </div>
            </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
