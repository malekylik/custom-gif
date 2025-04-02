import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/madness.vert';
import TextureWithPalleteFragText from '../shader_assets/madness.frag';

export type MandessPassGlobals = {
};

export type MandessPassTextures = {
    targetTexture: IGLTexture;
};

export class MandessPass<MemoryInput> implements RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures> {
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

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures>): RenderPass<MemoryInput, MandessPassGlobals, MandessPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, MandessPassGlobals, MandessPassTextures>): RenderResult {
        const { textures, resourceManager } = args;
        const drawingTarget = resourceManager.allocateFrameDrawingTarget(this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
