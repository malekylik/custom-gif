import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import MixTextureFragText from '../shader_assets/mixTextures.frag';


export type MixRenderResultsPassGlobals = {
    alpha: number;
};

export type MixRenderResultsPassTextures = {
    foreground: IGLTexture;
    background: IGLTexture;
}

export class MixRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, MixRenderResultsPassGlobals, MixRenderResultsPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragBaseShader = createFragmentGLShader(this.drawer.getGL(), MixTextureFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragBaseShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, MixRenderResultsPassTextures>): RenderPass<MemoryInput, {}, MixRenderResultsPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, MixRenderResultsPassGlobals, MixRenderResultsPassTextures>): RenderResult {
        const { globals, textures, resourceManager } = args;
        const drawingTarget = resourceManager.allocateFrameDrawingTarget(this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'backgroundTexture', textures.background);
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'foregroundTexture', textures.foreground);

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'alpha', globals.alpha);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}