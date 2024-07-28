import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { coordinates } from "./coordinates";
import { gsap } from "gsap";
import { convertPgnToMoves } from "./pgnConverter";

const ChessPieces = ({ scene, rotateCamera }) => {
  const pieces = useRef(new Map());
  const [board, setBoard] = useState(new Map());
  const isInitialized = useRef(false);
  const pgn = `

1. e4 c6 2. f4 d5 3. e5 f6 4. Nf3 Bg4 5. Be2 fxe5 6. fxe5 Nd7 7. d4 e6 8. h3
Bxf3 9. Bxf3 c5 10. O-O cxd4 11. Na3 Nh6 12. Bxh6 gxh6 13. c3 dxc3 14. bxc3 Rc8
15. Nb5 Qb6+ 16. Nd4 Bc5 17. Rb1 Bxd4+ 18. Qxd4 Qxd4+ 19. cxd4 Rc2 20. a3 b6 21.
Bh5+ Ke7 22. Bf3 Rhc8 23. Bg4 R8c4 24. Rfd1 Ra2 25. Be2 Rcc2 26. Bd3 Rxg2+ 27.
Kh1 Rh2+ 28. Kg1 Rxh3 29. Bxh7 Raxa3 30. Rf1 Raf3 31. Bg6 Rhg3+ 32. Kh2 Rxf1 33.
Rxf1 Rxg6 0-1`; // Example PGN

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
     console.log("here");
     if (startSquare && endSquare) {
       movePiece(startSquare, endSquare);
       console.log("move");
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
      loadModel(`${alpha[i - 1]}2`, "/white/white-pawn.glb", `white-pawn-${i}`); // White pawns
      loadModel(`${alpha[i - 1]}7`, "/black/black-pawn.glb", `black-pawn-${i}`); // Black pawns
    }

    // Load other pieces (rooks, knights, bishops, queens, kings)
    loadModel("a1", "/white/white-rook.glb", "white-rook-a1");
    loadModel("h1", "/white/white-rook.glb", "white-rook-h1");
    loadModel("a8", "/black/black-rook.glb", "black-rook-a8");
    loadModel("h8", "/black/black-rook.glb", "black-rook-h8");
    loadModel("b1", "/white/white-knight.glb", "white-knight-b1");
    loadModel("g1", "/white/white-knight.glb", "white-knight-g1");
    loadModel("b8", "/black/black-knight.glb", "black-knight-b8");
    loadModel("g8", "/black/black-knight.glb", "black-knight-g8");
    loadModel("c1", "/white/white-bishop.glb", "white-bishop-c1");
    loadModel("f1", "/white/white-bishop.glb", "white-bishop-f1");
    loadModel("c8", "/black/black-bishop.glb", "black-bishop-c8");
    loadModel("f8", "/black/black-bishop.glb", "black-bishop-f8");
    loadModel("d1", "/white/white-queen.glb", "white-queen-d1");
    loadModel("d8", "/black/black-queen.glb", "black-queen-d8");
    loadModel("e1", "/white/white-king.glb", "white-king-e1");
    loadModel("e8", "/black/black-king.glb", "black-king-e8");

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
