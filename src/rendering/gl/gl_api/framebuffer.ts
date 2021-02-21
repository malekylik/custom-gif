import { GLTexture } from "./texture";

export class GLFramebuffer {
  private frameBuffer: WebGLFramebuffer;

  constructor (gl: WebGL2RenderingContext, width: number, height: number) {
    this.frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
  
    const rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
  }

  unbind(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  setTexture(gl: WebGL2RenderingContext, texture: GLTexture): void {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getGLTexture(), 0);
  }
}