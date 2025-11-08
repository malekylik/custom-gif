import { effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, toComponent } from "../utils";
import { EffectId, Effect as GifEffect } from '../../../rendering/api/effect';
import { EffectEditorProps, getEffectEditorComponent, getEffectName } from "./utils";

export type GifEffectDataProps = {
  effects: ReadSignal<GifEffect[]>;
  currentFrameNumber: ReadSignal<number>;
  rerender: () => void;
  isEffectSelectedToAdd: () => boolean;
  addSelectedEffect: () => void;
  removeSelectedEffect: (effectIndex: number) => void;
};

const getEffectDesc = (effectId: EffectId, from: number, to: number, index: number): string => `${index + 1}. ${getEffectName(effectId) || 'Unknown Effect'} - from: ${from + 1}; to: ${to + 1}`;

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const effectEditorComponent = signal<Component | string | null>(null);
    const selectedEffect = signal<number>(-1);
    let currentEditorName: string | null = null;

    let froms: WriteSignal<number>[] = [];
    let tos: WriteSignal<number>[] = [];

    effect(() => {
    // TODO: think how to dirty function to define
      froms = props.effects().map((effect: GifEffect) => signal(effect.getFrom(), { dirty(prev, nexy) { return true; } }));
      tos = props.effects().map((effect: GifEffect) => signal(effect.getTo(), { dirty(prev, nexy) { return true; } }));
    });

    const closeEditor = () => {
      currentEditorName = null;
      effectEditorComponent.set(null);
      selectedEffect.set(-1);
    };

    const removeEffect = () => {
      props.removeSelectedEffect(selectedEffect());
      closeEditor();
    };

    const listItem = (effect: GifEffect, i: number): Component => {
      const onClick = () => {
          const newEditorName = getEffectDesc(effect.getId(), froms[i](), tos[i](), i);

          if (currentEditorName === newEditorName) {
            return;
          }

          currentEditorName = newEditorName;

          const _props: EffectEditorProps = {
            fromValue: () => froms[i](),
            setFromValue(n) {
              froms[i].set(n);
              effect.setFrom(n);
              props.rerender();
            },
            toValue: () => tos[i](),
            setToValue(n) {
              tos[i].set(n);
              effect.setTo(n);
              props.rerender();
            },
            effect,
            currentFrameNumber: props.currentFrameNumber,
            rerender: () => props.rerender(),
          };

          effectEditorComponent.set(getEffectEditorComponent(_props, closeEditor));
          selectedEffect.set(i);
      };

      const getColor = () => effect.shouldBeApplied(props.currentFrameNumber() - 1) ? 'color: green' : '';
      const getBackgorundColor = (effectNumber: number) => selectedEffect() === effectNumber ? 'background-color: #a9dcf3' : '';

      return html`<li onClick="${toEvent(onClick)}" style="${() => getColor() + '; ' + getBackgorundColor(i) + '; cursor: pointer;'}">
        ${getEffectDesc(effect.getId(), froms[i](), tos[i](), i)}
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
