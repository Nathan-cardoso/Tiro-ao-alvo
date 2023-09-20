import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let velocidade = 0;
let angulo = 0;
let anguloCanhaoLateral = 0;
let anguloCanhaoVertical = 0;
let velocidadeAngular = 0;
let velocidadeVertical = 0;
let velocidadeBalaX = 0;
let velocidadeBalaY = 0;
let velocidadeBalaZ = 0;
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


const geometry = new THREE.SphereGeometry( 0.03, 10, 10 );
const material = new THREE.MeshStandardMaterial ( { color: 0x00ffff} );
const bala = new THREE.Mesh( geometry, material );
scene.add( bala );
bala.position.y = 1.24
bala.position.z = -0.77
bala.position.x = -0.35

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
    const scale = 0.0017;
    modelBaseCanhao.scale.set(scale, scale, scale);
    modelBaseCanhao.position.y = 1.06
    modelBaseCanhao.position.z = -0.75
    modelBaseCanhao.position.x = -0.35
	scene.add( modelBaseCanhao );

}, undefined, function ( error ) {

	console.error( error );

} );
console.log(loader);

loader.load( 'models/canhao.glb', function ( gltf ) {

    modelCanhao = gltf.scene;
    const scale = 0.0017;
    modelCanhao.scale.set(scale, scale, scale);
    modelCanhao.position.y = 1.06
    modelCanhao.position.z = -0.75
    modelCanhao.position.x = -0.35
	scene.add( modelCanhao );

}, undefined, function ( error ) {

	console.error( error );

} );
console.log(loader);

camera.position.y = 1.4
camera.position.z = -0.65
camera.position.x = -0.36

const limiteLateral = 0.5;
const limiteMaxVertical = 0.3;
const limiteMinVertical = 0;

function animate() {
	requestAnimationFrame( animate );

    //Ângulos que são utilizados
    angulo += velocidadeAngular
    anguloCanhaoLateral += velocidadeCanhaoLateral
    anguloCanhaoVertical += velocidadeCanhaoVertical
    camera.rotation.y = angulo

    if (anguloCanhaoLateral > limiteLateral) {
        anguloCanhaoLateral = limiteLateral
    } else if (anguloCanhaoLateral < -limiteLateral) {
        anguloCanhaoLateral = -limiteLateral
    }

    if (anguloCanhaoVertical > limiteMaxVertical) {
        anguloCanhaoVertical = limiteMaxVertical
    } else if (anguloCanhaoVertical < limiteMinVertical) {
        anguloCanhaoVertical = limiteMinVertical
    }

    /*Ajustando a mira do canhão lateralmente
    Cálculo dos ângulos
    Ângulo x: Math.sin(anguloCanhaoLateral)
    Ângulo z: Math.cos(anguloCanhaoLateral)
    */
    modelCanhao.rotation.y = anguloCanhaoLateral

    /*Ajustando a mira do canhão verticalmente
    Cálculo dos ângulos
    Ângulo y: Math.sin(anguloCanhaoVertical)
    Ângulo z: Math.cos(anguloCanhaoVertical)
    */
    modelCanhao.rotation.x = anguloCanhaoVertical

    //Ajustando base do canhão lateralmente
    modelBaseCanhao.rotation.y = anguloCanhaoLateral

    //Comandos para ser possível se mover pelo mapa
    camera.position.z += velocidade * -Math.cos(angulo)
    camera.position.x += velocidade * -Math.sin(angulo)
    camera.position.y += velocidadeVertical

    velocidadeBalaY += -0.0005

    bala.position.x += velocidadeBalaX
    bala.position.y += velocidadeBalaY
    bala.position.z += velocidadeBalaZ

	renderer.render( scene, camera );
}

document.onkeydown = function(e) {

    if (e.key == 'c') {
        modoCanhao = -modoCanhao 
    }

    if (e.key == ' ') {
        bala.position.y = 1.24
        bala.position.z = -0.77
        bala.position.x = -0.35
        velocidadeBalaX = 0.1 * -Math.sin(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
        velocidadeBalaY = 0.1 * (Math.sin(anguloCanhaoVertical) + 0.2);
        velocidadeBalaZ = 0.1 * -Math.cos(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
        console.log(velocidadeBalaX)
        console.log(velocidadeBalaY)
        console.log(velocidadeBalaZ)
        console.log(anguloCanhaoLateral)
        console.log(anguloCanhaoVertical)
    }

    if (modoCanhao == -1) {
        if(e.key == "ArrowUp") {    
            velocidade = 0.05
        }
    
        if(e.key == "ArrowDown") {
            velocidade = -0.05
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