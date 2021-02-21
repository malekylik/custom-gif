import { GLTexture } from "./texture";

export class GLFramebuffer {
  private frameBuffer: WebGLFramebuffer;
  private width: number;
  private heigth: number;

  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    this.width = width;
    this.heigth = height;
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

  readPixels(gl: WebGL2RenderingContext): Uint8Array {
    const b = new Uint8Array(this.width * this.heigth * 4);

    gl.readPixels(0, 0, this.width, this.heigth, gl.RGBA, gl.UNSIGNED_BYTE, b);

    return b;
  }
}