// pgnConverter.js
import { Chess } from "chess.js";

export function convertPgnToMoves(pgn) {
  const chess = new Chess();

  try {
    chess.loadPgn(pgn);
  } catch (error) {
    console.error("Error loading PGN:", error.message);
    return [];
  }

  const convertedMoves = chess.history({ verbose: true }).flatMap((move) => {
    if (move.flags.includes("k")) {
      // King-side castling
      if (move.color === "w") {
        return [
          { from: move.from, to: move.to, isCastle: true }, // White king move
          { from: "h1", to: "f1", isCastle: true }, // White rook move
        ];
      } else {
        return [
          { from: move.from, to: move.to, isCastle: true }, // Black king move
          { from: "h8", to: "f8", isCastle: true }, // Black rook move
        ];
      }
    } else if (move.flags.includes("q")) {
      // Queen-side castling
      if (move.color === "w") {
        return [
          { from: move.from, to: move.to, isCastle: true }, // White king move
          { from: "a1", to: "d1", isCastle: true }, // White rook move
        ];
      } else {
        return [
          { from: move.from, to: move.to, isCastle: true }, // Black king move
          { from: "a8", to: "d8", isCastle: true }, // Black rook move
        ];
      }
    } else {
      return { from: move.from, to: move.to, isCastle: false };
    }
  });

  console.log(convertedMoves); // Log the moves
  return convertedMoves;
}
