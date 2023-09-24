import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 7000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let velY = 0
let velX = 0


  sceneInit();
  animate();

  function sceneInit(){
    const geometry = new THREE.BoxGeometry( 500, 500, 500);
    const material = [];

    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_ft.jpg')}));
    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_bk.jpg')}));
    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_up.jpg')}));
    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_dn.jpg')}));
    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_rt.jpg')}));
    material.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('textures/tears_lf.jpg')}));

    for(let i = 0; i < 6; i++){
      material[i].side = THREE.BackSide;
    }
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    }

function animate() {

  camera.rotation.y += velY;
  //camera.rotation.x += velX;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
document.onkeydown = function(e){
  console.log(e);
  if (e.key == "ArrowUp") {
      velY = 0.05;
  }
  else if (e.key == "ArrowDown") {
      velY = -0.05;
  }
  else if (e.key == "ArrowRight") {
      velX = 0.05;
  }
  else if (e.key == "ArrowLeft") {
      velX = -0.05;
  } 
}

document.onkeyup = function(e){
  console.log(e);
  if (e.key == "ArrowUp") {
      velY = 0;
  }
  else if (e.key == "ArrowDown") {
      velY = 0;
  }
  else if (e.key == "ArrowRight") {
      velX = 0;
  }
  else if (e.key == "ArrowLeft") {
      velX = 0;
  }
}

