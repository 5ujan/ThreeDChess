// ChessPieces.jsx
import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { coordinates } from "./coordinates"; // Import the coordinates

const ChessPieces = ({ scene }) => {
  const pieces = useRef([]);

  const loadModel = (square, modelPath) => {
    const { x, z } = coordinates[square];
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(x, 0.0, z); // Position model on top of the square
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
    const alpha = "abcdefgh";
    for (let i = 1; i <= 8; i++) {
      loadModel(`${alpha[i - 1]}2`, "/white/white-pawn.glb"); // White pawns
      loadModel(`${alpha[i - 1]}7`, "/black/black-pawn.glb"); // Black pawns
    }

    // Load rooks
    loadModel("a1", "/white/white-rook.glb");
    loadModel("h1", "/white/white-rook.glb");
    loadModel("a8", "/black/black-rook.glb");
    loadModel("h8", "/black/black-rook.glb");

    // Load knights
    loadModel("b1", "/white/white-knight.glb");
    loadModel("g1", "/white/white-knight.glb");
    loadModel("b8", "/black/black-knight.glb");
    loadModel("g8", "/black/black-knight.glb");

    // Load bishops
    loadModel("c1", "/white/white-bishop.glb");
    loadModel("f1", "/white/white-bishop.glb");
    loadModel("c8", "/black/black-bishop.glb");
    loadModel("f8", "/black/black-bishop.glb");

    // Load queens
    loadModel("d1", "/white/white-queen.glb");
    loadModel("d8", "/black/black-queen.glb");

    // Load kings
    loadModel("e1", "/white/white-king.glb");
    loadModel("e8", "/black/black-king.glb");

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
