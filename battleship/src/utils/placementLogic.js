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

function fillCellsAroundShip(
  cell,
  direction,
  i,
  shipSize,
  newArray,
  isDestroyed = false
) {
  const bufferZone = isDestroyed ? "nextToDestroyedShip" : "nextToShipCell";
  if (direction === horizon) {
    //first horizontal field line
    if (cell < 10) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 0) {
          newArray[cell + 10][bufferZone] = true;
        }
        if (cell > 0 && cell < 9) {
          newArray[cell - 1][bufferZone] = true;
          newArray[cell + 9][bufferZone] = true;
          newArray[cell + 10][bufferZone] = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 9) {
        newArray[cell + 10][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 9) {
        newArray[cell + 1][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
        newArray[cell + 11][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 9) {
        newArray[cell + 9][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
      }
    }
    //middle horizontal field lines
    if (cell > 9 && cell < 90) {
      if (i === 0 && i < shipSize - 1) {
        if (`${cell}`.includes("0")) {
          newArray[cell - 10][bufferZone] = true;
          newArray[cell + 10][bufferZone] = true;
        }
        if (!`${cell}`.includes("0")) {
          newArray[cell - 10][bufferZone] = true;
          newArray[cell - 11][bufferZone] = true;
          newArray[cell - 1][bufferZone] = true;
          newArray[cell + 9][bufferZone] = true;
          newArray[cell + 10][bufferZone] = true;
        }
      }
      if (i > 0 && i < shipSize - 1) {
        newArray[cell - 10][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
      }
      if (i > 0 && i === shipSize - 1) {
        if (`${cell}`.includes("9")) {
          newArray[cell - 10][bufferZone] = true;
          newArray[cell + 10][bufferZone] = true;
        }

        if (!`${cell}`.includes("9")) {
          newArray[cell - 10][bufferZone] = true;
          newArray[cell - 9][bufferZone] = true;
          newArray[cell + 1][bufferZone] = true;
          newArray[cell + 11][bufferZone] = true;
          newArray[cell + 10][bufferZone] = true;
        }
      }
    }
    //last horizontal field line
    if (cell > 89) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 90) {
          newArray[cell - 10][bufferZone] = true;
        }
        if (cell > 90 && cell < 99) {
          newArray[cell - 1][bufferZone] = true;
          newArray[cell - 11][bufferZone] = true;
          newArray[cell - 10][bufferZone] = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 99) {
        newArray[cell - 10][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 99) {
        newArray[cell + 1][bufferZone] = true;
        newArray[cell - 9][bufferZone] = true;
        newArray[cell - 10][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 99) {
        newArray[cell - 10][bufferZone] = true;
      }
    }
  }
  if (direction === vertical) {
    //first vertical fields line
    if (`${cell}`.includes("0")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 0) {
          newArray[cell + 1][bufferZone] = true;
        }
        if (cell > 0 && cell < 90) {
          newArray[cell - 10][bufferZone] = true;
          newArray[cell - 9][bufferZone] = true;
          newArray[cell + 1][bufferZone] = true;
        }
      }

      if (i > 0 && i < shipSize - 1) {
        newArray[cell + 1][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 90) {
        newArray[cell + 10][bufferZone] = true;
        newArray[cell + 11][bufferZone] = true;
        newArray[cell + 1][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 90) {
        newArray[cell + 1][bufferZone] = true;
        newArray[cell - 9][bufferZone] = true;
      }
    }
    //middle vertical field lines
    if (!`${cell}`.includes("0") && !`${cell}`.endsWith("9")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell < 9) {
          newArray[cell - 1][bufferZone] = true;
          newArray[cell + 1][bufferZone] = true;
        }
        if (cell > 10 && cell < 89) {
          newArray[cell - 1][bufferZone] = true;
          newArray[cell - 11][bufferZone] = true;
          newArray[cell - 10][bufferZone] = true;
          newArray[cell - 9][bufferZone] = true;
          newArray[cell + 1][bufferZone] = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell > 10 && cell < 89) {
        newArray[cell - 10][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 89) {
        newArray[cell - 1][bufferZone] = true;
        newArray[cell + 1][bufferZone] = true;
        newArray[cell + 9][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
        newArray[cell + 11][bufferZone] = true;
      }
      if (i > 0 && i === shipSize - 1 && cell > 90 && cell < 99) {
        newArray[cell - 1][bufferZone] = true;
        newArray[cell + 1][bufferZone] = true;
      }
    }
    //last vertical field line
    if (`${cell}`.endsWith("9")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 9) {
          newArray[cell - 1][bufferZone] = true;
        }
        if (cell > 9 && cell < 99) {
          newArray[cell - 1][bufferZone] = true;
          newArray[cell - 11][bufferZone] = true;
          newArray[cell - 10][bufferZone] = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 99) {
        newArray[cell - 1][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 99) {
        newArray[cell - 1][bufferZone] = true;
        newArray[cell + 9][bufferZone] = true;
        newArray[cell + 10][bufferZone] = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 99) {
        newArray[cell - 1][bufferZone] = true;
      }
    }
  }

  //single-deck ship
  if (i === 0 && i === shipSize - 1) {
    //first horizontal field line
    if (cell === 0) {
      newArray[cell + 10][bufferZone] = true;
      newArray[cell + 11][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
    }

    if (cell > 0 && cell < 9) {
      newArray[cell - 1][bufferZone] = true;
      newArray[cell + 9][bufferZone] = true;
      newArray[cell + 10][bufferZone] = true;
      newArray[cell + 11][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
    }

    if (cell === 9) {
      newArray[cell - 1][bufferZone] = true;
      newArray[cell + 9][bufferZone] = true;
      newArray[cell + 10][bufferZone] = true;
    }
  }

  if (i === 0 && i === shipSize - 1) {
    if (`${cell}`.includes("0") && cell > 0 && cell < 90) {
      newArray[cell - 10][bufferZone] = true;
      newArray[cell - 9][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
      newArray[cell + 10][bufferZone] = true;
      newArray[cell + 11][bufferZone] = true;
    }
    //fields out of borders
    if (
      !`${cell}`.includes("0") &&
      !`${cell}`.includes("9") &&
      cell > 9 &&
      cell < 89
    ) {
      newArray[cell - 11][bufferZone] = true;
      newArray[cell - 10][bufferZone] = true;
      newArray[cell - 9][bufferZone] = true;
      newArray[cell - 1][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
      newArray[cell + 9][bufferZone] = true;
      newArray[cell + 10][bufferZone] = true;
      newArray[cell + 11][bufferZone] = true;
    }
    //last vertical field line
    if (`${cell}`.endsWith("9") && cell > 9 && cell < 99) {
      newArray[cell - 10][bufferZone] = true;
      newArray[cell - 11][bufferZone] = true;
      newArray[cell - 1][bufferZone] = true;
      newArray[cell + 9][bufferZone] = true;
      newArray[cell + 10][bufferZone] = true;
    }
  }

  if (i === 0 && i === shipSize - 1) {
    if (cell === 90) {
      newArray[cell - 10][bufferZone] = true;
      newArray[cell - 9][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
    }
    //last horizontal line for single-deck ship
    if (cell > 90 && cell < 99) {
      newArray[cell - 1][bufferZone] = true;
      newArray[cell - 11][bufferZone] = true;
      newArray[cell - 10][bufferZone] = true;
      newArray[cell - 9][bufferZone] = true;
      newArray[cell + 1][bufferZone] = true;
    }

    if (cell === 99) {
      newArray[cell - 1][bufferZone] = true;
      newArray[cell - 11][bufferZone] = true;
      newArray[cell - 10][bufferZone] = true;
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
    if (i === 0) {
      return i + startCell;
    }
    if (direction === horizon) {
      return i + startCell;
    }
    return i * 10 + startCell;
  };

  for (let i = 0; i < shipSize; i++) {
    const cell = getCell(i, startCell);
    //if cell is already occupied by ship part or next to ship part, skip this startCell
    if (newArray[cell].shipPart || newArray[cell].nextToShipCell) {
      return placeShips(array, shipSize, count);
    }
    const shipId = `${shipSize}-${count}`;
    fillCellsAroundShip(cell, direction, i, shipSize, newArray);
    newArray[cell].shipPart = true;
    newArray[cell].shipId = shipId;
  }

  return newArray;
}

function placeShipsOnField(field = [], setField, setShipsStatus) {
  let shipsStatus = {};
  let filledField = field.map((obj) => ({ ...obj }));
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
  setShipsStatus(shipsStatus);
  setField(filledField);
}

function shootRandomCell({
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
}) {
  const availableCells = array
    .map((cell, idx) =>
      !cell.targeted && !cell.nextToDestroyedShip ? idx : null
    )
    .filter((idx) => idx !== null);

  if (availableCells.length === 0) return;
  const randomIdx = Math.floor(Math.random() * availableCells.length);
  const startCell = availableCells[randomIdx];
  const newArray = array.map((obj) => ({ ...obj }));
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
      const shipSize = shipsStatus[shipId].cells.length;
      const ship = shipsStatus[shipId].cells;
      let direction;
      if (shipSize > 1) {
        direction =
          Math.abs(
            shipsStatus[shipId].cells[0] - shipsStatus[shipId].cells[1]
          ) === 1
            ? horizon
            : vertical;
      } else {
        direction = horizon; // single-deck ship
      }

      ship.forEach((cell, i) => {
        fillCellsAroundShip(cell, direction, i, shipSize, newArray, true);
      });
    }
  }
  setArray(newArray);
  onSetIsPlayerTurn(true);
}

const huntingShip = (
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn,
  setHuntingHistory,
  huntingHistory
) => {
  const availableCells = [];
  const pushAvailableCells = (cell) => {
    if (array[cell].targeted || array[cell].nextToDestroyedShip) return;
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

      newAvailableCells[targetedIdx].targeted = true;
      const targetedCell = newAvailableCells[targetedIdx].idx;
      const newArray = array.map((obj) => ({ ...obj }));
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
            availableCells: newAvailableCells,
          }));
        }
        if (isDestroyed) {
          setHuntingHistory(null);
          const shipSize = shipsStatus[shipId].cells.length;
          const ship = shipsStatus[shipId].cells;
          let direction;
          if (shipSize > 1) {
            direction =
              Math.abs(
                shipsStatus[shipId].cells[0] - shipsStatus[shipId].cells[1]
              ) === 1
                ? horizon
                : vertical;
          } else {
            direction = horizon; // single-deck ship
          }

          ship.forEach((cell, i) => {
            fillCellsAroundShip(cell, direction, i, shipSize, newArray, true);
          });
        }
      }
      if (!shipId) {
        setHuntingHistory((prev) => ({
          ...prev,
          availableCells: newAvailableCells,
        }));
      }
      setArray(newArray);
      onSetIsPlayerTurn(true);
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
        const newArray = array.map((obj) => ({ ...obj }));

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
        const newArray = array.map((obj) => ({ ...obj }));
        //from top to bottom
        if (distanseBetweenTargetedParts > 0) {
          //if (lastShotIdx < 10) {
          //  nextShotIdx = huntingHistory.targetedShipParts[0].idx + 10;
          //}

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
      const newArray = array.map((obj) => ({ ...obj }));
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
          const shipSize = shipsStatus[shipId].cells.length;
          const ship = shipsStatus[shipId].cells;
          let direction;
          if (shipSize > 1) {
            direction =
              Math.abs(
                shipsStatus[shipId].cells[0] - shipsStatus[shipId].cells[1]
              ) === 1
                ? horizon
                : vertical;
          } else {
            direction = horizon; // single-deck ship
          }

          ship.forEach((cell, i) => {
            fillCellsAroundShip(cell, direction, i, shipSize, newArray, true);
          });
        }
      }
      if (!shipId) {
        setHuntingHistory((prev) => ({
          ...prev,
          availableCells: [],
        }));
      }
      setArray(newArray);
      onSetIsPlayerTurn(true);
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
    const newArray = array.map((obj) => ({ ...obj }));
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
        const shipSize = shipsStatus[shipId].cells.length;
        const ship = shipsStatus[shipId].cells;
        let direction;
        if (shipSize > 1) {
          direction =
            Math.abs(
              shipsStatus[shipId].cells[0] - shipsStatus[shipId].cells[1]
            ) === 1
              ? horizon
              : vertical;
        } else {
          direction = horizon; // single-deck ship
        }

        ship.forEach((cell, i) => {
          fillCellsAroundShip(cell, direction, i, shipSize, newArray, true);
        });
      }
    }
    if (!shipId) {
      setHuntingHistory((prev) => ({
        ...prev,
        availableCells,
      }));
    }
    setArray(newArray);
    onSetIsPlayerTurn(true);
  }
};

export {
  getRandomInt,
  placeShips,
  placeShipsOnField,
  generateEmptyArray,
  shootRandomCell,
  huntingShip,
};
