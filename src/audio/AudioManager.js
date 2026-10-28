// AudioManager.js - musik latar (BGM) dan efek suara (SFX). Domain Dev 2.
// Semua suara dibuat dengan Web Audio API (tanpa file audio pihak ketiga), jadi tidak ada
// masalah lisensi. Peramban memblokir suara sebelum ada interaksi pengguna, sehingga
// `unlock()` dipanggil dari klik pertama pemain (lihat App.jsx).
//
// Ingin memakai file musik sendiri? Taruh file di public/assets/audio/, ubah BGM_FILE menjadi
// "/assets/audio/nama-file.mp3", lalu perbarui AUDIO_CREDIT dengan sumber dan lisensinya
// (hanya pakai lisensi yang mengizinkan, misalnya CC0, dan verifikasi sendiri).

export const BGM_FILE = null;
export const AUDIO_CREDIT =
  'Musik latar dan efek suara dibuat dengan kode menggunakan Web Audio API, tanpa file audio pihak ketiga.';

const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Progresi sederhana: Cmaj7 - Am7 - Fmaj7 - G6 (nada tengah, lembut).
const CHORDS = [
  [48, 55, 59, 64],
  [45, 52, 55, 60],
  [41, 48, 52, 57],
  [43, 50, 55, 59],
];
const ARP_PATTERN = [0, 1, 2, 3, 2, 1, 2, 1];

class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.bgmTimer = null;
    this.bgmFile = null;
    this.nextBarTime = 0;
    this.barIndex = 0;
    this.bgmWanted = false;
    this.listeners = new Set();
    // Snapshot immutable agar aman dipakai useSyncExternalStore.
    this.state = { muted: false, musicVolume: 0.4, sfxVolume: 0.8 };
    this.onVisibility = this.onVisibility.bind(this);
  }

  // ---------- state & langganan (untuk React) ----------
  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.applyVolumes();
    this.listeners.forEach((l) => l());
  }

  setMuted(muted) {
    this.setState({ muted: Boolean(muted) });
  }

  toggleMuted() {
    this.setMuted(!this.state.muted);
  }

  setMusicVolume(value) {
    this.setState({ musicVolume: clamp01(value) });
  }

  setSfxVolume(value) {
    this.setState({ sfxVolume: clamp01(value) });
  }

  applyVolumes() {
    const { muted, musicVolume, sfxVolume } = this.state;
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.03);
      this.musicGain.gain.setTargetAtTime(musicVolume * 0.5, t, 0.03);
      this.sfxGain.gain.setTargetAtTime(sfxVolume * 0.6, t, 0.03);
    }
    if (this.bgmFile) this.bgmFile.volume = muted ? 0 : musicVolume;
  }

  // ---------- inisialisasi (harus dari gestur pengguna) ----------
  unlock() {
    if (!this.ctx) {
      const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
      if (!Ctx) return false;
      try {
        this.ctx = new Ctx();
      } catch {
        return false;
      }
      this.master = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyVolumes();
      document.addEventListener('visibilitychange', this.onVisibility);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    if (this.bgmWanted) this.startBgm();
    return true;
  }

  onVisibility() {
    if (!this.ctx) return;
    if (document.hidden) this.ctx.suspend().catch(() => {});
    else this.ctx.resume().catch(() => {});
  }

  // ---------- musik latar ----------
  startBgm() {
    this.bgmWanted = true;
    if (BGM_FILE) {
      if (!this.bgmFile) {
        this.bgmFile = new Audio(BGM_FILE);
        this.bgmFile.loop = true;
        this.applyVolumes();
      }
      this.bgmFile.play().catch(() => {});
      return;
    }
    if (!this.ctx || this.bgmTimer) return;
    this.nextBarTime = this.ctx.currentTime + 0.1;
    this.barIndex = 0;
    this.scheduleBgm();
    this.bgmTimer = setInterval(() => this.scheduleBgm(), 150);
  }

  stopBgm() {
    this.bgmWanted = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmFile) this.bgmFile.pause();
  }

  scheduleBgm() {
    if (!this.ctx) return;
    while (this.nextBarTime < this.ctx.currentTime + 0.6) {
      this.scheduleBar(this.nextBarTime, this.barIndex % CHORDS.length);
      this.nextBarTime += BAR;
      this.barIndex += 1;
    }
  }

  scheduleBar(start, chordIndex) {
    const chord = CHORDS[chordIndex];
    // Pad: tiga nada pertama ditahan sepanjang bar.
    chord.slice(0, 3).forEach((m) => {
      this.tone(midi(m - 12), start, BAR * 0.98, 'sine', 0.05, this.musicGain, { attack: 0.35, release: 0.5 });
    });
    // Arpeggio delapan nada per bar, satu oktaf di atas chord.
    ARP_PATTERN.forEach((idx, i) => {
      const t = start + i * (BEAT / 2);
      this.tone(midi(chord[idx] + 12), t, BEAT * 0.45, 'triangle', 0.07, this.musicGain, { attack: 0.01, release: 0.25 });
    });
  }

  // ---------- efek suara ----------
  playSfx(name) {
    if (!this.ctx || this.ctx.state === 'closed') return;
    const t = this.ctx.currentTime + 0.01;
    switch (name) {
      case 'click':
        this.tone(660, t, 0.07, 'triangle', 0.5, this.sfxGain, { attack: 0.003, release: 0.05, endFreq: 880 });
        break;
      case 'complete':
        [523.25, 659.25, 783.99].forEach((f, i) =>
          this.tone(f, t + i * 0.1, 0.25, 'triangle', 0.55, this.sfxGain, { attack: 0.005, release: 0.18 }),
        );
        break;
      case 'door':
        this.tone(150, t, 0.22, 'sine', 0.9, this.sfxGain, { attack: 0.005, release: 0.15, endFreq: 70 });
        this.noise(t, 0.18, 0.25);
        break;
      case 'result':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.tone(f, t + i * 0.13, 0.4, 'triangle', 0.55, this.sfxGain, { attack: 0.005, release: 0.3 }),
        );
        break;
      default:
        break;
    }
  }

  // ---------- bantuan sintesis ----------
  tone(freq, start, duration, type, peak, destination, { attack = 0.01, release = 0.1, endFreq } = {}) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    const end = start + duration;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + attack);
    gain.gain.setValueAtTime(peak, Math.max(start + attack, end - release));
    gain.gain.linearRampToValueAtTime(0.0001, end);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(start);
    osc.stop(end + 0.02);
  }

  noise(start, duration, peak) {
    const length = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(peak, start);
    gain.gain.linearRampToValueAtTime(0.0001, start + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    src.start(start);
  }
}

function clamp01(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

const audio = new AudioManager();
export default audio;
