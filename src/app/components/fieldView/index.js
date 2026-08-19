import FieldCell from '../fieldCell';
import FieldHeader from '../fieldHeader';
import HitWaveSVG from '../hitWave';

import styles from './styles.module.scss';

function FieldView({
  isPlayer,
  battleField,
  shipsStatus,
  lastHitId,
  started,
  showShips,
  handleClick,
  winner,
}) {
  return (
    <div className={styles.container}>
      <HitWaveSVG lastHitId={lastHitId} isPlayer={isPlayer} active />
      <FieldHeader
        shipsStatus={shipsStatus}
        isPlayer={isPlayer}
        started={started}
      />
      <div className={styles.wrapper}>
        {battleField.map((item, idx) => (
          <FieldCell
            idx={idx}
            key={idx}
            item={item}
            isPlayer={isPlayer}
            ship={item.shipId ? shipsStatus[item.shipId] : undefined}
            showShips={showShips}
            handleClick={handleClick}
            winner={winner}
          />
        ))}
      </div>
    </div>
  );
}

export default FieldView;
