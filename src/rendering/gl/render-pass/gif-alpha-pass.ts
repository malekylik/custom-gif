import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl-render-result';
import { createGLBufferDrawingTarget } from '../gl-drawing-target';

import MainVertText from '../shader_assets/main.vert';
import TextureAlpha from '../shader_assets/textureAlpha.frag';

export type GifAlphaRenderPassGlobals = {
    transperancyIndex: number;
    screenHeight: number;
    alphaSquarCoord: [number, number, number, number];
}

export type GifAlphaRenderPassTextures = {
    gifFrame: IGLTexture
}

export class GifAlphaRenderPass<MemoryInput> implements RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawingContext = gl;

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragAlphaShader = createFragmentGLShader(gl, TextureAlpha);

        this.gpuProgram = new GLProgram(gl, vertShader, fragAlphaShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragAlphaShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures>): RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GifAlphaRenderPassGlobals, textures: GifAlphaRenderPassTextures): RenderResult {
        const drawingTarget = createGLBufferDrawingTarget(this.drawingContext, this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setUniform1f(this.drawingContext, 'TransperancyIndex', globals.transperancyIndex);
        this.gpuProgram.setUniform1f(this.drawingContext, 'ScreenHeight', globals.screenHeight);
        this.gpuProgram.setUniform1fv(this.drawingContext, 'Rect', globals.alphaSquarCoord[0], globals.alphaSquarCoord[1], globals.alphaSquarCoord[2], globals.alphaSquarCoord[3]);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'IndexTexture', textures.gifFrame);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        const renderResult = createGLRenderResult(this.drawingContext, drawingTarget.getBuffer());

        drawingTarget.dispose();

        return renderResult;
    }
}
