// =====================================================================
// Input.js — keyboard W/A/S/D, panah, dan Spasi (Task 2.6)
// Domain DEV 1 (feature/canvas-engine)
//
// - Spasi diproses sebagai "tekan sekali" (edge), bukan tahan.
// - Saat paused = true: gerak & Spasi diabaikan, antrean aksi dibuang,
//   dan Spasi tetap di-preventDefault sehingga TIDAK ikut "mengklik"
//   tombol opsi dialog yang sedang fokus (SRS 5.2).
// =====================================================================

const KEY_TO_DIR = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export default class Input {
  constructor(target = window) {
    this.target = target;
    this.held = []; // urutan arah yang sedang ditahan (terakhir = prioritas)
    this.actionQueued = false;
    this.paused = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    // capture = true: dijalankan sebelum handler tombol React
    target.addEventListener("keydown", this.onKeyDown, true);
    target.addEventListener("keyup", this.onKeyUp, true);
    window.addEventListener("blur", this.onBlur);
  }

  onKeyDown(e) {
    if (isTypingTarget(e.target)) return;
    if (e.code === "Space") {
      e.preventDefault();
      if (!this.paused && !e.repeat) this.actionQueued = true;
      return;
    }
    const dir = KEY_TO_DIR[e.code];
    if (!dir) return;
    if (e.code.startsWith("Arrow")) e.preventDefault();
    if (this.paused) return;
    if (!this.held.includes(dir)) this.held.push(dir);
  }

  onKeyUp(e) {
    if (isTypingTarget(e.target)) return;
    if (e.code === "Space") {
      e.preventDefault(); // cegah aktivasi tombol fokus oleh Spasi
      return;
    }
    const dir = KEY_TO_DIR[e.code];
    if (dir) this.held = this.held.filter((d) => d !== dir);
  }

  onBlur() {
    this.held = [];
    this.actionQueued = false;
  }

  setPaused(paused) {
    this.paused = paused;
    if (paused) {
      this.held = [];
      this.actionQueued = false;
    }
  }

  /** Arah gerak saat ini: {dx, dy, dir} (dir = arah hadap terakhir ditekan). */
  getMovement() {
    if (this.paused || this.held.length === 0) return { dx: 0, dy: 0, dir: null };
    let dx = 0;
    let dy = 0;
    if (this.held.includes("left")) dx -= 1;
    if (this.held.includes("right")) dx += 1;
    if (this.held.includes("up")) dy -= 1;
    if (this.held.includes("down")) dy += 1;
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }
    return { dx, dy, dir: this.held[this.held.length - 1] };
  }

  /** true sekali per tekan Spasi (lalu antrean dikosongkan). */
  consumeAction() {
    const queued = this.actionQueued;
    this.actionQueued = false;
    return queued && !this.paused;
  }

  destroy() {
    this.target.removeEventListener("keydown", this.onKeyDown, true);
    this.target.removeEventListener("keyup", this.onKeyUp, true);
    window.removeEventListener("blur", this.onBlur);
    this.held = [];
  }
}
