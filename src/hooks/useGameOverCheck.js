import { useEffect } from 'react';

import { ENEMY, PLAYER } from '@/constants';
import { isGameOver } from '@/gameLogic';

export function useGameOverCheck({
  battleField,
  shipsStatus,
  isPlayer,
  setGameState,
}) {
  useEffect(() => {
    if (!battleField.length) return;
    const hasGameEnded = isGameOver(shipsStatus);
    if (hasGameEnded) {
      setGameState((prev) => ({
        ...prev,
        winner: isPlayer ? ENEMY : PLAYER,
      }));
    }
  }, [battleField, shipsStatus]);
}
