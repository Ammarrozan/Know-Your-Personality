// Input.js - menangkap keyboard (WASD/panah) dan Spasi. Dev 1.
const MOVE_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
]);

export default class Input {
  constructor() {
    this.keys = new Set();
    this.actionQueued = false; // Spasi ditekan (sekali per tekanan)
    this.paused = false;
    this.debugToggle = false;
    this._down = this._down.bind(this);
    this._up = this._up.bind(this);
    this._blur = this._blur.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this._down);
    window.addEventListener('keyup', this._up);
    window.addEventListener('blur', this._blur);
  }

  detach() {
    window.removeEventListener('keydown', this._down);
    window.removeEventListener('keyup', this._up);
    window.removeEventListener('blur', this._blur);
    this.keys.clear();
    this.actionQueued = false;
  }

  setPaused(p) {
    this.paused = p;
    this.actionQueued = false; // buang Spasi yang tertahan
  }

  _down(e) {
    if (e.code === 'Space') {
      e.preventDefault(); // cegah halaman scroll / tombol dialog ter-klik
      if (!e.repeat && !this.paused) this.actionQueued = true;
      return;
    }
    if (MOVE_KEYS.has(e.code)) {
      e.preventDefault();
      this.keys.add(e.code);
    } else if (e.code === 'KeyH' && !e.repeat) {
      this.debugToggle = true; // H = tampilkan hitbox (QA)
    }
  }

  _up(e) {
    if (e.code === 'Space') e.preventDefault();
    this.keys.delete(e.code);
  }

  _blur() {
    this.keys.clear();
  }

  // Arah gerak -1/0/1 per sumbu
  getAxis() {
    const k = this.keys;
    const dx = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    const dy = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0);
    return { dx, dy };
  }

  consumeAction() {
    const a = this.actionQueued;
    this.actionQueued = false;
    return a;
  }

  consumeDebugToggle() {
    const t = this.debugToggle;
    this.debugToggle = false;
    return t;
  }
}
