"use client";
import React, { useState } from "react";
import cls from "classnames";
import Field from "./components/field";
import Animations from "./components/animations";
import Header from "./components/header";

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
    <div className={cls(styles.container, { [styles.start]: started })}>
      <Header
        isPlayerTurn={isPlayerTurn}
        showShips={showShips}
        started={started}
        winner={winner}
        onHandlePlaceShips={handlePlaceShips}
        onHandleRestart={handleRestart}
        onSetShowShips={setShowShips}
        onSetStarted={setStarted}
      />
      <Animations winner={winner} />
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
