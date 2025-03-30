import { RenderResult } from '../../api/render-result';
import { GLTexture, IGLTexture } from '../gl_api/texture';

export interface GPUMemory {

}

export type GPUGlobals = {
    [globalName: string]: number | [number, number, number, number];
}

export interface GPUInputTexture {
    bind(): void;
}

export type GPUInputTextures = {
    // TODO: replace with GPUInputTexture
    [textureName: string]: IGLTexture;
};

/**
 * Represents a GPU program which can be chain in a sequence
 */
export interface RenderPass<MemoryInput, GlobalsInput extends GPUGlobals, TexturesInput extends GPUInputTextures> {
    chain(f: (image: RenderResult) => RenderPass<MemoryInput, GlobalsInput, TexturesInput>): RenderPass<MemoryInput, GlobalsInput, TexturesInput>;

    // TODO: should return RenderResult
    execute(memory: GPUMemory, globals: GPUGlobals, textures: TexturesInput): RenderResult;
}

export type DrawingTarget = {
    bind(): void;
}

export type ScreenDrawingTarget = DrawingTarget;

export type BufferDrawingTarget = {
    getBuffer(): IGLTexture;
    dispose(): void;
} & DrawingTarget;

export function createScreenDrawingTarget(gl: WebGL2RenderingContext): DrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;

    const drawingTarget: DrawingTarget = {
        bind() {
            _drawingContext.bindFramebuffer(_drawingContext.FRAMEBUFFER, null);
        },
    };

    return drawingTarget;
}

export function createBufferDrawingTarget(gl: WebGL2RenderingContext, width: number, height: number): BufferDrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;
    const _width: number = width;
    const _height: number = height;

    const { frameBuffer, texture: _texture } = init();

    const drawingTarget: BufferDrawingTarget = {
        bind() {
            _drawingContext.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        },

        getBuffer() {
            return _texture;
        },

        dispose() {
            _drawingContext.deleteFramebuffer(frameBuffer);
        },
    };

    return drawingTarget;

    function init(): { frameBuffer: WebGLFramebuffer; texture: GLTexture } {
        // TODO: think about deleting
        const frameBuffer = _drawingContext.createFramebuffer();
        _drawingContext.bindFramebuffer(_drawingContext.FRAMEBUFFER, frameBuffer);

        const rbo = _drawingContext.createRenderbuffer();
        _drawingContext.bindRenderbuffer(_drawingContext.RENDERBUFFER, rbo);
        _drawingContext.renderbufferStorage(_drawingContext.RENDERBUFFER, _drawingContext.DEPTH24_STENCIL8, _width, _height);
        _drawingContext.bindRenderbuffer(_drawingContext.RENDERBUFFER, null);
    
        _drawingContext.framebufferRenderbuffer(_drawingContext.FRAMEBUFFER, _drawingContext.DEPTH_STENCIL_ATTACHMENT, _drawingContext.RENDERBUFFER, rbo);

        const texture = new GLTexture(gl, _width, _height, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getGLTexture(), 0);

        _drawingContext.bindFramebuffer(gl.FRAMEBUFFER, null);

        return ({ frameBuffer, texture });
    }
}

