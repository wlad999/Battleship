import { FIRST_IDX, LAST_IDX, NEXT_TO_DESTROYED_SHIP } from '@/constants';

function isValidIndex(idx, array) {
  if (idx === undefined) {
    return false;
  }
  return (
    idx >= FIRST_IDX &&
    idx <= LAST_IDX &&
    !array[idx].targeted &&
    !array[idx][NEXT_TO_DESTROYED_SHIP]
  );
}

export { isValidIndex };
