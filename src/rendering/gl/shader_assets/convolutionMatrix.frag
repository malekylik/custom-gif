#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

uniform float kernel[9];
uniform float kernelWeight;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec2 onePixel = vec2(1) / vec2(textureSize(targetTexture, 0));

  vec4 colorSum =
      texture(targetTexture, texCoord + onePixel * vec2(-1, -1)) * kernel[0] +
      texture(targetTexture, texCoord + onePixel * vec2( 0, -1)) * kernel[1] +
      texture(targetTexture, texCoord + onePixel * vec2( 1, -1)) * kernel[2] +
      texture(targetTexture, texCoord + onePixel * vec2(-1,  0)) * kernel[3] +
      texture(targetTexture, texCoord + onePixel * vec2( 0,  0)) * kernel[4] +
      texture(targetTexture, texCoord + onePixel * vec2( 1,  0)) * kernel[5] +
      texture(targetTexture, texCoord + onePixel * vec2(-1,  1)) * kernel[6] +
      texture(targetTexture, texCoord + onePixel * vec2( 0,  1)) * kernel[7] +
      texture(targetTexture, texCoord + onePixel * vec2( 1,  1)) * kernel[8];

  fragColor = vec4((colorSum / kernelWeight).rgb, 1.0);
}
