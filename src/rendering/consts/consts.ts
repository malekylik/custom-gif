import { AttribType } from '../gl/shader/vbo';

export const VERTEX_COMPONENTS_COUNT = 3;
export const TEX_CORD_COMPONENTS_COUNT = 2;

export const VBO_LAYOUT = [
  { type: AttribType.FLOAT, componentsCount: VERTEX_COMPONENTS_COUNT },
  { type: AttribType.FLOAT, componentsCount: TEX_CORD_COMPONENTS_COUNT },
];

export const triangle = Float32Array.from([
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
