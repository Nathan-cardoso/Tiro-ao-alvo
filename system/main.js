import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

class model3D {
    constructor(name, scale, positionX, positionY, positionZ, light) {
        this.name = name;
        this.scale = scale;
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;
        this.model = null;
        this.caixa = null;
        this.light = light;
        this.spotLight = null
        this.lightHelper
    }

    carregar() {
        const self = this;
        const scale = this.scale;
        const positionX = this.positionX;
        const positionY = this.positionY;
        const positionZ = this.positionZ;
        this.holofote(positionX, positionY, positionZ)
        
        loader.load('models/' + this.name + '.glb', function (gltf) {
            self.model = gltf.scene; 
            self.model.scale.set(scale, scale, scale);
            self.model.position.set(positionX, positionY, positionZ);
            scene.add(self.model);

        }, undefined, function (error) {
            console.error(error);
        });
    }

    rotacionar(rotacaoX, rotacaoY, rotacaoZ) {
        if (this.model) { 
            this.model.rotation.x = rotacaoX;
            this.model.rotation.y = rotacaoY;
            this.model.rotation.z = rotacaoZ;
        }
    }

    posicionar(positionX, positionY, positionZ){
        if (this.model) { 
            this.model.position.x = positionX;
            this.model.position.y = positionY;
            this.model.position.z = positionZ;
            this.spotLight.position.set( positionX, positionY + 2, positionZ);
            this.spotLight.target.position.set(positionX, positionY, positionZ);
            
            this.lightHelper = new THREE.SpotLightHelper( this.spotLight );
        }
    }

    holofote(positionX, positionY, positionZ){
        if (this.light) {
            this.spotLight = new THREE.SpotLight( 0xffffff, 1000 );
            this.spotLight.position.set( positionX, positionY + 2, positionZ);
            this.spotLight.angle = Math.PI / 16;
            this.spotLight.penumbra = 1;
            this.spotLight.decay = 2;
            this.spotLight.distance = 2;
            this.spotLight.target.position.set(positionX, positionY, positionZ);

            this.spotLight.castShadow = true;
            this.spotLight.shadow.mapSize.width = 1024;
            this.spotLight.shadow.mapSize.height = 1024;
            this.spotLight.shadow.camera.near = 1;
            this.spotLight.shadow.camera.far = 10;
            this.spotLight.shadow.focus = 1;
            scene.add( this.spotLight );

            this.lightHelper = new THREE.SpotLightHelper( this.spotLight );
        }
    }

    caixaDelimitadora(largura, altura, profundidade, deslocarX, deslocarY, deslocarZ) {
        if (this.model) {
            const deslocamento = new THREE.Vector3(largura * deslocarX , altura * deslocarY, profundidade * deslocarZ);
            const caixaGeometry = new THREE.BoxGeometry(largura, altura, profundidade);

            caixaGeometry.translate(deslocamento.x, deslocamento.y, deslocamento.z);
    
            const caixaMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe : false});
            const caixaColisao = new THREE.Mesh(caixaGeometry, caixaMaterial);
    
            // Posicione a caixa de colisão onde o modelo 3D estiver posicionado
            caixaColisao.position.copy(this.model.position);
            scene.add(caixaColisao);
            this.caixa = caixaColisao;
            this.caixa.visible = false

            if (this.foiAtingido(largura, altura, profundidade)) {
                this.spotLight.visible = false
                this.model.visible = false
            }
        }
    }
    
    foiAtingido(largura, altura, profundidade){
        if (this.caixa && bala) {
            
            let raio = bala.geometry.parameters.radius

            if ((bala.position.x + raio) < (this.caixa.position.x - largura/2) || (bala.position.x - raio) > (this.caixa.position.x + largura/2)){
                return false
            } else if ((bala.position.y + raio) < (this.caixa.position.y) || (bala.position.y - raio) > (this.caixa.position.y + altura)) {
                return false
            }else if ((bala.position.z + raio) < (this.caixa.position.z - profundidade/2) || (bala.position.z - raio) > (this.caixa.position.z + profundidade/2)) {
                return false
            } else{
                    
                console.log("colisão")
                return true
            }

        }
    }

}

const loader = new GLTFLoader();
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
let velocidadeCanhaoLateral = 0
let velocidadeCanhaoVertical = 0

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const geometry = new THREE.SphereGeometry( 0.03, 10, 10 );
const material = new THREE.MeshStandardMaterial ( { color: 0xffffff} );
const bala = new THREE.Mesh( geometry, material );
scene.add( bala );
bala.position.y = 1.24
bala.position.z = -0.77
bala.position.x = -0.35

const light = new THREE.AmbientLight( 0xffffff ); 
scene.add(light)

const marry = new model3D('going_merry', 1.2, 0, 0, 0, false)
marry.carregar()
const canhao = new model3D('canhao', 0.0017, -0.35, 1.06, -0.75, false)
canhao.carregar()
const baseCanhao = new model3D('base-canhao', 0.0017, -0.35, 1.06, -0.75, false)
baseCanhao.carregar()

const goku = new model3D('goku', 1.2, getRandomArbitrary(-1, 0.5) , getRandomArbitrary(1, 2), getRandomArbitrary(-3, -7), true)
goku.carregar()
//const naruto = new model3D('naruto', 0.1, -0.3 , 1, -3)
//naruto.carregar()
//const luffy = new model3D('luffy', 4, -0.3 , 1.5, -3)
//luffy.carregar()
//const usopp = new model3D('usopp', 0.2, -0.3 , 1.5, -3)
//usopp.carregar()


camera.position.y = 1.6
camera.position.z = -0.55
camera.position.x = -0.36

const limiteLateral = 0.45;
const limiteMaxVertical = 0.2;
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
    canhao.rotacionar(anguloCanhaoVertical, anguloCanhaoLateral, 0)

    /*Ajustando a mira do canhão verticalmente
    Cálculo dos ângulos
    Ângulo y: Math.sin(anguloCanhaoVertical)
    Ângulo z: Math.cos(anguloCanhaoVertical)
    */

    //Ajustando base do canhão lateralmente
    //modelBaseCanhao.rotation.y = anguloCanhaoLateral
    baseCanhao.rotacionar(0, anguloCanhaoLateral, 0)

    //Comandos para ser possível se mover pelo mapa
    camera.position.z += velocidade * -Math.cos(angulo)
    camera.position.x += velocidade * -Math.sin(angulo)
    camera.position.y += velocidadeVertical

    bala.position.x += velocidadeBalaX
    bala.position.y += velocidadeBalaY
    bala.position.z += velocidadeBalaZ

    velocidadeBalaY += -0.0005
    goku.caixaDelimitadora(0.3, 0.7, 0.2, -0.03, 0.5, 0)
    goku.rotacionar(0, -3, 0)
    //naruto.caixaDelimitadora(0.3, 0.67, 0.13, -0.03, 0.5, 0)
    //luffy.caixaDelimitadora(0.4, 0.45, 0.33, 0, 0, 0)
    //luffy.rotacionar(0, 1.7, 0)
    //usopp.caixaDelimitadora(0.29, 0.43, 0.38, 0.09, 0.02, 0)

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
    }

    if (e.key == 'r') {
        goku.posicionar(getRandomArbitrary(-1, 0.5) , getRandomArbitrary(1, 2), getRandomArbitrary(-3, -7))
        goku.model.visible = true
        goku.spotLight.visible = true
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