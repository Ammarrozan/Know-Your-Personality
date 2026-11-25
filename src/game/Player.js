// =====================================================================
// Player.js — koordinat, kecepatan, animasi pemain
// Domain DEV 1 (feature/canvas-engine)
// Posisi (x, y) = titik kaki.
// =====================================================================
import { SPRITE } from "./mapData.js";
import { moveWithCollisions } from "./Collisions.js";

export default class Player {
  constructor(x, y, dir = "down") {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.speed = 170; // px per detik
    this.moving = false;
    this.animTime = 0;
  }

  stop() {
    this.moving = false;
    this.animTime = 0;
  }

  update(dt, input, sceneId, extraSolids) {
    const { dx, dy, dir } = input.getMovement();
    if (dir) this.dir = dir;
    if (dx === 0 && dy === 0) {
      this.stop();
      return;
    }
    const res = moveWithCollisions(sceneId, this, dx * this.speed * dt, dy * this.speed * dt, extraSolids);
    this.moving = res.movedX || res.movedY;
    this.animTime = this.moving ? this.animTime + dt : 0;
  }

  /** Frame animasi: 0 = berdiri, 1/2 = langkah. */
  get frame() {
    if (!this.moving) return 0;
    return Math.floor(this.animTime * 8) % 2 === 0 ? 1 : 2;
  }

  draw(ctx, sheet, camX, camY) {
    drawCharacter(ctx, sheet, 0, this.dir, this.frame, this.x - camX, this.y - camY);
  }
}

/** Menggambar satu frame karakter dari sprite sheet. (sx, sy) = titik kaki di layar. */
export function drawCharacter(ctx, sheet, row, dir, frame, sx, sy) {
  const { frameWidth: fw, frameHeight: fh, framesPerDir, dirs } = SPRITE;
  const di = Math.max(0, dirs.indexOf(dir));
  const col = di * framesPerDir + frame;
  ctx.drawImage(sheet, col * fw, row * fh, fw, fh, Math.round(sx - fw / 2), Math.round(sy - fh + 2), fw, fh);
}
