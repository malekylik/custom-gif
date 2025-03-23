import { QUAD_WITH_TEXTURE_COORD_DATA } from "./consts/consts";
import { GLProgram } from "./gl/gl_api/program";
import { createFragmentGLShader, createVertexGLShader } from "./gl/gl_api/shader";
import { GLTexture } from "./gl/gl_api/texture";
import MainVertText from './gl/shader_assets/main.vert';
import TextureFragText from './gl/shader_assets/texture.frag';


interface RenderResult {

}

interface GPUMemory {

}

interface GPUGlobals {

}

interface GPUInputTexture {
    bind(): void;
}

type GPUInputTextures = {
    // TODO: replace with GPUInputTexture
    [textureName: string]: GLTexture;
};

/**
 * Represents a GPU program which can be chain in a sequence
 */
interface RenderPass<MemoryInput, GlobalsInput, TexturesInput extends GPUInputTextures> {
    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GlobalsInput, TexturesInput>): RenderPass<MemoryInput, GlobalsInput, TexturesInput>;

    // TODO: should return RenderResult
    execute(memory: GPUMemory, globals: GPUGlobals, textures: TexturesInput): void;
}

type DrawingTarget = {
    bind(): void;
}

type ScreenDrawingTarget = DrawingTarget;


function createScreenDrawingTarget(gl: WebGL2RenderingContext): DrawingTarget {
    const drawingContext: WebGL2RenderingContext = gl;

    const drawingTarget: DrawingTarget = {
        bind() {
            drawingContext.bindFramebuffer(drawingContext.FRAMEBUFFER, null);
        }
    };

    return drawingTarget;
}

/**
 * accepts as input:
 * memory (VBO, VAO, VIO)
 * globals (uniforms)
 * textures (depends on slots)
 */

// class GLRenderPass implements RenderPass {


//     chain(f: (image: RenderResult) => RenderPass): RenderPass {
//         throw new Error("Method not implemented.");
//     }

//     execute(memory: GPUMemory<any>, globals: GPUGlobals, textures: GPUInputTextures<'asd' |'bgf'>): RenderResult {
//         // this.drawingToAlphaTexture(gl, image);
//         const result = chain();

//         textures.

        


//         outputTexture.bind();

//         // this.texture.bind(gl);
//         // this.texture.setData(gl, image.imageLeft, image.imageTop, image.imageWidth, image.imageHeight, this.uncompressedData);
//         // this.texture.activeTexture(gl);
//         // this.texture.bind(gl);
//         textures.gifData.bind();

//         // this.colorTableTexture.bind(gl);
//         // this.colorTableTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());
//         // this.colorTableTexture.activeTexture(gl);
//         // this.colorTableTexture.bind(gl);
//         textures.colorTable.bind();

//         // this.alphaTexture.activeTexture(gl);
//         // this.alphaTexture.bind(gl);
//         // textures.alphaTexture.bind();
//         result.bind();

//         draw();

//         return outputTexture;
//     }
// }

export class DrawingToScreenRenderPass<MemoryInput, GlobalsInput> implements RenderPass<MemoryInput, GlobalsInput, { outputTexture: GLTexture }> {
    private drawingTarget: ScreenDrawingTarget;
    private drawingContext: WebGL2RenderingContext;
    private gpuProgram: GLProgram;

    constructor(gl: WebGL2RenderingContext) {
        this.drawingContext = gl;
        this.drawingTarget = createScreenDrawingTarget(gl);

        const vertShader = createVertexGLShader(gl, MainVertText);
        const fragBaseShader = createFragmentGLShader(gl, TextureFragText);

        this.gpuProgram = new GLProgram(gl, vertShader, fragBaseShader);
    }

    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GlobalsInput, { outputTexture: GLTexture }>): RenderPass<MemoryInput, GlobalsInput, { outputTexture: GLTexture }> {
        throw new Error("Method not implemented.");
    }

    execute(memory: GPUMemory, globals: GPUGlobals, textures: { outputTexture: GLTexture }): void {
        this.drawingTarget.bind();

        this.gpuProgram.useProgram(this.drawingContext);
        this.gpuProgram.setTextureUniform(this.drawingContext, 'outTexture', textures.outputTexture);

        this.drawingContext.drawArrays(this.drawingContext.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
    }
}



/**
 * 1. Render to alpha (memory, globals: { TransperancyIndex: float, Rect: vec4 }, textures: { 1 }) -> Res1
 * 2. 
 */
