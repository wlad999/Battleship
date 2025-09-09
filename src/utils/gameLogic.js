// This file contains logic for placing ships on a battleship game field.

import {
  horizon,
  vertical,
  shipsConfig,
  FIRST_IDX,
  LAST_IDX,
  FIELD_WIDTH,
  LAST_ROW_NUM,
  LAST_COL_NUM,
  FIRST_COL_NUM,
  FIRST_ROW_NUM,
  NEXT_TO_SHIP_CELL,
  NEXT_TO_DESTROYED_SHIP,
  FIELD_SIZE,
  MAX_PLACEMENT_ATTEMPTS,
  PLAYER,
  ENEMY,
} from "./constants";

// ----------------------------
// Utility functions
// ----------------------------
function cloneArrayShallow(array) {
  return [...array];
}

function isValidIndex(idx, array) {
  if (idx === undefined) {
    return false;
  }
  return (
    idx >= FIRST_IDX &&
    idx <= LAST_IDX &&
    !array[idx].targeted &&
    !array[idx][NEXT_TO_DESTROYED_SHIP]
  );
}

function generateEmptyArray() {
  return Array(FIELD_SIZE)
    .fill(null)
    .map((_, idx) => ({ targeted: false, idx }));
}

function getCoordsFromIndex(idx) {
  return [Math.floor(idx / FIELD_WIDTH), idx % FIELD_WIDTH];
}

function getRandomDirection() {
  return Math.random() < 0.5 ? horizon : vertical;
}

function getRandomStartPosition(field, shipSize, direction) {
  // Filter only cells from which the ship will fully fit
  const safeCells = field.filter((cell) => {
    if (cell.shipId || cell[NEXT_TO_SHIP_CELL]) return false;

    if (direction === vertical) {
      return cell.idx + (shipSize - 1) * FIELD_WIDTH <= LAST_IDX;
    }
    //horizon
    const [row] = getCoordsFromIndex(cell.idx);
    const rowEnd = row * FIELD_WIDTH + LAST_COL_NUM;
    return cell.idx + (shipSize - 1) <= rowEnd;
  });

  const availableCells = safeCells.length ? safeCells : field;

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const startIdx = availableCells[randomIndex].idx;

  return startIdx;
}

function getFieldWithShipBuffer(
  field = [],
  shipCells = [],
  isDestroyed = false
) {
  if (!shipCells.length) return cloneArrayShallow(field);

  const updatedField = cloneArrayShallow(field);
  const bufferZone = isDestroyed ? NEXT_TO_DESTROYED_SHIP : NEXT_TO_SHIP_CELL;

  const shipCellsSet = new Set(shipCells);
  const shipCoords = shipCells.map((cellIdx) => getCoordsFromIndex(cellIdx));
  const rows = shipCoords.map(([r]) => r);
  const cols = shipCoords.map(([_, c]) => c);

  //find min and max rows and columns, ensuring they stay within field
  const minRow = Math.max(Math.min(...rows) - 1, FIRST_ROW_NUM);
  const maxRow = Math.min(Math.max(...rows) + 1, LAST_ROW_NUM);
  const minCol = Math.max(Math.min(...cols) - 1, FIRST_COL_NUM);
  const maxCol = Math.min(Math.max(...cols) + 1, LAST_COL_NUM);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const index = r * FIELD_WIDTH + c;

      // skip if it's a ship cell or already marked
      if (shipCellsSet.has(index) || updatedField[index][bufferZone]) continue;

      updatedField[index] = { ...updatedField[index], [bufferZone]: true };
    }
  }

  return updatedField;
}

function getNextIdx(i, startIdx, direction) {
  return direction === horizon ? i + startIdx : i * FIELD_WIDTH + startIdx;
}

function placeShip(array, shipSize, count) {
  let updatedField = cloneArrayShallow(array);
  let attempt = 0;
  let placed = false;

  // keep trying until the ship is placed or maxAttempts is reached
  // maximum number of attempts to place a ship
  while (!placed && attempt < MAX_PLACEMENT_ATTEMPTS) {
    attempt++;
    const direction = getRandomDirection();
    const startIdx = getRandomStartPosition(updatedField, shipSize, direction);

    const shipCells = [];
    let conflict = false;

    // check if ship can fit without overlapping or touching another ship
    for (let i = 0; i < shipSize; i++) {
      const nextIdx = getNextIdx(i, startIdx, direction);
      if (
        updatedField[nextIdx][NEXT_TO_SHIP_CELL] ||
        updatedField[nextIdx].shipId
      ) {
        conflict = true; // found conflict, try a new start position
        break;
      }
      shipCells.push(nextIdx);
    }

    if (!conflict) {
      // place the ship on the field
      shipCells.forEach((idx) => {
        updatedField[idx] = {
          ...updatedField[idx],
          shipId: `${shipSize}-${count}`,
        };
      });
      // mark buffer zone around ship
      updatedField = getFieldWithShipBuffer(updatedField, shipCells);
      placed = true;
    }
  }

  return updatedField;
}

function placeShipsOnField() {
  let shipsStatus = {};
  let filledField = generateEmptyArray();
  shipsConfig.forEach(({ size, count }) => {
    for (let i = 0; i < count; i++) {
      const filledFieldWithShip = placeShip(filledField, size, i);
      filledField = filledFieldWithShip;
    }
  });

  filledField.forEach((item, idx) => {
    if (item.shipId) {
      const shipId = item.shipId;
      if (!shipsStatus[shipId]) {
        shipsStatus[shipId] = {
          id: shipId,
          cells: [],
          isDestroyed: false,
        };
      }
      shipsStatus[shipId].cells.push(idx);
    }
  });
  return { shipsStatus, filledField };
}

function isShipDestroyed(ship, field) {
  return ship.cells.every((idx) => field[idx].targeted);
}

function updateShipStatus(shipId, newArray, shipsStatus) {
  const isDestroyed = isShipDestroyed(shipsStatus[shipId], newArray);
  return {
    ...shipsStatus,
    [shipId]: { ...shipsStatus[shipId], isDestroyed },
  };
}

function getFieldWithTargetedCell(field, cellIndex) {
  const updatedField = cloneArrayShallow(field);
  updatedField[cellIndex] = { ...updatedField[cellIndex], targeted: true };
  return updatedField;
}

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
      newHuntingHistory = huntingHistory
        ? {
            ...huntingHistory,
            targetedShipParts: [...huntingHistory.targetedShipParts, idx],
            availableCells,
          }
        : { targetedShipParts: [idx], availableCells };
    } else {
      newHuntingHistory = null;
      updatedField = getFieldWithShipBuffer(
        updatedField,
        shipsStatus[shipId].cells,
        true
      );
    }
  }

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

const moveHorizontal = (lastHitIdx, step, firstHitIdx, field) => {
  const col = getCoordsFromIndex(lastHitIdx)[1];
  const HORIZONTAL_STEP = 1;

  if (step > 0) {
    // move right
    return isValidIndex(lastHitIdx + HORIZONTAL_STEP, field) &&
      col < LAST_COL_NUM
      ? lastHitIdx + HORIZONTAL_STEP
      : firstHitIdx - HORIZONTAL_STEP; // fallback left
  } else {
    // move left
    return isValidIndex(lastHitIdx - HORIZONTAL_STEP, field) &&
      col > FIRST_COL_NUM
      ? lastHitIdx - HORIZONTAL_STEP
      : firstHitIdx + HORIZONTAL_STEP; // fallback right
  }
};

const moveVertical = (lastHitIdx, step, firstHitIdx, field) => {
  const row = getCoordsFromIndex(lastHitIdx)[0];

  if (step > 0) {
    // move down
    return isValidIndex(lastHitIdx + FIELD_WIDTH, field) && row < LAST_ROW_NUM
      ? lastHitIdx + FIELD_WIDTH
      : firstHitIdx - FIELD_WIDTH; // fallback up
  } else {
    // move up
    return isValidIndex(lastHitIdx - FIELD_WIDTH, field) && row > FIRST_ROW_NUM
      ? lastHitIdx - FIELD_WIDTH
      : firstHitIdx + FIELD_WIDTH; // fallback down
  }
};

const getNextShotIdx = (lastHitIdx, step, firstHitIdx, field) => {
  if (Math.abs(step) < FIELD_WIDTH) {
    return moveHorizontal(lastHitIdx, step, firstHitIdx, field);
    // horizontal
  } else {
    // vertical
    return moveVertical(lastHitIdx, step, firstHitIdx, field);
  }
};

function chooseNextShot(availableCells, hits, array) {
  if (hits.length === 1) {
    const randomIdx = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIdx];
  }

  const prevShot = hits[hits.length - 2];
  const lastShot = hits[hits.length - 1];
  const directionDelta = lastShot - prevShot;

  return getNextShotIdx(lastShot, directionDelta, hits[0], array);
}

function getAvailableNeighbors(firstHit, field) {
  const potentialNeighbors = [];
  if (firstHit % FIELD_WIDTH > FIRST_COL_NUM)
    potentialNeighbors.push(firstHit - 1); // left
  if (firstHit % FIELD_WIDTH < LAST_COL_NUM)
    potentialNeighbors.push(firstHit + 1); // right
  if (firstHit - FIELD_WIDTH >= FIRST_ROW_NUM)
    potentialNeighbors.push(firstHit - FIELD_WIDTH); // up
  if (firstHit + FIELD_WIDTH <= LAST_IDX)
    potentialNeighbors.push(firstHit + FIELD_WIDTH); // down

  return potentialNeighbors.filter((idx) => isValidIndex(idx, field));
}

function getRandomAvailableCell(field) {
  const availableCells = field
    .filter((cell) => !cell.targeted && !cell[NEXT_TO_DESTROYED_SHIP])
    .map((cell) => cell.idx);

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function cpuShoot(gameState) {
  const {
    [PLAYER]: { battleField, shipsStatus },
    huntingHistory,
    nextCpuShoot,
  } = gameState;
  const newArray = cloneArrayShallow(battleField);
  let availableCells = huntingHistory?.availableCells || [];
  let nextShotIdx;

  const hits = huntingHistory?.targetedShipParts || [];

  if (hits.length) {
    if (!availableCells.length) {
      availableCells = getAvailableNeighbors(hits[0], newArray);
    }

    nextShotIdx = chooseNextShot(availableCells, hits, newArray);

    if (!isValidIndex(nextShotIdx, newArray)) {
      nextShotIdx = getRandomAvailableCell(newArray);
    }

    availableCells = availableCells.filter((idx) => idx !== nextShotIdx);
  } else {
    nextShotIdx = getRandomAvailableCell(newArray);
  }

  const shotUpdatedData = processShotResult({
    idx: nextShotIdx,
    newArray,
    shipsStatus,
    huntingHistory,
    nextCpuShoot,
    availableCells,
  });

  return {
    ...gameState,
    ...shotUpdatedData,
  };
}

function playerShoot(gameState, idx) {
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

function groupAndSortShips(shipsStatus) {
  const ships = Object.values(shipsStatus);

  // Collecting unique ship sizes
  const uniqueSizes = [...new Set(ships.map((ship) => ship.cells.length))].sort(
    (a, b) => b - a // first big, then small
  );
  //sort by isDestroyed, alive ships first, destroyed ships last
  const sortByStatus = (a, b) => Number(a.isDestroyed) - Number(b.isDestroyed);

  // Group ships by size and sort each group by isDestroyed status (alive first, destroyed last)
  return uniqueSizes.map((size) =>
    ships.filter((ship) => ship.cells.length === size).sort(sortByStatus)
  );
}

function isGameOver(shipsStatus) {
  return Object.values(shipsStatus).every((ship) => ship.isDestroyed);
}

export function getShotCoords(lastHitId, isPlayer) {
  const id = `${isPlayer ? PLAYER : ENEMY}-${lastHitId}`;
  const el = document.getElementById(id);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export {
  placeShipsOnField,
  generateEmptyArray,
  groupAndSortShips,
  getFieldWithTargetedCell,
  isGameOver,
  cpuShoot,
  isShipDestroyed,
  playerShoot,
  getShotCoords,
};
