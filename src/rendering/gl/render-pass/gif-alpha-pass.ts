import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';

export type GifAlphaRenderPassGlobals = {
    transperancyIndex: number;
    screenHeight: number;
    alphaSquarCoord: [number, number, number, number];
}

export type GifAlphaRenderPassTextures = {
    gifFrame: IGLTexture
}

export class GifAlphaRenderPass<MemoryInput> implements RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.GifAlpha);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures>): RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures>): RenderResult {
        const { globals, textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'TransperancyIndex', globals.transperancyIndex);
        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'ScreenHeight', globals.screenHeight);
        this.gpuProgram.setUniform1fv(this.drawer.getGL(), 'Rect', globals.alphaSquarCoord[0], globals.alphaSquarCoord[1], globals.alphaSquarCoord[2], globals.alphaSquarCoord[3]);

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'IndexTexture', textures.gifFrame);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
