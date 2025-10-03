import { audioContext, sounds, soundNodes } from "./audioCore";

let audioUnlocked = false;

export async function initSoundsAsync() {
  if (!audioContext || typeof window === "undefined") return;

  if (audioContext.state === "suspended") {
    await audioContext.resume().catch(() => {});
  }

  const soundList = {
    "shot-0": "/sounds/shot-0.mp3",
    "shot-1": "/sounds/shot-1.mp3",
    "shot-2": "/sounds/shot-2.mp3",
    "shot-3": "/sounds/shot-3.mp3",
    "shot-4": "/sounds/shot-4.mp3",
    "shot-5": "/sounds/shot-5.mp3",
    "shot-6": "/sounds/shot-6.mp3",
    "shot-7": "/sounds/shot-7.mp3",
    "shot-8": "/sounds/shot-8.mp3",
    "shot-9": "/sounds/shot-9.mp3",
    "shot-10": "/sounds/shot-10.mp3",
    "shot-11": "/sounds/shot-11.mp3",
    "shot-12": "/sounds/shot-12.mp3",
    "hit-0": "/sounds/hit-0.mp3",
    "hit-1": "/sounds/hit-1.mp3",
    "hit-2": "/sounds/hit-2.mp3",
    "hit-3": "/sounds/hit-3.mp3",
    "hit-4": "/sounds/hit-4.mp3",
    "miss-0": "/sounds/miss-0.mp3",
    "miss-1": "/sounds/miss-1.mp3",
    "miss-2": "/sounds/miss-2.mp3",
    "miss-3": "/sounds/miss-3.mp3",
    "miss-4": "/sounds/miss-4.mp3",
    "miss-5": "/sounds/miss-5.mp3",
    "miss-6": "/sounds/miss-6.mp3",
    "miss-7": "/sounds/miss-7.mp3",
    "destroyed-0": "/sounds/destroyed-0.mp3",
    "destroyed-1": "/sounds/destroyed-1.mp3",
    "destroyed-2": "/sounds/destroyed-2.mp3",
    "destroyed-3": "/sounds/destroyed-3.mp3",
    "destroyed-4": "/sounds/destroyed-3.mp3",
    "siren-0": "/sounds/siren-0.mp3",
    "siren-1": "/sounds/siren-1.mp3",
    "siren-2": "/sounds/siren-2.mp3",
    "siren-3": "/sounds/siren-3.mp3",
    "sonar-0": "/sounds/sonar-0.mp3",
    "turret-0": "/sounds/turret-0.mp3",
    "turret-1": "/sounds/turret-1.mp3",
    "turret-2": "/sounds/turret-2.mp3",
    "enemyTargeted-0": "/sounds/enemyTargeted-0.mp3",
    "enemyTargeted-1": "/sounds/enemyTargeted-1.mp3",
    "enemyTargeted-2": "/sounds/enemyTargeted-2.mp3",
    "ocean-0": "/sounds/ocean-0.mp3",
    "victory-0": "/sounds/victory-0.mp3",
    "loss-0": "/sounds/loss-0.mp3",
    "sunk-0": "/sounds/sunk-0.mp3",
    "sunk-1": "/sounds/sunk-1.mp3",
    "enemyDestroyed-0": "/sounds/enemyDestroyed-0.mp3",
    "start-0": "/sounds/start-0.mp3",
    "button-0": "/sounds/button-0.mp3",
    "delayButton-0": "/sounds/delayButton-0.mp3",
    "muteButton-0": "/sounds/muteButton-0.mp3",
    "menuButton-0": "/sounds/menuButton-0.mp3",
  };

  const promises = Object.entries(soundList).map(([key, path]) => {
    return new Promise((resolve) => {
      const audio = new Audio(path);
      audio.preload = "auto";

      audio.addEventListener(
        "canplaythrough",
        () => {
          const source = audioContext.createMediaElementSource(audio);
          const gain = audioContext.createGain();
          gain.gain.value = 0.2;
          source.connect(gain).connect(audioContext.destination);

          sounds[key] = audio;
          soundNodes[key] = { audio, source, gain };
          resolve();
        },
        { once: true }
      );
    });
  });

  await Promise.all(promises);
}

export async function unlockAudio() {
  if (audioUnlocked || typeof window === "undefined") return;

  try {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    await initSoundsAsync();
    audioUnlocked = true;
  } catch (err) {
    console.warn("Audio unlock failed:", err);
  }
}
