'use client';

import styles from './styles.module.scss';

function LossAnimation() {
  return (
    <svg
      viewBox="0 0 200 250"
      className={styles.loss}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(100, 130)">
        <ellipse cx="0" cy="80" rx="50" ry="10" fill="rgba(0,0,0,0.3)">
          <animate
            attributeName="opacity"
            values="0;0.3"
            dur="1s"
            fill="freeze"
          />
        </ellipse>
        <path
          d="M-40 40 Q0 -0 40 40 L40 90 L-40 90 Z"
          fill="white"
          stroke="black"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="1s"
            fill="freeze"
          />
        </path>
        <text
          x="0"
          y="40"
          textAnchor="middle"
          fontSize="16"
          fill="black"
          fontWeight="bold"
          opacity="0"
          dominantBaseline="middle"
        >
          RIP
          <animate
            attributeName="opacity"
            values="0;1"
            dur="1s"
            begin="0.5s"
            fill="freeze"
          />
        </text>
        <text
          x="0"
          y="55"
          textAnchor="middle"
          fontSize="6"
          fill="black"
          opacity="0"
          dominantBaseline="middle"
        >
          Here lies a brave sailor,
          <tspan x="0" dy="8">
            who gave his life in an
          </tspan>
          <tspan x="0" dy="8">
            unequal battle
          </tspan>
          <tspan x="0" dy="8">
            for his homeland
          </tspan>
          <animate
            attributeName="opacity"
            values="0;1"
            dur="1s"
            begin="1s"
            fill="freeze"
          />
        </text>
      </g>
    </svg>
  );
}

export default LossAnimation;
