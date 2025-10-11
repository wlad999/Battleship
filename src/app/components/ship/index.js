import Image from 'next/image';

import cls from 'classnames';

import styles from './styles.module.scss';

function Ship({ shipsStatus, item, isPlayer, showShips }) {
  if (!item.shipId) return null;
  const ship = shipsStatus[item.shipId];
  if (!ship) return null;

  const { isDestroyed, cells } = ship;
  if (!item.shipId || (!isDestroyed && !isPlayer && !showShips)) return null;

  const size = cells.length;
  let isHorizontal = false;
  if (size > 1) {
    isHorizontal = cells[1] === cells[0] + 1;
  } else {
    isHorizontal = cells[0] % 2 === 0;
  }

  const shipIdx = cells.indexOf(item.idx);
  if (shipIdx < 0) return null;

  return (
    <div className={styles.ship}>
      <Image
        src={`/assets/ship-${`${size}-${shipIdx}`}.webp`}
        alt={`Ship part`}
        className={cls(styles.img, {
          [styles.vertical]: !isHorizontal,
          [styles.targeted]:
            (item.targeted && isPlayer && !item.destroyed) ||
            (isDestroyed && !isPlayer),
        })}
        fill
        priority={true}
      />
    </div>
  );
}

export default Ship;
