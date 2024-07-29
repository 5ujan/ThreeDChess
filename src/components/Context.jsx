import { createContext, useContext, useState, useRef, createRef } from "react";

const AppContext = createContext();
function AppProvider({ children }) {
    const audioRef = useRef(null)
    const [pgn, setPgn] = useState(`
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.07.24"]
[Round "?"]
[White "5UJ4N"]
[Black "hameco"]
[Result "1-0"]
[ECO "C00"]
[WhiteElo "937"]
[BlackElo "919"]
[TimeControl "180"]
[EndTime "22:48:39 PDT"]
[Termination "5UJ4N won by checkmate"]

1. e4 e6 2. f4 c5 3. Nf3 d5 4. e5 f5 5. exf6 Nxf6 6. Bb5+ Bd7 7. Bxd7+ Nbxd7 8.
O-O Bd6 9. d3 h6 10. Re1 O-O 11. Ne5 Nxe5 12. fxe5 Bb8 13. exf6 Qxf6 14. Rf1 Qe7
15. Rxf8+ Qxf8 16. Qf3 Qe8 17. Bf4 g5 18. Bxb8 Rxb8 19. Nd2 Qe7 20. Rf1 h5 21.
Qxh5 Rf8 22. Rxf8+ Qxf8 23. Qxg5+ Kf7 24. Qf4+ Ke8 25. Qxf8+ Kxf8 26. Nb3 b6 27.
d4 c4 28. Nd2 b5 29. c3 Kf7 30. b3 Kf6 31. bxc4 bxc4 32. Kf2 Kf5 33. Kf3 Kf6 34.
Kf4 Ke7 35. Ke5 Kd7 36. Nf3 Ke7 37. Ng5 Kd7 38. Nxe6 Ke7 39. Nf4 a5 40. Nxd5+
Kd7 41. Ne3 Kc6 42. Nxc4 Kb5 43. Nxa5 Kxa5 44. h4 Ka4 45. h5 Ka3 46. h6 Kxa2 47.
h7 Kb2 48. h8=Q Kxc3 49. Qc8+ Kd3 50. d5 Ke3 51. d6 Kf2 52. d7 Kxg2 53. d8=R Kg3
54. Ke6 Kf4 55. Ke7 Ke4 56. Ke8 Ke5 57. Rd7 Kf6 58. Qd8+ Kf5 59. Qe7 Kf4 60. Rd6
Kf3 61. Rf6+ Kg4 62. Qg7+ Kh5 63. Rh6# 1-0
`);
  const temp = "works";

  return (
    <AppContext.Provider value={{ pgn, setPgn, temp, audioRef }}>
      {children}
    </AppContext.Provider>
  );
}

function useGlobalContext() {
  return useContext(AppContext);
}

export default AppProvider;

export { useGlobalContext };
