import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl-render-result';

import MainVertText from '../shader_assets/main.vert';
import TextureFragText from '../shader_assets/texture.frag';
import { createGLBufferDrawingTarget } from '../gl-drawing-target';

type CopyRenderResultPassTextures = {
    targetTexture: IGLTexture;
}

export class CopyRenderResultRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawingContext = gl;

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragBaseShader = createFragmentGLShader(gl, TextureFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, CopyRenderResultPassTextures>): RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: CopyRenderResultPassTextures): RenderResult {
        const drawingTarget = createGLBufferDrawingTarget(this.drawingContext, this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'targetTexture', textures.targetTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        const renderResult = createGLRenderResult(this.drawingContext, drawingTarget.getBuffer());

        drawingTarget.dispose();

        return renderResult;
    }
}
