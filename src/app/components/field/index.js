"use client";
import { useCallback } from "react";
import cls from "classnames";
import CellEvents from "../cellEvents";
import HitWaveSVG from "../hitWave";
import Ship from "../ship";
import Status from "../status";
import { PLAYER, ENEMY } from "../../../utils/constants";
import { playerShoot } from "../../../utils/gameLogic";
import { useAutoPlaceShips } from "../../../hooks/useAutoPlaceShips";
import { useCpuAutoShoot } from "../../../hooks/useCpuAutoShoot";
import { useGameOverCheck } from "../../../hooks/useGameOverCheck";
import styles from "./styles.module.scss";

function Field({ isPlayer = false, gameState, setGameState }) {
  const fieldKey = isPlayer ? PLAYER : ENEMY;
  const fieldState = gameState[fieldKey];
  const { battleField, shipsStatus, lastHitId } = fieldState;

  const {
    nextCpuShoot,
    isPlayerTurn,
    winner,
    placeShips,
    started,
    showShips,
    shootDelay,
  } = gameState;

  useAutoPlaceShips({ isPlayer, placeShips, started, fieldKey, setGameState });

  useGameOverCheck({
    battleField,
    shipsStatus,
    isPlayer,
    setGameState,
  });

  useCpuAutoShoot({
    isPlayer,
    winner,
    isPlayerTurn,
    shipsStatus,
    shootDelay,
    gameState,
    setGameState,
    nextCpuShoot,
  });

  const handleClick = useCallback(
    (idx) => {
      if (isPlayer || !isPlayerTurn || !started || winner) return;
      if (battleField[idx].targeted) return;

      const newGameState = playerShoot(gameState, idx);
      setGameState(newGameState);
    },
    [fieldState, gameState, isPlayer, isPlayerTurn]
  );

  return (
    <div className={styles.container}>
      <HitWaveSVG lastHitId={lastHitId} isPlayer={isPlayer} active />
      <Status shipsStatus={shipsStatus} isPlayer={isPlayer} started={started} />
      <h3>{isPlayer ? `${PLAYER} fleet` : `${ENEMY} fleet`}</h3>
      <div className={styles.wrapper}>
        {battleField.map((item, idx) => (
          <div
            key={idx}
            id={`${isPlayer ? PLAYER : ENEMY}-${idx}`}
            onClick={() => handleClick(idx)}
            className={cls(styles.cell, {
              [styles.enemyField]: !isPlayer,
              [styles.enemyTurn]: !isPlayer && !isPlayerTurn,
            })}
          >
            <CellEvents item={item} shipsStatus={shipsStatus} />
            <Ship
              shipsStatus={shipsStatus}
              item={item}
              isPlayer={isPlayer}
              showShips={showShips}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Field;
