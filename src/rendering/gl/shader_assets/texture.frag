#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = texture(targetTexture, texCoord);
}
