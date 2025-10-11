import { soundNodes } from './audioCore';
import { getRandomSoundKey } from './soundUtils';
import { soundConfig } from './soundConfig';

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
    for (const [k, audio] of activeSounds.entries()) {
      if (k.startsWith(key)) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  },

  stopAllSound() {
    for (const [_, audio] of activeSounds.entries()) {
      try {
        if (!audio.paused && audio.currentTime > 0) {
          audio.loop = false;
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (_) {}
    }
  },

  isSoundPlaying(key) {
    const audio = activeSounds.get(key);
    return audio && !audio.paused;
  },

  setGlobalVolume(volume) {
    globalVolume = Math.max(0, Math.min(1, volume));
    for (const [key, _] of activeSounds.entries()) {
      const config = soundConfig[key] || {};
      const node = soundNodes[key];
      if (!node) continue;

      const { gain } = node;
      const finalVolume = (config?.volume || 0.2) * globalVolume;
      gain.gain.value = finalVolume;
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
