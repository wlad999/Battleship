"use client";
import React, { useState } from "react";
import cls from "classnames";
import Field from "./components/field";
import Animations from "./components/animations";
import Header from "./components/header";
import { initialGameState } from "../utils/initialGameState";
import VolumeControl from "./components/volumeControl";

import { playSound, stopAllSound } from "../utils/audio/soundManager";
import { useAudioUnlock } from "../hooks/useAudioUnlock";
import { useGameAudio } from "../hooks/useGameAudio";
import styles from "./page.module.css";

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);
  const { started, winner, shootDelay, isPlayerTurn } = gameState;

  useAudioUnlock();
  useGameAudio(started, winner);

  const handlePlaceShips = () => {
    playSound("button");
    setGameState((prev) => ({
      ...prev,
      placeShips: prev.placeShips === null ? true : !prev.placeShips,
    }));
  };

  const handleRestart = () => {
    playSound("button");
    stopAllSound();
    playSound("ocean");
    setGameState(initialGameState);
  };

  return (
    <div className={cls(styles.container, { [styles.start]: started })}>
      <VolumeControl
        onSetGameState={setGameState}
        shootDelay={shootDelay}
        started={started}
      />
      <Header
        gameState={gameState}
        setGameState={setGameState}
        onHandlePlaceShips={handlePlaceShips}
        onHandleRestart={handleRestart}
      />
      <Animations
        winner={winner}
        started={started}
        isPlayerTurn={isPlayerTurn}
        shootDelay={shootDelay}
      />
      <div className={styles.page}>
        <Field gameState={gameState} setGameState={setGameState} />
        <Field gameState={gameState} setGameState={setGameState} isPlayer />
      </div>
    </div>
  );
}
