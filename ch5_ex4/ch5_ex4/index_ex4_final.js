import * as THREE from './modules/three.module.js';

main();

function main() {
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    gl.shadowMap.enabled = true; // Enable shadow map
    gl.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

    // create camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    const scene = new THREE.Scene();

    // Load image as background
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('textures/wall.jpg'); // Ganti dengan path gambar yang diinginkan
    scene.background = backgroundTexture;

    const fog = new THREE.Fog("grey", 1, 90);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Create the Sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight = 128;
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    // MATERIALS
    const cubeNormalMap = textureLoader.load('textures/kayu.jpg');
    cubeNormalMap.wrapS = THREE.RepeatWrapping;
    cubeNormalMap.wrapT = THREE.RepeatWrapping;
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: cubeNormalMap,
    });

    const sphereNormalMap = textureLoader.load('textures/ball.jpg');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: sphereNormalMap,
    });

    const planeTextureMap = textureLoader.load('textures/floor.jpeg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    const planeNorm = textureLoader.load('textures/floors.jpeg');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNorm
    });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    //cube.castShadow = true; // Enable shadow for cube
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    // Hapus castShadow untuk bola agar tidak ada bayangan
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true; // Enable shadow on plane
    scene.add(plane);

    // LIGHTS
    const color = 0xffffff;
    const intensity = 0.7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true; // Enable shadow for light
    light.position.set(0, 30, 30);
    scene.add(light);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // Bouncing effect variables
    let velocity = 0;
    const gravity = -0.05; // Mengurangi gravitasi agar bola jatuh lebih lambat
    const bounceStrength = .9; // Mengurangi kekuatan mantul agar lebih rendah

    // DRAW
    function draw(time) {
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // Rotasi cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        // Update posisi bola untuk membuat efek mantul
        sphere.position.y += velocity;
        velocity += gravity; // Menerapkan gravitasi

        // Cek jika bola menyentuh tanah
        if (sphere.position.y <= sphereRadius) {
            sphere.position.y = sphereRadius; // Set posisi bola di atas tanah
            velocity *= -bounceStrength; // Memantulkan bola
        }

        light.position.x = 20 * Math.cos(time);
        light.position.y = 20 * Math.sin(time);
        
        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}
