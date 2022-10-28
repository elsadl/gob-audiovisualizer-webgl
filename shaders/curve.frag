precision highp float;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float map (float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

uniform float uTime;
uniform float uLevel;
uniform float uBlue;

uniform float uBass;
uniform float uMid;

varying vec2 vTexCoord;


void main () {
  vec2 coord = vTexCoord;

	vec3 color = vec3(0.3, 0.5, 0.8);

  float intensity = map(uMid, 0., 200., .0, .2);

  coord.y += sin(coord.x * 20. + uTime * 1.5) * 0.15 * intensity;

  float lineWidth = 0.01;

  if (uLevel > 0.) {
    lineWidth = 0.2 * (coord.x * 8. + 1.) * intensity;
  }

  float glitchOffset = map(uBass, 100., 400., 0.01, 0.04);
  float smoothness = 0.02;
  
  float mask0 = smoothstep(0.5 - lineWidth, 0.5 + smoothness * .5 - lineWidth, coord.y);
  float mask1 = smoothstep(0.5 - lineWidth, (0.5 + glitchOffset + smoothness) - lineWidth, coord.y);
  float mask2 = 1. - smoothstep(0.5 + lineWidth, (0.5 + smoothness) + lineWidth, coord.y);

  float mask = mask1 * mask2;

  float noiseValue = random(coord * sin(uTime) * 2.) * 0.5;

  color.r = 1. + coord.x;
  color.g += .55 * coord.x;

  color.g -= noiseValue * (1. - coord.x);
  color.b -= noiseValue * (1. - coord.x);

  color *= mask;

  float glitchIntensity = map(uBass, 100., 300., 0., 2.);

  color.r += (mask0 - mask1) * 0.25 * glitchIntensity;
  color.b += (mask0 - mask1) * 0.25 * glitchIntensity;
  color.g += (mask0 - mask1) * 2. * glitchIntensity; 

  color.r += (mask0 - mask1) * .8 * glitchIntensity * uBlue;
  color.b += (mask0 - mask1) * 1. * glitchIntensity * uBlue;
  color.g -= (mask0 - mask1) * 2. * glitchIntensity * uBlue;

  color += (1. - mask) * 30./255.;

  color.r -= (mask) * (1.2 * uBlue);
  color.g += (mask) * (.1 * uBlue);
  color.b += (mask) * (.2 * uBlue);

  gl_FragColor = vec4(color, 1.);
}