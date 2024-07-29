import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { coordinates } from "./coordinates";
import { gsap } from "gsap";
import { convertPgnToMoves } from "./pgnConverter";
import { useGlobalContext } from "./Context";

const ChessPieces = ({ scene, rotateCamera }) => {
  const pieces = useRef(new Map());

  const [board, setBoard] = useState(new Map());
  const isInitialized = useRef(false);
  const { pgn, audioRef } = useGlobalContext();

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      console.error("audioRef.current is null");
    }
  };

  const loadModel = (square, modelPath, name) => {
    const { x, z } = coordinates[square];
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(x, 0.0, z); // Position model on top of the square
        model.scale.set(0.2, 0.2, 0.2);
        model.name = name;
        pieces.current.set(square, model); // Store piece by square position
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  };

  const removePiece = (square) => {
    const piece = pieces.current.get(square);
    if (piece) {
      scene.remove(piece);
      piece.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      pieces.current.delete(square);
    }
  };

  const movePiece = (startSquare, endSquare) => {
    const piece = pieces.current.get(startSquare);
    const { x, z } = coordinates[endSquare];

    if (piece) {
      // Remove any piece at the destination square

      setTimeout(() => playSound(), 1300);
      // Move piece using gsap
      gsap.to(piece.position, {
        duration: 2, // Duration of the move in seconds
        x: x,
        z: z,
        ease: "power2.inOut",
        onComplete: () => {
          removePiece(endSquare);
          pieces.current.delete(startSquare); // Remove the reference from the map
          pieces.current.set(endSquare, piece); // Update the reference in the map
          setBoard((prevBoard) => {
            const newBoard = new Map(prevBoard);
            newBoard.delete(startSquare);
            newBoard.set(endSquare, piece);
            return newBoard;
          });
        },
      });
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const animateMoves = async (moves) => {
    for (const move of moves) {
      const [startSquare, endSquare, isCastle] = [
        move.from,
        move.to,
        move.isCastle,
      ];
      if (startSquare && endSquare) {
        movePiece(startSquare, endSquare);
        await delay(2000); // Wait for 2 seconds before making the next move
        if (!isCastle) {
          rotateCamera();
          await delay(2000);
        }
      }
    }
  };

  useEffect(() => {
    if (!scene || isInitialized.current) return;

    // Clear any existing pieces
    pieces.current.forEach((piece) => scene.remove(piece));
    pieces.current.clear();

    // Load pawns
    const alpha = "abcdefgh";
    for (let i = 1; i <= 8; i++) {
      loadModel(
        `${alpha[i - 1]}2`,
        "/ThreeDChess/white/white-pawn.glb",
        `white-pawn-${i}`
      ); // White pawns
      loadModel(
        `${alpha[i - 1]}7`,
        "/ThreeDChess/black/black-pawn.glb",
        `black-pawn-${i}`
      ); // Black pawns
    }

    // Load other pieces (rooks, knights, bishops, queens, kings)
    loadModel("a1", "/ThreeDChess/white/white-rook.glb", "white-rook-a1");
    loadModel("h1", "/ThreeDChess/white/white-rook.glb", "white-rook-h1");
    loadModel("a8", "/ThreeDChess/black/black-rook.glb", "black-rook-a8");
    loadModel("h8", "/ThreeDChess/black/black-rook.glb", "black-rook-h8");
    loadModel("b1", "/ThreeDChess/white/white-knight.glb", "white-knight-b1");
    loadModel("g1", "/ThreeDChess/white/white-knight.glb", "white-knight-g1");
    loadModel("b8", "/ThreeDChess/black/black-knight.glb", "black-knight-b8");
    loadModel("g8", "/ThreeDChess/black/black-knight.glb", "black-knight-g8");
    loadModel("c1", "/ThreeDChess/white/white-bishop.glb", "white-bishop-c1");
    loadModel("f1", "/ThreeDChess/white/white-bishop.glb", "white-bishop-f1");
    loadModel("c8", "/ThreeDChess/black/black-bishop.glb", "black-bishop-c8");
    loadModel("f8", "/ThreeDChess/black/black-bishop.glb", "black-bishop-f8");
    loadModel("d1", "/ThreeDChess/white/white-queen.glb", "white-queen-d1");
    loadModel("d8", "/ThreeDChess/black/black-queen.glb", "black-queen-d8");
    loadModel("e1", "/ThreeDChess/white/white-king.glb", "white-king-e1");
    loadModel("e8", "/ThreeDChess/black/black-king.glb", "black-king-e8");

    // Parse PGN and animate moves
    const moves = convertPgnToMoves(pgn);
    setTimeout(() => animateMoves(moves), 5000);

    isInitialized.current = true;

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
      pieces.current.clear();
    };
  }, [scene]);

  return null;
};

export default ChessPieces;
