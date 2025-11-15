import { BufferDrawingTarget } from '../../api/drawing-target';
import { GLTexture, IGLTexture, NoopGLTexture } from './texture';

export interface GLBufferDrawingTarget extends BufferDrawingTarget {
    dispose(): void
}

// TODO: add width and height as well, and update screen each time with viewport
export function createGLScreenDrawingTarget(gl: WebGL2RenderingContext): GLBufferDrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;
    const noopTexture = new NoopGLTexture();

    const drawingTarget: GLBufferDrawingTarget = {
        bind() {
            _drawingContext.bindFramebuffer(_drawingContext.FRAMEBUFFER, null);
        },

        getBuffer() {
            return noopTexture;
        },

        dispose() {
        },
    };

    return drawingTarget;
}

export function createGLBufferDrawingTarget(gl: WebGL2RenderingContext, width: number, height: number): GLBufferDrawingTarget {
    const _drawingContext: WebGL2RenderingContext = gl;
    const _width: number = width;
    const _height: number = height;

    const { frameBuffer, texture: _texture, rbo } = init();

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

            _drawingContext.deleteRenderbuffer(rbo);

            _drawingContext.deleteTexture(_texture.getGLTexture());
        },
    };

    return drawingTarget;

    function init(): { frameBuffer: WebGLFramebuffer; texture: IGLTexture; rbo: WebGLRenderbuffer } {
        const frameBuffer = _drawingContext.createFramebuffer();
        _drawingContext.bindFramebuffer(_drawingContext.FRAMEBUFFER, frameBuffer);

        // DO we need to read from framebuffer
        const rbo = _drawingContext.createRenderbuffer();
        _drawingContext.bindRenderbuffer(_drawingContext.RENDERBUFFER, rbo);
        _drawingContext.renderbufferStorage(_drawingContext.RENDERBUFFER, _drawingContext.DEPTH24_STENCIL8, _width, _height);
        _drawingContext.bindRenderbuffer(_drawingContext.RENDERBUFFER, null);
    
        _drawingContext.framebufferRenderbuffer(_drawingContext.FRAMEBUFFER, _drawingContext.DEPTH_STENCIL_ATTACHMENT, _drawingContext.RENDERBUFFER, rbo);

        const texture = new GLTexture(gl, _width, _height, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getGLTexture(), 0);

        _drawingContext.bindFramebuffer(gl.FRAMEBUFFER, null);

        return ({ frameBuffer, texture, rbo });
    }
}
