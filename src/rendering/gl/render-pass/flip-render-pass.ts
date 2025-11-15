import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { INDECIES_COUNT_NUMBER } from '../consts';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';
import { ShaderPromgramId } from '../../api/shader-manager';
import { GLShaderManager } from '../gl_api/gl-shader-manager';


type GifRenderPassTextures = {
    targetTexture: IGLTexture;
}

// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true) probably can be used instead
// Or NoopRenderPass
export class FlipRenderResultsRenderPass<MemoryInput> implements RenderPass<MemoryInput, {}, GifRenderPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.FlipDrawer);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, GifRenderPassTextures>): RenderPass<MemoryInput, {}, GifRenderPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, {}, GifRenderPassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER, this.drawer.getNumberOfDrawCalls(textures.targetTexture));

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
