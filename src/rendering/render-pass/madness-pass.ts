import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts/consts';
import { GLProgram } from '../gl/gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl/gl_api/shader';
import { IGLTexture } from '../gl/gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUMemory, RenderPass, RenderResult } from './render-pass';

import MainVertText from '../gl/shader_assets/madness.vert';
import TextureWithPalleteFragText from '../gl/shader_assets/madness.frag';

export type MandessPassGlobals = {
};

export type MandessPassTextures = {
    targetTexture: IGLTexture;
};

export class MandessPass<MemoryInput> implements RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures> {
    private drawingTarget: BufferDrawingTarget;
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.drawingContext = gl;
        this.drawingTarget = createBufferDrawingTarget(gl, width, height);

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
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'targetTexture', textures.targetTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return ({ texture: this.drawingTarget.getBuffer(), frameBuffer: this.drawingTarget });
    }
}
