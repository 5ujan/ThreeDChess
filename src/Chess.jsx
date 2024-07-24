import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Chess = () => {
  const canvasRef = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);
  const controls = useRef(null);
  const board = useRef(null);
  const rotationAnimation = useRef(null);

  useEffect(() => {
    const initialize = () => {
      scene.current = new THREE.Scene();
      camera.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.current.setSize(window.innerWidth, window.innerHeight);

      const square = new THREE.BoxGeometry(1, 0.1, 1);
      const lightsquare = new THREE.MeshBasicMaterial({ color: 0xe0c4a8 });
      const darksquare = new THREE.MeshBasicMaterial({ color: 0x6a4236 });

      board.current = new THREE.Group();

      let squareNumber = 1;
      for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
          let cube;
          const posX = x - 4.5;
          const posZ = z - 4.5;
          if (z % 2 === 0) {
            cube = new THREE.Mesh(
              square,
              x % 2 === 0 ? lightsquare : darksquare
            );
            if (x % 2 !== 0) {
              cube.userData.squareNumber = squareNumber;
              squareNumber++;
            }
          } else {
            cube = new THREE.Mesh(
              square,
              x % 2 === 0 ? darksquare : lightsquare
            );
            if (x % 2 === 0) {
              cube.userData.squareNumber = squareNumber;
              squareNumber++;
            }
          }

          cube.position.set(posX, 0, posZ);
          board.current.add(cube);
        }
      }

      scene.current.add(board.current);

      // Add axes helper
      const axesHelper = new THREE.AxesHelper(5); // Size of the axes
      scene.current.add(axesHelper);

      // Set the initial camera position
      camera.current.position.set(0, 7.5, 7.5);
      camera.current.lookAt(0, 0, 0); // Look at the center of the board

      controls.current = new OrbitControls(
        camera.current,
        renderer.current.domElement
      );
      controls.current.target.set(0, 0, 0);
      controls.current.enablePan = false;
      controls.current.maxPolarAngle = Math.PI / 2;
      controls.current.enableDamping = true;
    };

    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        console.log("Space pressed, starting rotation");
        rotateCamera();
      }
    };

    const rotateCamera = () => {
      if (rotationAnimation.current) {
        cancelAnimationFrame(rotationAnimation.current);
      }

      const startAngle = Math.atan2(
        camera.current.position.z,
        camera.current.position.x
      );
      const endAngle = startAngle + Math.PI;
      const duration = 1000; // 1 second
      const startTime = performance.now();

      console.log("Start angle:", startAngle, "End angle:", endAngle);

      const animateRotation = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const easeProgress = easeInOutQuad(progress);

        const currentAngle =
          startAngle + (endAngle - startAngle) * easeProgress;

        const radius = Math.sqrt(
          Math.pow(camera.current.position.x, 2) +
            Math.pow(camera.current.position.z, 2)
        );

        camera.current.position.x = radius * Math.cos(currentAngle);
        camera.current.position.z = radius * Math.sin(currentAngle);

        camera.current.lookAt(0, 0, 0);
        controls.current.update();

        console.log(
          "Current angle:",
          currentAngle,
          "Camera position:",
          camera.current.position
        );

        if (progress < 1) {
          rotationAnimation.current = requestAnimationFrame(animateRotation);
        } else {
          rotationAnimation.current = null;
          console.log("Rotation complete");
        }
      };

      rotationAnimation.current = requestAnimationFrame(animateRotation);
    };

    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const animate = () => {
      controls.current.update();
      renderer.current.render(scene.current, camera.current);
      requestAnimationFrame(animate);
    };

    initialize();
    animate();

    const onWindowResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("keydown", handleKeyPress);

      if (rotationAnimation.current) {
        cancelAnimationFrame(rotationAnimation.current);
      }

      // Clean up Three.js objects to prevent memory leaks
      scene.current.remove(board.current);
      scene.current.remove(scene.current.getObjectByName("axesHelper")); // Ensure axes are removed
      board.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      renderer.current.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Chess;
