import { useCallback } from 'react';

import { ENEMY, PLAYER } from '@/constants';
import { playerShoot } from '@/gameLogic';

import { useAutoPlaceShips } from './useAutoPlaceShips';
import { useCpuAutoShoot } from './useCpuAutoShoot';
import { useGameOverCheck } from './useGameOverCheck';

export function useFieldLogic({ isPlayer = false, gameState, setGameState }) {
  const fieldKey = isPlayer ? PLAYER : ENEMY;
  const fieldState = gameState[fieldKey];
  const { battleField, shipsStatus, lastHitId } = fieldState;

  const {
    nextCpuShoot,
    isPlayerTurn,
    winner,
    placeShips,
    started,
    showShips,
    shootDelay,
  } = gameState;

  useAutoPlaceShips({ isPlayer, placeShips, started, fieldKey, setGameState });

  useGameOverCheck({
    battleField,
    shipsStatus,
    isPlayer,
    setGameState,
  });

  useCpuAutoShoot({
    isPlayer,
    winner,
    isPlayerTurn,
    shipsStatus,
    shootDelay,
    gameState,
    setGameState,
    nextCpuShoot,
  });

  const handleClick = useCallback(
    (idx) => {
      if (isPlayer) return;

      setGameState((prevGameState) => {
        const { battleField: prevBattleField } = prevGameState[fieldKey];

        if (
          !prevGameState.isPlayerTurn ||
          !prevGameState.started ||
          prevGameState.winner ||
          prevBattleField[idx].targeted
        ) {
          return prevGameState;
        }
        return playerShoot(prevGameState, idx);
      });
    },
    [isPlayer, fieldKey, setGameState],
  );

  return {
    isPlayer,
    battleField,
    shipsStatus,
    lastHitId,
    started,
    isPlayerTurn,
    showShips,
    handleClick,
    winner,
  };
}
