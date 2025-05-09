import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import BlackAndWhiteFragText from '../shader_assets/blanckWhiteTexture.frag';

type BackAndWhitePassTextures = {
    targetTexture: IGLTexture;
}

export class BlackAndWhiteRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, BackAndWhitePassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;
    private disposed;

    constructor(drawer: GLDrawer) {
        this.disposed = false;
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

    execute(args: RenderPassArgs<MemoryInput, {}, BackAndWhitePassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }

    dispose(): void {
        if (this.disposed) {
            console.log('Render pass was already disposed');

            return;
        }

        this.gpuProgram.dispose(this.drawer.getGL());
        this.disposed = true;
    }
}
