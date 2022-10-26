
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;


void main (void) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    
    float noise = sin(st.y * 10. + time) / sin(st.y*100.+time * 20.);
    noise = step(noise, .5);
  
    //vec3 color = vec3(noise);
    vec3 color = vec3(.4, 0., 1.);
  
    gl_FragColor = vec4(color, 1.);
}
