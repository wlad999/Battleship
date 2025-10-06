import cls from "classnames";
import Explosion from "../explosion";

import styles from "./styles.module.scss";

function CellEvents({ item, shipsStatus }) {
  const { shipId, targeted } = item;
  const isDestroyed = shipsStatus[shipId]?.isDestroyed;

  return (
    <>
      <div
        className={cls(styles.cell, {
          [styles.destroyed]: isDestroyed && shipId,
          [styles.targetedEmptyCell]: targeted && !shipId,
        })}
      >
        {targeted && shipId && !isDestroyed && <Explosion />}
      </div>
    </>
  );
}

export default CellEvents;
