#version 300 es

precision mediump float;

uniform sampler2D targetTexture;
uniform float animationProgress;
uniform float direction;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 tex = texture(targetTexture, texCoord);
  float normilizedAnimationProgress = abs(direction - clamp(animationProgress, 0.0, 1.0));
  vec3 color = vec3(tex.rgb) * normilizedAnimationProgress;
  fragColor = vec4(color, tex.a);
}
