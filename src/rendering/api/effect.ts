import { Drawer } from "./drawer";
import { RenderResult } from "./render-result";
import { FrameDrawingTargetTemporaryAllocator } from "./resource-manager";
import { ShaderManager } from "./shader-manager";

export interface Effect {
   apply(drawer: Drawer, shaderManager: ShaderManager, frame: RenderResult, allocator: FrameDrawingTargetTemporaryAllocator): RenderResult;
}
