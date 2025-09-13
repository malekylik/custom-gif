import { effect, ReadSignal, root, signal, WriteSignal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, isComponent, toComponent } from "../utils";
import { EffectId, Effect as GifEffect } from '../../../rendering/api/effect';
import { isMadnessEffect, MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { BlackAndWhiteEffectId, isBlackAndWhiteEffect } from "../../../rendering/gl/effects/black-and-white-effect ";
import { BlackAndWhiteGifEffectEditor } from "../effects/BlackAndWhiteGifEffectEditor/BlackAndWhiteGifEffectEditor";

export type GifEffectDataProps = { effects: ReadSignal<GifEffect[]> };

const getEffectDesc = (effectId: EffectId, from: number, to: number, index: number): string => `${index + 1}. ${getEffectName(effectId) || 'Unknown Effect'} - from: ${from}; to: ${to}`;

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const effectEditorComponent = signal<Component | string | null>(null);
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
    };

    const listItem = (effect: GifEffect, i: number): Component => {
      const onClick = () => {
          const newEditorName = getEffectDesc(effect.getId(), froms[i](), tos[i](), i);

          if (currentEditorName === newEditorName) {
            return;
          }

          currentEditorName = newEditorName;

          const props: EffectEditorProps = {
            fromValue: () => froms[i](),
            setFromValue(n) {
              froms[i].set(n);
              effect.setFrom(n);
            },
            toValue: () => tos[i](),
            setToValue(n) {
              tos[i].set(n);
              effect.setTo(n);
            },
          };

          effectEditorComponent.set(getEffectEditorComponent(effect, props, closeEditor));
      };

      return html`<li onClick="${toEvent(onClick)}">
        ${getEffectDesc(effect.getId(), froms[i](), tos[i](), i)}
      </li>`;
    }


    const list = html`
      <ul>
        ${toChild(() => props.effects().map(listItem))}
      </ul>
    `;

    const view = html`
    <div>
        <div>
          ${toChild(() => props.effects().length === 0 ? 'No effects' : list)}
        </div>
        <div>
          ${toChild(() => effectEditorComponent())}
        </div>
      </div>
    `;

    return toComponent(view.element, () => { dispose(); view.dispose()});
  });
}

function getEffectName(effectId: number): string | null {
  if (effectId === MadnessEffectId) {
    return 'Madness Effect';
  }

  if (effectId === BlackAndWhiteEffectId) {
    return 'Black And White Effect';
  }

  return null;
}

type EffectEditorProps = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
};

function getEffectEditorComponent(effect: GifEffect, props: EffectEditorProps, closeEditor: () => void): Component | null {
  if (isMadnessEffect(effect)) {
    return html`<div>
      <div>madness effect editor</div>
      <button onClick="${toEvent(closeEditor)}">close</button>
    </div>`;
  }

  if (isBlackAndWhiteEffect(effect)) {
    return html`<div>
      <div>${toChild(() => BlackAndWhiteGifEffectEditor(props))}</div>
      <button onClick="${toEvent(closeEditor)}">close</button>
    </div>`;
  }

  return null;
}
