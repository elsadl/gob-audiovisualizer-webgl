precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;  // cpu/p5 to vert file

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord; // to move texcoords from vert to frag shader

void main() {
    vTexCoord = aTexCoord;

  vec4 pos = vec4(aPosition, 1.0);
  pos.xy = pos.xy * 2. - 1.;

  gl_Position = pos;
}