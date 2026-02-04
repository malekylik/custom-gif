import { RenderResult } from '../../api/render-result';
import { IGLTexture } from './texture';

export function createGLRenderResult(gl: WebGL2RenderingContext, texture: IGLTexture): RenderResult {
    return {
        texture,

        readResultToBuffer(buffer: Uint8Array, format?: WebGLRenderingContextBase['RGB'] | WebGLRenderingContextBase['RGBA']): void {
            format ??= gl.RGBA;

            const frameBuffer = attachToFrameBuffer(texture);

            gl.readPixels(0, 0, texture.getWidth(), texture.getHeight(), format, gl.UNSIGNED_BYTE, buffer);

            deleteFrameBuffer(frameBuffer);
        }
    };

    function attachToFrameBuffer(texture: IGLTexture): WebGLFramebuffer {
        const frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

        // TODO: delete ???
        const rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, texture.getWidth(), texture.getHeight());
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getGLTexture(), 0);

        return frameBuffer;
    }

    function deleteFrameBuffer(frameBuffer: WebGLFramebuffer): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.deleteFramebuffer(frameBuffer);
    }
}
