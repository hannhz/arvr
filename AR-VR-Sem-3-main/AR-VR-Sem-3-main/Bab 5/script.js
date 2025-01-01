import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r118/three.module.min.js";

main();

function main() {
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({canvas, antialias: true});

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

    // Buat listener untuk menangkap suara
    var listener = new THREE.AudioListener();
    camera.add(listener);

    // Buat sound source
    var sound = new THREE.Audio(listener);

    // Muat audio menggunakan AudioLoader
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('textures/petir.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true); // Kalau mau suara petir hanya sekali
        sound.setVolume(0.5);
        sound.play();
    });

    // Create a video element
    const video = document.createElement('video');
    video.src = 'textures/petir.mp4'; // Ganti dengan path video kamu
    video.loop = true;
    video.muted = true; // Mute the video to avoid sound issues
    video.play();

    // Create a video texture
    const videoTexture = new THREE.VideoTexture(video);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = videoTexture;

    const fog = new THREE.Fog(0x555577);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );

    // Create the Sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight = 128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );

    // MATERIALS
    const textureLoader = new THREE.TextureLoader();

    // Mengubah cube material dengan water.jpg
    const waterTexture = textureLoader.load('textures/water.jpg');
    const cubeMaterial = new THREE.MeshPhongMaterial({
        map: waterTexture
    });

    // Mengubah sphere material dengan water.jpg
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: waterTexture
    });

    // Mengubah plane material dengan waterbg.jpeg
    const planeTextureMap = textureLoader.load('textures/waterbg.jpeg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide
    });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    //LIGHTS
    const color = 0x555577;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0x001133;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // DRAW
    function draw(time) {
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        sphere.rotation.y += 0.01;
        
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
