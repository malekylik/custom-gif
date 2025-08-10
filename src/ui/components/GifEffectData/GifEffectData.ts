import { ReadSignal, root } from "@maverick-js/signals";
import { html, toChild } from "../../parsing";
import { Component, toComponent } from "../utils";
import { Effect as GifEffect } from '../../../rendering/api/effect';
import { MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { BlackAndWhiteEffectId } from "../../../rendering/gl/effects/black-and-white-effect ";

export type GifEffectDataProps = { effects: ReadSignal<GifEffect[]> };

const getEffectDesc = (effect: GifEffect, index: number): string => `${index + 1}. ${getEffectName(effect.getId()) || 'Unknown Effect'} - from: ${effect.getFrom()}; to: ${effect.getTo()}`;

export function GifEffectData(props: GifEffectDataProps): Component {
  return root((dispose) => {
    const list = html`
      <ul>
        ${toChild(() => props.effects().map((v, i) => html`<li>${getEffectDesc(v, i)}</li>`))}
      </ul>
    `;

    const view = html`
      <div>
        ${toChild(() => props.effects().length === 0 ? 'No effects' : list)}
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
