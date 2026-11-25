// useAudioState.js - hook agar komponen React ikut diperbarui saat pengaturan audio berubah.
import { useSyncExternalStore } from 'react';
import audio from './AudioManager.js';

export default function useAudioState() {
  return useSyncExternalStore(
    (listener) => audio.subscribe(listener),
    () => audio.getState(),
    () => audio.getState(),
  );
}
