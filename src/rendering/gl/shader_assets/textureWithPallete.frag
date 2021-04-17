#version 300 es

precision mediump float;

uniform sampler2D ColorTableTexture;     //256 x 1 pixels
uniform sampler2D IndexTexture;
uniform sampler2D alphaTexture;
uniform float ColorTableSize;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 myindex = texture(IndexTexture, texCoord);

  float normilaziedX = (myindex.x * 255.0) / ColorTableSize;
  vec4 texel = texture(ColorTableTexture, vec2(normilaziedX, myindex.y));
  float alpha = texture(alphaTexture, vec2(texCoord.x, 1.0 - texCoord.y)).r;

  // fragColor = vec4(alpha, 0.0, 0.0, 1.0);   //Output the color
  fragColor = vec4(texel.rgb, alpha);   //Output the color
}
