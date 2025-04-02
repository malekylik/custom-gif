import { ResourceManager } from '../../api/resource-manager';
import { RenderResult } from '../../api/render-result';
import { GLTexture, IGLTexture } from '../gl_api/texture';

export interface GPUMemory {

}

export type GPUGlobals = {
    [globalName: string]: number | [number, number, number, number];
}

export interface GPUInputTexture {
    bind(): void;
}

export type GPUInputTextures = {
    // TODO: replace with GPUInputTexture
    [textureName: string]: IGLTexture;
};

export interface RenderPassArgs<MemoryInput, GlobalsInput extends GPUGlobals, TexturesInput extends GPUInputTextures> {
    memory: MemoryInput;
    globals: GlobalsInput;
    textures: TexturesInput;
    resourceManager: ResourceManager
}

/**
 * Represents a GPU program which can be chain in a sequence
 */
export interface RenderPass<MemoryInput, GlobalsInput extends GPUGlobals, TexturesInput extends GPUInputTextures> {
    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GlobalsInput, TexturesInput>): RenderPass<MemoryInput, GlobalsInput, TexturesInput>;

    // TODO: should return RenderResult
    execute(args: RenderPassArgs<MemoryInput, GlobalsInput, TexturesInput>): RenderResult;
}
