import { useEffect } from "react";
import { audioContext } from "../utils/audio/audioCore.js";
import { initSoundsAsync } from "../utils/audio/soundAssets.js";

export function useAudioUnlock() {
  useEffect(() => {
    let unlocked = false;

    const unlockAudio = async () => {
      if (unlocked) return;

      try {
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        initSoundsAsync();
        unlocked = true;
        window.removeEventListener("click", unlockAudio);
      } catch (err) {
        console.warn("Audio unlock failed:", err);
      }
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);
}
