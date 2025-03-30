import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture, NoopGLTexture } from '../gl_api/texture';
import { GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl-render-result';

import MainVertText from '../shader_assets/main.vert';
import TextureFragText from '../shader_assets/texture.frag';
import { createGLScreenDrawingTarget } from '../gl-drawing-target';

type DrawingToScreenPassTextures = {
    targetTexture: IGLTexture;
}

export class DrawingToScreenRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;
    private noopTexture: IGLTexture;

    constructor(gl: WebGL2RenderingContext) {
        this.drawingContext = gl;
        this.noopTexture = new NoopGLTexture();

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragBaseShader = createFragmentGLShader(gl, TextureFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);

        deleteShader(gl, vertShader);
        deleteShader(gl, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, DrawingToScreenPassTextures>): RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: DrawingToScreenPassTextures): RenderResult {
        const drawingTarget = createGLScreenDrawingTarget(this.drawingContext);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'targetTexture', textures.targetTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return createGLRenderResult(this.drawingContext, this.noopTexture);
    }
}
