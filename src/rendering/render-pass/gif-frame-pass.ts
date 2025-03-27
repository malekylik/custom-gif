import { QUAD_WITH_TEXTURE_COORD_DATA } from '../consts/consts';
import { GLProgram } from '../gl/gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl/gl_api/shader';
import { IGLTexture } from '../gl/gl_api/texture';
import { BufferDrawingTarget, createBufferDrawingTarget, GPUMemory, RenderPass, RenderResult } from './render-pass';

import MainVertText from '../gl/shader_assets/main.vert';
import TextureWithPalleteFragText from '../gl/shader_assets/textureWithPallete.frag';

export type GifRenderPassGlobals = {
    colorTableSize: number;
};

export type GifRenderPassTextures = {
    indexTexture: IGLTexture;
    alphaTexture: IGLTexture;
    colorTableTexture: IGLTexture;
    prevFrameTexture: IGLTexture | null;
};

export class GifRenderPass<MemoryInput> implements RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures> {
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

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures>): RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GifRenderPassGlobals, textures: GifRenderPassTextures): RenderResult {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);

        this.gpuProgram.setUniform1f(this.drawingContext, 'ColorTableSize', globals.colorTableSize);

        this.gpuProgram.setTextureUniform(this.drawingContext, 'IndexTexture', textures.indexTexture);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'alphaTexture', textures.alphaTexture);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'ColorTableTexture', textures.colorTableTexture);

        if (textures.prevFrameTexture) {
        this.gpuProgram.setTextureUniform(this.drawingContext, 'prevFrameTexture', textures.prevFrameTexture);
        }

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);

        return ({ texture: this.drawingTarget.getBuffer(), frameBuffer: this.drawingTarget });
    }
}
