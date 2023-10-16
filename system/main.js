import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function gerar_cor_hexadecimal()
{
return '#' + parseInt((Math.random() * 0xFFFFFF))
.toString(16)
.padStart(6, '0');
}

function atualizarTimer() {

    if (iniciarTimer == 0) {
        milissegundos = tempo % 1000; // Calcula os milissegundos
        segundos = Math.floor(tempo / 1000); // Calcula os segundos

        // Remove o zero no final dos milissegundos
        const milissegundosString = milissegundos.toString().slice(0, -1);

        // Formata os valores de segundos e milissegundos em uma única string
        const timerString = `${segundos}s${milissegundosString}`;

        // Atualiza o conteúdo da div com o timer formatado
        document.getElementById("timer").textContent = timerString + "00";
      
    } else if (tempo > 0) {
        
        tempo -= 10; // Decrementa 10 milissegundos
        milissegundos = tempo % 1000; // Calcula os milissegundos
        segundos = Math.floor(tempo / 1000); // Calcula os segundos

        // Remove o zero no final dos milissegundos
        const milissegundosString = milissegundos.toString().slice(0, -1);

        // Formata os valores de segundos e milissegundos em uma única string
        const timerString = `${segundos}s${milissegundosString}`;

        // Atualiza o conteúdo da div com o timer formatado
        document.getElementById("timer").textContent = timerString;

    } else{
        document.getElementById("timer").textContent = "0s00";
        modoCanhao = 2

        scoreContainer.style.display = "block"
        image.style.display = "block"
        document.body.style.cursor = "auto"

        theme.stop();

        clearInterval(intervalo)

    }
}

// Configura o intervalo para chamar a função a cada 10 milissegundos
let intervalo = setInterval(atualizarTimer, 10);

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
            this.spotLight = new THREE.SpotLight( gerar_cor_hexadecimal(), 100 );
            this.spotLight.position.set( positionX, positionY + 2, positionZ);
            this.spotLight.angle = Math.PI / 16;
            this.spotLight.penumbra = 1;
            this.spotLight.decay = 2;
            this.spotLight.distance = 0;
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
            if (!this.caixa) {
                const deslocamento = new THREE.Vector3(largura * deslocarX , altura * deslocarY, profundidade * deslocarZ);
                const caixaGeometry = new THREE.BoxGeometry(largura, altura, profundidade);

                caixaGeometry.translate(deslocamento.x, deslocamento.y, deslocamento.z);
        
                const caixaMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe : true});
                const caixaColisao = new THREE.Mesh(caixaGeometry, caixaMaterial);
        
                // Posicione a caixa de colisão onde o modelo 3D estiver posicionado
                caixaColisao.position.copy(this.model.position);
                scene.add(caixaColisao);
                this.caixa = caixaColisao;
                this.caixa.visible = false
            } else{
                this.caixa.position.copy(this.model.position)
            }

            if (this.model.visible) {
                if (this.foiAtingido(largura, altura, profundidade)) {
                    this.spotLight.visible = false
                    this.model.visible = false
                    score += 20
                    console.log(score);
                }
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
    cube.rotation.y = -300
    scene.add( cube );
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
let score = 0;
let tempo = 30000;
let segundos = 0;
let milissegundos = 0;
let iniciarTimer = 0;
const Score = document.getElementById("score")
const finalScore = document.getElementsByClassName("score")[0]
const scoreContainer = document.getElementById("score-container")
const image = document.getElementById("background-image")
const botao = document.getElementById("reset")
document.body.style.cursor = "none"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 0.03, 10, 10 );
const material = new THREE.MeshStandardMaterial ( { color: 0x000000} );
const bala = new THREE.Mesh( geometry, material );
scene.add( bala );
bala.position.y = 1.24
bala.position.z = -0.77
bala.position.x = -0.35

const light = new THREE.AmbientLight( 0xffffff ); 
scene.add(light)
const audio = new Audio('sounds/cannon.mp3');

const listener = new THREE.AudioListener();


const theme = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();

audioLoader.load( 'sounds/theme.mp3', function( buffer ) {
    theme.setBuffer( buffer );
    theme.setLoop( false );
    theme.setVolume( 0.3 );
});


const marry = new model3D('going_merry', 1.2, 0, 0, 0, false)
marry.carregar()
const canhao = new model3D('canhao', 0.0017, -0.35, 1.06, -0.75, false)
canhao.carregar()
const baseCanhao = new model3D('base-canhao', 0.0017, -0.35, 1.06, -0.75, false)
baseCanhao.carregar()

const goku = new model3D('goku', 1.2, getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6), true)
goku.carregar()
const naruto = new model3D('naruto', 0.1, getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6), true)
naruto.carregar()
const sasuke = new model3D('sasuke', 0.3, getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6), true)
sasuke.carregar()
const vegeta = new model3D('vegeta', 0.3, getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6), true)
vegeta.carregar()
const zoro = new model3D('zoro', 0.005, getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6), true)
zoro.carregar()

camera.position.y = 1.6
camera.position.z = -0.55
camera.position.x = -0.36
const cameraOriginalPosition = camera.position.clone();
const cameraOriginalRotation = camera.rotation.clone();

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
    */
    canhao.rotacionar(anguloCanhaoVertical, anguloCanhaoLateral, 0)

    /*Ajustando a mira do canhão verticalmente
    Cálculo dos ângulos
    */

    //Ajustando base do canhão lateralmente
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
    naruto.caixaDelimitadora(0.3, 0.67, 0.13, -0.03, 0.5, 0)
    sasuke.caixaDelimitadora(0.2, 0.5, 0.33, 0.1, 0.45, 0.2)
    sasuke.rotacionar(0, -2.5, 0)
    vegeta.caixaDelimitadora(0.2, 0.55, 0.15, 0, 0.5, 0)
    zoro.caixaDelimitadora(0.26, 0.4, 0.2, 0.09, 0.58, -0.2)
    zoro.rotacionar(0, 0.5, 0)

    if (goku.model && naruto.model && sasuke.model && vegeta.model && zoro.model) {
        
        if (!goku.model.visible && !naruto.model.visible && !sasuke.model.visible && !vegeta.model.visible && !zoro.model.visible) {
            goku.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6))
            goku.model.visible = true
            goku.spotLight.visible = true
            naruto.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6))
            naruto.model.visible = true
            naruto.spotLight.visible = true
            sasuke.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6))
            sasuke.model.visible = true
            sasuke.spotLight.visible = true
            vegeta.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6))
            vegeta.model.visible = true
            vegeta.spotLight.visible = true
            zoro.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.2, 2), getRandomArbitrary(-3, -6))
            zoro.model.visible = true
            zoro.spotLight.visible = true
        }
    }
    
    Score.innerText = "SCORE: " + score
    finalScore.innerText = score

	renderer.render( scene, camera );
}

document.onkeydown = function(e) {

    if (e.key == 'c') {
        modoCanhao = -modoCanhao;
        camera.position.copy(cameraOriginalPosition);
        camera.rotation.copy(cameraOriginalRotation); 
        angulo = 0
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
    } else if(modoCanhao == 1){
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

        if (e.key == ' ') {
            iniciarTimer = 1
            bala.position.y = 1.24
            bala.position.z = -0.77
            bala.position.x = -0.35
            velocidadeBalaX = 0.1 * -Math.sin(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
            velocidadeBalaY = 0.1 * (Math.sin(anguloCanhaoVertical) + 0.2);
            velocidadeBalaZ = 0.1 * -Math.cos(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
            audio.currentTime = 0
            audio.play()
            theme.play()
        }

        if (e.key == 'r') {
            goku.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
            goku.model.visible = true
            goku.spotLight.visible = true
            naruto.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
            naruto.model.visible = true
            naruto.spotLight.visible = true
            sasuke.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
            sasuke.model.visible = true
            sasuke.spotLight.visible = true
            vegeta.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
            vegeta.model.visible = true
            vegeta.spotLight.visible = true
            zoro.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
            zoro.model.visible = true
            zoro.spotLight.visible = true
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

botao.addEventListener("click", (event) => {
    event.stopPropagation();

    modoCanhao = 1
    scoreContainer.style.display = "none"
    image.style.display = "none"
    score = 0
    tempo = 30000
    iniciarTimer = 0
    intervalo = setInterval(atualizarTimer, 10);
    goku.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
    goku.model.visible = true
    goku.spotLight.visible = true
    naruto.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
    naruto.model.visible = true
    naruto.spotLight.visible = true
    sasuke.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
    sasuke.model.visible = true
    sasuke.spotLight.visible = true
    vegeta.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
    vegeta.model.visible = true
    vegeta.spotLight.visible = true
    zoro.posicionar(getRandomArbitrary(-1, 0.8) , getRandomArbitrary(1.3, 2), getRandomArbitrary(-3, -6))
    zoro.model.visible = true
    zoro.spotLight.visible = true
    document.body.style.cursor = "none"
    theme.stop();
})

document.addEventListener('mousemove', (event) =>{
    if (scoreContainer.style.display != "block" &&
    image.style.display != "block") {
        
        anguloCanhaoLateral = -event.offsetX/1000 + 1
        anguloCanhaoVertical = -event.offsetY/1000 + 0.65
    }
})

document.addEventListener("click", function (){
    if (scoreContainer.style.display != "block" &&
    image.style.display != "block") {
        
        iniciarTimer = 1
        bala.position.y = 1.24
        bala.position.z = -0.77
        bala.position.x = -0.35
        velocidadeBalaX = 0.1 * -Math.sin(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
        velocidadeBalaY = 0.1 * (Math.sin(anguloCanhaoVertical) + 0.2);
        velocidadeBalaZ = 0.1 * -Math.cos(anguloCanhaoLateral) * Math.cos(anguloCanhaoVertical);
        audio.currentTime = 0
        audio.play()
        theme.play();   
        
    }
})


sceneInit();
animate();
