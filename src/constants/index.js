const horizon = 'horizontal';
const vertical = 'vertical';
const shipsConfig = [
  { size: 4, count: 1 },
  { size: 3, count: 2 },
  { size: 2, count: 3 },
  { size: 1, count: 4 },
];

const PLAYER = 'Player';
const ENEMY = 'Enemy';
const NEXT_TO_SHIP_CELL = 'nextToShipCell';
const NEXT_TO_DESTROYED_SHIP = 'nextToDestroyedShip';

const FIELD_WIDTH = 10;
const FIELD_SIZE = FIELD_WIDTH * FIELD_WIDTH;
const FIRST_COL_NUM = 0;
const FIRST_ROW_NUM = 0;
const LAST_COL_NUM = FIELD_WIDTH - 1;
const LAST_ROW_NUM = FIELD_WIDTH - 1;
const FIRST_IDX = 0;
const LAST_IDX = FIELD_SIZE - 1;

const MAX_PLACEMENT_ATTEMPTS = 50;

export {
  horizon,
  vertical,
  shipsConfig,
  PLAYER,
  ENEMY,
  FIRST_IDX,
  LAST_IDX,
  FIELD_WIDTH,
  LAST_ROW_NUM,
  LAST_COL_NUM,
  NEXT_TO_SHIP_CELL,
  NEXT_TO_DESTROYED_SHIP,
  FIRST_COL_NUM,
  FIRST_ROW_NUM,
  FIELD_SIZE,
  MAX_PLACEMENT_ATTEMPTS,
};
