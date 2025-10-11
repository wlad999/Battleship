import cls from 'classnames';
import styles from './styles.module.scss';

export default function AudioControlPanel({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
  onVolumePreview,
}) {
  return (
    <>
      <div className={styles.label}>AUDIO CONTROL</div>
      <div className={styles.indicatorLights}>
        <div
          className={cls(styles.light, styles[muted ? 'off' : 'on'])}
          title="READY"
        />
        <div
          className={cls(styles.light, styles[muted ? 'on' : 'off'])}
          title="MUTED"
        />
      </div>
      <div className={styles.controls}>
        <button onClick={onToggleMute} className={styles.toggleButton}>
          {muted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          aria-label="Volume control"
          min="0"
          max="1"
          step="0.1"
          value={muted ? 0 : volume}
          onChange={onVolumeChange}
          onInput={onVolumePreview}
          className={styles.slider}
        />
      </div>
    </>
  );
}
