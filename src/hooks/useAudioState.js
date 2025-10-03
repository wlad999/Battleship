import { useState, useEffect } from "react";
import { playSound, setGlobalVolume } from "@/audio/soundManager.js";

export function useAudioState(started) {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVolume = parseFloat(localStorage.getItem("volume")) || 0.5;
      const savedMuted = localStorage.getItem("muted") === "true";

      setVolume(savedVolume);
      setMuted(savedMuted);
      setGlobalVolume(savedMuted ? 0 : savedVolume);
    }
  }, [started]);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (!isFinite(vol)) return;
    setVolume(vol);
    setMuted(vol === 0);
    setGlobalVolume(vol);

    localStorage.setItem("volume", vol.toString());
    localStorage.setItem("muted", vol === 0 ? "true" : "false");
  };

  const handleVolumePreview = (e) => {
    const vol = parseFloat(e.target.value);
    if (!isFinite(vol)) return;
    setGlobalVolume(vol);
  };

  const toggleMute = () => {
    playSound("muteButton-0");
    const newMuted = !muted;
    setMuted(newMuted);
    setGlobalVolume(newMuted ? 0 : volume);
    localStorage.setItem("muted", newMuted.toString());
  };

  return {
    volume,
    muted,
    toggleMute,
    handleVolumeChange,
    handleVolumePreview,
  };
}
