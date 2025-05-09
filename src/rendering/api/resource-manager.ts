import { BufferDrawingTarget } from './drawing-target';

export interface FrameDrawingTargetTemporaryAllocator {
    allocate(width: number, height: number): BufferDrawingTarget;
}

export interface ResourceManager {
    startFrame(): void;
    endFrame(): void;

    allocateFrameDrawingTarget(callback: (allocator: FrameDrawingTargetTemporaryAllocator) => void): void;
}