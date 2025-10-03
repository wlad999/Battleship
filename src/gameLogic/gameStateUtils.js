import { PLAYER, ENEMY } from "@/constants";

function isGameOver(shipsStatus) {
  return Object.values(shipsStatus).every((ship) => ship.isDestroyed);
}

function groupAndSortShips(shipsStatus) {
  const ships = Object.values(shipsStatus);

  // Collecting unique ship sizes
  const uniqueSizes = [...new Set(ships.map((ship) => ship.cells.length))].sort(
    (a, b) => b - a // first big, then small
  );
  //sort by isDestroyed, alive ships first, destroyed ships last
  const sortByStatus = (a, b) => Number(a.isDestroyed) - Number(b.isDestroyed);

  // Group ships by size and sort each group by isDestroyed status (alive first, destroyed last)
  return uniqueSizes.map((size) =>
    ships.filter((ship) => ship.cells.length === size).sort(sortByStatus)
  );
}

function getShotCoords(lastHitId, isPlayer) {
  const id = `${isPlayer ? PLAYER : ENEMY}-${lastHitId}`;
  const el = document.getElementById(id);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  return {
    x: rect.left + rect.width / 2 + scrollX,
    y: rect.top + rect.height / 2 + scrollY,
  };
}

export { isGameOver, groupAndSortShips, getShotCoords };
