import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

function init() {
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

   let object;
   let controls new OrbitControls(camera, renderer.domElement);
   let objToRender = '' //TODO: Add Model

   const loader = new GLTFLoader();

   loader.load(
      `models/${objToRender}/scene.gltf`,
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

   const renderer = new THREE.WebGLRenderer(
      { alpha: false, antialias: true}
   );
   renderer.setSize(window.innerWidth, window.innerHeight);

   //add renderer to DOM
   document.getElementById("three-container").appendChild(renderer.domElement);

   camera.position.z = objToRender == "sunflower" ? 5 : 10;

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

   window.addEventListener("resize", function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
   })
}

init();
