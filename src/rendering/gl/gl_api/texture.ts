export enum TextureFiltering {
  NEAREST,
  LINEAR,
}

export enum TextureFormat {
  RGB,
  RGBA,
  R8,
  RED,
}

export enum TextureType {
  UNSIGNED_BYTE,
}

export enum TextureUnit {
  TEXTURE0 = 0,
  TEXTURE1,
  TEXTURE2,
}

function convertToGLTextureFiltering(gl: WebGLRenderingContext | WebGL2RenderingContext, filering: TextureFiltering): number {
  switch (filering) {
    case TextureFiltering.NEAREST: return gl.NEAREST;
    case TextureFiltering.LINEAR: return gl.LINEAR;
  }

  return 0;
}

function convertToGLTextureFormat(gl: WebGL2RenderingContext, format: TextureFormat): number {
  switch (format) {
    case TextureFormat.R8: return gl.R8;
    case TextureFormat.RED: return gl.RED;
    case TextureFormat.RGB: return gl.RGB;
    case TextureFormat.RGBA: return gl.RGBA;
  }

  return 0;
}

function convertToGLTextureType(gl: WebGLRenderingContext | WebGL2RenderingContext, format: TextureType): number {
  switch (format) {
    case TextureType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
  }

  return 0;
}

function convertToGLTextureUnit(gl: WebGLRenderingContext | WebGL2RenderingContext, index: TextureUnit): number {
  return gl.TEXTURE0 + index;
}

const DefaultFiltering = {
  min: TextureFiltering.NEAREST,
  mag: TextureFiltering.NEAREST,
};

const DefaultImageFormat = {
  internalFormat: TextureFormat.RGB,
  format: TextureFormat.RGB,
  type: TextureType.UNSIGNED_BYTE,
}

interface TextureConfig {
  filtering?: { min: TextureFiltering, mag: TextureFiltering },
  imageFormat?: { internalFormat: TextureFormat; format: TextureFormat; type: TextureType; }
}

const DefaultOptions: TextureConfig = {
  filtering: DefaultFiltering,
  imageFormat: DefaultImageFormat,
}

export interface IGLTexture {
  getWidth(): number;
  getHeight(): number;

  bind(gl: WebGLRenderingContext | WebGL2RenderingContext): void;
  // TODO: should be part of gl program ?
  activeTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, textureUnit?: number): void;
  
  getGLTexture(): WebGLTexture;

  dispose(gl: WebGLRenderingContext | WebGL2RenderingContext): void;
}

export class GLTexture implements IGLTexture {
  private config: TextureConfig;
  private texture: WebGLTexture;
  private textureUnit: TextureUnit;
  private prevDataPointer: ArrayBufferView;

  private width: number;
  private height: number;

  constructor(gl: WebGL2RenderingContext, width: number, height: number, data: ArrayBufferView | null, config = DefaultOptions) {
    this.width = width;
    this.height = height;

    this.texture = gl.createTexture();
    this.textureUnit = TextureUnit.TEXTURE0;
    const filtering = config?.filtering ?? DefaultFiltering;
    const imageFormat = config?.imageFormat ?? DefaultImageFormat;
    this.config = { filtering, imageFormat };

    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, convertToGLTextureFiltering(gl, filtering.min));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, convertToGLTextureFiltering(gl, filtering.mag));

    gl.texImage2D(gl.TEXTURE_2D, 0, convertToGLTextureFormat(gl, imageFormat.internalFormat), width, height, 0, convertToGLTextureFormat(gl, imageFormat.format), convertToGLTextureType(gl, imageFormat.type), data);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  bind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  setTextureWrap(gl: WebGLRenderingContext | WebGL2RenderingContext, axis: WebGLRenderingContextBase["TEXTURE_WRAP_S"] | WebGLRenderingContextBase["TEXTURE_WRAP_T"], mode: WebGLRenderingContextBase['REPEAT'] | WebGLRenderingContextBase['CLAMP_TO_EDGE'] | WebGLRenderingContextBase['MIRRORED_REPEAT']): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, axis, mode);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  setTextureFilter(gl: WebGLRenderingContext | WebGL2RenderingContext, filter: WebGLRenderingContextBase["TEXTURE_MIN_FILTER"] | WebGLRenderingContextBase["TEXTURE_MAG_FILTER"], mode: WebGLRenderingContextBase['NEAREST'] | WebGLRenderingContextBase['LINEAR']): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, filter, mode);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  getTextureUnit(): number {
    return this.textureUnit;
  }

  setTextureUnit(index: number): void {
    this.textureUnit = index;
  }

  setData(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number, data: ArrayBufferView | null): void {
    const imageFormat = this.config.imageFormat;

    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, convertToGLTextureFormat(gl, imageFormat.format), convertToGLTextureType(gl, imageFormat.type), data);

    this.prevDataPointer = data;
  }

  putData(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number, data: ArrayBufferView | null): void {
    if (this.prevDataPointer !== data) {
      const imageFormat = this.config.imageFormat;

      gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, convertToGLTextureFormat(gl, imageFormat.format), convertToGLTextureType(gl, imageFormat.type), data);

      this.prevDataPointer = data;
    }
  }

  getGLTexture(): WebGLTexture {
    return this.texture;
  }

  activeTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, texture?: number): void {
    gl.activeTexture(convertToGLTextureUnit(gl, texture !== undefined ? texture : this.textureUnit));
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  dispose(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    gl.deleteTexture(this.texture);
  }
}

export class NoopGLTexture implements IGLTexture {
  bind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    console.warn('A noop texture was tried to bind');
    console.trace();
  }

  getGLTexture(): WebGLTexture {
    return null;
  }

  activeTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, texture?: number): void {
  }

  getWidth(): number {
    return -1;
  }

  getHeight(): number {
    return -1;
  }

  dispose() {
  }
}
