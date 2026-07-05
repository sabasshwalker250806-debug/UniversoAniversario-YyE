// Escena, cámara y renderizador
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

// Fondo galáctico en 3D con manchas aleatorias
const canvasFondo = document.createElement('canvas');
canvasFondo.width = 1024;
canvasFondo.height = 1024;
const ctx = canvasFondo.getContext('2d');

// Fondo base negro
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 1024, 1024);

// Colores galácticos
const coloresGalaxia = ["#4B0082", "#8B0000", "#0000ff", "#ffffff"];

// Dibujar manchas aleatorias
for (let i = 0; i < 200; i++) {
  const x = Math.random() * 1024;
  const y = Math.random() * 1024;
  const radio = Math.random() * 150 + 50;
  const color = coloresGalaxia[Math.floor(Math.random() * coloresGalaxia.length)];

  const grad = ctx.createRadialGradient(x, y, 0, x, y, radio);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, Math.PI * 2);
  ctx.fill();
}

const texturaFondo = new THREE.CanvasTexture(canvasFondo);

// Esfera envolvente con textura aleatoria
const geometriaFondo = new THREE.SphereGeometry(3000, 64, 64);
const materialFondo = new THREE.MeshBasicMaterial({
  map: texturaFondo,
  side: THREE.BackSide
});
const fondo = new THREE.Mesh(geometriaFondo, materialFondo);
escena.add(fondo);
// ===================================================
// Estrellas de fondo (universo lejano)
// ===================================================

const estrellasFondo = new THREE.BufferGeometry();
const posicionesFondo = [];

const radioUniverso = 2900;

for (let i = 0; i < 12000; i++) {

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const r = radioUniverso;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    posicionesFondo.push(x, y, z);

}

estrellasFondo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(posicionesFondo, 3)
);

const materialFondoEstrellas = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
});

const universo = new THREE.Points(
    estrellasFondo,
    materialFondoEstrellas
);

escena.add(universo);

// Luz ambiental
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
escena.add(luzAmbiente);

// Núcleo galáctico
const geometriaNucleo = new THREE.SphereGeometry(45, 64, 64);

const materialNucleo = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0xfff4d6,
    emissiveIntensity: 1.3,
    shininess: 120
});
const nucleo = new THREE.Mesh(geometriaNucleo, materialNucleo);
escena.add(nucleo);

// Halo translúcido
const geometriaHalo = new THREE.SphereGeometry(550, 64, 64);

const materialHalo = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const halo = new THREE.Mesh(
    geometriaHalo,
    materialHalo
);

escena.add(halo);
const geometriaGlow = new THREE.SphereGeometry(80, 64, 64);

const materialGlow = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const glow = new THREE.Mesh(
  geometriaGlow,
  materialGlow
);

escena.add(glow);

// Luz central
const luzGalaxia = new THREE.PointLight(
    0xfff5d0,
    3.2,
    3200
);
luzGalaxia.position.set(0, 0, 0);
escena.add(luzGalaxia);

// Estrellas en brazos espirales gruesos
const estrellas = new THREE.BufferGeometry();

const posiciones = [];
const colores = [];
const tamaños = [];
const datosEstrellas = [];

const cantidad = 60000;
const brazos = 4;

for (let i = 0; i < cantidad; i++) {

// Distribución más natural
const radio = Math.pow(Math.random(), 0.55) * 1500;

// Brazo al que pertenece
const brazo = (i % brazos) * ((Math.PI * 2) / brazos);

// Curvatura espiral
const angulo = radio * 0.015 + brazo;

// Grosor variable
const dispersion = (1 - radio / 1500) * 120;

const offsetX = (Math.random() - 0.5) * dispersion;

// Grosor de la galaxia
const grosor =
    (1 - radio / 1500) * 120;

const offsetY =
    (Math.random() - 0.5) * grosor;

const offsetZ =
    (Math.random() - 0.5) * dispersion;

const x = Math.cos(angulo) * radio + offsetX;
const y = offsetY;
const z = Math.sin(angulo) * radio + offsetZ;

posiciones.push(x, y, z);

datosEstrellas.push({
    radio: radio,
    angulo: angulo,
    altura: y,
    velocidad: 0.00015 + (1 - radio / 1500) * 0.00035
});

const color = new THREE.Color();

const coloresGalaxia = [
    0xffffff,
    0xfff4d6,
    0xaec6ff,
    0xffd1dc
];

color.setHex(
    coloresGalaxia[
        Math.floor(Math.random() * coloresGalaxia.length)
    ]
);

colores.push(color.r, color.g, color.b);
tamaños.push(
    Math.random() * 2 + 0.5
);
}

// Bulbo central
for (let i = 0; i < 20000; i++) {


const r = Math.random() * 250;
const theta = Math.random() * Math.PI * 2;

const x = Math.cos(theta) * r;
const y = (Math.random() - 0.5) * 120;
const z = Math.sin(theta) * r;

posiciones.push(x, y, z);

colores.push(
    1,
    0.95,
    0.8
);
tamaños.push(
    Math.random() * 2 + 1
);
}

estrellas.setAttribute(
'position',
new THREE.Float32BufferAttribute(posiciones, 3)
);

estrellas.setAttribute(
'color',
new THREE.Float32BufferAttribute(colores, 3)
);

estrellas.setAttribute(
    'size',
    new THREE.Float32BufferAttribute(tamaños, 1)
);

const fases = [];

for (let i = 0; i < tamaños.length; i++) {
    fases.push(Math.random() * Math.PI * 2);
}

estrellas.setAttribute(
    'fase',
    new THREE.Float32BufferAttribute(fases, 1)
);

const materialEstrellas = new THREE.ShaderMaterial({

    transparent: true,
    depthWrite: false,
    vertexColors: true,

    uniforms: {
        tiempo: { value: 0 }

},
    vertexShader: `
    attribute float size;
    attribute float fase;

    uniform float tiempo;

    varying vec3 vColor;
    varying float vBrillo;

    void main(){

        vColor = color;

        vBrillo = 0.75 + sin(tiempo + fase) * 0.25;

        vec4 mvPosition = modelViewMatrix * vec4(position,1.0);

        gl_PointSize = size * (350.0 / -mvPosition.z);

        gl_Position = projectionMatrix * mvPosition;

    }
`,

fragmentShader: `
    varying vec3 vColor;
    varying float vBrillo;

    void main(){

        float distancia = distance(gl_PointCoord, vec2(0.5));

        if(distancia > 0.5){
            discard;
        }

        float intensidad = smoothstep(0.5, 0.0, distancia);

        float halo = smoothstep(0.5, 0.2, distancia) * 0.35;

        float brillo = (intensidad + halo) * vBrillo;

        gl_FragColor = vec4(vColor * brillo, brillo);

    }
`

});

const puntosEstrellas = new THREE.Points(
estrellas,
materialEstrellas
);

escena.add(puntosEstrellas);

const estrellasMedianas = new THREE.BufferGeometry();
const posMedianas = [];

for(let i=0;i<7000;i++){

    const r = Math.random()*1700;
    const a = Math.random()*Math.PI*2;

    posMedianas.push(
        Math.cos(a)*r,
        (Math.random()-0.5)*50,
        Math.sin(a)*r
    );

}

estrellasMedianas.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(posMedianas,3)
);

const materialMedianas = new THREE.PointsMaterial({

    color:0xffffff,
    size:3,
    transparent:true,
    opacity:0.85,
    depthWrite:false

});

const puntosMedianos = new THREE.Points(
    estrellasMedianas,
    materialMedianas
);

escena.add(puntosMedianos);

const estrellasGrandes = new THREE.BufferGeometry();
const posGrandes = [];
const estrellasBrillantes = [];
for(let i=0;i<900;i++){

    const r = Math.random()*1700;
    const a = Math.random()*Math.PI*2;

    const x = Math.cos(a) * r;
    const y = (Math.random() - 0.5) * 70;
    const z = Math.sin(a) * r;

posGrandes.push(x, y, z);

estrellasBrillantes.push({
    velocidad: Math.random() * 0.004 + 0.001,
    fase: Math.random() * Math.PI * 2
});

}

estrellasGrandes.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(posGrandes,3)
);

const materialGrandes = new THREE.PointsMaterial({

    color:0xfff5d0,
    size:3.5,
    transparent:true,
    opacity:0.9,
    depthWrite:false,
    blending: THREE.AdditiveBlending

});

const puntosGrandes = new THREE.Points(
    estrellasGrandes,
    materialGrandes
);

escena.add(puntosGrandes);

const polvo = new THREE.BufferGeometry();
const posicionesPolvo = [];

for (let i = 0; i < 30000; i++) {

  const radio = Math.random() * 1700;
  const angulo = Math.random() * Math.PI * 2;

  posicionesPolvo.push(
    Math.cos(angulo) * radio,
    (Math.random() - 0.5) * 15,
    Math.sin(angulo) * radio
  );
}

polvo.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(posicionesPolvo, 3)
);

const materialPolvo = new THREE.PointsMaterial({
  color: 0x444444,
  size: 1,
  transparent: true,
  opacity: 0.15
});

const nubePolvo = new THREE.Points(
  polvo,
  materialPolvo
);

escena.add(nubePolvo);

const grupoGlow = new THREE.Group();
escena.add(grupoGlow);

const estrellasGlow = [];

for(let i = 0; i < posGrandes.length; i += 3){

    const geo = new THREE.SphereGeometry(1,6,6);

    const mat = new THREE.MeshBasicMaterial({
        color:0xfff5d0,
        transparent:true,
        opacity:1
    });

    const estrella = new THREE.Mesh(geo,mat);

    estrella.position.set(
        posGrandes[i],
        posGrandes[i+1],
        posGrandes[i+2]
    );

    estrellasGlow.push(estrella);

    grupoGlow.add(estrella);

}


// Nebulosas y disco de gas
const loader = new THREE.TextureLoader();

function crearNebulosa(textura, x, y, z, escala) {
  const img = loader.load(textura);
  const material = new THREE.SpriteMaterial({ 
    map: img, 
    transparent: true, 
    opacity: 0.4 
  });
  const nebulosa = new THREE.Sprite(material);
  nebulosa.position.set(x, y, z);
  nebulosa.scale.set(escala, escala, 1);
  escena.add(nebulosa);
}

crearNebulosa("nebula1.png",900,300,-1200,1200);
crearNebulosa("nebula2.png",-1000,250,-800,900);
crearNebulosa("nebula1.png",-700,-250,1000,1000);
crearNebulosa("nebula2.png",800,-350,900,1100);
crearNebulosa("nebula1.png",200,500,-900,700);
crearNebulosa("nebula2.png",-300,450,700,800);

const texturaDisco = loader.load("nebula1.png");
const geometriaDisco = new THREE.PlaneGeometry(2400, 2400);
const materialDisco = new THREE.MeshBasicMaterial({ 
  map: texturaDisco, 
  transparent: true, 
  opacity: 0.25, 
  side: THREE.DoubleSide 
});
const disco = new THREE.Mesh(geometriaDisco, materialDisco);
disco.rotation.x = Math.PI / 2;
escena.add(disco);

// Frases románticas
function crearFrase(texto, x, y, z, color = "white") {
  const canvas = document.createElement('canvas');
  const contexto = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 256;

  contexto.font = '48px Arial';
  contexto.fillStyle = color;
  contexto.shadowColor = 'rgba(255,255,255,0.8)';
  contexto.shadowBlur = 10;
  contexto.fillText(texto, 20, 150);

  const textura = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: textura, transparent: true });
  const sprite = new THREE.Sprite(material);

  sprite.position.set(x, y, z);
  sprite.scale.set(250, 100, 1);
  escena.add(sprite);
  sprite.userData.baseY = y;

  return sprite;
}

const frases = [
crearFrase("Eres la casualidad más hermosa de mi vida 💖", 620, 180, 450, "pink"),
crearFrase("Mi corazón sonríe cada vez que pienso en ti ❤️", -720, 250, 300, "red"),
crearFrase("Eres mi persona favorita en todo el universo 🌌", 850, -120, -650, "gold"),
crearFrase("Amarte es mi mayor felicidad ✨", -580, 320, 760, "lightblue"),
crearFrase("Tu amor es mi refugio perfecto 🤍", 400, -300, 850, "white"),
crearFrase("No cambiaría un solo instante contigo 💕", -900, 150, -450, "magenta"),
crearFrase("Eres el sueño que nunca quiero despertar 💫", 980, 220, 500, "violet"),
crearFrase("Cada latido de mi corazón lleva tu nombre ❤️", -640, -180, 940, "red"),
crearFrase("Mi vida comenzó cuando llegaste tú 🌟", 540, 380, -820, "yellow"),
crearFrase("Siempre serás mi mejor historia 📖", -450, -420, 300, "cyan"),

crearFrase("Contigo todo es más bonito 🌹", 730, 120, -940, "orange"),
crearFrase("Eres mi felicidad diaria ☀️", -850, 290, 600, "yellow"),
crearFrase("Tus abrazos son mi lugar seguro 🤗", 920, -260, 300, "pink"),
crearFrase("A tu lado descubrí el verdadero amor 💝", -500, 440, -780, "gold"),
crearFrase("Mi corazón eligió el tuyo para siempre 💞", 660, -360, 760, "magenta"),
crearFrase("No existe un universo donde no te ame 🌌", -930, 100, -220, "cyan"),
crearFrase("Tú eres mi destino favorito 💘", 500, 240, -960, "red"),
crearFrase("Mi alma sonríe cuando estás conmigo 😊", -610, -310, 840, "lightblue"),
crearFrase("Gracias por cada momento juntos 💕", 810, 300, 600, "white"),
crearFrase("Eres la luz que ilumina mis días ✨", -740, 200, -850, "yellow"),

crearFrase("Cada beso tuyo vale un universo entero 💋", 960, -180, 450, "pink"),
crearFrase("Siempre quiero despertar a tu lado ❤️", -520, 420, 730, "red"),
crearFrase("Nuestro amor es mi mayor tesoro 💎", 760, -340, -600, "gold"),
crearFrase("Mi corazón encontró su hogar en ti 🏡", -880, 180, 520, "orange"),
crearFrase("Eres el milagro que siempre esperé 🌠", 620, 310, -780, "violet"),
crearFrase("Amarte es tan natural como respirar 💖", -430, -390, 910, "magenta"),
crearFrase("Tu sonrisa hace brillar mi universo ⭐", 930, 260, 250, "yellow"),
crearFrase("Nunca dejaré de enamorarme de ti 💞", -690, 140, -960, "lightblue"),
crearFrase("Contigo aprendí a creer en el amor ❤️", 470, -280, 820, "cyan"),
crearFrase("Mi infinito siempre será contigo ♾️", -950, 350, -500, "white"),

crearFrase("Tu amor hace latir más fuerte mi corazón 💓", 700, -160, 970, "red"),
crearFrase("Eres mi estrella favorita del cielo ✨", -760, 310, 410, "gold"),
crearFrase("Mi felicidad comienza donde estás tú 💕", 840, 180, -920, "pink"),
crearFrase("Cada día te amo un poquito más ❤️", -600, -250, 780, "magenta"),
crearFrase("Nuestro amor no tiene final 🌌", 990, 120, 650, "cyan"),
crearFrase("Siempre serás mi razón para sonreír 😊", -510, 460, -640, "orange"),
crearFrase("Eres el capítulo más bonito de mi vida 📚", 630, -420, 520, "yellow"),
crearFrase("Gracias por existir en mi mundo 🌍", -820, 240, -760, "white"),
crearFrase("Cada mirada tuya ilumina mi alma 💖", 520, 330, 910, "lightblue"),
crearFrase("Mi amor por ti es infinito ♾️", -910, -180, 340, "violet"),

crearFrase("Juntos somos imparables 💪❤️", 880, 260, -450, "red"),
crearFrase("Eres mi mejor coincidencia 🌹", -720, 120, 960, "pink"),
crearFrase("Mi lugar favorito siempre será contigo 🤍", 570, -310, -870, "gold"),
crearFrase("Nuestro amor es más grande que las estrellas ⭐", -980, 290, 210, "yellow"),
crearFrase("Amo cada pequeño detalle de ti 💕", 760, 380, 780, "magenta"),
crearFrase("Mi universo tiene tu nombre 🌌", -560, -460, -930, "cyan"),
crearFrase("Siempre serás el amor de mi vida ❤️", 940, 200, 540, "orange"),
crearFrase("Te volvería a elegir mil veces 💖", -650, 340, -580, "lightblue"),
crearFrase("Mi corazón es completamente tuyo 💘", 480, -370, 990, "white"),
crearFrase("Feliz aniversario, mi amor eterno ❤️", -1000, 150, 700, "pink"),
];

// Cámara
camara.position.set(700, 350, 900);
camara.lookAt(0, 0, 0);

// OrbitControls
const controls = new THREE.OrbitControls(camara, renderizador.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

controls.enableZoom = true;
controls.zoomSpeed = 1.2;

controls.enablePan = false;       // evita perder la galaxia del centro

controls.rotateSpeed = 0.7;
controls.minDistance = 250;
controls.maxDistance = 2500;

controls.target.set(0, 0, 0);
controls.update();
// Animación
function animar() {

  requestAnimationFrame(animar);

  const tiempo = Date.now();

  const posicionesArray = puntosEstrellas.geometry.attributes.position.array;

for (let i = 0; i < datosEstrellas.length; i++) {

    const estrella = datosEstrellas[i];

    estrella.angulo += estrella.velocidad;

    posicionesArray[i * 3] =
        Math.cos(estrella.angulo) * estrella.radio;

    posicionesArray[i * 3 + 1] =
        estrella.altura;

    posicionesArray[i * 3 + 2] =
        Math.sin(estrella.angulo) * estrella.radio;

}

puntosEstrellas.geometry.attributes.position.needsUpdate = true;

  //puntosEstrellas.rotation.y += 0.00012;
  nubePolvo.rotation.y += 0.00010;
  disco.rotation.z += 0.00018;
  halo.rotation.y += 0.00015;
  glow.rotation.y += 0.00020;
  nucleo.rotation.y += 0.0015;
  fondo.rotation.y += 0.0001;
  universo.rotation.y += 0.00003;
  puntosMedianos.rotation.y += 0.00008;
  puntosGrandes.rotation.y += 0.00004;
  grupoGlow.rotation.y += 0.00004;

  estrellasGlow.forEach((estrella,i)=>{

    estrella.material.opacity =
        0.35 +
        Math.sin(
            tiempo * 0.001 +
            estrellasBrillantes[i].fase
        ) * 0.65;

});

  // Pulso del núcleo
  const pulso = 1 + Math.sin(tiempo * 0.003) * 0.05;

  halo.scale.set(pulso, pulso, pulso);
  glow.scale.set(pulso, pulso, pulso);
  nucleo.scale.set(
      pulso * 0.98,
      pulso * 0.98,
      pulso * 0.98
  );

  // Parpadeo de las estrellas grandes
  materialGrandes.opacity =
      0.75 + Math.sin(tiempo * 0.0025) * 0.25;

      frases.forEach((f, i) => {
        f.position.y =
            f.userData.baseY +
            Math.sin(tiempo * 0.001 + i) * 10;

      // Siempre mirar a la cámara
      f.lookAt(camara.position);
  });

  controls.update();
  materialEstrellas.uniforms.tiempo.value = tiempo * 0.002;
  renderizador.render(escena, camara);

}

animar();