import { ColorMap } from 'src/parsing/gif/color_map';
import { QUAD_WITH_TEXTURE_COORD_DATA, VBO_LAYOUT } from '../consts/consts';
import { GLProgram } from '../gl/gl_api/program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from '../gl/gl_api/shader';
import { GLTexture, TextureUnit } from '../gl/gl_api/texture';
import { GLVBO } from '../gl/gl_api/vbo';
import { GrapgicMemory } from '../gl/render_algorithm/graphic_memory';

import MainVertText from '../shader_assets/main.vert';
import TextureFragText from '../shader_assets/texture.frag';

export class ColorMapVisualizer {
  private gl: WebGL2RenderingContext;
  private screenWidth: number;
  private screenHeight: number;
  private vboToTexture: GLVBO;
  private outTexture: GLTexture;
  private program: GLProgram;

  constructor (canvas: HTMLCanvasElement, screenWidth: number, screenHeight: number, entriesCount: number) {
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;

    const gl = canvas.getContext('webgl2');
    this.gl = gl;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.viewport(0, 0, screenWidth, screenHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const vertShader = createVertexGLShader(gl, MainVertText);
    const fragShader = createFragmentGLShader(gl, TextureFragText);

    const program = new GLProgram(gl, vertShader, fragShader);
    this.program = program;

    deleteShader(gl, vertShader);
    deleteShader(gl, fragShader);

    this.outTexture = new GLTexture(gl, entriesCount, 1, null);

    this.outTexture.setTextureUnit(TextureUnit.TEXTURE0);

    this.vboToTexture = new GLVBO(gl, VBO_LAYOUT);
    this.vboToTexture.bind(gl);
    this.vboToTexture.setData(gl, QUAD_WITH_TEXTURE_COORD_DATA);
    this.vboToTexture.activateAllAttribPointers(gl);

    program.useProgram(gl);

    program.setTextureUniform(gl, 'outTexture', this.outTexture);
  }

  drawToScreen(colorMap: ColorMap): void {
    const gl = this.gl;

    this.outTexture.bind(gl);
    this.outTexture.putData(gl, 0, 0, colorMap.entriesCount, 1, colorMap.getRawData());

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, QUAD_WITH_TEXTURE_COORD_DATA.length);
  }
}

export function renderColorMap(colorMap: ColorMap, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  const screenWidth = colorMap.entriesCount;
  const screenHeight = 250;
  const memory = new GrapgicMemory(screenWidth, screenHeight);

  canvas.width = screenWidth;
  canvas.height = screenHeight;
  canvas.style.width = `${screenWidth}px`;
  canvas.style.height = `${screenHeight}px`;

  for (let j = 0; j < screenHeight; j++) {
    for (let i = 0; i < screenWidth; i++) {
      memory.setRedInPixel(i, j, colorMap.getRed(i));
      memory.setGreenInPixel(i, j, colorMap.getGreen(i));
      memory.setBlueInPixel(i, j, colorMap.getBlue(i));
      memory.setAlphaInPixel(i, j, 255);
    }
  }

  ctx.putImageData(memory.getRawMemory(), 0, 0);
}
