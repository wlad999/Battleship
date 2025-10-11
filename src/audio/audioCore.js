export const audioContext =
  typeof window !== 'undefined' ? new AudioContext() : null;

export const sounds = {};
export const soundNodes = {};
