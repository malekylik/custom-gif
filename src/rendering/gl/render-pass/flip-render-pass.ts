import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { createGLRenderResult } from '../gl-render-result';

import MainFlippedVertText from '../shader_assets/mainFlipped.vert';
import MixTextureFragText from '../shader_assets/mixTextures.frag';

type GifRenderPassTextures = {
    targetTexture: IGLTexture;
}

export class FlipRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, GifRenderPassTextures> {
    private drawingTarget: BufferDrawingTarget;
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.drawingContext = gl;
        this.drawingTarget = createBufferDrawingTarget(gl, width, height);

        const vertShader = createVertexGLShader(gl, MainFlippedVertText);
        const fragBaseShader = createFragmentGLShader(gl, MixTextureFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, GifRenderPassTextures>): RenderPass<MemoryInput, {}, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: GifRenderPassTextures): RenderResult {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'targetTexture', textures.targetTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return createGLRenderResult(this.drawingContext, this.drawingTarget.getBuffer());
    }
}
