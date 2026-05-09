import { effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";
import { EffectId, Effect as GifEffect } from '../../../rendering/api/effect';
import { EffectEditorProps, getEffectEditorComponent, getEffectName } from "./utils";

export type GifEffectDataProps = {
  effects: ReadSignal<({ effect: GifEffect; to: WriteSignal<number>; from: WriteSignal<number>; })[]>;
  currentFrameNumber: ReadSignal<number>;
  rerender: () => void;
  isEffectSelectedToAdd: () => boolean;
  addSelectedEffect: () => void;
  removeSelectedEffect: (effectIndex: number) => void;
  selectedEffect: WriteSignal<number>;
};

const getEffectDesc = (effectId: EffectId, from: number, to: number, index: number): string => `${index + 1}. ${getEffectName(effectId) || 'Unknown Effect'} - from: ${from + 1}; to: ${to + 1}`;

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const effectEditorComponent = signal<Component | string | null>(null);
    const selectedEffect = props.selectedEffect;
    let currentEditorName: string | null = null;

    const closeEditor = () => {
      currentEditorName = null;
      effectEditorComponent.set(null);
      selectedEffect.set(-1);
    };

    const removeEffect = () => {
      props.removeSelectedEffect(selectedEffect());
      closeEditor();
    };

    const openEffect = (_effect: { effect: GifEffect; to: WriteSignal<number>; from: WriteSignal<number>; }, i: number): boolean => {
      const newEditorName = getEffectDesc(_effect.effect.getId(), _effect.from(), _effect.to(), i);

      if (currentEditorName === newEditorName) {
        return false;
      }

      currentEditorName = newEditorName;

      const _props: EffectEditorProps = {
        fromValue: () => _effect.from(),
        setFromValue(n) {
          _effect.from.set(n);
          _effect.effect.setFrom(n);
          props.rerender();
        },
        toValue: () => _effect.to(),
        setToValue(n) {
          _effect.to.set(n);
          _effect.effect.setTo(n);
          props.rerender();
        },
        effect: _effect.effect,
        currentFrameNumber: props.currentFrameNumber,
        rerender: () => props.rerender(),
      };

      effectEditorComponent.set(getEffectEditorComponent(_props, closeEditor));

      return true;
    }

    effect(() => {
      const effectIndex = selectedEffect();
      const _effect = props.effects()[effectIndex];

      if (_effect === undefined) {
        return;
      }

      openEffect(_effect, effectIndex);
    });

    const listItem = (effect: { effect: GifEffect; to: WriteSignal<number>; from: WriteSignal<number>; }, i: number): Component => {
      const onClick = () => {
        if (openEffect(effect, i)) {
          selectedEffect.set(i);
        }
      };

      const getColor = () => effect.effect.shouldBeApplied(props.currentFrameNumber() - 1) ? 'color: green' : '';
      const getBackgorundColor = (effectNumber: number) => selectedEffect() === effectNumber ? 'background-color: #a9dcf3' : '';

      return html`<li onClick="${toEvent(onClick)}" style="${() => getColor() + '; ' + getBackgorundColor(i) + '; cursor: pointer;'}">
        ${getEffectDesc(effect.effect.getId(), effect.from(), effect.to(), i)}
      </li>`;
    }


    const list = () => html`
      <ul>
        ${toChild(() =>
          props.effects().map(listItem))}
      </ul>
    `;

    const view = html`
    <div>
        <div style="margin-bottom: 5px">
          ${toChild(() => props.effects().length === 0 ? 'No effects' : list())}
        </div>
        <button
          style="maring-right: 5px"
          disabled="${() => !props.isEffectSelectedToAdd()}"
          onClick="${() => props.addSelectedEffect()}">
            Add Effect
        </button>
        <button disabled="${() => selectedEffect() === -1}" onClick="${() => removeEffect()}">Remove Effect</button>
        <div style="border-top: 1px solid black; margin-top: 5px">
          ${toChild(() => effectEditorComponent())}
        </div>
      </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}
