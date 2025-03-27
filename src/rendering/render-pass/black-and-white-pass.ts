import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts/consts';
import { GLProgram } from '../gl/gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl/gl_api/shader';
import { IGLTexture } from '../gl/gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUGlobals, GPUMemory, RenderPass, RenderResult } from './render-pass';

import MainVertText from '../gl/shader_assets/main.vert';
import BlackAndWhiteFragText from '../gl/shader_assets/blanckWhiteTexture.frag';

type BackAndWhitePassTextures = {
    targetTexture: IGLTexture;
}

export class BackAndWhiteRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, BackAndWhitePassTextures> {
    private drawingTarget: BufferDrawingTarget;
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.drawingContext = gl;
        this.drawingTarget = createBufferDrawingTarget(gl, width, height);

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragBaseShader = createFragmentGLShader(gl, BlackAndWhiteFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, BackAndWhitePassTextures>): RenderPass<MemoryInput, {}, BackAndWhitePassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: BackAndWhitePassTextures): RenderResult {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'targetTexture', textures.targetTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return ({ texture: this.drawingTarget.getBuffer(), frameBuffer: this.drawingTarget });
    }
}
