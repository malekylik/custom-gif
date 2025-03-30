import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl-render-result';

import MainVertText from '../shader_assets/main.vert';
import MixTextureFragText from '../shader_assets/mixTextures.frag';


export type MixRenderResultsPassGlobals = {
    alpha: number;
};

export type MixRenderResultsPassTextures = {
    foreground: IGLTexture;
    background: IGLTexture;
}

export class MixRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, MixRenderResultsPassGlobals, MixRenderResultsPassTextures> {
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

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, MixRenderResultsPassTextures>): RenderPass<MemoryInput, {}, MixRenderResultsPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: MixRenderResultsPassGlobals, textures: MixRenderResultsPassTextures): RenderResult {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'backgroundTexture', textures.background);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'foregroundTexture', textures.foreground);

        this.gpuProgram.setUniform1f(this.drawingContext, 'alpha', globals.alpha);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return createGLRenderResult(this.drawingContext, this.drawingTarget.getBuffer());
    }
}