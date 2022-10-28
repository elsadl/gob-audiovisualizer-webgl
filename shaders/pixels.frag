precision highp float;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float map(float value, float min1, float max1, float min2, float max2) {
  float result = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  if (result < min2) {
    return min2;
  }
  if (result > max2) {
    return max2;
  }
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// perlin noise
vec4 ppermute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 ptaylorInvSqrt(vec4 r){return 1.79 - 0.85 * r;}
vec3 pfade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

// Classic Perlin noise
float pnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = ppermute(ppermute(ix) + iy);
  vec4 ixy0 = ppermute(ixy + iz0);
  vec4 ixy1 = ppermute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = ptaylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = ptaylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = pfade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

vec3 pnoiseVec3(vec3 x) {
  float xx = x.x;
  float yy = x.y;
  float zz = x.z;
  return vec3(  pnoise(vec3( xx, x.y, x.z ) * 2. -1. ),
								pnoise(vec3( yy - 19.1 , zz + 33.4 , x.x + 47.2 ) * 2. -1. ),
								pnoise(vec3( zz + 74.2 , xx - 124.5 , yy + 99.4 ) * 2. -1. ) );
}

vec3 getPerlinTurbulence( vec2 position, float scale, float strength, float time ) {
  vec3 perlin = pnoiseVec3( vec3( position.xy, time ) * scale );
  perlin *= strength;
  return perlin;
}
// fin perlin noise

float circle(vec2 _st, float _radius, float _smoothness){
    vec2 dist = _st-vec2(0.5);
	return smoothstep(_radius-(_radius*_smoothness),
                         _radius+(_radius*_smoothness),
                         dot(dist,dist)*4.0);
}

uniform vec2 uResolution;
uniform float uTime;
uniform float uTempo;
uniform float uRandom;
uniform float uLevel;
uniform sampler2D uTexture;
uniform float uBlue;

uniform float uBass;
uniform float uLowMid;
uniform float uMid;
uniform float uHighMid;
uniform float uTreble;

varying vec2 vTexCoord;
vec3 color = vec3(30./255.);

void main () {
  vec2 coord = vTexCoord;

  coord.x *= 2.;
  coord *= (1., 10.);

  float grainNoise = pnoise(vec3(random(coord + uTime), 1., 1.));
  float positionNoise = pnoise(vec3(random(coord), uTime / 200., 1.)) * 10.;

  vec2 pixel = floor(coord);
  vec2 pixel2 = floor(coord + 0.1);

  float mid = map(uMid, 0., 300., 0.5, 1.);
  float bass = map(uBass, 0., 200., .8, 0.);

  vec3 mask = vec3(255./255., 40./255., 140./255.);
  vec3 mask2 = vec3(255./255., 255./255., 140./255.);

  mask2.g += 1.;

  mask.r -= .2 * uBlue;
  mask.g += .1 * uBlue;
  mask.b += .6 * uBlue;

  float noise = pnoise(vec3(random(pixel), uTime * 0.05, .8));
  float noise2 = pnoise(vec3(random(pixel2), uTime * 0.05, .8));

  mask.g -= coord.y/10. * sin(coord.x/10. + uTime * 0.005) * .2;

  float grain = random(coord + uTime) * 0.1;
  mask -= grain;

  if (bass > 0.) {
    mask *= step(0.5, noise + bass);
    mask2 *= step(0.5, noise2 + bass);
  }

  mask2 += grain * 10. * mask;

  mask = mix(mask, mask2, 0.2);

  color += mask;

  gl_FragColor = vec4(color, 1.);
}