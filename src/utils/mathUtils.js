function getRandomInt(maxNum) {
  if (typeof maxNum !== "number" || maxNum <= 0 || !Number.isInteger(maxNum)) {
    throw new Error(`getRandomInt: invalid maxNum "${maxNum}"`);
  }
  return Math.floor(Math.random() * maxNum);
}

export { getRandomInt };
