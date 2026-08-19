import {
  FIELD_WIDTH,
  FIRST_COL_NUM,
  FIRST_ROW_NUM,
  LAST_COL_NUM,
  LAST_IDX,
  LAST_ROW_NUM,
  NEXT_TO_DESTROYED_SHIP,
  PLAYER,
} from '@/constants';
import {
  cloneArrayShallow,
  getCoordsFromIndex,
  getRandomInt,
  isValidIndex,
} from '@/utils';

import { processShotResult } from './shotProcessor.js';

const moveHorizontal = (lastHitIdx, step, firstHitIdx, field) => {
  const col = getCoordsFromIndex(lastHitIdx)[1];
  const HORIZONTAL_STEP = 1;

  if (step > 0) {
    // move right
    return isValidIndex(lastHitIdx + HORIZONTAL_STEP, field) &&
      col < LAST_COL_NUM
      ? lastHitIdx + HORIZONTAL_STEP
      : firstHitIdx - HORIZONTAL_STEP; // fallback left
  } else {
    // move left
    return isValidIndex(lastHitIdx - HORIZONTAL_STEP, field) &&
      col > FIRST_COL_NUM
      ? lastHitIdx - HORIZONTAL_STEP
      : firstHitIdx + HORIZONTAL_STEP; // fallback right
  }
};

const moveVertical = (lastHitIdx, step, firstHitIdx, field) => {
  const row = getCoordsFromIndex(lastHitIdx)[0];

  if (step > 0) {
    // move down
    return isValidIndex(lastHitIdx + FIELD_WIDTH, field) && row < LAST_ROW_NUM
      ? lastHitIdx + FIELD_WIDTH
      : firstHitIdx - FIELD_WIDTH; // fallback up
  } else {
    // move up
    return isValidIndex(lastHitIdx - FIELD_WIDTH, field) && row > FIRST_ROW_NUM
      ? lastHitIdx - FIELD_WIDTH
      : firstHitIdx + FIELD_WIDTH; // fallback down
  }
};

const getNextShotIdx = (lastHitIdx, step, firstHitIdx, field) => {
  if (Math.abs(step) < FIELD_WIDTH) {
    return moveHorizontal(lastHitIdx, step, firstHitIdx, field);
    // horizontal
  } else {
    // vertical
    return moveVertical(lastHitIdx, step, firstHitIdx, field);
  }
};

function chooseNextShot(availableCells, hits, array) {
  if (hits.length === 1) {
    const randomIdx = getRandomInt(availableCells.length);
    return availableCells[randomIdx];
  }

  const prevShot = hits[hits.length - 2];
  const lastShot = hits[hits.length - 1];
  const directionDelta = lastShot - prevShot;

  return getNextShotIdx(lastShot, directionDelta, hits[0], array);
}

function getAvailableNeighbors(firstHit, field) {
  const potentialNeighbors = [];
  if (firstHit % FIELD_WIDTH > FIRST_COL_NUM)
    potentialNeighbors.push(firstHit - 1); // left
  if (firstHit % FIELD_WIDTH < LAST_COL_NUM)
    potentialNeighbors.push(firstHit + 1); // right
  if (firstHit - FIELD_WIDTH >= FIRST_ROW_NUM)
    potentialNeighbors.push(firstHit - FIELD_WIDTH); // up
  if (firstHit + FIELD_WIDTH <= LAST_IDX)
    potentialNeighbors.push(firstHit + FIELD_WIDTH); // down

  return potentialNeighbors.filter((idx) => isValidIndex(idx, field));
}

function getRandomAvailableCell(field) {
  const availableCells = field
    .filter((cell) => !cell.targeted && !cell[NEXT_TO_DESTROYED_SHIP])
    .map((cell) => cell.idx);

  const randomIdx = getRandomInt(availableCells.length);
  return availableCells[randomIdx];
}

function cpuShoot(gameState) {
  const {
    [PLAYER]: { battleField, shipsStatus },
    huntingHistory,
    nextCpuShoot,
  } = gameState;
  const newArray = cloneArrayShallow(battleField);
  let availableCells = huntingHistory?.availableCells || [];
  let nextShotIdx;

  const hits = huntingHistory?.targetedShipParts || [];

  if (hits.length) {
    if (!availableCells.length) {
      availableCells = getAvailableNeighbors(hits[0], newArray);
    }

    nextShotIdx = chooseNextShot(availableCells, hits, newArray);

    if (!isValidIndex(nextShotIdx, newArray)) {
      nextShotIdx = getRandomAvailableCell(newArray);
    }

    availableCells = availableCells.filter((idx) => idx !== nextShotIdx);
  } else {
    nextShotIdx = getRandomAvailableCell(newArray);
  }

  const shotUpdatedData = processShotResult({
    idx: nextShotIdx,
    newArray,
    shipsStatus,
    huntingHistory,
    nextCpuShoot,
    availableCells,
  });

  return {
    ...gameState,
    ...shotUpdatedData,
  };
}

export { cpuShoot };
