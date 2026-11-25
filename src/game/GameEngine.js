// =====================================================================
// GameEngine.js — loop requestAnimationFrame, update, render
// Domain DEV 1 (feature/canvas-engine) — Task 2.3, 2.5
//
// Kontrak dengan React (SRS 3.3) — engine hanya berbicara lewat:
//   callbacks.onTrigger(scenarioId)   saat Spasi di dekat TI aktif
//   callbacks.onSound("door")         saat lewat pintu
//   callbacks.onSceneChange(sceneId)  saat scene berganti
//   engine.setPaused(bool)            dari prop `paused`
//   engine.setActiveZoneIds(array)    dari prop `activeZoneIds`
// =====================================================================
import { SCENES, SPRITE, START, VIEWPORT } from "./mapData.js";
import Camera from "./Camera.js";
import Input from "./Input.js";
import Npc from "./Npc.js";
import Player, { drawCharacter } from "./Player.js";
import SceneManager from "./SceneManager.js";
import { findNpc, findZone } from "./Collisions.js";

const imageCache = new Map();

function loadImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Gagal memuat ${src}`));
        img.src = src;
      })
    );
  }
  return imageCache.get(src);
}

function defaultAssetBase() {
  try {
    return `${import.meta.env.BASE_URL || "/"}assets/`;
  } catch {
    return "/assets/";
  }
}

const TRIGGER_LOCK_TIMEOUT = 0.5; // detik; jaga-jaga bila React tidak mengirim paused

export default class GameEngine {
  constructor(canvas, callbacks = {}, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.callbacks = callbacks;
    this.assetBase = options.assetBase || defaultAssetBase();
    this.debug = Boolean(options.debug);

    this.viewW = VIEWPORT.width;
    this.viewH = VIEWPORT.height;
    canvas.width = this.viewW;
    canvas.height = this.viewH;

    this.input = new Input(window);
    this.camera = new Camera(this.viewW, this.viewH);
    this.player = new Player(START.x, START.y, START.dir);
    this.scenes = new SceneManager({
      onSound: (name) => this.callbacks.onSound?.(name),
      onSceneChange: (id) => this.callbacks.onSceneChange?.(id),
    });
    this.npcs = (SCENES[START.scene].npcs || []).map((def) => new Npc(def));
    // NPC dunia luar disimpan terpisah agar tetap ada saat pemain di interior
    this.npcsByScene = { [START.scene]: this.npcs };

    this.paused = false;
    this.activeSet = new Set();
    this.target = null; // TI yang bisa dipicu saat ini
    this.triggerLock = 0; // >0: menunggu React mengirim paused=true
    this.images = null;
    this.time = 0;
    this.running = false;
    this.rafId = 0;
    this.lastTs = 0;
    this.destroyed = false;
    this.loop = this.loop.bind(this);
  }

  // ------------------------------------------------------------- API
  setPaused(paused) {
    const wasPaused = this.paused;
    this.paused = Boolean(paused);
    this.input.setPaused(this.paused);
    if (this.paused) {
      this.triggerLock = 0;
      this.player.stop();
    } else if (wasPaused) {
      this.triggerLock = 0;
    }
  }

  setActiveZoneIds(ids) {
    this.activeSet = new Set(ids || []);
  }

  async start() {
    this.running = true;
    this.rafId = requestAnimationFrame(this.loop);
    try {
      const sceneImgs = await Promise.all(
        Object.values(SCENES).map((s) => loadImage(this.assetBase + s.image).then((img) => [s.id, img]))
      );
      const [player, npc] = await Promise.all([
        loadImage(this.assetBase + "player.png"),
        loadImage(this.assetBase + "npc.png"),
      ]);
      if (this.destroyed) return;
      this.images = { scenes: Object.fromEntries(sceneImgs), player, npc };
      const scene = this.scenes.scene;
      this.camera.snapTo(this.player.x, this.player.y - 24, scene.width, scene.height);
      this.scenes.announceCurrent();
    } catch (err) {
      console.error("[GameEngine]", err);
      this.loadError = err.message;
    }
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
  }

  // ------------------------------------------------------------ LOOP
  loop(ts) {
    if (!this.running) return;
    const dt = this.lastTs ? Math.min((ts - this.lastTs) / 1000, 1 / 20) : 0;
    this.lastTs = ts;
    this.time += dt;
    if (this.images) {
      this.update(dt);
      this.render();
    } else {
      this.renderLoading();
    }
    this.rafId = requestAnimationFrame(this.loop);
  }

  get currentNpcs() {
    return this.npcsByScene[this.scenes.currentId] || [];
  }

  update(dt) {
    if (this.paused) {
      this.input.consumeAction(); // buang Spasi apa pun saat dialog terbuka
      this.target = null;
      return;
    }

    const sceneId = this.scenes.currentId;
    const npcs = this.currentNpcs;

    const transitioning = this.scenes.update(dt, this.player, this.camera);
    if (transitioning) {
      this.input.consumeAction();
      this.target = null;
      return;
    }

    // Pemain (NPC = benda padat)
    this.player.update(dt, this.input, sceneId, npcs.map((n) => n.hitbox));

    // NPC (pemain & NPC lain = benda padat)
    const playerBox = { x: this.player.x - 10, y: this.player.y - 12, w: 20, h: 12 };
    for (const npc of npcs) {
      const others = npcs.filter((o) => o !== npc).map((o) => o.hitbox);
      others.push(playerBox);
      npc.update(dt, sceneId, this.player, others);
    }

    // Kamera
    const scene = this.scenes.scene;
    this.camera.follow(this.player.x, this.player.y - 24, scene.width, scene.height, dt);

    // Interaksi (Task 2.5): NPC (jarak) diutamakan, lalu TI objek
    this.target =
      findNpc(npcs, this.player.x, this.player.y, this.activeSet) ||
      findZone(sceneId, this.player.x, this.player.y, this.activeSet);

    if (this.triggerLock > 0) this.triggerLock = Math.max(0, this.triggerLock - dt);
    const pressed = this.input.consumeAction();
    if (pressed && this.target && this.triggerLock === 0) {
      this.triggerLock = TRIGGER_LOCK_TIMEOUT;
      this.player.stop();
      this.callbacks.onTrigger?.(this.target.id);
    }
  }

  // ---------------------------------------------------------- RENDER
  renderLoading() {
    const { ctx } = this;
    ctx.fillStyle = "#1b2233";
    ctx.fillRect(0, 0, this.viewW, this.viewH);
    ctx.fillStyle = "#e8ecf5";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this.loadError ? `Gagal memuat aset: ${this.loadError}` : "Memuat sekolah...", this.viewW / 2, this.viewH / 2);
  }

  render() {
    const { ctx, camera } = this;
    const scene = this.scenes.scene;
    const camX = camera.ix;
    const camY = camera.iy;
    ctx.imageSmoothingEnabled = false;

    // Latar (untuk interior yang lebih kecil dari viewport)
    ctx.fillStyle = "#1b2233";
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    // Task 2.3: hanya potongan peta yang terlihat yang digambar
    const img = this.images.scenes[scene.id];
    const sx = Math.max(0, camX);
    const sy = Math.max(0, camY);
    const sw = Math.min(this.viewW, scene.width - sx);
    const sh = Math.min(this.viewH, scene.height - sy);
    ctx.drawImage(img, sx, sy, sw, sh, sx - camX, sy - camY, sw, sh);

    // Karakter, diurutkan berdasarkan y (yang lebih bawah digambar belakangan)
    const drawables = [];
    for (const s of scene.staticNpcs || []) {
      if (!camera.isVisible(s.x - 16, s.y - 48, 32, 48)) continue;
      const row = SPRITE.npcRows[s.variant] ?? 0;
      drawables.push({ y: s.y, draw: () => drawCharacter(ctx, this.images.npc, row, s.dir, 0, s.x - camX, s.y - camY) });
    }
    for (const npc of this.currentNpcs) {
      if (!camera.isVisible(npc.x - 16, npc.y - 48, 32, 48)) continue;
      drawables.push({ y: npc.y, draw: () => npc.draw(ctx, this.images.npc, camX, camY) });
    }
    drawables.push({ y: this.player.y, draw: () => this.player.draw(ctx, this.images.player, camX, camY) });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    this.renderMarkers(scene, camX, camY);
    if (this.debug) this.renderDebug(scene, camX, camY);
    this.renderPrompt(camX, camY);
    this.renderBanner(scene);

    const fade = this.scenes.fadeAlpha;
    if (fade > 0) {
      ctx.fillStyle = `rgba(10, 12, 20, ${fade})`;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
  }

  /** Penanda "!" melayang di atas TI yang masih aktif. */
  renderMarkers(scene, camX, camY) {
    const bob = Math.sin(this.time * 4) * 3;
    for (const z of scene.zones) {
      if (!this.activeSet.has(z.id)) continue;
      const mx = z.rect.x + z.rect.w / 2;
      const my = z.rect.y + Math.min(26, z.rect.h / 2);
      if (!this.camera.isVisible(mx - 12, my - 30, 24, 30)) continue;
      this.drawBubble(mx - camX, my - camY + bob, this.target && this.target.id === z.id);
    }
    for (const npc of this.currentNpcs) {
      if (!this.activeSet.has(npc.id)) continue;
      if (!this.camera.isVisible(npc.x - 12, npc.y - 80, 24, 30)) continue;
      this.drawBubble(npc.x - camX, npc.y - 52 - camY + bob, this.target && this.target.id === npc.id);
    }
  }

  drawBubble(x, y, highlighted) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = highlighted ? "#ffd84a" : "#ffffff";
    ctx.strokeStyle = "#2a2340";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 14, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 5);
    ctx.lineTo(x + 4, y - 5);
    ctx.lineTo(x, y + 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2a2340";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", x, y - 13);
    ctx.restore();
  }

  /** Petunjuk "[Spasi] <nama TI>" di atas kepala pemain. */
  renderPrompt(camX, camY) {
    if (!this.target || this.paused) return;
    const { ctx } = this;
    const text = `Spasi  ·  ${this.target.label}`;
    ctx.save();
    ctx.font = "bold 13px sans-serif";
    const w = ctx.measureText(text).width + 20;
    const x = Math.round(Math.min(Math.max(this.player.x - camX - w / 2, 6), this.viewW - w - 6));
    const y = Math.round(Math.max(this.player.y - camY - 84, 6));
    ctx.fillStyle = "rgba(20, 22, 40, 0.85)";
    roundRect(ctx, x, y, w, 24, 6);
    ctx.fill();
    ctx.strokeStyle = "#ffd84a";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 10, y + 12.5);
    ctx.restore();
  }

  /** Nama lokasi singkat saat masuk scene. */
  renderBanner(scene) {
    const t = this.scenes.bannerTime;
    if (t <= 0) return;
    const { ctx } = this;
    const alpha = Math.min(1, t / 0.4);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = "bold 18px sans-serif";
    const w = ctx.measureText(scene.name).width + 36;
    const x = (this.viewW - w) / 2;
    ctx.fillStyle = "rgba(20, 22, 40, 0.8)";
    roundRect(ctx, x, 16, w, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#fff4cf";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(scene.name, this.viewW / 2, 33.5);
    ctx.restore();
  }

  renderDebug(scene, camX, camY) {
    const { ctx } = this;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,0,0,0.8)";
    for (const w of scene.walls) ctx.strokeRect(w.x - camX + 0.5, w.y - camY + 0.5, w.w, w.h);
    ctx.strokeStyle = "rgba(0,120,255,0.9)";
    for (const d of scene.doors) ctx.strokeRect(d.rect.x - camX + 0.5, d.rect.y - camY + 0.5, d.rect.w, d.rect.h);
    ctx.strokeStyle = "rgba(255,220,0,0.9)";
    for (const z of scene.zones) ctx.strokeRect(z.rect.x - camX + 0.5, z.rect.y - camY + 0.5, z.rect.w, z.rect.h);
    ctx.strokeStyle = "rgba(0,255,120,0.9)";
    const p = this.player;
    ctx.strokeRect(p.x - 10 - camX + 0.5, p.y - 12 - camY + 0.5, 20, 12);
    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${scene.id} (${Math.round(p.x)}, ${Math.round(p.y)})`, 8, this.viewH - 10);
    ctx.restore();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
