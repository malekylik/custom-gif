import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture, NoopGLTexture } from '../gl_api/texture';
import { GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { createGLScreenDrawingTarget } from '../gl_api/gl-drawing-target';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import TextureFragText from '../shader_assets/texture.frag';

type DrawingToScreenPassTextures = {
    targetTexture: IGLTexture;
}

export class DrawingToScreenRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;
    private noopTexture: IGLTexture;

    constructor(drawer: GLDrawer) {
        this.drawer = drawer;
        this.noopTexture = new NoopGLTexture();

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragBaseShader = createFragmentGLShader(this.drawer.getGL(), TextureFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragBaseShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, DrawingToScreenPassTextures>): RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: DrawingToScreenPassTextures): RenderResult {
        const drawingTarget = createGLScreenDrawingTarget(this.drawer.getGL());

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        return createGLRenderResult(this.drawer.getGL(), this.noopTexture);
    }
}
