import { ENEMY, PLAYER } from '@/constants';

import Status from '../status';

function FieldHeader({ isPlayer, shipsStatus, started }) {
  return (
    <>
      <Status shipsStatus={shipsStatus} isPlayer={isPlayer} started={started} />
      <h3>{isPlayer ? `${PLAYER} fleet` : `${ENEMY} fleet`}</h3>
    </>
  );
}

export default FieldHeader;
