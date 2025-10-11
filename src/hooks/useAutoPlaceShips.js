import { useEffect } from 'react';
import { placeShipsOnField } from '@/gameLogic';

export function useAutoPlaceShips({
  isPlayer,
  placeShips,
  started,
  fieldKey,
  setGameState,
}) {
  useEffect(() => {
    if ((!isPlayer && placeShips !== null) || started) {
      return;
    }

    const { shipsStatus, filledField } = placeShipsOnField();
    setGameState((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        battleField: filledField,
        shipsStatus,
      },
    }));
  }, [placeShips, started, isPlayer]);
}
