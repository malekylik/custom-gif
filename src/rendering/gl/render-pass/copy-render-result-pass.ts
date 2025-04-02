import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUGlobals, GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';
import { ResourceManager } from '../../api/resource-manager';

import MainVertText from '../shader_assets/main.vert';
import TextureFragText from '../shader_assets/texture.frag';

type CopyRenderResultPassTextures = {
    targetTexture: IGLTexture;
}

export class CopyRenderResultRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragBaseShader = createFragmentGLShader(this.drawer.getGL(), TextureFragText);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragBaseShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, CopyRenderResultPassTextures>): RenderPass<MemoryInput, {}, CopyRenderResultPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: CopyRenderResultPassTextures, resourceManager: ResourceManager): RenderResult {
        const drawingTarget = resourceManager.allocateFrameDrawingTarget(this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
