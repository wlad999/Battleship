"use client";
import React from "react";
import { PLAYER, ENEMY } from "../../../utils/constants";

export default function HitWaveSVG({ lastHitId = null, isPlayer = false }) {
  if (lastHitId === null) return;

  const id = `${isPlayer ? PLAYER : ENEMY}-${lastHitId}`;
  const el = document.getElementById(id);
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
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
