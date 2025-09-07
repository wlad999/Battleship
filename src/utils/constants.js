const horizon = "horizontal";
const vertical = "vertical";
const shipsConfig = [
  { size: 4, count: 1 },
  { size: 3, count: 2 },
  { size: 2, count: 3 },
  { size: 1, count: 4 },
];

const PLAYER = "Player";
const ENEMY = "Enemy";

const TOTAL_SHIP_PARTS = shipsConfig.reduce(
  (acc, ship) => acc + ship.size * ship.count,
  0
);

export { horizon, vertical, shipsConfig, PLAYER, ENEMY, TOTAL_SHIP_PARTS };
