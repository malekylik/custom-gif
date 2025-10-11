import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';

export enum DarkingDirection {
    out = 0.0,
    in = 1.0,
}

type DarkingPassTextures = {
    targetTexture: IGLTexture;
}

type DarkingPassGlobals = {
    animationProgress: number;
    /**
     * 0.0 mean - "out"  animation
     * 1.0 mean - "in" animation
     */
    direction?: DarkingDirection;
}

export class DarkingRenderPass<MemoryInput> implements RenderPass<MemoryInput, DarkingPassGlobals, DarkingPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.Darking);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, DarkingPassTextures>): RenderPass<MemoryInput, {}, DarkingPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, DarkingPassGlobals, DarkingPassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);
        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'animationProgress', args.globals.animationProgress ?? 1.0);
        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'direction', args.globals.direction ?? DarkingDirection.in);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER, this.drawer.getNumberOfDrawCalls(textures.targetTexture));

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
