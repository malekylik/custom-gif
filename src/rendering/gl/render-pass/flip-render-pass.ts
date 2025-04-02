import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { INDECIES_COUNT_NUMBER } from '../consts';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainFlippedVertText from '../shader_assets/mainFlipped.vert';
import MixTextureFragText from '../shader_assets/mixTextures.frag';

type GifRenderPassTextures = {
    targetTexture: IGLTexture;
}

export class FlipRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, GifRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainFlippedVertText);
        const fragBaseShader = createFragmentGLShader(this.drawer.getGL(), MixTextureFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragBaseShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, GifRenderPassTextures>): RenderPass<MemoryInput, {}, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, {}, GifRenderPassTextures>): RenderResult {
        const { memory, globals, textures, resourceManager } = args;
        const drawingTarget = resourceManager.allocateFrameDrawingTarget(this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
