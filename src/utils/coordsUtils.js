import { FIELD_WIDTH } from '@/constants';

function getCoordsFromIndex(idx) {
  return [Math.floor(idx / FIELD_WIDTH), idx % FIELD_WIDTH];
}

export { getCoordsFromIndex };
