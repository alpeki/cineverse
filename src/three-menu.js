import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Kategoriler
const categories = [
  { text: "Ana Sayfa", target: "#hero" },
  { text: "İncelemeler", target: "#reviews" },
  { text: "Fragmanlar", target: "#trailers" },
  { text: "Listeler", target: "#lists" },
  { text: "Profiller", target: "#profiles" },
  { text: "Haberler", target: "#news" },
];

// Three.js temel kurulum
const container = document.getElementById("three-menu");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0e);

const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Işıklar
const pointLight = new THREE.PointLight(0xff0044, 2, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Orbit Controls (sadece minimal hareket)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;

// Font yükleme
const loader = new THREE.FontLoader();
loader.load("https://threejs.org/examples/fonts/helvetiker_bold.typeface.json", (font) => {
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff0022, emissive: 0xff2244, emissiveIntensity: 0.8 }),
  ];

  categories.forEach((cat, i) => {
    const geometry = new THREE.TextGeometry(cat.text, {
      font: font,
      size: 0.8,
      height: 0.15,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 3,
    });

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(-4, 2.5 - i * 1.2, 0);
    mesh.userData = cat;
    scene.add(mesh);
  });
});

// Mouse tıklama (scroll)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const target = intersects[0].object.userData.target;
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }
}
window.addEventListener("click", onClick);

// Animasyon döngüsü
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Yeniden boyutlandırma
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
