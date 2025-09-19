"use client";
import React, { useState, useEffect } from "react";
import cls from "classnames";
import Field from "./components/field";
import Animations from "./components/animations";
import Header from "./components/header";
import { initialGameState } from "../utils/initialGameState";
import { PLAYER } from "../utils/constants";
import VolumeControl from "./components/volumeControl";

import { playSound, stopAllSound } from "../utils/audio/soundManager";

import styles from "./page.module.css";

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);

  useEffect(() => {
    if (gameState.started) {
      stopAllSound();
      playSound("ocean");
      playSound("start");
    }
    if (gameState.winner) {
      stopAllSound();
      if (gameState.winner === PLAYER) {
        playSound("enemyDestroyed");
        playSound("victory");
      } else {
        playSound("loss");
      }
    }
  }, [gameState.started, gameState.winner]);

  const handlePlaceShips = () => {
    setGameState((prev) => ({
      ...prev,
      placeShips: prev.placeShips === null ? true : !prev.placeShips,
    }));
  };

  const handleRestart = () => {
    stopAllSound();
    playSound("ocean");
    setGameState(initialGameState);
  };

  return (
    <div
      className={cls(styles.container, { [styles.start]: gameState.started })}
    >
      <VolumeControl onSetGameState={setGameState} />
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
