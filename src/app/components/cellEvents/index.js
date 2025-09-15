import cls from "classnames";
import styles from "./styles.module.scss";

function CellEvents({ item, shipsStatus }) {
  const { shipId, targeted } = item;
  const isDestroyed = shipsStatus[shipId]?.isDestroyed;

  return (
    <div
      className={cls(styles.cell, {
        [styles.destroyed]: isDestroyed && shipId,
        [styles.targetedShipCell]: targeted && shipId,
        [styles.targetedEmptyCell]: targeted && !shipId,
      })}
    />
  );
}

export default CellEvents;
