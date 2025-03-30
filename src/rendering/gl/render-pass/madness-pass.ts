import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl-render-result';
import { createGLBufferDrawingTarget } from '../gl-drawing-target';

import MainVertText from '../shader_assets/madness.vert';
import TextureWithPalleteFragText from '../shader_assets/madness.frag';

export type MandessPassGlobals = {
};

export type MandessPassTextures = {
    targetTexture: IGLTexture;
};

export class MandessPass<MemoryInput> implements RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures> {
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawingContext = gl;

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragShader = createFragmentGLShader(gl, TextureWithPalleteFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures>): RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: MandessPassGlobals, textures: MandessPassTextures): RenderResult {
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
