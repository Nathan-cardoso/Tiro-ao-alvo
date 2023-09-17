import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let velocidade = 0;
let angulo = 0;
let anguloCanhaoLateral = 0;
let anguloCanhaoVertical = 0;
let velocidadeAngular = 0;
let velocidadeVertical = 0;
let modoCanhao = 1;
let modelBaseCanhao = 0;
let modelCanhao = 0;
let modelNavio = 0;
let velocidadeCanhaoLateral = 0
let velocidadeCanhaoVertical = 0

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0xffffff ); 
scene.add(light)

const loader = new GLTFLoader();

loader.load( 'models/going_merry.glb', function ( gltf ) {

    modelNavio = gltf.scene;
    const scale = 1.2;
    modelNavio.scale.set(scale, scale, scale);
	scene.add( modelNavio );

}, undefined, function ( error ) {

	console.error( error );

} );
console.log(loader);

loader.load( 'models/base-canhao.glb', function ( gltf ) {

    modelBaseCanhao = gltf.scene;
    const scale = 0.0015;
    modelBaseCanhao.scale.set(scale, scale, scale);
    modelBaseCanhao.position.y = 1.06
    modelBaseCanhao.position.z = -0.77
    modelBaseCanhao.position.x = -0.35
	scene.add( modelBaseCanhao );

}, undefined, function ( error ) {

	console.error( error );

} );
console.log(loader);

loader.load( 'models/canhao.glb', function ( gltf ) {

    modelCanhao = gltf.scene;
    const scale = 0.0015;
    modelCanhao.scale.set(scale, scale, scale);
    modelCanhao.position.y = 1.06
    modelCanhao.position.z = -0.77
    modelCanhao.position.x = -0.35
	scene.add( modelCanhao );

}, undefined, function ( error ) {

	console.error( error );

} );
console.log(loader);

camera.position.y = 1.4
camera.position.z = -0.65
camera.position.x = -0.36

function animate() {
	requestAnimationFrame( animate );

    //Ângulos que são utilizados
    angulo += velocidadeAngular
    anguloCanhaoLateral += velocidadeCanhaoLateral
    anguloCanhaoVertical += velocidadeCanhaoVertical
    camera.rotation.y = angulo

    console.log(anguloCanhaoLateral)
    console.log(anguloCanhaoVertical)

    //Ajustando a mira do canhão lateralmente
    modelCanhao.position.x += 0 * -Math.sin(anguloCanhaoLateral)
    modelCanhao.position.z += 0 * -Math.cos(anguloCanhaoLateral)
    modelCanhao.rotation.y += velocidadeCanhaoLateral

    //Ajustando a mira do canhão verticalmente
    modelCanhao.position.y += 0 * -Math.sin(anguloCanhaoVertical)
    modelCanhao.position.z += 0 * -Math.cos(anguloCanhaoVertical)
    modelCanhao.rotation.x += velocidadeCanhaoVertical

    //Ajustando base do canhão lateralmente
    modelBaseCanhao.position.x += 0 * -Math.sin(anguloCanhaoLateral)
    modelBaseCanhao.position.z += 0 * -Math.cos(anguloCanhaoLateral)
    modelBaseCanhao.rotation.y += velocidadeCanhaoLateral

    //Comandos para ser possível se mover pelo mapa
    camera.position.z += velocidade * -Math.cos(angulo)
    camera.position.x += velocidade * -Math.sin(angulo)
    camera.position.y += velocidadeVertical

	renderer.render( scene, camera );
}

document.onkeydown = function(e) {

    console.log(e)

    if (modoCanhao == -1) {
        if(e.key == "ArrowUp") {    
            velocidade = 0.1
        }
    
        if(e.key == "ArrowDown") {
            velocidade = -0.1
        }
    
        if(e.key == "ArrowLeft") {
            velocidadeAngular = 0.05;
        }
    
        if(e.key == "ArrowRight") {
            velocidadeAngular = -0.05;
        }
        
        if (e.key == 'w') {
            velocidadeVertical = 0.05
        }
    
        if (e.key == 's') {
            velocidadeVertical = -0.05
        }
    } else{
        if(e.key == "ArrowUp") {
            velocidadeCanhaoVertical = -0.01
        }
    
        if(e.key == "ArrowDown") {
            velocidadeCanhaoVertical = 0.01
        }
    
        if(e.key == "ArrowLeft") {
            velocidadeCanhaoLateral = 0.01;
        }
    
        if(e.key == "ArrowRight") {
            velocidadeCanhaoLateral = -0.01;
        }

        camera.position.y = 1.4
        camera.position.z = -0.65
        camera.position.x = -0.36
    }

    if (e.key == ' ') {
        modoCanhao = -modoCanhao
    }

}

document.onkeyup = function(e) {
	if(e.key == "ArrowUp") {
		velocidade = 0
        velocidadeCanhaoVertical = 0
	}

	if(e.key == "ArrowDown") {
        velocidade = 0
        velocidadeCanhaoVertical = 0
	}

	if(e.key == "ArrowLeft") {
		velocidadeAngular = 0.0;
        velocidadeCanhaoLateral = 0
	}

	if(e.key == "ArrowRight") {
		velocidadeAngular = 0.0;
        velocidadeCanhaoLateral = 0
	}

    if (e.key == 'w') {
        velocidadeVertical = 0
    }

    if (e.key == 's') {
        velocidadeVertical = 0
    }
}

animate();