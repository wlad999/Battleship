import { useEffect } from 'react';

import { cpuShoot, isGameOver } from '@/gameLogic';

export function useCpuAutoShoot({
  isPlayer,
  winner,
  isPlayerTurn,
  shipsStatus,
  shootDelay,
  gameState,
  setGameState,
  nextCpuShoot,
}) {
  useEffect(() => {
    const hasGameEnded = isGameOver(shipsStatus);
    //return from function if game is over to avoid extra shot
    // shout on the player's field only
    if (!isPlayer || winner || isPlayerTurn || hasGameEnded) {
      return;
    }

    const shootWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, shootDelay));
      const newGameState = cpuShoot(gameState);
      setGameState(newGameState);
    };
    shootWithDelay();
  }, [isPlayerTurn, nextCpuShoot]);
}
