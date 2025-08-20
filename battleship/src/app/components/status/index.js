"use client";
import cls from "classnames";
import styles from "./styles.module.scss";

function Status({ shipsStatus }) {
  if (!Object.values(shipsStatus).length) {
    return;
  }

  const ships = Object.values(shipsStatus);
  const groupedShips = [
    ships.filter((ship) => ship.cells.length === 4),
    ships.filter((ship) => ship.cells.length === 3),
    ships.filter((ship) => ship.cells.length === 2),
    ships.filter((ship) => ship.cells.length === 1),
  ].map((group) =>
    group.sort((a, b) => Number(a.isDestroyed) - Number(b.isDestroyed))
  );

  return (
    <>
      <p>Fleet status</p>
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
