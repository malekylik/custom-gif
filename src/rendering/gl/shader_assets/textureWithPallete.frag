#version 300 es

precision mediump float;

uniform sampler2D ColorTable;     //256 x 1 pixels
uniform sampler2D MyIndexTexture;
uniform float colorTableSize;
uniform float transperancyIndex;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 myindex = texture(MyIndexTexture, texCoord);
  float maxCodeValue = colorTableSize - 1.0;
  float normilaziedTransperancyIndex = round(transperancyIndex / maxCodeValue);

  float normilaziedX = (myindex.x * 255.0) / colorTableSize;
  vec4 texel = texture(ColorTable, vec2(normilaziedX, myindex.y));

  // TODO: check for better the best way with performance
  float alpha = 1.0 - step(transperancyIndex, round(myindex.x * 255.0)) + step(transperancyIndex + 1.0, round(myindex.x * 255.0));

  fragColor = vec4(texel.rgb, alpha);   //Output the color
}
