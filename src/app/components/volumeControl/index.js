import { useState, useEffect } from "react";
import cls from "classnames";
import ContactPanel from "../communication";
import { setGlobalVolume } from "../../../utils/audio/soundManager";
import { playSound } from "../../../utils/audio/soundManager";
import styles from "./styles.module.scss";

const labels = ["Instant", "Quick", "Engage", "Hold"];

function VolumeControl({ onSetGameState, shootDelay, started }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVolume = parseFloat(localStorage.getItem("volume")) || 0.5;
      const savedMuted = localStorage.getItem("muted") === "true";

      setVolume(savedVolume);
      setMuted(savedMuted);
      setGlobalVolume(savedMuted ? 0 : savedVolume);

      const savedDelay = parseFloat(localStorage.getItem("shootDelay"));
      if (isFinite(savedDelay)) {
        onSetGameState((prev) => ({ ...prev, shootDelay: savedDelay }));
      }
    }
  }, [started]);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (!isFinite(vol)) return;
    setVolume(vol);
    setMuted(vol === 0);
    setGlobalVolume(vol);

    localStorage.setItem("volume", vol.toString());
    localStorage.setItem("muted", vol === 0 ? "true" : "false");
  };

  const handleVolumePreview = (e) => {
    const vol = parseFloat(e.target.value);
    if (!isFinite(vol)) return;
    setGlobalVolume(vol);
  };

  const toggleMute = () => {
    playSound("muteButton-0");
    const newMuted = !muted;
    setMuted(newMuted);
    setGlobalVolume(newMuted ? 0 : volume);
    localStorage.setItem("muted", newMuted.toString());
  };

  const togglePanel = () => {
    playSound("menuButton-0");
    setPanelOpen((prev) => !prev);
  };

  const handleDelaySelect = (value) => {
    playSound("delayButton-0");
    onSetGameState((prev) => ({ ...prev, shootDelay: value }));
    localStorage.setItem("shootDelay", value.toString());
  };

  return (
    <div className={cls(styles.wrapper, { [styles.topBarClosed]: !panelOpen })}>
      <div className={cls(styles.topBar, { [styles.mb0]: !panelOpen })}>
        {!panelOpen && (
          <button onClick={toggleMute} className={styles.muteButton}>
            {muted ? "🔇" : "🔊"}
          </button>
        )}

        <button onClick={togglePanel} className={styles.statusButton}>
          <span className={styles.statusIcon}>{panelOpen ? "✖" : "≡"}</span>
        </button>
      </div>
      {panelOpen && (
        <div
          className={cls(
            styles.panelBody,
            styles[panelOpen ? "fadeIn" : "fadeOut"]
          )}
        >
          <div className={styles.label}>AUDIO CONTROL</div>
          <div className={styles.indicatorLights}>
            <div
              className={cls(styles.light, styles[muted ? "off" : "on"])}
              title="READY"
            />
            <div
              className={cls(styles.light, styles[muted ? "on" : "off"])}
              title="MUTED"
            />
          </div>
          <div className={styles.controls}>
            <button onClick={toggleMute} className={styles.toggleButton}>
              {muted ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              onInput={handleVolumePreview}
              className={styles.slider}
            />
          </div>
          <div className={styles.fireControlBlock}>
            <div className={styles.label}>CPU FIRE DELAY</div>
            <div className={styles.subLabel}>
              Response time between enemy shots
            </div>
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
          <ContactPanel />
        </div>
      )}
    </div>
  );
}

export default VolumeControl;
