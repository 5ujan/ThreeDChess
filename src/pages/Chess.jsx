import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ChessBoard from "../components/ChessBoard";
import ChessPieces from "../components/ChessPieces";
import PlaySound from "../components/PlaySound";
import { useLocation, Link } from "react-router-dom";
import { useGlobalContext } from "../components/Context";

const Chess = () => {
  const canvasRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(null);
  const renderer = useRef(null);
  const controls = useRef(null);
  const rotationAnimation = useRef(null);
  const [isHome, setIsHome] = useState(true);
  const { pgn, setPgn } = useGlobalContext();
  const location = useLocation();
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

    const animateRotation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentAngle = startAngle + (endAngle - startAngle) * progress;

      const radius = Math.sqrt(
        Math.pow(camera.current.position.x, 2) +
          Math.pow(camera.current.position.z, 2)
      );

      camera.current.position.x = radius * Math.cos(currentAngle);
      camera.current.position.z = radius * Math.sin(currentAngle);
      camera.current.lookAt(0, 0, 0);
      controls.current.update();

      if (progress < 1) {
        rotationAnimation.current = requestAnimationFrame(animateRotation);
      } else {
        rotationAnimation.current = null;
        // console.log("Rotation complete");
      }
    };

    rotationAnimation.current = requestAnimationFrame(animateRotation);
  };

  useEffect(() => {
    location.pathname === "/" ? setIsHome(false) : setIsHome(true);
    const initialize = () => {
      camera.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer.current = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.current.setSize(window.innerWidth, window.innerHeight);

      // Load background textures
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load(
        [
          "/ThreeDChess/skybox/right.png", // px
          "/ThreeDChess/skybox/left.png", // nx
          "/ThreeDChess/skybox/top.png", // py
          "/ThreeDChess/skybox/bottom.png", // ny
          "/ThreeDChess/skybox/front.png", // pz
          "/ThreeDChess/skybox/back.png", // nz
        ],
        () => {
          console.log("Cube texture loaded successfully");
          scene.current.background = texture;
        },
        undefined,
        (error) => {
          console.error("Error loading cube texture:", error);
        }
      );

      const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5); // Soft white light
      scene.current.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffffff, 1); // Bright white light
      directionalLight.position.set(0, 10, 10);
      scene.current.add(directionalLight);

      // Add axes helper
      // const axesHelper = new THREE.AxesHelper(5);
      // scene.current.add(axesHelper);

      // Set the initial camera position
      camera.current.position.set(-7.5, 7.5, 0);
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
        // console.log("Space pressed, starting rotation");
        rotateCamera();
      }
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
      scene.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      renderer.current.dispose();
    };
  }, [pgn]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      {/* <div className="hidden"> */}
      <Link
        to="/pgn"
        className="rounded px-4 py-2 z-20 absolute top-[2rem] right-[2rem]"
        onClick={() => {
          setIsHome(false);
          // console.log("changed");
        }}
      >
        Add PGN
      </Link>
      <ChessBoard scene={scene.current} />
      <ChessPieces scene={scene.current} rotateCamera={rotateCamera} />
      {/* </div> */}
    </>
  );
};

export default Chess;
