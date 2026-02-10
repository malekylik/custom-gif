import { Vec1 } from "../effects/utils/vec1";
import { IGLTexture } from "./texture";

export function createGLProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);

    console.warn(`Fail to link program: ${info}`);

    gl.deleteProgram(program);

    return null;
  }

  return program;
}

interface BufferCache {
  location: WebGLUniformLocation;
  value: unknown;
}

export class GLProgram {
  private program: WebGLProgram;
  private uniformBuffer: Map<string, BufferCache>;
  private currentTextureUnit: number;

  constructor (gl: WebGLRenderingContext | WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
    this.program = createGLProgram(gl, vertShader, fragShader);
    this.uniformBuffer = new Map();

    this.currentTextureUnit = -1;
  }

  isProgramCreated(): boolean {
    return this.program !== null;
  }

  useProgram(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.currentTextureUnit = -1;
    gl.useProgram(this.program);
  }

  setTextureUniform(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, texture: IGLTexture): void {
    this.currentTextureUnit += 1;

    texture.activeTexture(gl, this.currentTextureUnit);
    // TODO: think if we need to bind and active texture here
    texture.bind(gl);

    this.setUniform1i(gl, location, this.currentTextureUnit);
  }

  setUniform1i(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, value: number): void {
    let cache = this.getCache(gl, location);

    if (cache.value !== value) {
      cache.value = value;

      gl.uniform1i(cache.location, value);
    }
  }

  setUniform1f(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, value: number): void {
    let cache = this.getCache(gl, location);

    if (cache.value !== value) {
      cache.value = value;

      gl.uniform1f(cache.location, value);
    }
  }

    setUniform1fv(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, value: Vec1): void {
    let cache = this.getCache(gl, location + '[0]');
    let cachedValue = cache.value as unknown as Vec1;

    if (!cachedValue || (value !== cachedValue)) {
      cache.value = value;

      gl.uniform1fv(cache.location, value.getBuffer());
    }
  }

  setUniform3f(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, x: number, y: number, z: number): void {
    let cache = this.getCache(gl, location);
    let value = cache.value as unknown as Float32Array;

    if (!value || (value[0] !== x || value[1] !== y, value[2] !== z)) {
      value = new Float32Array(3);
      value[0] = x;
      value[1] = y;
      value[2] = z;
      cache.value = value;

      gl.uniform3f(cache.location, x, y, z);
    }
  }

  setUniform3fv(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, x: number, y: number, z: number): void {
    let cache = this.getCache(gl, location + '[0]');
    let value = cache.value as unknown as Float32Array;

    if (!value || (value[0] !== x || value[1] !== y, value[2] !== z)) {
      value = new Float32Array(3);
      value[0] = x;
      value[1] = y;
      value[2] = z;
      cache.value = value;

      gl.uniform3fv(cache.location, value);
    }
  }

  setUniform4fv(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string, x: number, y: number, z: number, w: number): void {
    let cache = this.getCache(gl, location);
    let value = cache.value as unknown as Float32Array;

    if (!value || (value[0] !== x || value[1] !== y, value[2] !== z, value[3] !== w)) {
      value = new Float32Array(4);
      value[0] = x;
      value[1] = y;
      value[2] = z;
      value[3] = w;
      cache.value = value;

      gl.uniform4fv(cache.location, value);
    }
  }

  private getCache(gl: WebGLRenderingContext | WebGL2RenderingContext, location: string): BufferCache {
    let cache: BufferCache = this.uniformBuffer.get(location);

    if (!cache) {
      cache = {
        location: gl.getUniformLocation(this.program, location),
        value: undefined,
      }
    }

    return cache;
  }

  dispose(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    gl.deleteProgram(this.program);
    this.program = null;
  }
}
