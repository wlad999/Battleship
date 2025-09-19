import { useState, useEffect } from "react";
import { setGlobalVolume } from "../../../utils/audio/soundManager";
import cls from "classnames";
import styles from "./styles.module.scss";

function VolumeControl() {
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
    }
  }, []);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (!isFinite(vol)) return;
    setVolume(vol);
    setMuted(vol === 0);
    setGlobalVolume(vol);

    localStorage.setItem("volume", vol.toString());
    localStorage.setItem("muted", vol === 0 ? "true" : "false");
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setGlobalVolume(newMuted ? 0 : volume || 1);
    localStorage.setItem("muted", newMuted.toString());
  };

  const togglePanel = () => setPanelOpen((prev) => !prev);

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
              onTouchStart={() => setGlobalVolume(volume)}
              onMouseDown={() => setGlobalVolume(volume)}
              className={styles.slider}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VolumeControl;
