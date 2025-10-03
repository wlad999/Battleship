import { getFieldWithTargetedCell, isShipDestroyed } from "./shotProcessor.js";
import { playSound } from "@/audio/soundManager.js";
import { ENEMY } from "@/constants";

function playerShoot(gameState, idx) {
  playSound("shot");
  const {
    [ENEMY]: { battleField, shipsStatus },
  } = gameState;
  const updatedBattleField = getFieldWithTargetedCell(battleField, idx);
  const shipId = updatedBattleField[idx].shipId;
  let updatedShipsStatus = { ...shipsStatus };
  if (shipId) {
    const isDestroyed = isShipDestroyed(
      shipsStatus[shipId],
      updatedBattleField
    );
    updatedShipsStatus[shipId] = {
      ...updatedShipsStatus[shipId],
      isDestroyed,
    };

    if (!isDestroyed) {
      playSound("turret");
      playSound("enemyTargeted");
    }
  }
  return {
    ...gameState,
    [ENEMY]: {
      battleField: updatedBattleField,
      shipsStatus: updatedShipsStatus,
      lastHitId: idx,
    },
    isPlayerTurn: !!shipId,
  };
}

export { playerShoot };
