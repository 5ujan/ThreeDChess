import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ChessBoard from "../components/ChessBoard";
import ChessPieces from "../components/ChessPieces";

const Chess = () => {
  const canvasRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(null);
  const renderer = useRef(null);
  const controls = useRef(null);
  const rotationAnimation = useRef(null);

  useEffect(() => {
    const initialize = () => {
      camera.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.current.setSize(window.innerWidth, window.innerHeight);

      const ambientLight = new THREE.AmbientLight(0xffffff); // Soft white light
      scene.current.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
      directionalLight.position.set(5, 10, 7.5);
      scene.current.add(directionalLight);

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

    return () => {
      window.removeEventListener("resize", onWindowResize);
      // Clean up Three.js objects to prevent memory leaks
      scene.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      renderer.current.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />
      <ChessBoard scene={scene.current} />
      <ChessPieces scene={scene.current} />
    </>
  );
};

export default Chess;
