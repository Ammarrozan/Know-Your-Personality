// =====================================================================
// Npc.js — 3 NPC berjalan acak di dunia luar (Task 2.4)
// Domain DEV 1 (feature/canvas-engine)
//
// Perilaku: jalan -> jeda -> ganti arah. Tidak menembus tembok, pemain,
// atau NPC lain. Berhenti total saat game paused (engine tidak memanggil
// update). Saat pemain mendekat, NPC berhenti dan menghadap pemain agar
// mudah diajak bicara (interaksi berbasis jarak, Task 2.5).
// =====================================================================
import { SPRITE } from "./mapData.js";
import { collidesAt, hitboxAt, moveWithCollisions, NPC_TALK_RANGE } from "./Collisions.js";
import { drawCharacter } from "./Player.js";

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const DIR_NAMES = Object.keys(DIRS);

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default class Npc {
  constructor(def) {
    this.id = def.id;
    this.label = def.label;
    this.variant = def.variant;
    this.row = SPRITE.npcRows[def.variant] ?? 0;
    this.x = def.spawn.x;
    this.y = def.spawn.y;
    this.bounds = def.bounds;
    this.dir = "down";
    this.speed = 55;
    this.state = "idle";
    this.timer = rand(0.4, 1.6);
    this.animTime = 0;
    this.stuckTime = 0;
  }

  get hitbox() {
    return hitboxAt(this.x, this.y);
  }

  get moving() {
    return this.state === "walk";
  }

  get frame() {
    if (!this.moving) return 0;
    return Math.floor(this.animTime * 6) % 2 === 0 ? 1 : 2;
  }

  insideBounds(x, y) {
    const b = this.bounds;
    return !b || (x >= b.x + 10 && x <= b.x + b.w - 10 && y >= b.y + 12 && y <= b.y + b.h);
  }

  /** Pilih arah yang langkah pertamanya tidak langsung menabrak. */
  pickDirection(sceneId, solids) {
    const options = DIR_NAMES.filter((name) => {
      const d = DIRS[name];
      const nx = this.x + d.x * 20;
      const ny = this.y + d.y * 20;
      return this.insideBounds(nx, ny) && !collidesAt(sceneId, nx, ny, solids);
    });
    if (options.length === 0) return null;
    // sedikit kecenderungan meneruskan arah agar gerakan terlihat natural
    if (options.includes(this.dir) && Math.random() < 0.35) return this.dir;
    return options[Math.floor(Math.random() * options.length)];
  }

  faceTowards(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    if (Math.abs(dx) > Math.abs(dy)) this.dir = dx < 0 ? "left" : "right";
    else this.dir = dy < 0 ? "up" : "down";
  }

  /**
   * @param {string} sceneId
   * @param {{x,y}} player
   * @param {Array} solids  hitbox lain (pemain & NPC lain)
   */
  update(dt, sceneId, player, solids) {
    // Pemain dekat: berhenti dan menoleh ke pemain
    if (Math.hypot(player.x - this.x, player.y - this.y) < NPC_TALK_RANGE + 8) {
      this.state = "idle";
      this.timer = Math.max(this.timer, 0.8);
      this.animTime = 0;
      this.faceTowards(player.x, player.y);
      return;
    }

    this.timer -= dt;
    if (this.state === "idle") {
      if (this.timer <= 0) {
        const dir = this.pickDirection(sceneId, solids);
        if (dir) {
          this.dir = dir;
          this.state = "walk";
          this.timer = rand(0.8, 2.4);
          this.stuckTime = 0;
        } else {
          this.timer = rand(0.5, 1.2);
        }
      }
      return;
    }

    // state walk
    const d = DIRS[this.dir];
    const before = { x: this.x, y: this.y };
    moveWithCollisions(sceneId, this, d.x * this.speed * dt, d.y * this.speed * dt, solids);
    if (!this.insideBounds(this.x, this.y)) {
      this.x = before.x;
      this.y = before.y;
    }
    const moved = Math.abs(this.x - before.x) + Math.abs(this.y - before.y) > 0.01;
    this.animTime += dt;
    this.stuckTime = moved ? 0 : this.stuckTime + dt;

    if (this.timer <= 0 || this.stuckTime > 0.15) {
      this.state = "idle";
      this.timer = rand(1.0, 2.5);
      this.animTime = 0;
    }
  }

  draw(ctx, sheet, camX, camY) {
    drawCharacter(ctx, sheet, this.row, this.dir, this.frame, this.x - camX, this.y - camY);
  }
}
