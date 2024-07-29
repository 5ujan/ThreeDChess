import React from "react";
import Chess from "./pages/Chess";
import PGNPage from "./pages/PGNPage";
import AppProvider from "./components/Context";
import PlaySound from "./components/PlaySound";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <AppProvider>
        <BrowserRouter basename="/ThreeDChess/">
          <Routes>
            <Route path="/" Component={Chess}></Route>
            <Route path="/pgn" Component={PGNPage}></Route>
            {/* <Route path="/" Component={Home}></Route> */}
          </Routes>
        </BrowserRouter>
        <PlaySound></PlaySound>
      </AppProvider>
    </>
  );
};

export default App;
