import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- Configuration ---
const CONFIG = {
    colors: {
        neon: 0xCCFF00,
        white: 0xF0F8FF,
        onyx: 0x0A0A0A // Dark grey for visibility against black bg
    },
    cam: {
        fov: 45,
        pos: { x: 0, y: 0, z: 5 }
    }
};

// --- Global Variables ---
let scene, camera, renderer, shirtMesh;
let mouse = new THREE.Vector2();
let targetRotation = { x: 0, y: 0 };
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let scrollPercent = 0;

// --- Initialization ---
function init() {
    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(CONFIG.cam.fov, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10); // Start further out for zoom-in effect

    // 3. Renderer
    const canvas = document.querySelector('#webgl');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const rectAreaLight = new THREE.RectAreaLight(CONFIG.colors.neon, 5, 4, 10);
    rectAreaLight.position.set(-5, 5, 5);
    rectAreaLight.lookAt(0, 0, 0);
    scene.add(rectAreaLight);

    const rimLight = new THREE.SpotLight(0xffffff, 10);
    rimLight.position.set(2, 5, -2);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.5;
    rimLight.decay = 2;
    rimLight.distance = 50;
    scene.add(rimLight);

    // 5. Model Loading
    loadModel();

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    // Color Swatches
    document.querySelectorAll('.swatch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const colorHex = e.target.dataset.color;
            updateShirtColor(colorHex);

            // UI Active State
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Start Loop
    animate();
}

function loadModel() {
    // START LOADING SIMULATION
    simulateLoading();

    const loader = new GLTFLoader();

    loader.load('assets/model/scene.gltf', function (gltf) {
        shirtMesh = gltf.scene;

        // Reset transform
        shirtMesh.position.set(0, 0, 0);
        shirtMesh.rotation.set(0, 0, 0);
        shirtMesh.scale.set(1, 1, 1);

        // Traverse to find mesh for coloring
        shirtMesh.traverse((child) => {
            if (child.isMesh) {
                // Determine material
                // child.material = new THREE.MeshStandardMaterial({...});
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Auto-Center
        const box = new THREE.Box3().setFromObject(shirtMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        shirtMesh.position.sub(center);

        // Auto-Scale Logic: Fit to view (approx 5 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            const scaleFactor = 6 / maxDim;
            shirtMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        scene.add(shirtMesh);

        // Zoom-In Camera Effect
        gsap.to(camera.position, {
            z: CONFIG.cam.pos.z,
            duration: 1.5,
            ease: "power3.inOut"
        });

        // Remove Loader
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            gsap.to(loaderEl, { opacity: 0, duration: 0.5, pointerEvents: 'none' });
        }

    }, undefined, function (error) {
        console.error('An error happened loading the model:', error);
    });
}

function updateShirtColor(colorStr) {
    if (!shirtMesh) return;

    const newColor = new THREE.Color(colorStr);

    // Traverse because GLTF is a Group, not a single Mesh
    shirtMesh.traverse((child) => {
        if (child.isMesh) {
            gsap.to(child.material.color, {
                r: newColor.r,
                g: newColor.g,
                b: newColor.b,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
}

function simulateLoading() {
    let progress = 0;
    const progressEl = document.getElementById('progress');
    const percentEl = document.getElementById('percentage');
    const loaderEl = document.getElementById('loader');

    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Finish Loading
            gsap.to(loaderEl, {
                opacity: 0,
                duration: 1,
                pointerEvents: 'none',
                onComplete: () => {
                    // Zoom-In Camera Effect
                    gsap.to(camera.position, {
                        z: CONFIG.cam.pos.z,
                        duration: 1.5,
                        ease: "power3.inOut"
                    });
                }
            });
        }
        progressEl.style.width = `${progress}%`;
        percentEl.innerText = `${Math.floor(progress)}%`;
    }, 100);
}

// --- Interaction Logic ---

function onMouseMove(event) {
    mouse.x = (event.clientX - windowHalfX) / 200; // Sensitivity 
    mouse.y = (event.clientY - windowHalfY) / 200;
}

function onScroll() {
    scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Parallax Text
    const parallaxText = document.querySelector('.parallax-text');
    if (parallaxText) {
        gsap.to(parallaxText, {
            xPercent: -20 * scrollPercent, // Move text left as we scroll
            duration: 0.5,
            ease: "power1.out"
        });
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (shirtMesh) {
        // 1. Initial Auto-Rotation
        // shirtMesh.rotation.y += 0.005; 

        // 2. Scroll-Rotate Interaction
        const targetScrollRot = scrollPercent * Math.PI * 2; // Full 360 rotation over scroll

        // 3. Mouse Tilt (Reduced sensitivity)
        targetRotation.x = mouse.y * 0.3;
        targetRotation.y = mouse.x * 0.3;

        // Apply Rotations (Mix of scroll + mouse + slight bob)
        // Combine rotations:
        // Base Y rotation from scroll
        // Additional tilt from mouse

        // Smoothly interpolate current rotation to target
        shirtMesh.rotation.x = THREE.MathUtils.lerp(shirtMesh.rotation.x, targetRotation.x, 0.05);
        shirtMesh.rotation.y = THREE.MathUtils.lerp(shirtMesh.rotation.y, targetRotation.y + targetScrollRot, 0.05);

        // Floating Sine Wave with Base Offset
        // We want the shirt slightly lower than center (-1.0)
        shirtMesh.position.y = -1.0 + Math.sin(time) * 0.1;
    }

    renderer.render(scene, camera);
}

// Run
init();
