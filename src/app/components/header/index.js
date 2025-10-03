"use client";
import React from "react";
import cls from "classnames";
import { PLAYER, ENEMY } from "@/constants";
import { initialGameState } from "@/state";
import { playSound, stopAllSound } from "@/audio/soundManager";

import styles from "./styles.module.scss";

function Header({ gameState, setGameState }) {
  const { isPlayerTurn, showShips, started, winner } = gameState;

  const handleStart = () => {
    playSound("button");
    setGameState((prev) => ({ ...prev, started: true }));
  };

  const handleShowShips = () => {
    playSound("button");
    setGameState((prev) => ({ ...prev, showShips: true }));
  };

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
    <>
      {!winner && started && (
        <h2 className={styles.title}>{isPlayerTurn ? PLAYER : ENEMY} turn</h2>
      )}
      {!started && (
        <div className={styles.startButtonContainer}>
          <button
            className={cls(styles.button, styles.startButton)}
            onClick={handleStart}
          >
            start a battle
          </button>
          <button className={styles.button} onClick={handlePlaceShips}>
            change placement
          </button>
        </div>
      )}
      {winner && (
        <>
          <h2 className={styles.title}>
            {winner === ENEMY
              ? "Captain, you've lost! Don't give up, try again!"
              : "Boom! You sunk ’em all, Admiral! Don’t retire yet — fight another battle for your country!"}
          </h2>
          <div className={styles.toBattleWrapper}>
            <button className={styles.button} onClick={handleRestart}>
              To battle!
            </button>
            {winner === ENEMY && !showShips && (
              <button
                className={cls(styles.button, styles.showShipsButton)}
                onClick={handleShowShips}
              >
                Show all ships
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Header;
