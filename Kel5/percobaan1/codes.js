// Inisialisasi Scene dan Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Biru langit (SkyBlue)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Menambahkan Fog ke Scene
const fog = new THREE.Fog("white", 0.1, 50); // Kabut lebih dekat
scene.fog = fog;

// Inisialisasi Light (Directional dan Ambient)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Cahaya ambient yang lebih terang
scene.add(ambientLight);

// Menambahkan Tekstur pada Sphere (bola voli) dan Plane
const textureLoader = new THREE.TextureLoader();
const volleyballTexture = textureLoader.load('../textures/360_F_524205460_KLLGTs24DebMIgTgY7dFFxMW2UDbCwpD.jpg', (texture) => {
    console.log("Tekstur bola berhasil dimuat:", texture);
}, undefined, (error) => {
    console.error("Terjadi kesalahan saat memuat tekstur bola:", error);
});

const planeTexture = textureLoader.load("../textures/stone_wall_04_diff_2k.jpg", (texture) => {
  console.log("Tekstur plane berhasil dimuat:", texture);
}, undefined, (error) => {
  console.error("Terjadi kesalahan saat memuat tekstur plane:", error);
});

// Membuat Plane (tanah) dengan tekstur
const planeMaterial = new THREE.MeshStandardMaterial({
  map: planeTexture
});
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Memutar plane agar datar
scene.add(plane);

// Membuat Sphere dengan Tekstur
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: volleyballTexture,
  side: THREE.DoubleSide
});
sphereMaterial.map.wrapS = THREE.RepeatWrapping;
sphereMaterial.map.wrapT = THREE.RepeatWrapping;
sphereMaterial.map.repeat.set(1, 1);

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(10, 5, 0); // Memposisikan sphere di atas plane
scene.add(sphere);

// Menambahkan Cube (kubus) dengan Tekstur
const cubeTexture = textureLoader.load("../textures/stone_wall_04_diff_2k.jpg", (texture) => {
    console.log("Tekstur kubus berhasil dimuat:", texture);
}, undefined, (error) => {
    console.error("Terjadi kesalahan saat memuat tekstur kubus:", error);
});

const cubeMaterial = new THREE.MeshStandardMaterial({
  map: cubeTexture,
  side: THREE.DoubleSide
});
const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-10, 5, 0); // Memposisikan kubus di samping sphere
scene.add(cube);

// Memposisikan Kamera
camera.position.z = 20;
camera.position.y = 10;

// Fungsi Animasi
function animate() {
  requestAnimationFrame(animate);
  
  // Rotasi sphere dan kubus
  sphere.rotation.y += 0.01;
  cube.rotation.y -= 0.01;
  
  // Render scene
  renderer.render(scene, camera);
}

// Memulai animasi
animate();