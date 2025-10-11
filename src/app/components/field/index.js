'use client';

import { useFieldLogic } from '@/hooks/useFieldLogic';

import FieldView from '../fieldView';

function Field({ isPlayer = false, gameState, setGameState }) {
  const logicResult = useFieldLogic({ isPlayer, gameState, setGameState });

  return <FieldView {...logicResult} />;
}

export default Field;
