"use client";
import React, { useState } from "react";
import cls from "classnames";
import Field from "./components/field";

import styles from "./page.module.css";

export default function Home() {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [started, setStarted] = useState(false);
  const [placeShips, setPlaceShips] = useState(null);
  const [showShips, setShowShips] = useState(false);

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
    setShowShips(false);
  };

  return (
    <div className={styles.container}>
      {!winner && started && (
        <h2 className={styles.title}>
          {isPlayerTurn ? "Player" : "Enemy"} turn
        </h2>
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
          <h2 className={styles.title}>
            {winner === "Enemy"
              ? "Captain, you've lost! Don't be a coward, try again!"
              : "Congratulations, General, you won! You are cooler than AI!"}
          </h2>
          <div>
            <button className={styles.button} onClick={handleRestart}>
              To battle!
            </button>
            {winner === "Enemy" && !showShips && (
              <button
                className={cls(styles.button, styles.showShipsButton)}
                onClick={() => setShowShips(true)}
              >
                Show all ships
              </button>
            )}
          </div>
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
          showShips={showShips}
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
