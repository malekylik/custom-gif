import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts/consts';
import { GLProgram } from '../gl/gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl/gl_api/shader';
import { IGLTexture } from '../gl/gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUGlobals, GPUMemory, RenderPass, RenderResult } from './render-pass';

import MainVertText from '../gl/shader_assets/main.vert';
import MixTextureFragText from '../gl/shader_assets/mixTextures.frag';

export type MixRenderResultsPassTextures = {
    foreground: IGLTexture;
    background: IGLTexture;
}

export class MixRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, { foreground: IGLTexture; background: IGLTexture; }> {
    private drawingTarget: BufferDrawingTarget;
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.drawingContext = gl;
        this.drawingTarget = createBufferDrawingTarget(gl, width, height);

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragBaseShader = createFragmentGLShader(gl, MixTextureFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, { foreground: IGLTexture; background: IGLTexture; }>): RenderPass<MemoryInput, {}, { foreground: IGLTexture; background: IGLTexture; }> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: { foreground: IGLTexture; background: IGLTexture; }): RenderResult {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'backgroundTexture', textures.background);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'foregroundTexture', textures.foreground);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return ({ texture: this.drawingTarget.getBuffer(), frameBuffer: this.drawingTarget });
    }
}