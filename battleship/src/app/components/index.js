"use client";
import { useState, useEffect } from "react";
import cls from "classnames";
import { placeShipsOnField } from "../../utils/placementLogic";
import styles from "./styles.module.scss";

function Field() {
  const [array, setArray] = useState(
    Array(100)
      .fill(null)
      .map(() => ({ shipPart: 0, targeted: false }))
  );
  //console.log("array!!!", array);
  useEffect(() => {
    placeShipsOnField(array, setArray);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {array.map((item, idx) => (
          <div
            key={idx}
            className={cls(styles.cell, { [styles.shipPart]: item.shipPart })}
          >
            {idx}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Field;
