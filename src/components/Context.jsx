import { createContext, useContext, useState, useRef, createRef } from "react";

const AppContext = createContext();
function AppProvider({ children }) {
    const audioRef = useRef(null)
    const [pgn, setPgn] = useState(`
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.07.24"]
[Round "?"]
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.07.29"]
[Round "?"]
[White "5UJ4N"]
[Black "ajique"]
[Result "1-0"]
[ECO "B06"]
[WhiteElo "929"]
[BlackElo "941"]
[TimeControl "180"]
[EndTime "2:32:51 PDT"]
[Termination "5UJ4N won by resignation"]

1. e4 g6 2. f4 Bg7 3. Nf3 e6 4. d4 Ne7 5. e5 d5 6. Bb5+ c6 7. Bd3 O-O 8. O-O Nf5
9. Nc3 Bd7 10. g4 Ne7 11. h3 f6 12. Be3 f5 13. gxf5 exf5 14. Ng5 b6 15. Qe1 Bc8
16. Qh4 h6 17. Nf3 Nd7 18. Rf2 c5 19. Rg2 cxd4 20. Bxd4 Nc5 21. Bb5 Be6 22. Rd1
a6 23. Ba4 Nxa4 24. Nxa4 b5 25. Nc5 Qc7 26. Nxe6 Qxc2 27. Rxc2 1-0
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
