"use client";
import { useState, useEffect } from "react";
import cls from "classnames";
import {
  placeShipsOnField,
  shootRandomCell,
  huntingShip,
} from "../../utils/placementLogic";
import styles from "./styles.module.scss";

function Field({
  isPlayer = false,
  isPlayerTurn,
  onSetIsPlayerTurn,
  onSetWinner,
  winner,
  placeShips,
  started,
}) {
  const [array, setArray] = useState([]);
  const [shipsStatus, setShipsStatus] = useState({});
  const [huntingHistory, setHuntingHistory] = useState(null);

  useEffect(() => {
    if (placeShips !== null && !isPlayer) {
      return;
    }
    const { shipsStatus, filledField } = placeShipsOnField();
    setArray(filledField);
    setShipsStatus(shipsStatus);
  }, [placeShips]);

  useEffect(() => {
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
    if (!isPlayerTurn && !huntingHistory) {
      shootRandomCell({
        array,
        setArray,
        shipsStatus,
        setShipsStatus,
        onSetIsPlayerTurn,
        setHuntingHistory,
      });
    }
    if (!isPlayerTurn && huntingHistory) {
      huntingShip(
        array,
        setArray,
        shipsStatus,
        setShipsStatus,
        onSetIsPlayerTurn,
        setHuntingHistory,
        huntingHistory
      );
    }
  }, [isPlayerTurn]);

  const handleClick = (idx) => {
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
    onSetIsPlayerTurn(false);
  };

  return (
    <div className={styles.container}>
      <h3>{isPlayer ? "Player" : "Enemy"}</h3>
      <div className={styles.wrapper}>
        {array.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            className={cls(styles.cell, {
              //[styles.shipPart]:
              //  item.shipPart || shipsStatus[item.shipId]?.isDestroyed,
              [styles.shipPart]:
                (item.shipPart && isPlayer) ||
                shipsStatus[item.shipId]?.isDestroyed,
              //[styles.nextToShipCell]: item.nextToShipCell,
              [styles.targetedEmptyCell]: item.targeted && !item.shipPart,
              [styles.targetedShipCell]:
                item.targeted && item.shipPart && !item.destroyed,
              [styles.destroyed]:
                shipsStatus[item.shipId]?.isDestroyed && item.shipPart,
              [styles.nextToDestroyedShip]: item.nextToDestroyedShip,
            })}
          >
            {/*{idx}*/}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Field;
