import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { createGLScreenDrawingTarget } from '../gl_api/gl-drawing-target';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';

type DrawingToScreenPassTextures = {
    targetTexture: IGLTexture;
}

export class DrawingToScreenRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.ScreenDrawer);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, DrawingToScreenPassTextures>): RenderPass<MemoryInput, {}, DrawingToScreenPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: Omit<RenderPassArgs<MemoryInput, {}, DrawingToScreenPassTextures>, 'drawingTarget'>): RenderResult {
        const {textures} = args;
        const drawingTarget = createGLScreenDrawingTarget(this.drawer.getGL());

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        return createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());
    }
}
