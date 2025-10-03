import { useEffect } from "react";
import { isGameOver } from "@/gameLogic";
import { PLAYER, ENEMY } from "@/constants";

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
