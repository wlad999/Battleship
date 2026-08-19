import cls from 'classnames';

import Explosion from '../explosion';

import styles from './styles.module.scss';

function CellEvents({ item, ship }) {
  const { shipId, targeted } = item;
  const isDestroyed = ship?.isDestroyed;

  return (
    <>
      <div
        className={cls(styles.cell, {
          [styles.destroyed]: isDestroyed && shipId,
          [styles.targetedEmptyCell]: targeted && !shipId,
        })}
      >
        {targeted && shipId && !isDestroyed && <Explosion />}
      </div>
    </>
  );
}

export default CellEvents;
