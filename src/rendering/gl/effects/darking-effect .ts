import { RenderResult } from "../../api/render-result";
import { GLDrawer } from "../gl_api/gl-drawer";
import { GLFrameDrawingTargetTemporaryAllocator } from "../gl_api/gl-resource-manager";
import { GLEffect } from "../gl_api/gl-effect";
import { GLShaderManager } from "../gl_api/gl-shader-manager";
import { Effect, getEffectId } from "../../api/effect";
import { calculateAnimationProgress } from "./utils/uitls";
import { DarkingDirection, DarkingRenderPass } from "../render-pass/darking-pass";

export interface GLDarkingEffect extends GLEffect {
}

export const DarkingEffectId = getEffectId();

export function isDarkingEffect(effect: Effect): effect is GLDarkingEffect {
  return effect.getId() === DarkingEffectId;
}

export function createDarkingEffect(data: { screenWidth: number, screenHeight: number, from: number, to: number }, direction: DarkingDirection): GLDarkingEffect {
  return {
    apply(drawer: GLDrawer, shaderManager: GLShaderManager, frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator, currentFrame: number) {
      const animationProgress = calculateAnimationProgress(data.from, data.to, currentFrame);

      let newResult = frame;

      newResult = new DarkingRenderPass(drawer, shaderManager)
        .execute({
          memory: {},
          // TODO: add assert for direction
          globals: { animationProgress: animationProgress, direction: direction },
          textures: { targetTexture: newResult.texture },
          drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
        });

      return newResult;
    },

    shouldBeApplied(frameNumber) {
      return frameNumber >= data.from && frameNumber <= data.to;
    },

    getId() {
      return DarkingEffectId;
    },

    getFrom() {
      return data.from;
    },

    setFrom(from) {
      data.from = from;
    },

    getTo() {
      return data.to;
    },

    setTo(to) {
      data.to = to;
    },
  };
}
