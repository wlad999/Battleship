import FieldCell from "../fieldCell";
import HitWaveSVG from "../hitWave";
import Status from "../status";
import { PLAYER, ENEMY } from "../../../utils/constants";

import styles from "./styles.module.scss";

function FieldView({
  isPlayer,
  battleField,
  shipsStatus,
  lastHitId,
  started,
  isPlayerTurn,
  showShips,
  handleClick,
}) {
  return (
    <div className={styles.container}>
      <HitWaveSVG lastHitId={lastHitId} isPlayer={isPlayer} active />
      <Status shipsStatus={shipsStatus} isPlayer={isPlayer} started={started} />
      <h3>{isPlayer ? `${PLAYER} fleet` : `${ENEMY} fleet`}</h3>
      <div className={styles.wrapper}>
        {battleField.map((item, idx) => (
          <FieldCell
            idx={idx}
            key={idx}
            item={item}
            isPlayer={isPlayer}
            shipsStatus={shipsStatus}
            isPlayerTurn={isPlayerTurn}
            showShips={showShips}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

export default FieldView;
