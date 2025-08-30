"use client";

import styles from "./styles.module.scss";

function Firework({ active = false }) {
  if (!active) {
    return null;
  }

  const explosions = [
    { cx: 100, cy: 100, delay: "0s", colors: ["red", "yellow", "orange"] },
    { cx: 60, cy: 80, delay: "0.8s", colors: ["cyan", "blue", "violet"] },
    { cx: 140, cy: 60, delay: "1.6s", colors: ["lime", "pink", "gold"] },
  ];

  return (
    <svg
      viewBox="0 0 200 200"
      width="240"
      height="240"
      className={styles.fireworks}
      preserveAspectRatio="xMidYMid meet"
    >
      {explosions.map((exp, index) => (
        <g key={index}>
          <circle cx={exp.cx} cy={exp.cy} r="0" fill="white">
            <animate
              attributeName="r"
              values="0;12;0"
              begin={exp.delay}
              dur="0.4s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              begin={exp.delay}
              dur="0.4s"
              fill="freeze"
            />
          </circle>
          {[...Array(20)].map((_, i) => {
            const angle = (i * 360) / 20;
            const rad = (angle * Math.PI) / 180;
            const dx = Math.cos(rad) * 50;
            const dy = Math.sin(rad) * 50;

            return (
              <circle
                key={i}
                cx={exp.cx}
                cy={exp.cy}
                r="3"
                fill={exp.colors[i % exp.colors.length]}
                opacity="0"
              >
                <animate
                  attributeName="cx"
                  values={`${exp.cx};${exp.cx + dx}`}
                  begin={exp.delay}
                  dur="1s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${exp.cy};${exp.cy + dy}`}
                  begin={exp.delay}
                  dur="1s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  begin={exp.delay}
                  dur="1s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export default Firework;
