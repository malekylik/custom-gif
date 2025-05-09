import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { ShaderPromgramId } from '../../api/shader-manager';
import { GLShaderManager } from '../gl_api/gl-shader-manager';

export type GifRenderPassGlobals = {
    colorTableSize: number;
};

export type GifRenderPassTextures = {
    indexTexture: IGLTexture;
    alphaTexture: IGLTexture;
    colorTableTexture: IGLTexture;
    prevFrameTexture: IGLTexture | null;
};

export class GifRenderPass<MemoryInput> implements RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.GifFrame);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures>): RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures>): RenderResult {
        const { globals, textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'ColorTableSize', globals.colorTableSize);

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'IndexTexture', textures.indexTexture);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'alphaTexture', textures.alphaTexture);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'ColorTableTexture', textures.colorTableTexture);

        if (textures.prevFrameTexture) {
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'prevFrameTexture', textures.prevFrameTexture);
        }

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
