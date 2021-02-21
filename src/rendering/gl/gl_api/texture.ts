export enum TextureFiltering {
  NEAREST,
  LINEAR,
}

export enum TextureFormat {
  RGB,
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

export class GLTexture {
  private config: TextureConfig;
  private texture: WebGLTexture;
  private textureUnit: TextureUnit;
  private prevDataPointer: ArrayBufferView;

  constructor(gl: WebGL2RenderingContext, width: number, height: number, data: ArrayBufferView | null, config = DefaultOptions) {
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

  activeTexture(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    gl.activeTexture(convertToGLTextureUnit(gl, this.textureUnit));
  }
}
