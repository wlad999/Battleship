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
import { initSoundsAsync } from "../utils/audio/soundAssets.js";
import { audioContext } from "../utils/audio/audioCore";
import styles from "./page.module.css";

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);

  useEffect(() => {
    let unlocked = false;

    const unlockAudio = async () => {
      if (unlocked) return;

      try {
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        initSoundsAsync();
        unlocked = true;
        window.removeEventListener("click", unlockAudio);
      } catch (err) {
        console.warn("Audio unlock failed:", err);
      }
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

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
      <VolumeControl
        onSetGameState={setGameState}
        shootDelay={gameState.shootDelay}
        started={gameState.started}
      />
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
