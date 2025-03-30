import { BufferDrawingTarget, DrawingTarget } from '../../api/drawing-target';
import { GLTexture, IGLTexture } from './texture';

export interface GLBufferDrawingTarget extends BufferDrawingTarget {
    dispose(): void
}

export function createGLScreenDrawingTarget(gl: WebGL2RenderingContext): DrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;

    const drawingTarget: DrawingTarget = {
        bind() {
            _drawingContext.bindFramebuffer(_drawingContext.FRAMEBUFFER, null);
        },
    };

    return drawingTarget;
}

export function createGLBufferDrawingTarget(gl: WebGL2RenderingContext, width: number, height: number): GLBufferDrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;
    const _width: number = width;
    const _height: number = height;

    const { frameBuffer, texture: _texture } = init();

    const drawingTarget: GLBufferDrawingTarget = {
        bind() {
            _drawingContext.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        },

        getBuffer() {
            return _texture;
        },

        dispose() {
            _drawingContext.bindFramebuffer(gl.FRAMEBUFFER, null);
            _drawingContext.deleteFramebuffer(frameBuffer);
        },
    };

    return drawingTarget;

    function init(): { frameBuffer: WebGLFramebuffer; texture: IGLTexture } {
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
