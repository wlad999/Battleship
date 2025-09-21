import { soundNodes } from "./audioCore";
import { getRandomSoundKey } from "./soundUtils";
import { soundConfig } from "./soundConfig";

const isAppleDevice =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.userAgent);
const activeSounds = new Map();
let globalVolume = 1;

const SoundManager = {
  playSound(key, customConfig = {}) {
    const soundKey = getRandomSoundKey(soundNodes, key);
    const node = soundNodes[soundKey];
    if (!node) return;

    const { audio, gain } = node;

    const baseConfig = soundConfig[key] || {};
    const currentConfig = { ...baseConfig, ...customConfig };
    const { volume = 0.2, loop = false, skipIfPlaying = false } = currentConfig;

    const current = activeSounds.get(soundKey);
    if (skipIfPlaying && current && !current.paused) return;
    if (!skipIfPlaying && current && !current.paused) {
      current.pause();
    }

    gain.gain.value = volume * globalVolume;
    audio.loop = loop;
    audio.currentTime = 0;
    audio.play().catch(() => {});

    activeSounds.set(soundKey, audio);
  },

  stopSound(key) {
    const sound = activeSounds.get(key);
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(key);
  },

  stopAllSound() {
    for (const [_, audio] of activeSounds.entries()) {
      try {
        audio.pause();
      } catch (_) {}
      audio.currentTime = 0;
    }
    activeSounds.clear();
  },

  isSoundPlaying(key) {
    const audio = activeSounds.get(key);
    return audio && !audio.paused;
  },

  syncApplePlayback(audio, volume) {
    if (volume === 0 && !audio.paused) {
      audio.pause();
    } else if (volume > 0) {
      try {
        if (!audio.paused) audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch (_) {}
    }
  },

  setGlobalVolume(volume) {
    globalVolume = Math.max(0, Math.min(1, volume));
    for (const [key, audio] of activeSounds.entries()) {
      const config = soundConfig[key] || {};
      const node = soundNodes[key];
      if (!node) continue;

      const { gain } = node;
      const finalVolume = (config?.volume || 0.2) * globalVolume;
      gain.gain.value = finalVolume;

      if (isAppleDevice) {
        SoundManager.syncApplePlayback(audio, globalVolume);
      }
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
