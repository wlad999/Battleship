// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical, shipsConfig } from "./constants";

function generateEmptyArray() {
  return Array(100)
    .fill(null)
    .map(() => ({ shipPart: 0, targeted: false }));
}

function getRandomInt() {
  const startCell = Math.floor(Math.random() * 100);
  const direction = Math.round(Math.random()) < 1 ? horizon : vertical; // 0 - horizontal, 1 - vertical
  return [startCell, direction];
}

function fillCellsAroundShip(cell, direction, i, shipSize, newArray) {
  if (direction === horizon) {
    //first horizontal field line
    if (cell < 10) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 0) {
          newArray[cell + 10].nextToShipCell = true;
        }
        if (cell > 0 && cell < 9) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell + 9].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 9) {
        newArray[cell + 10].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 9) {
        newArray[cell + 1].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
        newArray[cell + 11].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 9) {
        newArray[cell + 9].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
      }
    }
    //middle horizontal field lines
    if (cell > 9 && cell < 90) {
      if (i === 0 && i < shipSize - 1) {
        if (`${cell}`.includes("0")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
        }
        if (!`${cell}`.includes("0")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell + 9].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
        }
      }
      if (i > 0 && i < shipSize - 1) {
        newArray[cell - 10].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
      }
      if (i > 0 && i === shipSize - 1) {
        if (`${cell}`.includes("9")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
        }

        if (!`${cell}`.includes("9")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
          newArray[cell + 11].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
        }
      }
    }
    //last horizontal field line
    if (cell > 89) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 90) {
          newArray[cell - 10].nextToShipCell = true;
        }
        if (cell > 90 && cell < 99) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 99) {
        newArray[cell - 10].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 99) {
        newArray[cell + 1].nextToShipCell = true;
        newArray[cell - 9].nextToShipCell = true;
        newArray[cell - 10].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 99) {
        newArray[cell - 10].nextToShipCell = true;
      }
    }
  }
  if (direction === vertical) {
    //first vertical fields line
    if (`${cell}`.includes("0")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 0) {
          newArray[cell + 1].nextToShipCell = true;
        }
        if (cell > 0 && cell < 90) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
        }
      }

      if (i > 0 && i < shipSize - 1) {
        newArray[cell + 1].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 90) {
        newArray[cell + 10].nextToShipCell = true;
        newArray[cell + 11].nextToShipCell = true;
        newArray[cell + 1].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 90) {
        newArray[cell + 1].nextToShipCell = true;
        newArray[cell - 9].nextToShipCell = true;
      }
    }
    //middle vertical field lines
    if (!`${cell}`.includes("0") && !`${cell}`.endsWith("9")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell < 9) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
        }
        if (cell > 10 && cell < 89) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell > 10 && cell < 89) {
        newArray[cell - 10].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 89) {
        newArray[cell - 1].nextToShipCell = true;
        newArray[cell + 1].nextToShipCell = true;
        newArray[cell + 9].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
        newArray[cell + 11].nextToShipCell = true;
      }
      if (i > 0 && i === shipSize - 1 && cell > 90 && cell < 99) {
        newArray[cell - 1].nextToShipCell = true;
        newArray[cell + 1].nextToShipCell = true;
      }
    }
    //last vertical field line
    if (`${cell}`.endsWith("9")) {
      if (i === 0 && i < shipSize - 1) {
        if (cell === 9) {
          newArray[cell - 1].nextToShipCell = true;
        }
        if (cell > 9 && cell < 99) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
        }
      }

      if (i > 0 && i < shipSize - 1 && cell < 99) {
        newArray[cell - 1].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell < 99) {
        newArray[cell - 1].nextToShipCell = true;
        newArray[cell + 9].nextToShipCell = true;
        newArray[cell + 10].nextToShipCell = true;
      }

      if (i > 0 && i === shipSize - 1 && cell === 99) {
        newArray[cell - 1].nextToShipCell = true;
      }
    }
  }

  //single-deck ship
  if (i === 0 && i === shipSize - 1) {
    //first horizontal field line
    if (cell === 0) {
      newArray[cell + 10].nextToShipCell = true;
      newArray[cell + 11].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
    }

    if (cell > 0 && cell < 9) {
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell + 9].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
      newArray[cell + 11].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
    }

    if (cell === 9) {
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell + 9].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
    }
  }

  if (i === 0 && i === shipSize - 1) {
    if (cell === 0) {
      newArray[cell + 1].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
      newArray[cell + 11].nextToShipCell = true;
    }
    //first vertical field line excluding 0 & 90
    if (`${cell}`.includes("0") && cell > 0 && cell < 90) {
      newArray[cell - 10].nextToShipCell = true;
      newArray[cell - 9].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
      newArray[cell + 11].nextToShipCell = true;
    }
    //fields out of borders
    if (
      !`${cell}`.includes("0") &&
      !`${cell}`.includes("9") &&
      cell > 9 &&
      cell < 89
    ) {
      newArray[cell - 11].nextToShipCell = true;
      newArray[cell - 10].nextToShipCell = true;
      newArray[cell - 9].nextToShipCell = true;
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
      newArray[cell + 9].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
      newArray[cell + 11].nextToShipCell = true;
    }
    //last vertical field line
    if (`${cell}`.endsWith("9") && cell > 9 && cell < 99) {
      newArray[cell - 10].nextToShipCell = true;
      newArray[cell - 11].nextToShipCell = true;
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell + 9].nextToShipCell = true;
      newArray[cell + 10].nextToShipCell = true;
    }
  }

  if (i === 0 && i === shipSize - 1) {
    if (cell === 90) {
      newArray[cell - 10].nextToShipCell = true;
      newArray[cell - 9].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
    }
    //last horizontal line for single-deck ship
    if (cell > 90 && cell < 99) {
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell - 11].nextToShipCell = true;
      newArray[cell - 10].nextToShipCell = true;
      newArray[cell - 9].nextToShipCell = true;
      newArray[cell + 1].nextToShipCell = true;
    }

    if (cell === 99) {
      newArray[cell - 1].nextToShipCell = true;
      newArray[cell - 11].nextToShipCell = true;
      newArray[cell - 10].nextToShipCell = true;
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
    //const shipPart = (i + 1) / shipSize;
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

function shootRandomCell(
  array,
  setArray,
  shipsStatus,
  setShipsStatus,
  onSetIsPlayerTurn
) {
  const [startCell] = getRandomInt();
  const newArray = array.map((obj) => ({ ...obj }));
  if (newArray[startCell].targeted) {
    return shootRandomCell(
      newArray,
      setArray,
      shipsStatus,
      setShipsStatus,
      onSetIsPlayerTurn
    );
  }
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
  }
  setArray(newArray);
  onSetIsPlayerTurn(true);
}

export {
  getRandomInt,
  placeShips,
  placeShipsOnField,
  generateEmptyArray,
  shootRandomCell,
};
