import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { ShaderPromgramId } from '../../api/shader-manager';
import { GLShaderManager } from '../gl_api/gl-shader-manager';

export type MandessRenderPassGlobals = {
};

export type MandessRenderPassTextures = {
    targetTexture: IGLTexture;
};

export class MandessRenderPass<MemoryInput> implements RenderPass<MemoryInput, MandessRenderPassGlobals, MandessRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.Mandess);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, MandessRenderPassGlobals, MandessRenderPassTextures>): RenderPass<MemoryInput, MandessRenderPassGlobals, MandessRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, MandessRenderPassGlobals, MandessRenderPassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
