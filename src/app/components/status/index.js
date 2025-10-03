"use client";
import cls from "classnames";
import { groupAndSortShips } from "@/gameLogic";
import { PLAYER, ENEMY } from "@/constants";

import styles from "./styles.module.scss";

function Status({ shipsStatus = {}, isPlayer, started }) {
  if (!Object.values(shipsStatus).length || !started) {
    return;
  }

  const groupedShips = groupAndSortShips(shipsStatus);

  return (
    <>
      <p className={styles.title}>{isPlayer ? PLAYER : ENEMY} fleet status</p>
      <div className={styles.statusContainer}>
        {groupedShips.map((group, groupIdx) => (
          <div className={styles.group} key={groupIdx}>
            {group.map((ship) => (
              <div
                className={cls(
                  styles.ship,
                  styles[`ship-${ship.cells.length}`],
                  { [styles.destroyed]: ship.isDestroyed }
                )}
                key={ship.id}
              >
                {ship.cells.map((cellIdx) => (
                  <div key={cellIdx} className={styles.cell} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Status;
