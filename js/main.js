import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

// Scene
const scene = new THREE.Scene();
//size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 2;
scene.add(camera);
//renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#21282a"), 1);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Objects
// sphere
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
const material = new THREE.PointsMaterial({
  size: 0.005,
  color: 0x87a7ca,
});
const sphere = new THREE.Points(geometry, material);
scene.add(sphere);

//particle
const particlesGeometry = new THREE.BufferGeometry();
const loader = new THREE.TextureLoader();
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.height = 100;
canvas.width = 100;
ctx.fillStyle = "#fff";
ctx.beginPath();
ctx.arc(50, 50, 25, 0, 2 * Math.PI);
ctx.fill();
let img = canvas.toDataURL("image/png");
const star = loader.load(img);
const particlesmaterial = new THREE.PointsMaterial({
  size: 0.01,
  map: star,
  transparent: true,
});
const particlesCnt = 2000;
const posArray = new Float32Array(particlesCnt * 3);
// xyz,xyz,xyz , xyz
for (let i = 0; i < particlesCnt * 3; i++) {
  //posArray[i] = Math.random()
  //   posArray[i] = Math.random() - 0.5
  //   posArray[i] = (Math.random() - 0.5) * 5
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMesh = new THREE.Points(particlesGeometry, particlesmaterial);
scene.add(particlesMesh);

//mouse
document.addEventListener("mousemove", animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;
  particlesMesh.rotation.y = -1 * (elapsedTime * 0.1);

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
    particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
  }

  renderer.render(scene, camera);
};

animate();
