import { ReadSignal, root, signal } from "@maverick-js/signals";
import { html, toChild, toEvent } from "../../parsing";
import { Component, isComponent, toComponent } from "../utils";
import { Effect as GifEffect } from '../../../rendering/api/effect';
import { isMadnessEffect, MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { BlackAndWhiteEffectId, isBlackAndWhiteEffect } from "../../../rendering/gl/effects/black-and-white-effect ";
import { BlackAndWhiteGifEffectEditor } from "../effects/BlackAndWhiteGifEffectEditor/BlackAndWhiteGifEffectEditor";

export type GifEffectDataProps = { effects: ReadSignal<GifEffect[]> };

const getEffectDesc = (effect: GifEffect, index: number): string => `${index + 1}. ${getEffectName(effect.getId()) || 'Unknown Effect'} - from: ${effect.getFrom()}; to: ${effect.getTo()}`;

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const effectEditorComponent = signal<Component | string | null>(null);
    let currentEditorName: string | null = null;

    const closeEditor = () => {
      const currentComponent = effectEditorComponent();

      if (isComponent(currentComponent)) {
        currentComponent.dispose();
      }

      currentEditorName = null;
      effectEditorComponent.set(null);
    };

    const list = html`
      <ul>
        ${toChild(() => props.effects().map((v, i) => html`<li onClick="${toEvent(() => {
          const newEditorName = getEffectDesc(v, i);

          if (currentEditorName === newEditorName) {
            return;
          }

          currentEditorName = newEditorName;

          effectEditorComponent.set(getEffectEditorComponent(v, closeEditor));
        })}">${getEffectDesc(v, i)}</li>`))}
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

function getEffectEditorComponent(effect: GifEffect, closeEditor: () => void): Component | null {
  if (isMadnessEffect(effect)) {
    return html`<div>
      <div>madness effect editor</div>
      <button onClick="${toEvent(closeEditor)}">close</button>
    </div>`;
    // container.append(createMadnessEditorElement(effect, li, index));
  }

  if (isBlackAndWhiteEffect(effect)) {
    return html`<div>
      <div>${toChild(() => BlackAndWhiteGifEffectEditor({ effect }))}</div>
      <button onClick="${toEvent(closeEditor)}">close</button>
    </div>`;
    // container.append(createBlackAndWhiteEditorElement(effect, li, index));
  }

  return null;
}
