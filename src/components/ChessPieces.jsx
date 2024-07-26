// ChessPieces.jsx
import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const ChessPieces = ({ scene }) => {
  const pieces = useRef([]);

  const loadModel = (x, z, modelPath) => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(x, 0.4, z); // Position model on top of the square
        model.scale.set(0.2, 0.2, 0.2);
        pieces.current.push(model);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  };

  useEffect(() => {
    if (!scene) return;

    // Clear any existing pieces
    pieces.current.forEach((piece) => scene.remove(piece));
    pieces.current = [];

    // Load pawns
    for (let i = -3.5; i <= 3.5; i++) {
      loadModel(i, -2.5, "/chess_pawn.glb"); // White pawns
      loadModel(i, 2.5, "/chess_pawn.glb"); // Black pawns
    }

    // Load other pieces as needed
    // For example, loading a single bishop:
    // loadModel(-2.5, -3.5, "/chess_bishop.glb"); // White bishop
    // loadModel(2.5, 3.5, "/chess_bishop.glb"); // Black bishop

    // You can add more pieces here, adjusting their positions and model paths

    return () => {
      pieces.current.forEach((piece) => {
        scene.remove(piece);
        piece.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            obj.material.dispose();
          }
        });
      });
    };
  }, [scene]);

  return null;
};

export default ChessPieces;
