import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { createGLBufferDrawingTarget } from '../gl_api/gl-drawing-target';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import BlackAndWhiteFragText from '../shader_assets/blanckWhiteTexture.frag';

type BackAndWhitePassTextures = {
    targetTexture: IGLTexture;
}

export class BackAndWhiteRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, BackAndWhitePassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragBaseShader = createFragmentGLShader(this.drawer.getGL(), BlackAndWhiteFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragBaseShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, BackAndWhitePassTextures>): RenderPass<MemoryInput, {}, BackAndWhitePassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: BackAndWhitePassTextures): RenderResult {
        const drawingTarget = createGLBufferDrawingTarget(this.drawer.getGL(), this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        drawingTarget.dispose();

        return renderResult;
    }
}
