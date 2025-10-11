import { FIELD_SIZE } from '@/constants';

function generateEmptyArray() {
  return Array(FIELD_SIZE)
    .fill(null)
    .map((_, idx) => ({ targeted: false, idx }));
}

export { generateEmptyArray };
