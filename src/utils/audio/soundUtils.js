import { getRandomInt } from "../gameLogic";

export function getRandomSoundKey(sounds, keyPrefix) {
  if (sounds[keyPrefix]) return keyPrefix;

  const availableKeys = Object.keys(sounds).filter((soundKey) =>
    soundKey.startsWith(keyPrefix)
  );

  if (availableKeys.length === 0) return null;

  const randomIndex = getRandomInt(availableKeys.length);
  return availableKeys[randomIndex];
}
