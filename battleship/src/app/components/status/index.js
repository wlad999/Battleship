"use client";
import cls from "classnames";
import { groupAndSortShips } from "@/utils/placementLogic";

import styles from "./styles.module.scss";

function Status({ shipsStatus = {}, isPlayer }) {
  if (!Object.values(shipsStatus).length) {
    return;
  }

  const groupedShips = groupAndSortShips(shipsStatus);

  return (
    <>
      <p>{isPlayer ? "Player" : "Enemy"} fleet status</p>
      <div className={styles.statusContainer}>
        {groupedShips.map((group, groupIdx) => (
          <div className={styles.group} key={groupIdx}>
            {group.map((ship) => (
              <div className={styles.ship} key={ship.id}>
                {ship.cells.map((cellIdx) => (
                  <div
                    key={cellIdx}
                    className={cls(styles.cell, {
                      [styles.destroyedCell]: ship.isDestroyed,
                    })}
                  >
                    <div
                      className={cls(styles.cellStatus, {
                        [styles.shipPart]: !ship.isDestroyed,
                        [styles.destroyed]: ship.isDestroyed,
                      })}
                    />
                  </div>
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
