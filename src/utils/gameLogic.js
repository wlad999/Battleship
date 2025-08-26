// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical, shipsConfig } from "./constants";

function generateEmptyArray() {
  return Array(100)
    .fill(null)
    .map((_, idx) => ({ shipPart: 0, targeted: false, idx }));
}

function getRandomInt() {
  const startCell = Math.floor(Math.random() * 100);
  const direction = Math.round(Math.random()) < 1 ? horizon : vertical; // 0 - horizontal, 1 - vertical
  return [startCell, direction];
}

function fillCellsAroundShip(newArray, shipCells, isDestroyed = false) {
  const bufferZone = isDestroyed ? "nextToDestroyedShip" : "nextToShipCell";
  const coords = shipCells.map((c) => [Math.floor(c / 10), c % 10]);

  const minRow = Math.min(...coords.map(([r]) => r)) - 1;
  const maxRow = Math.max(...coords.map(([r]) => r)) + 1;
  const minCol = Math.min(...coords.map(([_, c]) => c)) - 1;
  const maxCol = Math.max(...coords.map(([_, c]) => c)) + 1;

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (r >= 0 && r < 10 && c >= 0 && c < 10) {
        const index = r * 10 + c;

        if (!shipCells.includes(index)) {
          newArray[index][bufferZone] = true;
        }
      }
    }
  }
}

function placeShips(array, shipSize, count) {
  const [startCell, direction] = getRandomInt();
  const newArray = array.map((obj) => ({ ...obj }));
  //if last vertical cell of ship is out of field skip this startCell
  if (direction === vertical) {
    if (startCell + (shipSize - 1) * 10 > 99) {
      return placeShips(array, shipSize, count);
    }
  }

  //if last horizon cell of ship is out of field skip this startCell
  if (direction === horizon && !`${startCell}`.includes("0")) {
    const lastHorizonCell = startCell + (shipSize - 1);
    const lastCellRaw = Math.ceil(startCell / 10) * 10 - 1;
    if (lastHorizonCell > lastCellRaw) {
      return placeShips(array, shipSize, count);
    }
  }

  const getCell = (i, startCell) => {
    //direction - 0 - horizontal, 1 - vertical
    //i===0 - first ship part
    if (i === 0) {
      return i + startCell;
    }
    if (direction === horizon) {
      return i + startCell;
    }
    return i * 10 + startCell;
  };

  const shipCells = [];

  for (let i = 0; i < shipSize; i++) {
    const cell = getCell(i, startCell);
    //if cell is already occupied by ship part or next to ship part, skip this startCell
    if (newArray[cell].shipPart || newArray[cell].nextToShipCell) {
      return placeShips(array, shipSize, count);
    }
    //collect ship cells to fill buffer zone around ship after all ship parts are placed
    shipCells.push(cell);
    newArray[cell].shipPart = true;
    newArray[cell].shipId = `${shipSize}-${count}`;
  }
  fillCellsAroundShip(newArray, shipCells);

  return newArray;
}

function placeShipsOnField() {
  let shipsStatus = {};
  let filledField = generateEmptyArray();
  shipsConfig.forEach(({ size, count }) => {
    for (let i = 0; i < count; i++) {
      const filledFieldWithShip = placeShips(filledField, size, i);
      filledField = [...filledFieldWithShip];
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

function shootRandomCell({
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
  setNextCpuShoot,
}) {
  const newArray = array.map((obj) => ({ ...obj }));
  const availableCells = newArray
    .map((cell, idx) =>
      !cell.targeted && !cell.nextToDestroyedShip ? idx : null
    )
    .filter((idx) => idx !== null);

  if (availableCells.length === 0) return;
  const randomIdx = Math.floor(Math.random() * availableCells.length);
  const startCell = availableCells[randomIdx];

  newArray[startCell].targeted = true;
  const shipId = newArray[startCell].shipId;

  if (shipId && newArray[startCell].shipPart) {
    const isDestroyed = shipsStatus[shipId].cells
      .map((idx) => newArray[idx].targeted)
      .every((targeted) => targeted);
    setShipsStatus((prev) => ({
      ...prev,
      [shipId]: { ...prev[shipId], isDestroyed },
    }));

    if (!isDestroyed) {
      setHuntingHistory({ targetedShipParts: [startCell] });
    }
    if (isDestroyed) {
      setHuntingHistory(null);
      const shipCells = shipsStatus[shipId].cells;
      fillCellsAroundShip(newArray, shipCells, true);
    }
  }
  setArray(newArray);
  setNextCpuShoot((prev) => {
    return shipId ? prev + 1 : 0;
  });
  onSetIsPlayerTurn(shipId ? false : true);
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
}) {
  const newArray = array.map((obj) => ({ ...obj }));
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

    availableCells = potentialNeighbors
      .filter(
        (idx) => !newArray[idx].targeted && !newArray[idx].nextToDestroyedShip
      )
      .map((idx) => idx);
  }

  if (hits.length === 1) {
    const randomIdx = Math.floor(Math.random() * availableCells.length);

    nextShotIdx = availableCells[randomIdx];

    if (!nextShotIdx && nextShotIdx !== 0) {
      shootRandomCell({
        array: newArray,
        setArray,
        shipsStatus,
        setShipsStatus,
        onSetIsPlayerTurn,
        setHuntingHistory,
        setNextCpuShoot,
      });
      return;
    }
  } else {
    const hits = huntingHistory.targetedShipParts;
    const prev = hits[hits.length - 2];
    const last = hits[hits.length - 1];
    const step = last - prev;

    const isValid = (idx) =>
      idx >= 0 &&
      idx < 100 &&
      !newArray[idx].targeted &&
      !newArray[idx].nextToDestroyedShip;

    if (Math.abs(step) < 10) {
      // horizontal
      if (step > 0) {
        // right
        if (isValid(last + 1) && !`${last}`.endsWith("9")) {
          nextShotIdx = last + 1;
        } else {
          nextShotIdx = hits[0] - 1;
        }
      } else {
        // left
        if (isValid(last - 1) && !`${last}`.endsWith("0")) {
          nextShotIdx = last - 1;
        } else {
          nextShotIdx = hits[0] + 1;
        }
      }
    } else {
      // vertical
      if (step > 0) {
        // down
        if (isValid(last + 10) && last < 90) {
          nextShotIdx = last + 10;
        } else {
          nextShotIdx = hits[0] - 10;
        }
      } else {
        // up
        if (isValid(last - 10) && last > 9) {
          nextShotIdx = last - 10;
        } else {
          nextShotIdx = hits[0] + 10;
        }
      }
    }

    // if nextShotIdx is not valid (out of bounds or already targeted), fallback to random available cell
    if (!isValid(nextShotIdx) || nextShotIdx === undefined) {
      shootRandomCell({
        array: newArray,
        setArray,
        shipsStatus,
        setShipsStatus,
        onSetIsPlayerTurn,
        setHuntingHistory,
        setNextCpuShoot,
      });
      return;
    }
  }

  newArray[nextShotIdx].targeted = true;
  const shipId = newArray[nextShotIdx].shipId;
  availableCells = availableCells.filter((c) => c !== nextShotIdx);

  if (shipId) {
    const isDestroyed = shipsStatus[shipId].cells.every(
      (idx) => newArray[idx].targeted
    );
    setShipsStatus((prev) => ({
      ...prev,
      [shipId]: { ...prev[shipId], isDestroyed },
    }));

    if (!isDestroyed) {
      setHuntingHistory((prev) => ({
        targetedShipParts: [...prev.targetedShipParts, nextShotIdx],
        availableCells,
      }));
    } else {
      setHuntingHistory(null);
      fillCellsAroundShip(newArray, shipsStatus[shipId].cells, true);
    }
  } else {
    setHuntingHistory((prev) => ({
      ...prev,
      availableCells,
    }));
  }

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
