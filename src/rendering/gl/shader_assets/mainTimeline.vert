#version 300 es

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec2 aTexCoord;

uniform float totalWidth;
uniform float timelineFrameWidth;
uniform float offset;

out vec2 texCoord;
out float colorEnable;

void main()
{

  // 0          1, 3
  // -----------
  // |         |
  // |         |
  // -----------
  // 2, 4       5

  // x coord - mod(squarVertextId, 2.0), either 0.0 or 1.0
  // y coord, should be 0.0 for 0, 1, 3 and 1.0 for 2, 4, 5
  // 1.0 - abs(squarVertextId - 2.0)) gives 1.0 for index 2
  // clamp(squarVertextId - 3.0, 0.0, 1.0) - gives 1.0 for indices 4 and 5


  float squarVertextId = mod(float(gl_VertexID), 6.0);
  float squarId = floor(float(gl_VertexID) / 6.0);
  float squarSize = timelineFrameWidth / totalWidth;

  float y = max(0.0, 1.0 - abs(squarVertextId - 2.0)) + clamp(squarVertextId - 3.0, 0.0, 1.0);
  float texX = mod(squarVertextId, 2.0);
  float frameCount = 4.0;
  float spaceBetweenSquars = offset;
  float x = texX * squarSize + (squarSize * spaceBetweenSquars) * squarId;

  gl_Position = vec4(mix(-1.0, 1.0, x), mix(-1.0, 1.0, y), 0.0, 1.0);

  texCoord = vec2(texX, y);
  colorEnable = squarId + 1.0;
}
