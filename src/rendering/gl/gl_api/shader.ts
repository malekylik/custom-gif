function createGLShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, shaderSrc: string): WebGLShader {
  const shader = gl.createShader(type);

  if (shader === 0) console.warn('Fail to create shader');

  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);

    console.warn(`Fail to compile shader: ${message}`);

    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

export function createVertexGLShader(gl: WebGLRenderingContext | WebGL2RenderingContext, shaderSrc: string): WebGLShader {
  return createGLShader(gl, gl.VERTEX_SHADER, shaderSrc);
}

export function createFragmentGLShader(gl: WebGLRenderingContext | WebGL2RenderingContext, shaderSrc: string): WebGLShader {
  return createGLShader(gl, gl.FRAGMENT_SHADER, shaderSrc);
}

export function deleteShader(gl: WebGLRenderingContext | WebGL2RenderingContext, shader: WebGLShader): void {
  gl.deleteShader(shader);
}
