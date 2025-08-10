"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Field from "./components";

export default function Home() {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  return (
    <div className={styles.container}>
      {!winner && (
        <h1 className={styles.title}>
          {isPlayerTurn ? "Player" : "Enemy"} turn
        </h1>
      )}
      {winner && (
        <>
          <h1>
            {winner === "Enemy"
              ? "Captain, you've lost! Don't be a coward, try again!"
              : "Congratulations, General, you won! You are cooler than AI!"}
          </h1>
          {/*<h3>
            <span className={styles.tryAgain} onClick={handlePlaceShips}>
              Try playing again!!!
            </span>
          </h3>*/}
        </>
      )}
      <div className={styles.page}>
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
          onSetWinner={setWinner}
          winner={winner}
        />
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
          onSetWinner={setWinner}
          winner={winner}
          isPlayer
        />
      </div>
    </div>
  );
}
