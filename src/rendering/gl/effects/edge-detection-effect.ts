import { RenderResult } from "../../api/render-result";
import { GLDrawer } from "../gl_api/gl-drawer";
import { GLFrameDrawingTargetTemporaryAllocator } from "../gl_api/gl-resource-manager";
import { ConvolutionMatrixRenderPass } from "../render-pass/convolution-matrix-pass";
import { GLEffect } from "../gl_api/gl-effect";
import { GLShaderManager } from "../gl_api/gl-shader-manager";
import { Effect, getEffectId } from "../../api/effect";
import { getEdgeDetectionFilter } from "./utils/mat3";

export interface GLEdgeDetectionEffect extends GLEffect {
}

export const EdgeDetectionEffectId = getEffectId();

export function isEdgeDetectionEffect(effect: Effect): effect is GLEdgeDetectionEffect {
  return effect.getId() === EdgeDetectionEffectId;
}

export function createEdgeDetectionEffect(data: { screenWidth: number, screenHeight: number, from: number, to: number }): GLEdgeDetectionEffect {
  return {
    apply(drawer: GLDrawer, shaderManager: GLShaderManager, frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator) {
      let newResult = frame;

      newResult = new ConvolutionMatrixRenderPass(drawer, shaderManager)
        .execute({
          memory: {},
          globals: { kernel: getEdgeDetectionFilter() },
          textures: { targetTexture: newResult.texture },
          drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
        });

      return newResult;
    },

    shouldBeApplied(frameNumber) {
      return frameNumber >= data.from && frameNumber <= data.to;
    },

    getId() {
      return EdgeDetectionEffectId;
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
