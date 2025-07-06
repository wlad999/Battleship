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

      //if (i === 0 && i === shipSize - 1) {
      //  if (cell === 0) {
      //    newArray[cell + 10].nextToShipCell = true;
      //    newArray[cell + 11].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //  }

      //  if (cell > 0 && cell < 9) {
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell + 9].nextToShipCell = true;
      //    newArray[cell + 10].nextToShipCell = true;
      //    newArray[cell + 11].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //  }

      //  if (cell === 9) {
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell + 9].nextToShipCell = true;
      //    newArray[cell + 10].nextToShipCell = true;
      //  }
      //}
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

      //if (i === 0 && i === shipSize - 1) {
      //  if (`${cell}`.includes("0")) {
      //    newArray[cell - 10].nextToShipCell = true;
      //    newArray[cell - 9].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //    newArray[cell + 10].nextToShipCell = true;
      //    newArray[cell + 11].nextToShipCell = true;
      //  }

      //  if (!`${cell}`.includes("0") && !`${cell}`.includes("9")) {
      //    newArray[cell - 11].nextToShipCell = true;
      //    newArray[cell - 10].nextToShipCell = true;
      //    newArray[cell - 9].nextToShipCell = true;
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //    newArray[cell + 9].nextToShipCell = true;
      //    newArray[cell + 10].nextToShipCell = true;
      //    newArray[cell + 11].nextToShipCell = true;
      //  }
      //  if (`${cell}`.includes("9")) {
      //    newArray[cell - 10].nextToShipCell = true;
      //    newArray[cell - 11].nextToShipCell = true;
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell + 9].nextToShipCell = true;
      //    newArray[cell + 10].nextToShipCell = true;
      //  }
      //}
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
      //if (i === 0 && i === shipSize - 1) {
      //  if (cell === 90) {
      //    newArray[cell - 10].nextToShipCell = true;
      //    newArray[cell - 9].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //  }

      //  if (cell > 0 && cell < 9) {
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell - 11].nextToShipCell = true;
      //    newArray[cell - 10].nextToShipCell = true;
      //    newArray[cell + 9].nextToShipCell = true;
      //    newArray[cell + 1].nextToShipCell = true;
      //  }

      //  if (cell === 9) {
      //    newArray[cell - 1].nextToShipCell = true;
      //    newArray[cell - 11].nextToShipCell = true;
      //    newArray[cell - 10].nextToShipCell = true;
      //  }
      //}
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
    //=====================================
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

function placeShips(array, shipSize) {
  const [startCell, direction] = getRandomInt();
  const newArray = array.map((obj) => ({ ...obj }));

  console.log("startCell!!!", startCell);
  console.log("direction!!!", direction);

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
    //if cell is already occupied by ship part or next to ship part, skip this startCell
    if (newArray[cell].shipPart || newArray[cell].nextToShipCell) {
      console.log("busy cell - return placeShips!!!", cell);

      return placeShips(array, shipSize);
    }
    const shipPart = (i + 1) / shipSize;
    fillCellsAroundShip(cell, direction, i, shipSize, newArray);
    newArray[cell].shipPart = shipPart;
  }

  return newArray;
}

function placeShipsOnField(field = [], setField) {
  let changedField = field.map((obj) => ({ ...obj }));
  [4, 3, 2, 1].forEach((shipSize) => {
    console.log("======placing started - shipSize!!!", shipSize);
    changedField = placeShips(changedField, shipSize);
    console.log("======placing finished - shipSize - field!!!", changedField);
  });
  console.log("++++placing finished - field+++++!!!", changedField);

  setField(changedField);
}

export { getRandomInt, placeShips, placeShipsOnField, generateEmptyArray };
