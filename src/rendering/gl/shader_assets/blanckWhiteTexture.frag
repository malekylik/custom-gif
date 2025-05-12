#version 300 es

precision mediump float;

uniform sampler2D targetTexture;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 tex = texture(targetTexture, texCoord);
  float color = (tex.r + tex.g + tex.b) / 3.0;
  fragColor = vec4(vec3(color), tex.a);
}
