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
   const raycaster = new THREE.Raycaster();
   const pointer = new THREE.Vector2();
   const interactiveObjects = [];
   let selectedObject = null;

   function registerInteractiveObject(objectToRegister) {
      objectToRegister.traverse((child) => {
         if (child.isMesh) {
            interactiveObjects.push(child);
         }
      });
   }

   function handlePointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) {
         return;
      }

      event.preventDefault();

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
         const hitObject = intersects[0].object;
         selectedObject = hitObject;

         const selectionLabel = hitObject.userData?.selectionLabel || hitObject.name || 'unknown';
         if (selectionLabel === 'sunflower') {
            console.log('Sunflower touched');

         } else if (selectionLabel === 'bee') {
            openBee();
         } else if (selectionLabel === 'postcard') {
            openPostcard();
         } else {
            console.log('Selected interactive mesh:', selectionLabel);
         }
      } else if (selectedObject) {
         selectedObject = null;
      }
   }

   function renderobj(modelPath, objectLabel = 'interactive-object') {
      const objToRender = modelPath || null;

         if (objToRender) {
            loader.load(
               objToRender,
               function(gltf) {
                  object = gltf.scene;
                  object.traverse((child) => {
                     if (child.isMesh) {
                        child.name = objectLabel;
                        child.userData.selectionLabel = objectLabel;
                     }
                  });
                  registerInteractiveObject(object);
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
            cube.name = objectLabel;
            cube.userData.selectionLabel = objectLabel;
            scene.add(cube);
            registerInteractiveObject(cube);

            const errorText = document.createElement('div');
            errorText.id = 'errorText';
            errorText.textContent = 'No model found! - selecting test cube...';
            container.appendChild(errorText);

            return cube;
         }
   }

   //objects & settings
   let sunflowerRender = renderobj(sunflowerModel, 'sunflower');

   let beeRender = renderobj(beeModel, 'bee');
   beeRender.scale.set(0.5, 0.5, 0.5);
   beeRender.position.set(0.75, 1.5, 0);

   function openBee() {
      console.log('Bee function called');
   }

   let postcardRender = renderobj(postcardModel, 'postcard');
   postcardRender.scale.set(0.5, 0.5, 0.5);
   postcardRender.position.set(0.5, -0.25, 0.75);
   postcardRender.rotation.set(-0.5, 0.5, 0.25);

   let isPostcardOpen = false;
   function openPostcard() {
      isPostcardOpen = !isPostcardOpen ? true : false;
      if (isPostcardOpen) { open() } else { close() }
      function open() {
         console.log('Opening postcard...');
         // create a div element for the postcard content
         const postcardContent = document.createElement('div');
      }
      function close() {
         console.log('Closing postcard...');
      }
   }

   //add renderer to DOM
   document.getElementById("three-container").appendChild(renderer.domElement);
   renderer.domElement.style.touchAction = 'none';
   renderer.domElement.addEventListener('pointerdown', handlePointerDown);

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
   const ambientLight = new THREE.AmbientLight(0x333333, 1);
   scene.add(ambientLight);

   function animate(time) {
      requestAnimationFrame(animate);
      //------add stuff here------
      if (beeRender) {
         beeRender.position.x = Math.sin(time * 0.001) * 1.5;
         beeRender.position.z = Math.cos(time * 0.001) * 1.5;
         beeRender.position.y = 1.5 + Math.sin(time * 0.0025)/4;
         beeRender.rotation.y = -Math.atan2(beeRender.position.z, beeRender.position.x);
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
