import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js?module';

const sunflowerModel = '';
const beeModel = '';
const postcardModel = ''

const isAlphaTrue = true;
const debugText = true;

function init() {
   const scene = new THREE.Scene();
   const container = document.getElementById('three-container');
   if (!container) {
      console.error('three-container not found');
      return;
   }
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

   //add renderer to DOM
   document.getElementById("three-container").appendChild(renderer.domElement);

   function renderobj(modelPath) {
      const objToRender = modelPath || null;

         if (objToRender) {
            loader.load(
               objToRender,
               function(gltf) {
                  object = gltf.scene;
                  scene.add(object);
                  return object;
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
            errorText.textContent = 'No model found! - selecting test cube...';
            container.appendChild(errorText);

            return cube;
         }
   }

   //objects & settings
   let sunflowerRender = renderobj(sunflowerModel);

   let beeRender = renderobj(beeModel);
   beeRender.scale.set(0.5, 0.5, 0.5);
   beeRender.position.set(0.75, 1.5, 0);

   let postcardRender = renderobj(postcardModel);
   postcardRender.scale.set(0.5, 0.5, 0.5);
   postcardRender.position.set(0.5, -0.25, 0.75);
   postcardRender.rotation.set(-0.5, 0.5, 0.25);

   //camera settings
   const cameraBaseY = 2;
   camera.position.set(0, cameraBaseY, 5);

   //controls settings
   const target = new THREE.Vector3(0, 0, 0);
   controls.target.copy(target);
   controls.update();

   controls.minDistance = 2;
   controls.maxDistance = 10;

   controls.maxPolarAngle = Math.PI / 2;
   controls.minPolarAngle = 0.5;

   controls.enableDamping = true;
   controls.dampingFactor = 0.05;

   //topLight
   const topLight = new THREE.DirectionalLight(0xffffff, 0.75); // (color, intensity)
   topLight.position.set(10, 10, 10); //top-left~
   topLight.castShadow = true;
   scene.add(topLight);

   //bottom Light
   const botLight = new THREE.DirectionalLight(0xffffff, 0.25);
   botLight.position.set(-10,-10,-10);
   botLight.castShadow = false;
   scene.add(botLight);

   //ambientLight
   const ambientLight = new THREE.AmbientLight(0x333333, 0.1);
   ambientLight.position.set(0, -10, 0);
   scene.add(ambientLight);

   function animate(time) {
      requestAnimationFrame(animate);
      //------add stuff here------
      if (beeRender) {
         beeRender.position.x = Math.sin(time * 0.001) * 1.5;
         beeRender.position.z = Math.cos(time * 0.001) * 1.5;
         beeRender.rotation.y += 0.004305;
      }

      //--------------------------
      controls.update();
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

window.addEventListener('DOMContentLoaded', init);
