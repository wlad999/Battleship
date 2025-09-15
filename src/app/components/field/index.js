"use client";
import { useEffect, useCallback } from "react";
import cls from "classnames";
import Status from "../status";
import { PLAYER, ENEMY } from "../../../utils/constants";
import HitWaveSVG from "../hitWave";
import {
  placeShipsOnField,
  isGameOver,
  cpuShoot,
  playerShoot,
} from "../../../utils/gameLogic";
import Ship from "../ship";
import styles from "./styles.module.scss";

function Field({ isPlayer = false, gameState, setGameState }) {
  const fieldKey = isPlayer ? PLAYER : ENEMY;
  const fieldState = gameState[fieldKey];
  const { battleField, shipsStatus, lastHitId } = fieldState;

  const { nextCpuShoot, isPlayerTurn, winner, placeShips, started, showShips } =
    gameState;

  useEffect(() => {
    if ((!isPlayer && placeShips !== null) || started) {
      return;
    }

    const { shipsStatus, filledField } = placeShipsOnField();
    setGameState((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        battleField: filledField,
        shipsStatus,
      },
    }));
  }, [placeShips, started, isPlayer]);

  useEffect(() => {
    if (!battleField.length) return;
    const hasGameEnded = isGameOver(shipsStatus);

    if (hasGameEnded) {
      setGameState((prev) => ({
        ...prev,
        winner: isPlayer ? ENEMY : PLAYER,
      }));
    }
  }, [battleField, shipsStatus]);

  useEffect(() => {
    const hasGameEnded = isGameOver(shipsStatus);
    //return from function if game is over to avoid extra shot
    // shout on the player's field only
    if (!isPlayer || winner || isPlayerTurn || hasGameEnded) {
      return;
    }

    const shootWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newGameState = cpuShoot(gameState);
      setGameState(newGameState);
    };
    shootWithDelay();
  }, [isPlayerTurn, nextCpuShoot]);

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
            className={styles.cell}
          >
            <div
              className={cls(styles.imgs, {
                [styles.destroyed]:
                  shipsStatus[item.shipId]?.isDestroyed && item.shipId,
                [styles.targetedShipCell]:
                  item.targeted && item.shipId && !item.destroyed,
                [styles.targetedEmptyCell]: item.targeted && !item.shipId,
              })}
            />
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
