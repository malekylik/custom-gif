import { INDECIES_COUNT_NUMBER } from '../consts';
import { GLProgram } from '../gl_api/program';
import { IGLTexture } from '../gl_api/texture';
import { RenderPass, RenderPassArgs } from './render-pass';
import { RenderResult } from '../../api/render-result';
import { createGLRenderResult } from '../gl_api/gl-render-result';
import { GLDrawer } from '../gl_api/gl-drawer';

import { GLShaderManager } from '../gl_api/gl-shader-manager';
import { ShaderPromgramId } from '../../api/shader-manager';
import { Mat3 } from '../effects/utils/mat3';
import { mat3ToVec1 } from '../effects/utils/vec1';

function computeKernelWeight(kernel: Mat3) {
   const weight = kernel.getBuffer().reduce((prev, curr) => {
       return prev + curr;
   });
   return weight <= 0 ? 1 : weight;
 }

type ConvolutionMatrixPassTextures = {
    targetTexture: IGLTexture;
}

type ConvolutionMatrixPassGlobals = {
    kernel: Mat3; // | Mat5
}

export class ConvolutionMatrixRenderPass<MemoryInput> implements RenderPass<MemoryInput, ConvolutionMatrixPassGlobals, ConvolutionMatrixPassTextures> {
    private drawer: GLDrawer;
    private gpuProgram: GLProgram;

    constructor(drawer: GLDrawer, shaderManager: GLShaderManager) {
        this.drawer = drawer;

        this.gpuProgram = shaderManager.getProgram(ShaderPromgramId.ConvolutionMatrix);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, {}, ConvolutionMatrixPassTextures>): RenderPass<MemoryInput, {}, ConvolutionMatrixPassTextures> {
        throw new Error("Method not implemented.");
    }

    execute(args: RenderPassArgs<MemoryInput, ConvolutionMatrixPassGlobals, ConvolutionMatrixPassTextures>): RenderResult {
        const { textures, drawingTarget } = args;

        console.log(computeKernelWeight(args.globals.kernel), computeKernelWeight(args.globals.kernel));

        this.gpuProgram.useProgram(this.drawer.getGL());
        this.gpuProgram.setTextureUniform(this.drawer.getGL(), 'targetTexture', textures.targetTexture);
        this.gpuProgram.setUniform1fv(this.drawer.getGL(), 'kernel', mat3ToVec1(args.globals.kernel));
        this.gpuProgram.setUniform1f(this.drawer.getGL(), 'kernelWeight', computeKernelWeight(args.globals.kernel));

        this.drawer.drawTriangles(drawingTarget, 0, INDECIES_COUNT_NUMBER, this.drawer.getNumberOfDrawCalls(textures.targetTexture));

        const renderResult = createGLRenderResult(this.drawer.getGL(), drawingTarget.getBuffer());

        return renderResult;
    }
}
