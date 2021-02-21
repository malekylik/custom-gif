#version 300 es

precision mediump float;

uniform sampler2D ColorTableTexture;     //256 x 1 pixels
uniform sampler2D IndexTexture;
uniform float ColorTableSize;
uniform float TransperancyIndex;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 myindex = texture(IndexTexture, texCoord);
  float maxCodeValue = ColorTableSize - 1.0;

  float normilaziedX = (myindex.x * 255.0) / ColorTableSize;
  vec4 texel = texture(ColorTableTexture, vec2(normilaziedX, myindex.y));

  // TODO: check for better the best way with performance
  float alpha = 1.0 - step(TransperancyIndex, round(myindex.x * 255.0)) + step(TransperancyIndex + 1.0, round(myindex.x * 255.0));

  fragColor = vec4(texel.rgb, alpha);   //Output the color
}
