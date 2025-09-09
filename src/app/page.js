"use client";
import React, { useState } from "react";
import cls from "classnames";
import Field from "./components/field";
import Animations from "./components/animations";
import Header from "./components/header";
import { initialGameState } from "../utils/initialGameState";

import styles from "./page.module.css";

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);

  const handlePlaceShips = () => {
    setGameState((prev) => ({
      ...prev,
      placeShips: prev.placeShips === null ? true : !prev.placeShips,
    }));
  };

  const handleRestart = () => {
    setGameState(initialGameState);
  };

  return (
    <div
      className={cls(styles.container, { [styles.start]: gameState.started })}
    >
      <Header
        gameState={gameState}
        setGameState={setGameState}
        onHandlePlaceShips={handlePlaceShips}
        onHandleRestart={handleRestart}
      />
      <Animations winner={gameState.winner} />
      <div className={styles.page}>
        <Field gameState={gameState} setGameState={setGameState} />
        <Field gameState={gameState} setGameState={setGameState} isPlayer />
      </div>
    </div>
  );
}
