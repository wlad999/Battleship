'use client';

import { useState } from 'react';

import cls from 'classnames';

import { useAudioUnlock } from '@/hooks/useAudioUnlock';
import { useGameAudio } from '@/hooks/useGameAudio';
import { initialGameState } from '@/state';

import Animations from './components/animations';
import ControlPanel from './components/controlPanel';
import Field from './components/field';
import Header from './components/header';

import styles from './page.module.css';

export default function Home() {
  const [gameState, setGameState] = useState(initialGameState);
  const { started, winner, shootDelay, isPlayerTurn } = gameState;

  useAudioUnlock();
  useGameAudio(started, winner);

  return (
    <div className={cls(styles.container, { [styles.start]: started })}>
      <ControlPanel
        onSetGameState={setGameState}
        shootDelay={shootDelay}
        started={started}
      />
      <Header gameState={gameState} setGameState={setGameState} />
      <Animations
        winner={winner}
        started={started}
        isPlayerTurn={isPlayerTurn}
        shootDelay={shootDelay}
      />
      <div className={styles.page}>
        <Field gameState={gameState} setGameState={setGameState} />
        <Field gameState={gameState} setGameState={setGameState} isPlayer />
      </div>
    </div>
  );
}
