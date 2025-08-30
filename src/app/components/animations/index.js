import Firework from "../firework";
import LossAnimation from "../loss";
import { PLAYER, ENEMY } from "../../../utils/constants";
function Animations({ winner = null }) {
  if (winner === PLAYER) {
    return <Firework />;
  }
  if (winner === ENEMY) {
    return <LossAnimation />;
  }
  return null;
}

export default Animations;
