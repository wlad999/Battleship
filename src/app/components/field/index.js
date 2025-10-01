"use client";
import FieldView from "../fieldView";
import { useFieldLogic } from "../../../hooks/useFieldLogic";

function Field({ isPlayer = false, gameState, setGameState }) {
  const logicResult = useFieldLogic({ isPlayer, gameState, setGameState });

  return <FieldView {...logicResult} />;
}

export default Field;
