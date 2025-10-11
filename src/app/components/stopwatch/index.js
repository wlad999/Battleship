'use client';

import styles from './styles.module.scss';

function Stopwatch() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" className={styles.root}>
      <circle cx="100" cy="100" r="90" fill="none" className={styles.circle} />
      {[...Array(12)].map((_, i) => {
        const angle = i * 30 * (Math.PI / 180);
        const x1 = 100 + Math.cos(angle) * 80;
        const y1 = 100 + Math.sin(angle) * 80;
        const x2 = 100 + Math.cos(angle) * 90;
        const y2 = 100 + Math.sin(angle) * 90;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#999"
            strokeWidth="2"
          />
        );
      })}
      <line x1="100" y1="100" x2="100" y2="10" stroke="#999" strokeWidth="2">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="6s"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
}

export default Stopwatch;
