"use client";
import { useState, useEffect, useCallback } from "react";
import cls from "classnames";
import Status from "../status";
import {
  placeShipsOnField,
  shootRandomCell,
  huntingShip,
} from "../../../utils/gameLogic";
import styles from "./styles.module.scss";

function Field({
  isPlayer = false,
  isPlayerTurn,
  onSetIsPlayerTurn,
  onSetWinner,
  winner,
  placeShips,
  started,
  showShips = false,
}) {
  const [array, setArray] = useState([]);
  const [shipsStatus, setShipsStatus] = useState({});
  const [huntingHistory, setHuntingHistory] = useState(null);
  const [nextCpuShoot, setNextCpuShoot] = useState(null);

  useEffect(() => {
    if (!isPlayer && placeShips !== null) {
      return;
    }

    if (started) {
      return;
    }
    const { shipsStatus, filledField } = placeShipsOnField();
    setArray(filledField);
    setShipsStatus(shipsStatus);
  }, [placeShips, started]);

  useEffect(() => {
    if (!array.length) return;
    const targetedShipParts = array.filter(
      (item) => item.targeted && item.shipPart
    );
    if (targetedShipParts.length > 19) {
      onSetWinner(isPlayer ? "Enemy" : "Player");
    }
  }, [array]);

  useEffect(() => {
    if (!isPlayer) {
      return;
    }
    const shootWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        (!isPlayerTurn && !huntingHistory) ||
        (!isPlayerTurn && !huntingHistory && !!nextCpuShoot)
      ) {
        shootRandomCell({
          array,
          setArray,
          shipsStatus,
          setShipsStatus,
          onSetIsPlayerTurn,
          setHuntingHistory,
          setNextCpuShoot,
        });
      }
      if (
        (!isPlayerTurn && huntingHistory) ||
        (!isPlayerTurn && huntingHistory && !!nextCpuShoot)
      ) {
        huntingShip(
          array,
          setArray,
          shipsStatus,
          setShipsStatus,
          onSetIsPlayerTurn,
          setHuntingHistory,
          huntingHistory,
          setNextCpuShoot
        );
      }
    };
    shootWithDelay();
  }, [isPlayerTurn, nextCpuShoot]);

  const handleClick = useCallback((idx) => {
    if (isPlayer || !isPlayerTurn) {
      return;
    }

    if (array[idx].targeted || winner) {
      return;
    }

    if (!started) {
      return;
    }

    const arrayWithTargeted = [...array];
    arrayWithTargeted[idx].targeted = true;
    const shipId = arrayWithTargeted[idx].shipId;

    if (shipId) {
      const isDestroyed = shipsStatus[shipId].cells
        .map((idx) => arrayWithTargeted[idx].targeted)
        .every((targeted) => targeted);

      setShipsStatus((prev) => ({
        ...prev,
        [shipId]: { ...prev[shipId], isDestroyed },
      }));
    }
    setArray(arrayWithTargeted);
    onSetIsPlayerTurn(!!shipId);
  });

  return (
    <div className={styles.container}>
      <Status shipsStatus={shipsStatus} isPlayer={isPlayer} started={started} />
      <h3>{isPlayer ? "Player fleet" : "Enemy fleet"}</h3>
      <div className={styles.wrapper}>
        {array.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            className={cls(styles.cell, {
              [styles.shipPart]:
                (item.shipPart && isPlayer) ||
                shipsStatus[item.shipId]?.isDestroyed ||
                (item.shipPart && showShips),
              [styles.targetedEmptyCell]: item.targeted && !item.shipPart,
              [styles.targetedShipCell]:
                item.targeted && item.shipPart && !item.destroyed,
              [styles.destroyed]:
                shipsStatus[item.shipId]?.isDestroyed && item.shipPart,
              [styles.nextToDestroyedShip]: item.nextToDestroyedShip,
            })}
          />
        ))}
      </div>
    </div>
  );
}

export default Field;
