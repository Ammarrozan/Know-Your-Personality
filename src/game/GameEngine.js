// GameEngine.js - loop requestAnimationFrame, update, render. Dev 1.
import Input from './Input.js';
import Player from './Player.js';
import { getZoneAt, ZONES, SOLIDS, MAP_W, MAP_H } from './Collisions.js';

const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/';

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // aset gagal -> pakai tampilan cadangan
    img.src = src;
  });
}

export default class GameEngine {
  constructor(canvas, { onTrigger }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onTrigger = onTrigger;
    this.input = new Input();
    this.player = new Player();
    this.paused = false;
    this.activeZoneIds = [];
    this.running = false;
    this.rafId = 0;
    this.last = 0;
    this.time = 0;
    this.map = null;
    this.sheet = null;
    this.debug = false;
    // kunci agar satu tekanan Spasi hanya memicu satu callback
    this.locked = false;
    this.lockedAt = 0;
    this.sawPause = false;
    this._loop = this._loop.bind(this);
  }

  async start() {
    this.running = true;
    this.input.attach();
    const [map, sheet] = await Promise.all([
      loadImage(`${BASE}assets/map.png`),
      loadImage(`${BASE}assets/player.png`),
    ]);
    if (!this.running) return; // sudah di-stop saat memuat (StrictMode)
    this.map = map;
    this.sheet = sheet;
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this._loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.input.detach();
  }

  setPaused(p) {
    if (p === this.paused) return;
    this.paused = p;
    this.input.setPaused(p);
    if (p) this.sawPause = true;
    else { this.locked = false; this.sawPause = false; } // dialog selesai
  }

  setActiveZones(ids) {
    this.activeZoneIds = Array.isArray(ids) ? ids : [];
  }

  _loop(now) {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame(this._loop);
  }

  update(dt) {
    if (this.input.consumeDebugToggle()) this.debug = !this.debug;
    if (this.paused) { this.player.moving = false; return; }
    this.player.update(dt, this.input.getAxis());
    // jaga-jaga bila induk tidak pernah memanggil pause
    if (this.locked && !this.sawPause && now() - this.lockedAt > 1500) this.locked = false;
    this.zone = getZoneAt(this.player.x, this.player.y - 6, this.activeZoneIds);
    if (this.input.consumeAction() && this.zone && !this.locked) {
      this.locked = true;
      this.lockedAt = now();
      this.onTrigger && this.onTrigger(this.zone.id);
    }
  }

  render() {
    const c = this.ctx;
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, MAP_W, MAP_H);
    if (this.map) c.drawImage(this.map, 0, 0, MAP_W, MAP_H);
    else { c.fillStyle = '#70b05c'; c.fillRect(0, 0, MAP_W, MAP_H); }

    // penanda zona aktif
    for (const z of ZONES) {
      if (!this.activeZoneIds.includes(z.id)) continue;
      const cx = z.x + z.w / 2, inside = this.zone && this.zone.id === z.id;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 4);
      c.fillStyle = `rgba(255,214,64,${inside ? 0.45 : 0.18 + 0.12 * pulse})`;
      c.beginPath(); c.ellipse(cx, z.y + z.h / 2, z.w / 2, z.h / 2, 0, 0, Math.PI * 2); c.fill();
      if (!inside) this._bubble(cx, z.y - 4 + Math.sin(this.time * 3 + cx) * 3);
    }

    this.player.draw(c, this.sheet);

    if (this.zone && !this.paused) this._prompt(this.zone);
    if (this.debug) this._debugDraw();
  }

  _bubble(x, y) {
    const c = this.ctx;
    c.fillStyle = '#ffd740'; c.strokeStyle = '#7a5a00'; c.lineWidth = 2;
    c.beginPath(); c.arc(x, y - 10, 10, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#4a3400'; c.font = 'bold 14px sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', x, y - 9);
  }

  _prompt(z) {
    const c = this.ctx, text = `Tekan SPASI - ${z.label}`;
    c.font = 'bold 13px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const w = c.measureText(text).width + 18;
    const x = Math.min(Math.max(this.player.x, w / 2 + 4), MAP_W - w / 2 - 4);
    const y = Math.max(this.player.y - 62, 20);
    c.fillStyle = 'rgba(20,24,40,0.88)';
    c.beginPath(); c.roundRect(x - w / 2, y - 12, w, 24, 12); c.fill();
    c.fillStyle = '#fff'; c.fillText(text, x, y);
  }

  _debugDraw() {
    const c = this.ctx;
    c.fillStyle = 'rgba(255,0,0,0.3)';
    SOLIDS.forEach((s) => c.fillRect(s.x, s.y, s.w, s.h));
    c.strokeStyle = 'cyan'; c.lineWidth = 2;
    ZONES.forEach((z) => c.strokeRect(z.x, z.y, z.w, z.h));
    const h = this.player.hitbox;
    c.strokeStyle = 'lime'; c.strokeRect(h.x, h.y, h.w, h.h);
  }
}

const now = () => performance.now();
