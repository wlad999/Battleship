import { memo, useCallback } from 'react';

import cls from 'classnames';

import { ENEMY, PLAYER } from '@/constants';

import CellEvents from '../cellEvents';
import Ship from '../ship';

import styles from './styles.module.scss';

function FieldCell({ idx, item, isPlayer, ship, showShips, handleClick }) {
  const onClick = useCallback(() => handleClick(idx), [handleClick, idx]);

  return (
    <div
      key={idx}
      id={`${isPlayer ? PLAYER : ENEMY}-${idx}`}
      onClick={onClick}
      className={cls(styles.cell, {
        [styles.enemyField]: !isPlayer,
      })}
    >
      <CellEvents item={item} ship={ship} />
      <Ship ship={ship} item={item} isPlayer={isPlayer} showShips={showShips} />
    </div>
  );
}

export default memo(FieldCell);
