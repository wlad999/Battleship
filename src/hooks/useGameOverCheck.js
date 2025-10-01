import { useEffect } from "react";
import { isGameOver } from "../utils/gameLogic";
import { PLAYER, ENEMY } from "../utils/constants";

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
