import React from "react";
import { useGlobalContext } from "./Context";

const PlaySound = () => {
  const { audioRef } = useGlobalContext();

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div>
      <audio ref={audioRef}>
        <source src="/ThreeDChess/piecemove.mp3" type="audio/mpeg" />
      </audio>
      {/* <button onClick={playSound}>Play Sound</button> */}
    </div>
  );
};

export default PlaySound;
