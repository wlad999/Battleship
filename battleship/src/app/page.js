"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Field from "./components";
import cls from "classnames";

export default function Home() {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [started, setStarted] = useState(false);
  const [placeShips, setPlaceShips] = useState(null);

  const handlePlaceShips = () => {
    if (placeShips === null) {
      setPlaceShips(true);
      return;
    }
    setPlaceShips((prev) => !prev);
  };

  const handleRestart = () => {
    setWinner(null);
    setStarted(false);
    setPlaceShips(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className={styles.container}>
      {!winner && started && (
        <h1 className={styles.title}>
          {isPlayerTurn ? "Player" : "Enemy"} turn
        </h1>
      )}

      {!started && (
        <div>
          <button
            className={cls(styles.button, styles.startButton)}
            onClick={() => setStarted(true)}
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
          <h1>
            {winner === "Enemy"
              ? "Captain, you've lost! Don't be a coward, try again!"
              : "Congratulations, General, you won! You are cooler than AI!"}
          </h1>
          <button className={styles.button} onClick={handleRestart}>
            To battle!
          </button>
        </>
      )}
      <div className={styles.page}>
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
          onSetWinner={setWinner}
          winner={winner}
          placeShips={placeShips}
          started={started}
        />
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
          onSetWinner={setWinner}
          winner={winner}
          placeShips={placeShips}
          started={started}
          isPlayer
        />
      </div>
    </div>
  );
}
