import { useEffect } from "react";
import cls from "classnames";
import { playSound } from "../../../utils/audio/soundManager";
import styles from "./styles.module.scss";

const labels = ["Instant", "Quick", "Engage", "Hold"];

function FireDelayPanel({ onSetGameState, shootDelay, started }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDelay = parseFloat(localStorage.getItem("shootDelay"));
      if (isFinite(savedDelay)) {
        onSetGameState((prev) => ({ ...prev, shootDelay: savedDelay }));
      }
    }
  }, [started]);

  const handleDelaySelect = (value) => {
    playSound("delayButton-0");
    onSetGameState((prev) => ({ ...prev, shootDelay: value }));
    localStorage.setItem("shootDelay", value.toString());
  };

  return (
    <div className={styles.fireControlBlock}>
      <div className={styles.label}>CPU FIRE DELAY</div>
      <div className={styles.subLabel}>Response time between enemy shots</div>
      <div className={styles.delayButtons}>
        {[0, 700, 1400, 2000].map((val, idx) => {
          const active = shootDelay === val;
          const color =
            val === 0
              ? "red"
              : val === 700
              ? "orange"
              : val === 1400
              ? "yellow"
              : "green";
          return (
            <div className={styles.delayBlock} key={val}>
              <button
                onClick={() => handleDelaySelect(val)}
                className={cls(styles.delayButton, styles[color], {
                  [styles.active]: active,
                })}
                title={`CPU fires delay ${val / 1000}s`}
              />
              <span className={styles.delayLabel}>{labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FireDelayPanel;
