// This file contains logic for placing ships on a battleship game field.

import {
  horizon,
  vertical,
  shipsConfig,
  FIRST_IDX,
  LAST_IDX,
  FIELD_WIDTH,
  LAST_ROW_IDX,
  NEXT_TO_SHIP_CELL,
  NEXT_TO_DESTROYED_SHIP,
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
    FIRST_IDX >= 0 &&
    LAST_IDX <= 100 &&
    !array[idx].targeted &&
    !array[idx][NEXT_TO_DESTROYED_SHIP]
  );
}

function generateEmptyArray() {
  return Array(100)
    .fill(null)
    .map((_, idx) => ({ targeted: false, idx }));
}

function getCoordsFromIndex(idx) {
  return [Math.floor(idx / 10), idx % 10];
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
    const rowEnd = row * FIELD_WIDTH + LAST_ROW_IDX;
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
  const minRow = Math.max(Math.min(...rows) - 1, 0);
  const maxRow = Math.min(Math.max(...rows) + 1, 9);
  const minCol = Math.max(Math.min(...cols) - 1, 0);
  const maxCol = Math.min(Math.max(...cols) + 1, 9);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const index = r * 10 + c;

      // skip if it's a ship cell or already marked
      if (shipCellsSet.has(index) || updatedField[index][bufferZone]) continue;

      updatedField[index] = { ...updatedField[index], [bufferZone]: true };
    }
  }

  return updatedField;
}

function getNextIdx(i, startCell, direction) {
  return direction === horizon ? i + startCell : i * 10 + startCell;
}

function placeShips(array, shipSize, count) {
  let updatedField = cloneArrayShallow(array);
  const maxAttempts = 50; // maximum number of attempts to place a ship
  let attempt = 0;
  let placed = false;

  // keep trying until the ship is placed or maxAttempts is reached
  while (!placed && attempt < maxAttempts) {
    attempt++;
    const direction = getRandomDirection();
    const startIdx = getRandomStartPosition(updatedField, shipSize, direction);

    const shipCells = [];
    let conflict = false;

    // check if ship can fit without overlapping or touching another ship
    for (let i = 0; i < shipSize; i++) {
      const nextIdx = getNextIdx(i, startIdx, direction);
      if (updatedField[nextIdx][NEXT_TO_SHIP_CELL]) {
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
      const filledFieldWithShip = placeShips(filledField, size, i);
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

function getAvailableCells(array) {
  return array.reduce((acc, cell, idx) => {
    if (!cell.targeted && !cell[NEXT_TO_DESTROYED_SHIP]) acc.push(idx);
    return acc;
  }, []);
}

function updateShipStatus(shipId, newArray, shipsStatus, setShipsStatus) {
  const isDestroyed = shipsStatus[shipId].cells.every(
    (idx) => newArray[idx].targeted
  );
  setShipsStatus((prev) => ({
    ...prev,
    [shipId]: { ...prev[shipId], isDestroyed },
  }));
  return isDestroyed;
}

function getFieldWithTargetedCell(field, cellIndex) {
  const updatedField = cloneArrayShallow(field);
  updatedField[cellIndex] = {
    ...updatedField[cellIndex],
    targeted: true,
  };
  return updatedField;
}

function processShotResult({
  idx,
  newArray,
  shipsStatus,
  setShipsStatus,
  setHuntingHistory,
  setLastHitId,
  setNextCpuShoot,
  onSetIsPlayerTurn,
  availableCells,
}) {
  let updatedField = getFieldWithTargetedCell(newArray, idx);
  const shipId = updatedField[idx].shipId;

  if (shipId) {
    const isDestroyed = updateShipStatus(
      shipId,
      updatedField,
      shipsStatus,
      setShipsStatus
    );

    if (!isDestroyed) {
      setHuntingHistory((prev) =>
        prev
          ? {
              ...prev,
              targetedShipParts: [...prev.targetedShipParts, idx],
              availableCells,
            }
          : { targetedShipParts: [idx], availableCells }
      );
    } else {
      setHuntingHistory(null);
      updatedField = getFieldWithShipBuffer(
        updatedField,
        shipsStatus[shipId].cells,
        true
      );
    }
  }

  setLastHitId(idx);
  setNextCpuShoot((prev) => (shipId ? prev + 1 : 0));
  onSetIsPlayerTurn(!shipId);

  return updatedField;
}

function shootRandomCell({
  array,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
  setNextCpuShoot,
  setLastHitId,
}) {
  const newArray = cloneArrayShallow(array);
  const availableCells = getAvailableCells(newArray);

  if (availableCells.length === 0) return;
  const randomIdx = Math.floor(Math.random() * availableCells.length);
  const startIdx = availableCells[randomIdx];

  const updatedArray = processShotResult({
    idx: startIdx,
    newArray,
    shipsStatus,
    setShipsStatus,
    setHuntingHistory,
    setLastHitId,
    setNextCpuShoot,
    onSetIsPlayerTurn,
  });

  return updatedArray;
}

const moveHorizontal = (lastHitIdx, step, firstHitIdx, field) => {
  const col = getCoordsFromIndex(lastHitIdx)[1];

  if (step > 0) {
    // move right
    return isValidIndex(lastHitIdx + 1, field) && col < 9
      ? lastHitIdx + 1
      : firstHitIdx - 1; // fallback left
  } else {
    // move left
    return isValidIndex(lastHitIdx - 1, field) && col > 0
      ? lastHitIdx - 1
      : firstHitIdx + 1; // fallback right
  }
};

const moveVertical = (lastHitIdx, step, firstHitIdx, field) => {
  const row = getCoordsFromIndex(lastHitIdx)[0];

  if (step > 0) {
    // move down
    return isValidIndex(lastHitIdx + 10, field) && row < 9
      ? lastHitIdx + 10
      : firstHitIdx - 10; // fallback up
  } else {
    // move up
    return isValidIndex(lastHitIdx - 10, field) && row > 0
      ? lastHitIdx - 10
      : firstHitIdx + 10; // fallback down
  }
};

const getNextShotIdx = (lastHitIdx, step, firstHitIdx, field) => {
  if (Math.abs(step) < 10) {
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

function huntingShip({
  array,
  shipsStatus,
  huntingHistory,
  setHuntingHistory,
  setNextCpuShoot,
  onSetIsPlayerTurn,
  setShipsStatus,
  setLastHitId,
}) {
  const newArray = cloneArrayShallow(array);
  let availableCells = huntingHistory.availableCells || [];
  let nextShotIdx;

  const hits = huntingHistory.targetedShipParts;

  if (!availableCells.length) {
    const firstHit = hits[0];
    const potentialNeighbors = [];
    if (firstHit % 10 > 0) potentialNeighbors.push(firstHit - 1); // left
    if (firstHit % 10 < 9) potentialNeighbors.push(firstHit + 1); // right
    if (firstHit - 10 >= 0) potentialNeighbors.push(firstHit - 10); // up
    if (firstHit + 10 <= 99) potentialNeighbors.push(firstHit + 10); // down

    availableCells = potentialNeighbors.filter((idx) =>
      isValidIndex(idx, newArray)
    );
  }

  nextShotIdx = chooseNextShot(availableCells, hits, newArray);

  // if nextShotIdx is not valid (out of bounds or already targeted), fallback to random available cell
  if (!isValidIndex(nextShotIdx, newArray)) {
    const updatedArray = shootRandomCell({
      array: newArray,
      shipsStatus,
      setShipsStatus,
      onSetIsPlayerTurn,
      setHuntingHistory,
      setNextCpuShoot,
      setLastHitId,
    });

    return updatedArray;
  }

  availableCells = availableCells.filter((idx) => idx !== nextShotIdx);

  const updatedArray = processShotResult({
    idx: nextShotIdx,
    newArray,
    shipsStatus,
    setShipsStatus,
    setHuntingHistory,
    setLastHitId,
    setNextCpuShoot,
    onSetIsPlayerTurn,
    availableCells,
  });

  return updatedArray;
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

export {
  placeShips,
  placeShipsOnField,
  generateEmptyArray,
  shootRandomCell,
  huntingShip,
  groupAndSortShips,
  getFieldWithTargetedCell,
  isGameOver,
};
