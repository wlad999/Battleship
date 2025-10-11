import { ENEMY, PLAYER } from '@/constants';

import Firework from '../firework';
import LossAnimation from '../loss';
import Stopwatch from '../stopwatch';

function Animations({ winner = null, started, isPlayerTurn, shootDelay }) {
  if (winner === PLAYER) {
    return <Firework />;
  }
  if (winner === ENEMY) {
    return <LossAnimation />;
  }
  if (!winner && started && !isPlayerTurn && shootDelay > 0) {
    return <Stopwatch />;
  }
  return null;
}

export default Animations;
