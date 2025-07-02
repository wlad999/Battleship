// This file contains logic for placing ships on a battleship game field.

import { horizon, vertical } from "./contstantes";
function getRandomInt() {
  const startCell = Math.floor(Math.random() * 100);
  const direction = Math.round(Math.random());
  return [startCell, direction];
}

function placeShips(array, shipSize) {
  const [startCell, direction] = getRandomInt();
  const newArray = [...array];
  console.log("startCell!!!", startCell);
  console.log("direction!!!", !!direction ? "vertical" : "horizontal");

  //if last vertical cell of ship is out of field skip this startCell
  if (direction) {
    if (startCell + (shipSize - 1) * 10 > 99) {
      return placeShips(array, shipSize);
      //return newArray;
    }
  }
  //if last horizon cell of ship is out of field skip this startCell
  if (!direction && !`${startCell}`.includes("0")) {
    const lastHorizonCell = startCell + (shipSize - 1);
    const lastCellRaw = Math.ceil(startCell / 10) * 10 - 1;
    if (lastHorizonCell > lastCellRaw) {
      return placeShips(array, shipSize);
      //return newArray
    }
  }

  const getStep = (i) => {
    //direction - 0 - horizontal, 1 - vertical
    if (i === 0) {
      return i;
    }
    if (!direction) {
      return i;
    }
    return i * 10;
  };

  for (let i = 0; i < shipSize; i++) {
    const step = getStep(i);
    newArray[startCell + step].shipPart = (i + 1) / shipSize;
  }

  return newArray;
}

function placeShipsOnField(field, setField) {
  const fieldWithShip = placeShips(field, 4);
  setField(fieldWithShip);
}

export { getRandomInt, placeShips, placeShipsOnField };
