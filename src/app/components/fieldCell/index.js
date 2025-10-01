import cls from "classnames";
import CellEvents from "../cellEvents";
import Ship from "../ship";
import { PLAYER, ENEMY } from "../../../utils/constants";

import styles from "./styles.module.scss";

function FieldCell({
  idx,
  item,
  isPlayer,
  shipsStatus,
  isPlayerTurn,
  showShips,
  handleClick,
  winner,
}) {
  return (
    <div
      key={idx}
      id={`${isPlayer ? PLAYER : ENEMY}-${idx}`}
      onClick={() => handleClick(idx)}
      className={cls(styles.cell, {
        [styles.enemyField]: !isPlayer,
        [styles.enemyTurn]: !isPlayer && !isPlayerTurn && !winner,
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
  );
}

export default FieldCell;
