import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Chess } from "chess.js";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/Context";

const PGNPage = () => {
  const navigate = useNavigate();
  const chess = new Chess();
  const canvasRef = useRef(null);
  const scene = useRef(new THREE.Scene());
  const camera = useRef(null);
  const renderer = useRef(null);
  const controls = useRef(null);
  const rotationAnimation = useRef(null);
  const { pgn, setPgn } = useGlobalContext();
  const [text, setText] = useState("");
  const location = useLocation();
  const [isErr, setErr] = useState(false);

  const handleChange = async (e) => {
    setText(e.target.value);
    try {
      chess.loadPgn(e.target.value);

      setErr(false);
    } catch (err) {
      setErr(true);
    }
  };

  const handleSubmit = () => {
    setPgn(text);
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
      }
    };

    rotationAnimation.current = requestAnimationFrame(animateRotation);
  };

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
          // console.log("Cube texture loaded successfully")
          scene.current.background = texture;
        },
        undefined,
        (error) => {
          console.error("Error loading cube texture:", error);
        }
      );

      //   const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5); // Soft white light
      //   scene.current.add(ambientLight);

      //   const directionalLight = new THREE.DirectionalLight(0xffffffff, 1); // Bright white light
      //   directionalLight.position.set(0, 10, 10);
      //   scene.current.add(directionalLight);

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
      <div
        className={`z-10 absolute mt-12 bg-gray-800 bg-opacity-50 w-[80vw] h-[70vh] rounded-md right-[10vw] flex flex-col items-center gap-3`}
      >
        <h1 className="text-center text-xl p-3">Add PGN Here</h1>
        <textarea
          id="textarea"
          value={text}
          onChange={handleChange}
          className={`w-full bg-transparent  flex-1  text-white text-opacity-70 p-10 border-none outline-none resize-none ${
            isErr ? "underline decoration-red-500" : ""
          }`}
        />
        {isErr ? (
          <div className="p-4 text-red-500 font-bold mt-[-2rem]">
            Invalid PGN{" "}
          </div>
        ) : (
          <button
            className="bg-blue-600 p-2 px-4 mx-auto m-3 rounded"
            onClick={() => {
              setPgn(text)
              navigate("/");
            }}
          >
            View Game
          </button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "block" }} />
      {/* <div className="hidden"> */}

      {/* </div> */}
    </>
  );
};

export default PGNPage;
