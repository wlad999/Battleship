"use client";
import cls from "classnames";
import CellEvents from "../cellEvents";
import HitWaveSVG from "../hitWave";
import Ship from "../ship";
import Status from "../status";
import { PLAYER, ENEMY } from "../../../utils/constants";
import { useFieldLogic } from "../../../hooks/useFieldLogic";
import styles from "./styles.module.scss";

function Field({ isPlayer = false, gameState, setGameState }) {
  const {
    battleField,
    shipsStatus,
    lastHitId,
    started,
    isPlayerTurn,
    showShips,
    handleClick,
  } = useFieldLogic({ isPlayer, gameState, setGameState });

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
