uniform float time;
uniform float waveLength;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float ratio;
varying vec2 vUv;
varying vec4 vPosition;
void main() {
  vUv = uv;


  lowp float vWave = sin( time/4.+ (position.x + position.y)*waveLength);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + mouse.y*0.02 ,position.y + mouse.x*0.02,vWave*0.04, 1.0 );
}