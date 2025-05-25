import { RenderResult } from "../../api/render-result";
import { GLDrawer } from "../gl_api/gl-drawer";
import { GLFrameDrawingTargetTemporaryAllocator } from "../gl_api/gl-resource-manager";
import { BlackAndWhiteRenderPass } from "../render-pass/black-and-white-pass";
import { MandessRenderPass } from "../render-pass/madness-pass";
import { MixRenderResultsRenderPass } from "../render-pass/mix-render-result-pass";
import { GLEffect } from "../gl_api/gl-effect";
import { GLShaderManager } from "../gl_api/gl-shader-manager";
import { Effect, getEffectId } from "../../api/effect";

export interface GLMadnessEffect extends GLEffect {
  setAlpha(a: number): void;
  getAlpha(): number;
}

export const MadnessEffectId = getEffectId();

export function isMadnessEffect(effect: Effect): effect is GLMadnessEffect {
  return effect.getId() === MadnessEffectId;
}

export function createMadnessEffect(data: { screenWidth: number, screenHeight: number, from: number, to: number }): GLMadnessEffect {
  let alpha = 0.7;

  return {
    apply(drawer: GLDrawer, shaderManager: GLShaderManager, frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator) {
      let newResult = frame;

    const newResult1 = new BlackAndWhiteRenderPass(drawer, shaderManager)
      .execute({
        memory: {},
        globals: {},
        textures: { targetTexture: newResult.texture },
        drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
      });

    const newResult2 = new MandessRenderPass(drawer, shaderManager)
      .execute({
        memory: {},
        globals: {},
        textures: { targetTexture: newResult.texture },
        drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
      });

    newResult = new MixRenderResultsRenderPass(drawer, shaderManager)
      .execute({
        memory: {},
        globals: {alpha: alpha},
        textures: { background: newResult1.texture, foreground: newResult2.texture },
        drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
      });

      return newResult;
    },

    shouldBeApplied(frameNumber) {
      return frameNumber >= data.from && frameNumber <= data.to;
    },

    getId() {
      return MadnessEffectId;
    },

    getFrom() {
      return data.from;
    },

    getTo() {
      return data.to;
    },

    setFrom(from) {
      data.from = from;
    },

    setTo(to) {
      data.to = to;
    },

    getAlpha() {
      return alpha;
    },

    setAlpha(a) {
      alpha = a;
    },
  };
}
