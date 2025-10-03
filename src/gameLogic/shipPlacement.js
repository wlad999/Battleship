import {
  horizon,
  vertical,
  shipsConfig,
  NEXT_TO_SHIP_CELL,
  NEXT_TO_DESTROYED_SHIP,
  FIELD_WIDTH,
  LAST_IDX,
  LAST_COL_NUM,
  FIRST_ROW_NUM,
  LAST_ROW_NUM,
  FIRST_COL_NUM,
  MAX_PLACEMENT_ATTEMPTS,
} from "@/constants";
import {
  cloneArrayShallow,
  getCoordsFromIndex,
  generateEmptyArray,
  getRandomInt,
} from "@/utils";

function getRandomDirection() {
  return Math.random() < 0.5 ? horizon : vertical;
}

function getNextIdx(i, startIdx, direction) {
  return direction === horizon ? i + startIdx : i * FIELD_WIDTH + startIdx;
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
    const rowEnd = row * FIELD_WIDTH + LAST_COL_NUM;
    return cell.idx + (shipSize - 1) <= rowEnd;
  });

  const availableCells = safeCells.length ? safeCells : field;

  const randomIdx = getRandomInt(availableCells.length);
  const startIdx = availableCells[randomIdx].idx;

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
  const minRow = Math.max(Math.min(...rows) - 1, FIRST_ROW_NUM);
  const maxRow = Math.min(Math.max(...rows) + 1, LAST_ROW_NUM);
  const minCol = Math.max(Math.min(...cols) - 1, FIRST_COL_NUM);
  const maxCol = Math.min(Math.max(...cols) + 1, LAST_COL_NUM);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const index = r * FIELD_WIDTH + c;

      // skip if it's a ship cell or already marked
      if (shipCellsSet.has(index) || updatedField[index][bufferZone]) continue;

      updatedField[index] = { ...updatedField[index], [bufferZone]: true };
    }
  }

  return updatedField;
}

function placeShip(array, shipSize, count) {
  let updatedField = cloneArrayShallow(array);
  let attempt = 0;
  let placed = false;

  // keep trying until the ship is placed or maxAttempts is reached
  // maximum number of attempts to place a ship
  while (!placed && attempt < MAX_PLACEMENT_ATTEMPTS) {
    attempt++;
    const direction = getRandomDirection();
    const startIdx = getRandomStartPosition(updatedField, shipSize, direction);

    const shipCells = [];
    let conflict = false;

    // check if ship can fit without overlapping or touching another ship
    for (let i = 0; i < shipSize; i++) {
      const nextIdx = getNextIdx(i, startIdx, direction);
      if (
        updatedField[nextIdx][NEXT_TO_SHIP_CELL] ||
        updatedField[nextIdx].shipId
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
      const filledFieldWithShip = placeShip(filledField, size, i);
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

export { placeShipsOnField, getFieldWithShipBuffer };
