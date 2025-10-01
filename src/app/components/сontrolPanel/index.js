import { useState } from "react";
import cls from "classnames";
import AudioControlPanel from "../audioControlPanel";
import ContactPanel from "../communication";
import FireDelayPanel from "../fireDelayPanel";
import { playSound } from "../../../utils/audio/soundManager";
import { useAudioState } from "../../../hooks/useAudioState";

import styles from "./styles.module.scss";

function ControlPanel({ onSetGameState, shootDelay, started }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { volume, muted, toggleMute, handleVolumeChange, handleVolumePreview } =
    useAudioState(started);

  const togglePanel = () => {
    playSound("menuButton-0");
    setPanelOpen((prev) => !prev);
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
          <span>{panelOpen ? "✖" : "≡"}</span>
        </button>
      </div>
      <div
        className={cls(styles.panelBody, {
          [styles.hidden]: !panelOpen,
        })}
      >
        <AudioControlPanel
          muted={muted}
          volume={volume}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onVolumePreview={handleVolumePreview}
        />
        <FireDelayPanel
          onSetGameState={onSetGameState}
          shootDelay={shootDelay}
          started={started}
        />
        <ContactPanel />
      </div>
    </div>
  );
}

export default ControlPanel;
