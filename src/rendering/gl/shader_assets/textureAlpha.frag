#version 300 es

precision mediump float;

uniform sampler2D IndexTexture;

uniform float TransperancyIndex;
uniform float ScreenHeight;
uniform vec4 Rect;

in vec2 texCoord;

out vec4 fragColor;

void main()
{
  float imageLeft = Rect.x;
  float imageTop = Rect.y;
  float width = Rect.z;
  float hieght = Rect.w;
  float x = gl_FragCoord.x;
  float y = ScreenHeight - gl_FragCoord.y;

  vec4 myindex = texture(IndexTexture, texCoord);

  float alpha = step(imageLeft, x) - (2.0 * step(imageLeft + width, x)) + step(imageTop, y) - (2.0 * step(imageTop + hieght, y)) - (1.0 - (step(imageLeft, x)))- (1.0 - (step(imageTop, y)));
  // TODO: check for better the best way with performance
  alpha = alpha * (1.0 - (step(TransperancyIndex, myindex.x * 255.0) - step(TransperancyIndex + 1.0, myindex.x * 255.0)));

  fragColor = vec4(alpha, 0.0, 0.0, 1.0);   //Output the color
}
