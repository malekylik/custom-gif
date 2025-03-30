import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { createGLBufferDrawingTarget } from '../gl_api/gl-drawing-target';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import TextureWithPalleteFragText from '../shader_assets/textureWithPallete.frag';

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
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragShader = createFragmentGLShader(this.drawer.getGL(), TextureWithPalleteFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures>): RenderPass<MemoryInput, GifRenderPassGlobals, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GifRenderPassGlobals, textures: GifRenderPassTextures): RenderResult {
        const drawingTarget = createGLBufferDrawingTarget(this.drawer.getGL(), this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'ColorTableSize', globals.colorTableSize);

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'IndexTexture', textures.indexTexture);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'alphaTexture', textures.alphaTexture);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'ColorTableTexture', textures.colorTableTexture);

        if (textures.prevFrameTexture) {
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'prevFrameTexture', textures.prevFrameTexture);
        }

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        drawingTarget.dispose();

        return renderResult;
    }
}
