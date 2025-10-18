#version 300 es

precision mediump float;

uniform sampler2D targetTexture;
uniform float animationProgress;
uniform float direction;
uniform vec3 color;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  vec4 tex = texture(targetTexture, texCoord);
  float normilizedAnimationProgress = abs(direction - clamp(animationProgress, 0.0, 1.0));
  vec3 _color = mix(vec3(tex.rgb), color, animationProgress);
  fragColor = vec4(_color, tex.a);
}
