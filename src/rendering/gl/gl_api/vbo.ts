export enum AttribType {
  FLOAT,
}

export function convertToGLAttribType(gl: WebGLRenderingContext | WebGL2RenderingContext, type: AttribType): number {
  switch (type) {
    case AttribType.FLOAT: return gl.FLOAT;
  }

  return 0;
}

export function convertToSize(gl: WebGLRenderingContext | WebGL2RenderingContext, type: AttribType): number {
  switch (type) {
    case gl.FLOAT:
    case AttribType.FLOAT: return Float32Array.BYTES_PER_ELEMENT;
  }

  return 0;
}

export interface AttribLayout {
  type: AttribType;
  componentsCount: number;
}

interface PrivateAttribLayout {
  type: number;
  offset: number;
  componentsCount: number;
}

export class GLVBO {
  private vbo: WebGLBuffer;
  private layout: Array<PrivateAttribLayout>;
  private stride: number;

  constructor (gl: WebGLRenderingContext | WebGL2RenderingContext, layout: Array<AttribLayout>) {
    this.vbo = gl.createBuffer();

    let offset = 0;
    this.layout = layout.map((v) => {
      const currentOffset = offset;
      offset += convertToSize(gl, v.type) * v.componentsCount

      return ({
        type: convertToGLAttribType(gl, v.type),
        componentsCount: v.componentsCount,
        offset: currentOffset,
      });
    });

    this.stride = 0;
    if (layout.length) {
      const layoutItem = this.layout[layout.length - 1];
      this.stride = layoutItem.offset + convertToSize(gl, layoutItem.type) * layoutItem.componentsCount;
    }
  }

  bind(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  }

  activateAttribPointer(gl: WebGLRenderingContext | WebGL2RenderingContext, index: number): void {
    if (index >= 0 && index < this.layout.length) {
      this.setAttribPointer(gl, index);
      gl.enableVertexAttribArray(index);
    }
  }

  activateAllAttribPointers(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.setAllAttribPointers(gl);

    for (let i = 0; i < this.layout.length; i++) {
      gl.enableVertexAttribArray(i);
    }
  }

  setData(gl: WebGLRenderingContext | WebGL2RenderingContext, data: BufferSource): void {
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }

  dispose(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    gl.deleteBuffer(this.vbo);
  }

  private setAttribPointer(gl: WebGLRenderingContext | WebGL2RenderingContext, index: number): void {
    if (index >= 0 && index < this.layout.length) {
      const layoutItem = this.layout[index];
      gl.vertexAttribPointer(index, layoutItem.componentsCount, layoutItem.type, false, this.stride, layoutItem.offset);
    }
  }

  private setAllAttribPointers(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    for (let i = 0; i < this.layout.length; i++) {
      const layoutItem = this.layout[i];
      gl.vertexAttribPointer(i, layoutItem.componentsCount, layoutItem.type, false, this.stride, layoutItem.offset);
    }
  }
}
