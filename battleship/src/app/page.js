"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Field from "./components";

export default function Home() {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isPlayerTurn ? "Player" : "Enemy"} turn</h1>
      <div className={styles.page}>
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
        />
        <Field
          isPlayerTurn={isPlayerTurn}
          onSetIsPlayerTurn={setIsPlayerTurn}
          isPlayer
        />
      </div>
    </div>
  );
}
