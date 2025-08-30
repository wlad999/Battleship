"use client";
import React from "react";
import cls from "classnames";
import { PLAYER, ENEMY } from "../../../utils/constants";
import styles from "./styles.module.scss";

function Header({
  isPlayerTurn,
  showShips,
  started,
  winner,
  onHandlePlaceShips,
  onHandleRestart,
  onSetShowShips,
  onSetStarted,
}) {
  return (
    <>
      {!winner && started && (
        <h2 className={styles.title}>{isPlayerTurn ? PLAYER : ENEMY} turn</h2>
      )}
      {!started && (
        <div className={styles.startButtonContainer}>
          <button
            className={cls(styles.button, styles.startButton)}
            onClick={() => onSetStarted(true)}
          >
            start a battle
          </button>
          <button className={styles.button} onClick={onHandlePlaceShips}>
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
          <div>
            <button className={styles.button} onClick={onHandleRestart}>
              To battle!
            </button>
            {winner === ENEMY && !showShips && (
              <button
                className={cls(styles.button, styles.showShipsButton)}
                onClick={() => onSetShowShips(true)}
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
