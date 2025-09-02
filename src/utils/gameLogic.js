// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical, shipsConfig } from "./constants";

// ----------------------------
// Utility functions
// ----------------------------
function cloneArray(array) {
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

function getRandomInt(field, shipSize) {
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

function fillCellsAroundShip(
  newArray = [],
  shipCells = [],
  isDestroyed = false
) {
  if (!shipCells.length) return;

  const bufferZone = isDestroyed ? "nextToDestroyedShip" : "nextToShipCell";
  const coords = shipCells.map((c) => [Math.floor(c / 10), c % 10]);
  const shipCellsSet = new Set(shipCells);

  const minRow = Math.min(...coords.map(([r]) => r)) - 1;
  const maxRow = Math.max(...coords.map(([r]) => r)) + 1;
  const minCol = Math.min(...coords.map(([_, c]) => c)) - 1;
  const maxCol = Math.max(...coords.map(([_, c]) => c)) + 1;

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (r >= 0 && r < 10 && c >= 0 && c < 10) {
        const index = r * 10 + c;

        const isShipCell = shipCellsSet.has(index);
        const isAlreadyBuffered = newArray[index][bufferZone];

        if (isShipCell || isAlreadyBuffered) continue;

        newArray[index] = {
          ...newArray[index],
          [bufferZone]: true,
        };
      }
    }
  }
}

function getCell(i, startCell, direction) {
  return direction === horizon ? i + startCell : i * 10 + startCell;
}

function placeShips(array, shipSize, count) {
  const newArray = cloneArray(array);
  const maxAttempts = 50; // maximum number of attempts to place a ship
  let attempt = 0;
  let placed = false;

  // keep trying until the ship is placed or maxAttempts is reached
  while (!placed && attempt < maxAttempts) {
    attempt++;
    const [startCell, direction] = getRandomInt(newArray, shipSize);

    const shipCells = [];
    let conflict = false;

    // check if ship can fit without overlapping or touching another ship
    for (let i = 0; i < shipSize; i++) {
      const cell = getCell(i, startCell, direction);
      if (newArray[cell].shipPart || newArray[cell].nextToShipCell) {
        conflict = true; // found conflict, try a new start position
        break;
      }
      shipCells.push(cell);
    }

    if (!conflict) {
      // place the ship on the field
      shipCells.forEach((cell) => {
        newArray[cell] = {
          ...newArray[cell],
          shipPart: true,
          shipId: `${shipSize}-${count}`,
        };
      });
      // mark buffer zone around ship
      fillCellsAroundShip(newArray, shipCells);
      placed = true;
    }
  }

  return newArray;
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

function markCellTargeted(array, idx) {
  array[idx] = { ...array[idx], targeted: true };
}

function shootRandomCell({
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
  setNextCpuShoot,
  setLastHitId,
}) {
  const newArray = cloneArray(array);
  const availableCells = getAvailableCells(newArray);

  if (availableCells.length === 0) return;
  const randomIdx = Math.floor(Math.random() * availableCells.length);
  const startCell = availableCells[randomIdx];

  markCellTargeted(newArray, startCell);
  const shipId = newArray[startCell].shipId;

  if (shipId && newArray[startCell].shipPart) {
    const isDestroyed = updateShipStatus(
      shipId,
      newArray,
      shipsStatus,
      setShipsStatus
    );

    if (!isDestroyed) {
      setHuntingHistory({ targetedShipParts: [startCell] });
    }
    if (isDestroyed) {
      setHuntingHistory(null);
      fillCellsAroundShip(newArray, shipsStatus[shipId].cells, true);
    }
  }
  setLastHitId(startCell);
  setArray(newArray);
  setNextCpuShoot((prev) => (shipId ? prev + 1 : 0));
  onSetIsPlayerTurn(!shipId);
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
  setArray,
  shipsStatus,
  huntingHistory,
  setHuntingHistory,
  setNextCpuShoot,
  onSetIsPlayerTurn,
  setShipsStatus,
  setLastHitId,
}) {
  const newArray = cloneArray(array);
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
    shootRandomCell({
      array: newArray,
      setArray,
      shipsStatus,
      setShipsStatus,
      onSetIsPlayerTurn,
      setHuntingHistory,
      setNextCpuShoot,
      setLastHitId,
    });
    return;
  }

  markCellTargeted(newArray, nextShotIdx);
  availableCells = availableCells.filter((idx) => idx !== nextShotIdx);
  const shipId = newArray[nextShotIdx].shipId;

  if (shipId) {
    const isDestroyed = updateShipStatus(
      shipId,
      newArray,
      shipsStatus,
      setShipsStatus
    );

    if (!isDestroyed) {
      setHuntingHistory((prev) => ({
        targetedShipParts: [...prev.targetedShipParts, nextShotIdx],
        availableCells,
      }));
    }
    if (isDestroyed) {
      setHuntingHistory(null);
      fillCellsAroundShip(newArray, shipsStatus[shipId].cells, true);
    }
  } else {
    setHuntingHistory((prev) => ({
      ...prev,
      availableCells,
    }));
  }
  setLastHitId(nextShotIdx);
  setArray(newArray);
  setNextCpuShoot((prev) => (shipId ? prev + 1 : 0));
  onSetIsPlayerTurn(!shipId);
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

export {
  getRandomInt,
  placeShips,
  placeShipsOnField,
  generateEmptyArray,
  shootRandomCell,
  huntingShip,
  groupAndSortShips,
};
