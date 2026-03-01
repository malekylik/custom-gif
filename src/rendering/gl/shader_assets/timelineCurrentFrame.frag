#version 300 es

precision mediump float;

uniform float ratio;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  if (
    texCoord.x < (0.05 * ratio) ||
    texCoord.x > 1.0 - (0.05 * ratio) ||
    texCoord.y < 0.05 ||
    texCoord.y > 1.0 - 0.05
    ) {
    fragColor = vec4(1.0, 0.0, 0.0, 0.2);
  } else {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
