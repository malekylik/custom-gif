#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;
in vec2 texMultCoordA;
in vec2 texMultCoordGB;

out vec4 fragColor;

void main()
{
  fragColor = texture(targetTexture, texCoord) * 7.0;
  fragColor = mix(fragColor, vec4(texture(targetTexture, texMultCoordA).r, 0.0, 0.0, 1.0) * 2.0, 0.7);
  fragColor = mix(fragColor, vec4(0.0, texture(targetTexture, texMultCoordGB).g, texture(targetTexture, texMultCoordGB).b, 1.0) * 1.5, 0.5);
}
