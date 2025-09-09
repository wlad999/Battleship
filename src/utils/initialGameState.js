import { PLAYER, ENEMY } from "./constants";
export const initialGameState = {
  isPlayerTurn: true,
  winner: null,
  started: false,
  placeShips: null,
  showShips: false,
  [PLAYER]: { battleField: [], shipsStatus: {}, lastHitId: null },
  [ENEMY]: { battleField: [], shipsStatus: {}, lastHitId: null },
  huntingHistory: null,
  nextCpuShoot: null,
};
