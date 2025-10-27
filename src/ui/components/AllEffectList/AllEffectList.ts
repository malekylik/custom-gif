import { ReadSignal, root, signal } from "@maverick-js/signals";
import { DarkingEffectId } from "../../../rendering/gl/effects/darking-effect";
import { MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { BlackAndWhiteEffectId } from "../../../rendering/gl/effects/black-and-white-effect";
import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";
import { getEffectName } from "../GifEffectData/utils";

type AllEffectListProps = {
  selectedEffect: ReadSignal<number | null>;
  selectEffect: (effectId: number) => void;
};

export function AllEffectList(props: AllEffectListProps): Component {
  const {
    selectedEffect,
    selectEffect,
  } = props;

  const effects = signal<number[]>([
    BlackAndWhiteEffectId,
    MadnessEffectId,
    DarkingEffectId,
  ]);

  return root((dispose) => {
    const view = html`
      <div>
        <span>Select Effect:</span>
        <ul style="padding: 0; padding-left: 15px;">
            ${toChild(() => effects().map(v =>
              html`<li
                  style="${() => ((selectedEffect() === v) ? 'background-color: green; ' : '') + "cursor: pointer"}"
                  onClick="${toEvent(() => selectEffect(v))}"
                >
                  ${getEffectName(v)}
              </li>`
              ))}
        </ul>
      </div>
    `;

    const component = toComponent(view.element, () => { dispose(); view.dispose()});

    return component;
  });
}
