import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )



  sceneInit();
  animate();

  function sceneInit(){
    
    camera.position.y = 200;
    
      scene.background = new THREE.Color(0xaaccff);
      scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
  
      const geometry = new THREE.PlaneGeometry(20000, 2000);
      geometry.rotateX(-Math.PI/2);
    
      const texture = new THREE.TextureLoader().load('textures/water.jpg');
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3);
    
    
      const material = new THREE.MeshBasicMaterial({ color: 0x0044ff, map: texture });
    
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

