#version 300 es

precision mediump float;

uniform sampler2D backgroundTexture;
uniform sampler2D foregroundTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  fragColor = mix(texture(backgroundTexture, texCoord), texture(foregroundTexture, texCoord), texture(backgroundTexture, texCoord).a);
}
