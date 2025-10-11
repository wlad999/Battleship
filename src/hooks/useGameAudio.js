import { useEffect } from 'react';
import { playSound, stopAllSound } from '@/audio/soundManager';
import { PLAYER } from '@/constants';

export function useGameAudio(started, winner) {
  useEffect(() => {
    if (started && !winner) {
      stopAllSound();
      playSound('ocean');
      playSound('start');
    }
    if (winner) {
      stopAllSound();
      if (winner === PLAYER) {
        playSound('enemyDestroyed');
        playSound('victory');
      } else {
        playSound('loss');
      }
    }
  }, [started, winner]);
}
