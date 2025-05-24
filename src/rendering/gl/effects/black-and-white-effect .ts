import { RenderResult } from "../../api/render-result";
import { GLDrawer } from "../gl_api/gl-drawer";
import { GLFrameDrawingTargetTemporaryAllocator } from "../gl_api/gl-resource-manager";
import { BlackAndWhiteRenderPass } from "../render-pass/black-and-white-pass";
import { GLEffect } from "../gl_api/gl-effect";
import { GLShaderManager } from "../gl_api/gl-shader-manager";
import { getEffectId } from "../../api/effect";

export interface GLBlackAndWhiteEffect extends GLEffect {
}

export const BlackAndWhiteEffectId = getEffectId();

export function createBlackAndWhiteEffect(data: { screenWidth: number, screenHeight: number, from: number, to: number }): GLBlackAndWhiteEffect {
  return {
    apply(drawer: GLDrawer, shaderManager: GLShaderManager, frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator) {
      let newResult = frame;

      newResult = new BlackAndWhiteRenderPass(drawer, shaderManager)
        .execute({
          memory: {},
          globals: {},
          textures: { targetTexture: newResult.texture },
          drawingTarget: allocator.allocate(data.screenWidth, data.screenHeight),
        });

      return newResult;
    },

    shouldBeApplied(frameNumber) {
      return frameNumber >= data.from && frameNumber <= data.to;
    },

    getId() {
      return BlackAndWhiteEffectId;
    },

    getFrom() {
      return data.from;
    },

    getTo() {
      return data.to;
    },
  };
}
