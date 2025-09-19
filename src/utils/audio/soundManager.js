import { sounds } from "./soundAssets.js";
import { getRandomSoundKey } from "./soundUtils";
import { soundConfig } from "./soundConfig";

const activeSounds = new Map();
let globalVolume = 1;

const SoundManager = {
  playSound(key, customConfig = {}) {
    const soundKey = getRandomSoundKey(sounds, key);

    const sound = sounds[soundKey];
    if (!sound) return;
    const baseConfig = soundConfig[key] || {};
    const currentConfig = { ...baseConfig, ...customConfig };
    const { volume = 0.2, loop = false, skipIfPlaying = false } = currentConfig;

    const current = activeSounds.get(key);
    if (skipIfPlaying && current && !current.paused) return;
    if (!skipIfPlaying && current && !current.paused) {
      current.pause();
    }
    sound.volume = volume * globalVolume;
    sound.loop = loop;
    sound.currentTime = 0;
    sound.play();

    activeSounds.set(key, sound);
  },

  stopSound(key) {
    const sound = activeSounds.get(key);
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(key);
  },

  stopAllSound() {
    for (const [_, sound] of activeSounds.entries()) {
      sound.pause();
      sound.currentTime = 0;
    }
    activeSounds.clear();
  },

  isSoundPlaying(key) {
    const sound = activeSounds.get(key);
    return sound && !sound.paused;
  },

  setGlobalVolume(v) {
    globalVolume = Math.max(0, Math.min(1, v));
    for (const [key, sound] of activeSounds.entries()) {
      const config = soundConfig[key] || {};
      sound.volume = (config?.volume || 0.2) * globalVolume;
      sound.muted = globalVolume === 0;
    }
  },
};

export const {
  playSound,
  stopSound,
  stopAllSound,
  isSoundPlaying,
  setGlobalVolume,
} = SoundManager;
