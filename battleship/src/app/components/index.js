"use client";
import { useState, useEffect } from "react";
import cls from "classnames";
import {
  placeShipsOnField,
  generateEmptyArray,
} from "../../utils/placementLogic";
import styles from "./styles.module.scss";

function Field() {
  const [placeShips, setPlaceShips] = useState(false);

  const [array, setArray] = useState(() => generateEmptyArray());

  useEffect(() => {
    placeShipsOnField(array, setArray);
  }, [placeShips]);

  const handlePlaceShips = () => {
    setArray(generateEmptyArray());
    setPlaceShips((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {array.map((item, idx) => (
          <div
            key={idx}
            className={cls(styles.cell, {
              [styles.shipPart]: item.shipPart,
              [styles.nextToShipCell]: item.nextToShipCell,
            })}
          >
            {idx}
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={handlePlaceShips}>
        place ships
      </button>
    </div>
  );
}

export default Field;
