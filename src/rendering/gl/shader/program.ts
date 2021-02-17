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

  constructor (gl: WebGLRenderingContext | WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
    this.program = createGLProgram(gl, vertShader, fragShader);
    this.uniformBuffer = new Map();
  }

  useProgram(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    gl.useProgram(this.program);
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
}
