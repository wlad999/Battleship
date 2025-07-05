// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical } from "./constants";

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
    console.log("====================???");
    console.log("cell???", cell);
    console.log("i???", i);
    console.log("shipSize???", shipSize);
    console.log("===================???");

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

      if (i === 0 && i === shipSize - 1) {
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

      if (i === 0 && i === shipSize - 1) {
        if (`${cell}`.includes("0")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
          newArray[cell + 11].nextToShipCell = true;
        }

        if (!`${cell}`.includes("0") && !`${cell}`.includes("9")) {
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
          newArray[cell + 9].nextToShipCell = true;
          newArray[cell + 10].nextToShipCell = true;
          newArray[cell + 11].nextToShipCell = true;
        }
        if (`${cell}`.includes("9")) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell + 9].nextToShipCell = true;
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
      //last horizontal line for single-deck ship
      if (i === 0 && i === shipSize - 1) {
        if (cell === 90) {
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell - 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
        }

        if (cell > 0 && cell < 9) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
          newArray[cell + 9].nextToShipCell = true;
          newArray[cell + 1].nextToShipCell = true;
        }

        if (cell === 9) {
          newArray[cell - 1].nextToShipCell = true;
          newArray[cell - 11].nextToShipCell = true;
          newArray[cell - 10].nextToShipCell = true;
        }
      }
    }
  }
}

function placeShips(array, shipSize) {
  console.log("shipSize!!!", shipSize);

  const [startCell, direction] = getRandomInt();
  const newArray = [...array];
  console.log("startCell!!!", startCell);
  console.log("direction!!!", !!direction ? "vertical" : "horizontal");

  //if last vertical cell of ship is out of field skip this startCell
  if (direction === vertical) {
    if (startCell + (shipSize - 1) * 10 > 99) {
      return placeShips(array, shipSize);
    }
  }
  //if last horizon cell of ship is out of field skip this startCell
  if (direction === horizon && !`${startCell}`.includes("0")) {
    const lastHorizonCell = startCell + (shipSize - 1);
    const lastCellRaw = Math.ceil(startCell / 10) * 10 - 1;
    if (lastHorizonCell > lastCellRaw) {
      return placeShips(array, shipSize);
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
    const shipPart = (i + 1) / shipSize;
    fillCellsAroundShip(cell, direction, i, shipSize, newArray);
    newArray[cell].shipPart = shipPart;
  }

  return newArray;
}

function placeShipsOnField(field = [], setField) {
  let currentField = field;
  [4, 3, 2, 1].forEach((shipSize) => {
    currentField = placeShips(currentField, shipSize);
  });
  setField(currentField);
}

export { getRandomInt, placeShips, placeShipsOnField, generateEmptyArray };
