import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';

type CopyRenderResultPassTextures = {
    targetTexture: IGLTexture;
}

export class CopyRenderResultRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.FlipDrawer);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, CopyRenderResultPassTextures>): RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, {}, CopyRenderResultPassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER, this.drawer.getNumberOfDrawCalls(textures.targetTexture));

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
