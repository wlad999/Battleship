// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical, shipsConfig, TOTAL_SHIP_PARTS } from "./constants";

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
    idx >= 0 &&
    idx < 100 &&
    !array[idx].targeted &&
    !array[idx].nextToDestroyedShip
  );
}

function generateEmptyArray() {
  return Array(100)
    .fill(null)
    .map((_, idx) => ({ shipPart: 0, targeted: false, idx }));
}

function getRandomStartPosition(field, shipSize) {
  const direction = Math.random() < 0.5 ? horizon : vertical;

  // Filter only cells from which the ship will fully fit
  const safeCells = field.filter((cell) => {
    if (cell.shipPart || cell.nextToShipCell) return false;

    if (direction === vertical) {
      return cell.idx + (shipSize - 1) * 10 <= 99;
    }

    if (direction === horizon) {
      const rowStart = Math.floor(cell.idx / 10) * 10;
      const rowEnd = rowStart + 9;
      return cell.idx + (shipSize - 1) <= rowEnd;
    }

    return true;
  });

  const randomIndex = Math.floor(Math.random() * safeCells.length);
  const startCell = safeCells[randomIndex].idx;

  return [startCell, direction];
}

function getCoordsFromIndex(idx) {
  return [Math.floor(idx / 10), idx % 10];
}

function getFieldWithShipBuffer(
  field = [],
  shipCells = [],
  isDestroyed = false
) {
  if (!shipCells.length) return cloneArrayShallow(field);

  const updatedField = cloneArrayShallow(field);
  const bufferZone = isDestroyed ? "nextToDestroyedShip" : "nextToShipCell";

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
    const [startCell, direction] = getRandomStartPosition(
      updatedField,
      shipSize
    );

    const shipCells = [];
    let conflict = false;

    // check if ship can fit without overlapping or touching another ship
    for (let i = 0; i < shipSize; i++) {
      const nextIdx = getNextIdx(i, startCell, direction);
      if (
        updatedField[nextIdx].shipPart ||
        updatedField[nextIdx].nextToShipCell
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
          shipPart: true,
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
    if (item.shipPart && item.shipId) {
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
    if (!cell.targeted && !cell.nextToDestroyedShip) acc.push(idx);
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

  if (shipId && updatedField[idx].shipPart) {
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

const getNextCell = (last, step, hits, array) => {
  if (Math.abs(step) < 10) {
    // horizontal
    if (step > 0)
      return isValidIndex(last + 1, array) && !`${last}`.endsWith("9")
        ? last + 1
        : hits[0] - 1;
    else
      return isValidIndex(last - 1, array) && !`${last}`.endsWith("0")
        ? last - 1
        : hits[0] + 1;
  } else {
    // vertical
    if (step > 0)
      return isValidIndex(last + 10, array) && last < 90
        ? last + 10
        : hits[0] - 10;
    else
      return isValidIndex(last - 10, array) && last > 9
        ? last - 10
        : hits[0] + 10;
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

  return getNextCell(lastShot, directionDelta, hits, array);
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
  return [
    ships.filter((ship) => ship.cells.length === 4),
    ships.filter((ship) => ship.cells.length === 3),
    ships.filter((ship) => ship.cells.length === 2),
    ships.filter((ship) => ship.cells.length === 1),
  ].map((group) =>
    group.sort((a, b) => Number(a.isDestroyed) - Number(b.isDestroyed))
  );
}

function isGameOver(field = []) {
  const targetedShipParts = field.reduce(
    (count, cell) => count + (cell.targeted && cell.shipPart ? 1 : 0),
    0
  );
  return targetedShipParts >= TOTAL_SHIP_PARTS;
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
