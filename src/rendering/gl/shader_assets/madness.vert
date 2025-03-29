#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

out vec2 texCoord;
out vec2 texMultCoordA;
out vec2 texMultCoordGB;

void main()
{
  gl_Position = vPosition;
  texCoord = aTexCoord;
  texMultCoordA = vec2(aTexCoord.x * (1.0 / 1.1), aTexCoord.y * (1.0 / 1.1));
  texMultCoordGB = vec2(aTexCoord.x * (1.0 / 1.05) + 0.08, aTexCoord.y * (1.0 / 1.05));
}
