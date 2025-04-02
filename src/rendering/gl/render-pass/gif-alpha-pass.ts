import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl_api/shader';
import { IGLTexture } from '../gl_api/texture';
import { GPUMemory, RenderPass } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { ResourceManager } from '../../api/resource-manager';
import { GLDrawer } from '../gl_api/gl-drawer';

import MainVertText from '../shader_assets/main.vert';
import TextureAlpha from '../shader_assets/textureAlpha.frag';

export type GifAlphaRenderPassGlobals = {
    transperancyIndex: number;
    screenHeight: number;
    alphaSquarCoord: [number, number, number, number];
}

export type GifAlphaRenderPassTextures = {
    gifFrame: IGLTexture
}

export class GifAlphaRenderPass<MemoryInput> implements RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    private width: number;
    private height: number;

    constructor(drawer: GLDrawer, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.drawer = drawer;

        const vertShader = createVertexGLShader(this.drawer.getGL(), MainVertText);
        const fragAlphaShader = createFragmentGLShader(this.drawer.getGL(), TextureAlpha);

        this.gpuProgram = new GLProgram(this.drawer.getGL(), vertShader, fragAlphaShader);

        deleteShader(this.drawer.getGL(), vertShader);
        deleteShader(this.drawer.getGL(), fragAlphaShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures>): RenderPass<MemoryInput, GifAlphaRenderPassGlobals, GifAlphaRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GifAlphaRenderPassGlobals, textures: GifAlphaRenderPassTextures, resourceManager: ResourceManager): RenderResult {
        const drawingTarget = resourceManager.allocateFrameDrawingTarget(this.width, this.height);

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());

        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'TransperancyIndex', globals.transperancyIndex);
        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'ScreenHeight', globals.screenHeight);
        this.gpuProgram.setUniform1fv(this.drawer.getGL(), 'Rect', globals.alphaSquarCoord[0], globals.alphaSquarCoord[1], globals.alphaSquarCoord[2], globals.alphaSquarCoord[3]);

        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'IndexTexture', textures.gifFrame);

        this.drawer.drawTriangles(0, INDECIES_COUNT_NUMBER);

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
