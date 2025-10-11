import { getFieldWithShipBuffer } from './shipPlacement.js';
import { cloneArrayShallow } from '@/utils';
import { playSound, stopSound } from '@/audio/soundManager.js';
import { PLAYER } from '@/constants';

// mark cell as targeted
function getFieldWithTargetedCell(field, cellIndex) {
  const updatedField = cloneArrayShallow(field);
  updatedField[cellIndex] = { ...updatedField[cellIndex], targeted: true };
  return updatedField;
}

// check if all ship cells are hit
function isShipDestroyed(ship, field) {
  return ship.cells.every((idx) => field[idx].targeted);
}

// update ship status after hit
function updateShipStatus(shipId, newArray, shipsStatus) {
  const isDestroyed = isShipDestroyed(shipsStatus[shipId], newArray);
  return {
    ...shipsStatus,
    [shipId]: { ...shipsStatus[shipId], isDestroyed },
  };
}

// process shot result and update game state
function processShotResult({
  idx,
  newArray,
  shipsStatus,
  huntingHistory,
  nextCpuShoot,
  availableCells,
}) {
  let updatedField = getFieldWithTargetedCell(newArray, idx);
  let newShipsStatus = shipsStatus;
  let newHuntingHistory = huntingHistory;

  const shipId = updatedField[idx].shipId;

  if (shipId) {
    const isDestroyed = isShipDestroyed(shipsStatus[shipId], updatedField);
    newShipsStatus = updateShipStatus(shipId, updatedField, shipsStatus);

    if (!isDestroyed) {
      playSound('siren');
      playSound('hit');
      newHuntingHistory = huntingHistory
        ? {
            ...huntingHistory,
            targetedShipParts: [...huntingHistory.targetedShipParts, idx],
            availableCells,
          }
        : { targetedShipParts: [idx], availableCells };
    } else {
      shipsStatus[shipId].cells.length === 1 && playSound('sonar');
      stopSound('siren');
      playSound('destroyed');
      playSound('sunk');
      newHuntingHistory = null;
      updatedField = getFieldWithShipBuffer(
        updatedField,
        shipsStatus[shipId].cells,
        true,
      );
    }
  }

  if (!shipId) playSound('miss');

  return {
    [PLAYER]: {
      battleField: updatedField,
      shipsStatus: newShipsStatus,
      lastHitId: idx,
    },
    huntingHistory: newHuntingHistory,
    nextCpuShoot: shipId ? nextCpuShoot + 1 : 0,
    isPlayerTurn: !shipId,
  };
}
export {
  getFieldWithTargetedCell,
  isShipDestroyed,
  updateShipStatus,
  processShotResult,
};
