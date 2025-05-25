import { Drawer } from "./drawer";
import { RenderResult } from "./render-result";
import { FrameDrawingTargetTemporaryAllocator } from "./resource-manager";
import { ShaderManager } from "./shader-manager";

export type EffectId = number & { readonly __tag: unique symbol; };

let effectId = 0 as EffectId;

export function getEffectId(): EffectId {
   return effectId++ as EffectId;
}

export interface Effect {
   apply(drawer: Drawer, shaderManager: ShaderManager, frame: RenderResult, allocator: FrameDrawingTargetTemporaryAllocator): RenderResult;

   // TODO: should be part of effect interface ?
   shouldBeApplied(frameNumber: number): boolean;

   getFrom(): number;
   setFrom(from: number): void;
   getTo(): number;
   setTo(to: number): void;

   getId(): EffectId;
}
