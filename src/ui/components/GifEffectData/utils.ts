import { html, toChild, toEvent } from "../../parsing";
import { GLMadnessEffect, isMadnessEffect, MadnessEffectId } from "../../../rendering/gl/effects/madness-effect";
import { BlackAndWhiteEffectId, isBlackAndWhiteEffect } from "../../../rendering/gl/effects/black-and-white-effect";
import { DarkingEffectId, isDarkingEffect, GLDarkingEffect } from "../../../rendering/gl/effects/darking-effect";
import { BlackAndWhiteGifEffectEditor } from "../effects/BlackAndWhiteGifEffectEditor/BlackAndWhiteGifEffectEditor";
import { MadnessEffectEditor } from "../effects/MadnessEffectEditor/MadnessEffectEditor";
import { GLEffect } from "src/rendering/gl/gl_api/gl-effect";
import { DarkingEffectEditor } from "../effects/DarkingEffectEditor/DarkingEffectEditor";
import { ReadSignal } from "@maverick-js/signals";
import { Component } from "../utils";

export function getEffectName(effectId: number): string | null {
  if (effectId === MadnessEffectId) {
    return 'Madness Effect';
  }

  if (effectId === BlackAndWhiteEffectId) {
    return 'Black And White Effect';
  }

  if (effectId === DarkingEffectId) {
    return 'In And Out Effect';
  }

  return null;
}

export type EffectEditorProps<T = GLEffect> = {
  fromValue: () => number;
  setFromValue: (n: number) => void;
  toValue: () => number;
  setToValue: (n: number) => void;
  rerender: () => void;
  effect: T;
  currentFrameNumber: ReadSignal<number>;
};

export function getEffectEditorComponent(props: EffectEditorProps, closeEditor: () => void): Component | null {
    if (isMadnessEffect(props.effect)) {
        return html`<div>
        <div>${toChild(() => MadnessEffectEditor(props as EffectEditorProps<GLMadnessEffect>))}</div>
        <button onClick="${toEvent(closeEditor)}">close</button>
        </div>`;
    }

    if (isBlackAndWhiteEffect(props.effect)) {
        return html`<div>
        <div>${toChild(() => BlackAndWhiteGifEffectEditor(props))}</div>
        <button onClick="${toEvent(closeEditor)}">close</button>
        </div>`;
    }

    if (isDarkingEffect(props.effect)) {
        return html`<div>
        <div>${toChild(() => DarkingEffectEditor(props as EffectEditorProps<GLDarkingEffect>))}</div>
        <button onClick="${toEvent(closeEditor)}">close</button>
        </div>`;
    }

  return html`<div>
      <span>Editing is not supported for this effect</span>
      <button onClick="${toEvent(closeEditor)}">close</button>
  </div>`;
}
