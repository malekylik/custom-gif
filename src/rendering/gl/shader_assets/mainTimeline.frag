#version 300 es

precision mediump float;

uniform sampler2D targetTexture1;
uniform sampler2D targetTexture2;
uniform sampler2D targetTexture3;
uniform sampler2D targetTexture4;

in vec2 texCoord;
in float colorEnable;

out vec4 fragColor;

void main()
{
  fragColor = vec4(0.0, 0.0, 0.0, 1.0);
  // max(0.0, 1.0 - abs(colorEnable - 1.0) - triangle func will return 1.0 for x in colorEnable - x, and rest is 0.0
  fragColor = fragColor + texture(targetTexture1, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 1.0)));
  fragColor = fragColor + texture(targetTexture2, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 2.0)));
  fragColor = fragColor + texture(targetTexture3, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 3.0)));
  fragColor = fragColor + texture(targetTexture4, texCoord) * (max(0.0, 1.0 - abs(colorEnable - 4.0)));
}
