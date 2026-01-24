#version 300 es

precision mediump float;

in vec2 texCoord;
in float colorEnable;

out vec4 fragColor;

void main()
{
  if (
    texCoord.x < 0.05 ||
    texCoord.x > 0.95 ||
    texCoord.y < 0.05 ||
    texCoord.y > 0.95
    ) {
    fragColor = vec4(1.0, 0.0, 0.0, 0.2);
  } else {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
