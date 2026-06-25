import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js?module';

const isAlphaTrue = false;
const testcube = 'public/models/tests/cube.glb' //TODO: remove before commit!!
const model = '';

function init() {
   const scene = new THREE.Scene();
   const container = document.getElementById('three-container');
   const containerSize = container.getBoundingClientRect();
   const camera = new THREE.PerspectiveCamera(75, containerSize.width / containerSize.height, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer({ 
      alpha: isAlphaTrue, antialias: true 
   });
   renderer.setSize(containerSize.width, containerSize.height);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

   let object;
   let controls = new OrbitControls(camera, renderer.domElement);
   const loader = new GLTFLoader();

   const objToRender = model || null;

   if (objToRender) {
      loader.load(
         objToRender,
         function(gltf) {
            object = gltf.scene;
            scene.add(object);
         },
         function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
         },
         function(error) {
            console.error(error);
         }
      );
   } else {
      const cube = new THREE.Mesh(
         new THREE.BoxGeometry(1,1,1),
         new THREE.MeshStandardMaterial({color: 0x00ff00})
      );
      scene.add(cube);

      const errorText = document.createElement('div');
      errorText.id = 'errorText';
      errorText.textContent = 'No model found! \n - selecting test cube...';
      container.appendChild(errorText);
   }


   //add renderer to DOM
   document.getElementById("three-container").appendChild(renderer.domElement);

   camera.position.z = 5;
   camera.position.y = 2;
   

   const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
   topLight.position.set(10, 10, 10); //top-left~
   topLight.castShadow = true;
   scene.add(topLight);

   const ambientLight = new THREE.AmbientLight(0x333333, objToRender == "sunflower" ? 1 : 0.001);
   scene.add(ambientLight);

   function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
   }

   animate();

   window.addEventListener("resize", function() {
      const newContainerSize = container.getBoundingClientRect();
      camera.aspect = newContainerSize.width / newContainerSize.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newContainerSize.width, newContainerSize.height);
   });
}

init();
