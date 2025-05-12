import { AttribType } from '../gl/gl_api/vbo';

/**
 * Let's assume that all shaders invert the image (it may not be the case when the shader address it specificaly, but we assume we don't have such shaders)
 * Drawing to the screen also flips the image
 * The first render won't be flip the the image
 * So 2, 4 and every even number are inverted and can be safely rendered
 * But for odd number the image should be fliped first
 */

export const VERTEX_COMPONENTS_COUNT = 3;
export const TEX_CORD_COMPONENTS_COUNT = 2;
export const TOTAL_COMPONENTS_COUNT = VERTEX_COMPONENTS_COUNT + TEX_CORD_COMPONENTS_COUNT;

export const VBO_LAYOUT = [
  { type: AttribType.FLOAT, componentsCount: VERTEX_COMPONENTS_COUNT },
  { type: AttribType.FLOAT, componentsCount: TEX_CORD_COMPONENTS_COUNT },
];

// Texture Coordinates V	Effect
// 0.0 → 1.0	normal mapping (bottom → top)
// 1.0 → 0.0	vertically flipped image

// Flips
export const QUAD_WITH_TEXTURE_COORD_DATA_INVERTED = Float32Array.from([
  // first triangle
  -1.0, 1.0, 0.0, // top-left v0
  0.0, 1.0, // texCoord v0

  1.0, 1.0, 0.0, // top-right v1
  1.0, 1.0, // texCoord v1

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 0.0, // texCoord v2

  // second triangle
  1.0, 1.0, 0.0, // top-rigth v1
  1.0, 1.0, // texCoord v1

  1.0, -1.0, 0.0, // bottom-right v4
  1.0, 0.0, // texCoord v4

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 0.0, // texCoord v2
]);

// Doesn't Flip
export const QUAD_WITH_TEXTURE_COORD_DATA = Float32Array.from([
  // first triangle
  -1.0, 1.0, 0.0, // top-left v0
  0.0, 0.0, // texCoord v0

  1.0, 1.0, 0.0, // top-right v1
  1.0, 0.0, // texCoord v1

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 1.0, // texCoord v2

  // second triangle
  1.0, 1.0, 0.0, // top-rigth v1
  1.0, 0.0, // texCoord v1

  1.0, -1.0, 0.0, // bottom-right v4
  1.0, 1.0, // texCoord v4

  -1.0, -1.0, 0.0, // bottom-left v2
  0.0, 1.0, // texCoord v2
]);

export const INDECIES_COUNT_NUMBER = QUAD_WITH_TEXTURE_COORD_DATA.length / TOTAL_COMPONENTS_COUNT;
