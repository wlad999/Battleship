'use client';

import { getShotCoords } from '@/gameLogic';

export default function HitWaveSVG({ lastHitId = null, isPlayer = false }) {
  if (lastHitId === null) return;

  const coords = getShotCoords(lastHitId, isPlayer);
  if (!coords) return null;
  const { x, y } = coords;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      key={lastHitId}
    >
      <circle cx={x} cy={y} r="0" fill="rgba(0,150,255,0.25)">
        <animate attributeName="r" values="0;200;400" dur="2s" fill="freeze" />
        <animate
          attributeName="opacity"
          values="0.7;0"
          dur="2s"
          fill="freeze"
        />
      </circle>
      <circle cx={x} cy={y} r="0" fill="rgba(0,120,220,0.2)">
        <animate
          attributeName="r"
          values="0;200;400"
          dur="2s"
          begin="0.5s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          values="0.6;0"
          dur="2s"
          begin="0.5s"
          fill="freeze"
        />
      </circle>
      <circle cx={x} cy={y} r="0" fill="rgba(0,90,200,0.15)">
        <animate
          attributeName="r"
          values="0;200;400"
          dur="2s"
          begin="1s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          values="0.5;0"
          dur="2s"
          begin="1s"
          fill="freeze"
        />
      </circle>
    </svg>
  );
}
