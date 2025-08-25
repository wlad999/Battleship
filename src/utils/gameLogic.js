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
      filledField = placeShips(filledField, size, i);
    }
  });

  filledField.forEach((item, idx) => {
    if (item.shipPart) {
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

  if (shipId) {
    const isDestroyed = shipsStatus[shipId].cells
      .map((idx) => newArray[idx].targeted)
      .every((targeted) => targeted);
    setShipsStatus((prev) => ({
      ...prev,
      [shipId]: { ...prev[shipId], isDestroyed },
    }));

    if (!isDestroyed) {
      setHuntingHistory({ targetedShipParts: [newArray[startCell]] });
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

const huntingShip = (
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
  huntingHistory,
  setNextCpuShoot
) => {
  const availableCells = [];
  const newArray = array.map((obj) => ({ ...obj }));
  const pushAvailableCells = (cell) => {
    if (newArray[cell].targeted || newArray[cell].nextToDestroyedShip) return;
    availableCells.push({ idx: cell });
  };

  if (huntingHistory.availableCells) {
    if (huntingHistory.targetedShipParts.length === 1) {
      const newAvailableCells = huntingHistory.availableCells.map((cell) => ({
        ...cell,
      }));

      const availableIdxShotCells = huntingHistory.availableCells
        .map((cell, idx) => (!cell.targeted ? idx : null))
        .filter((idx) => idx !== null);

      const randomIdx = Math.floor(
        Math.random() * availableIdxShotCells.length
      );
      const targetedIdx = availableIdxShotCells[randomIdx];
      //add random shot if cell is already targeted or filled
      newAvailableCells[targetedIdx].targeted = true;
      const targetedCell = newAvailableCells[targetedIdx].idx;
      newArray[targetedCell].targeted = true;

      const shipId = newArray[targetedCell].shipId;

      if (shipId && newArray[targetedCell].shipPart) {
        const isDestroyed = shipsStatus[shipId].cells
          .map((idx) => newArray[idx].targeted)
          .every((targeted) => targeted);
        setShipsStatus((prev) => ({
          ...prev,
          [shipId]: { ...prev[shipId], isDestroyed },
        }));

        if (!isDestroyed) {
          setHuntingHistory((prev) => ({
            targetedShipParts: [
              ...prev.targetedShipParts,
              newArray[targetedCell],
            ],
            availableCells: newAvailableCells,
          }));
        }
        if (isDestroyed) {
          setHuntingHistory(null);
          const shipCells = shipsStatus[shipId].cells;
          fillCellsAroundShip(newArray, shipCells, true);
        }
      }
      if (!shipId) {
        setHuntingHistory((prev) => ({
          ...prev,
          availableCells: newAvailableCells,
        }));
      }
      setArray(newArray);
      setNextCpuShoot((prev) => {
        return shipId ? prev + 1 : 0;
      });
      onSetIsPlayerTurn(shipId ? false : true);
    }

    if (huntingHistory.targetedShipParts.length > 1) {
      const previousShotIdx =
        huntingHistory.targetedShipParts[
          huntingHistory.targetedShipParts.length - 2
        ].idx;

      const lastShotIdx =
        huntingHistory.targetedShipParts[
          huntingHistory.targetedShipParts.length - 1
        ].idx;

      const distanseBetweenTargetedParts = lastShotIdx - previousShotIdx;

      let nextShotIdx;
      if (Math.abs(distanseBetweenTargetedParts) < 10) {
        if (distanseBetweenTargetedParts > 0) {
          if (!`${lastShotIdx}`.endsWith("9")) {
            if (
              !newArray[lastShotIdx + 1].targeted ||
              !newArray[lastShotIdx + 1].nextToTargetedShip
            ) {
              nextShotIdx = lastShotIdx + 1;
            }

            if (
              newArray[lastShotIdx + 1].targeted ||
              newArray[lastShotIdx + 1].nextToTargetedShip
            ) {
              nextShotIdx = huntingHistory.targetedShipParts[0].idx - 1;
            }
          }

          if (
            `${lastShotIdx}`.endsWith("9") ||
            newArray[lastShotIdx + 1].targeted
          ) {
            nextShotIdx = huntingHistory.targetedShipParts[0].idx - 1;
          }
        }
        if (distanseBetweenTargetedParts < 0) {
          if (!`${lastShotIdx}`.endsWith("0")) {
            if (
              !newArray[lastShotIdx - 1].targeted ||
              !newArray[lastShotIdx - 1].nextToTargetedShip
            ) {
              nextShotIdx = lastShotIdx - 1;
            }
            if (
              newArray[lastShotIdx - 1].targeted ||
              newArray[lastShotIdx - 1].nextToTargetedShip
            ) {
              nextShotIdx = huntingHistory.targetedShipParts[0].idx + 1;
            }
          }

          if (
            `${lastShotIdx}`.endsWith("0") ||
            newArray[lastShotIdx + distanseBetweenTargetedParts].targeted
          ) {
            nextShotIdx = huntingHistory.targetedShipParts[0].idx + 1;
          }
        }
      }
      //verical shot
      if (Math.abs(distanseBetweenTargetedParts) >= 10) {
        //from top to bottom
        if (distanseBetweenTargetedParts > 0) {
          if (lastShotIdx > 9 && lastShotIdx < 90) {
            if (
              !newArray[lastShotIdx + 10].targeted ||
              !newArray[lastShotIdx + 10].nextToDestroyedShip
            ) {
              nextShotIdx = lastShotIdx + 10;
            }
            if (
              newArray[lastShotIdx + 10].targeted ||
              newArray[lastShotIdx + 10].nextToDestroyedShip
            ) {
              nextShotIdx = huntingHistory.targetedShipParts[0].idx - 10;
            }
          }

          if (lastShotIdx > 89) {
            nextShotIdx = huntingHistory.targetedShipParts[0].idx - 10;
          }
        }
        //from bottom to top
        if (distanseBetweenTargetedParts < 0) {
          if (lastShotIdx < 10) {
            nextShotIdx = huntingHistory.targetedShipParts[0].idx + 10;
          }
          if (lastShotIdx > 9) {
            if (
              !newArray[lastShotIdx - 10].targeted ||
              !newArray[lastShotIdx - 10].nextToTargetedShip
            ) {
              nextShotIdx = lastShotIdx - 10;
            }
            if (
              newArray[lastShotIdx - 10].targeted ||
              newArray[lastShotIdx - 10].nextToTargetedShip
            ) {
              nextShotIdx = huntingHistory.targetedShipParts[0].idx + 10;
            }
          }
        }
      }
      newArray[nextShotIdx].targeted = true;

      const shipId = newArray[nextShotIdx].shipId;

      if (shipId) {
        const isDestroyed = shipsStatus[shipId].cells
          .map((idx) => newArray[idx].targeted)
          .every((targeted) => targeted);
        setShipsStatus((prev) => ({
          ...prev,
          [shipId]: { ...prev[shipId], isDestroyed },
        }));

        if (!isDestroyed) {
          setHuntingHistory((prev) => ({
            targetedShipParts: [
              ...prev.targetedShipParts,
              newArray[nextShotIdx],
            ],
            availableCells: [],
          }));
        }
        if (isDestroyed) {
          setHuntingHistory(null);
          const shipCells = shipsStatus[shipId].cells;
          fillCellsAroundShip(newArray, shipCells, true);
        }
      }
      if (!shipId) {
        setHuntingHistory((prev) => ({
          ...prev,
          availableCells: [],
        }));
      }
      setArray(newArray);
      setNextCpuShoot((prev) => {
        return shipId ? prev + 1 : 0;
      });
      onSetIsPlayerTurn(shipId ? false : true);
    }
  }

  if (!huntingHistory.availableCells) {
    // first targeted ship part
    const cell = huntingHistory.targetedShipParts[0].idx;
    //first horizontal field line
    if (cell === 0) {
      pushAvailableCells(cell + 10);
      pushAvailableCells(cell + 1);
    }

    if (cell > 0 && cell < 9) {
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell + 10);
      pushAvailableCells(cell + 1);
    }
    if (cell === 9) {
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell + 10);
    }
    //first vertical field line excluding 0 & 90
    if (`${cell}`.includes("0") && cell > 0 && cell < 90) {
      pushAvailableCells(cell - 10);
      pushAvailableCells(cell + 1);
      pushAvailableCells(cell + 10);
    }
    //fields out of borders
    if (
      !`${cell}`.includes("0") &&
      !`${cell}`.includes("9") &&
      cell > 9 &&
      cell < 89
    ) {
      pushAvailableCells(cell - 10);
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell + 1);
      pushAvailableCells(cell + 10);
    }
    //last vertical field line
    if (`${cell}`.endsWith("9") && cell > 9 && cell < 99) {
      pushAvailableCells(cell - 10);
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell + 10);
    }

    if (cell === 90) {
      pushAvailableCells(cell - 10);
      pushAvailableCells(cell + 1);
    }
    //last horizontal line for single-deck ship
    if (cell > 90 && cell < 99) {
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell - 10);
      pushAvailableCells(cell + 1);
    }

    if (cell === 99) {
      pushAvailableCells(cell - 1);
      pushAvailableCells(cell - 10);
    }

    const randomIdx = Math.floor(Math.random() * availableCells.length);
    availableCells[randomIdx].targeted = true;
    const targetedCell = availableCells[randomIdx].idx;
    newArray[targetedCell].targeted = true;

    const shipId = newArray[targetedCell].shipId;

    if (shipId) {
      const isDestroyed = shipsStatus[shipId].cells
        .map((idx) => newArray[idx].targeted)
        .every((targeted) => targeted);
      setShipsStatus((prev) => ({
        ...prev,
        [shipId]: { ...prev[shipId], isDestroyed },
      }));

      if (!isDestroyed) {
        setHuntingHistory((prev) => ({
          targetedShipParts: [
            ...prev.targetedShipParts,
            newArray[targetedCell],
          ],
          availableCells,
        }));
      }
      if (isDestroyed) {
        setHuntingHistory(null);
        const shipCells = shipsStatus[shipId].cells;
        fillCellsAroundShip(newArray, shipCells, true);
      }
    }
    if (!shipId) {
      setHuntingHistory((prev) => ({
        ...prev,
        availableCells,
      }));
    }
    setArray(newArray);
    setNextCpuShoot((prev) => {
      return shipId ? prev + 1 : 0;
    });
    onSetIsPlayerTurn(shipId ? false : true);
  }
};

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
