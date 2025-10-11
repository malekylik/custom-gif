import { Effect } from "../../api/effect";
import { RenderResult } from "../../api/render-result";
import { GLDrawer } from "./gl-drawer";
import { GLFrameDrawingTargetTemporaryAllocator } from "./gl-resource-manager";
import { GLShaderManager } from "./gl-shader-manager";

export interface GLEffect extends Effect {
    apply(drawer: GLDrawer, shaderManager: GLShaderManager, frame: RenderResult, allocator: GLFrameDrawingTargetTemporaryAllocator, currentFrame: number): RenderResult;
}
