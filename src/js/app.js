import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';



let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2;
let destination = {x:0,y:0};
let textures = [];

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  controls = new OrbitControls(camera, renderer.domElement);

  textures = [
    THREE.ImageUtils.loadTexture( 'img/img1.jpg' ),
    THREE.ImageUtils.loadTexture( 'img/img2.jpg' ),
    THREE.ImageUtils.loadTexture( 'img/img3.jpg' ),
    THREE.ImageUtils.loadTexture( 'img/img4.jpg' ),
  ];


  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      ratio: { type: 'f', value: 1 },
      waveLength: { type: 'f', value: 3 },
      mouse: { type: 'v2', value: new THREE.Vector2() },
      resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight) },
      img1: { type: 't', value: textures[0] }
    },
    // wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 64, 64 ),material);
  scene.add(plane);

  resize();

 
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;

  // calculate scene
  let dist  = camera.position.z - plane.position.z;
  let height = 1;
  camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

  if(w/h>1) {
    plane.scale.x = plane.scale.y = 1.05*w/h;
  }



  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  material.uniforms.mouse.value.x += (destination.x - material.uniforms.mouse.value.x)*0.05;
  material.uniforms.mouse.value.y += (destination.y - material.uniforms.mouse.value.y)*0.05;

  renderer.render(scene, camera);
}

let ww = window.innerWidth;
let wh = window.innerHeight;

function onMousemove(e) {
  var x = (e.clientX-ww/2)/(ww/2);
  var y = (e.clientY-wh/2)/(wh/2);
  destination.x = y;
  destination.y = x;
}
window.addEventListener('mousemove', onMousemove);



init();
animate();


let counter = 0;
let animating = 0;
$('body').on('click',function() {
  if(animating) return;
  animating = 1;
  counter = (counter +1) % textures.length;
  let tl = new TimelineMax({onComplete:function() {animating = 0;}});
  tl
    .to(material.uniforms.waveLength,0.5,{value: 22})
    .to(material.uniforms.ratio,0.5,{value: 0, onComplete: function() {
      material.uniforms.img1.value = textures[counter];
    }},0)
    .to(material.uniforms.ratio,0.5,{value: 1})
    .to(material.uniforms.waveLength,0.5,{value: 3},0.5);
});


