import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';

export type MixRenderResultsPassGlobals = {
    alpha: number;
};

export type MixRenderResultsPassTextures = {
    foreground: IGLTexture;
    background: IGLTexture;
}

export class MixRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, MixRenderResultsPassGlobals, MixRenderResultsPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.MixDrawer);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, MixRenderResultsPassTextures>): RenderPass<MemoryInput, {}, MixRenderResultsPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, MixRenderResultsPassGlobals, MixRenderResultsPassTextures>): RenderResult {
        const { globals, textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'backgroundTexture', textures.background);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'foregroundTexture', textures.foreground);

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'alpha', globals.alpha);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}