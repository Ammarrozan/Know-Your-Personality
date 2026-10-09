// Player.js - koordinat, kecepatan, arah, animasi. Dev 1.
import { collidesWithWalls, MAP_W, MAP_H } from './Collisions.js';
import { PLAYER_START } from './mapData.js';

const SPEED = 150;          // piksel per detik
const HB_W = 20, HB_H = 12; // hitbox di kaki (x,y = tengah kaki)
const DRAW = 44;            // ukuran gambar sprite di kanvas
const ROW = { down: 0, left: 1, right: 2, up: 3 };

export default class Player {
  constructor() {
    this.x = PLAYER_START.x;
    this.y = PLAYER_START.y;
    this.dir = 'down';
    this.moving = false;
    this.animTime = 0;
  }

  get hitbox() {
    return { x: this.x - HB_W / 2, y: this.y - HB_H, w: HB_W, h: HB_H };
  }

  update(dt, { dx, dy }) {
    this.moving = dx !== 0 || dy !== 0;
    if (!this.moving) { this.animTime = 0; return; }
    const len = Math.hypot(dx, dy);
    const step = SPEED * Math.min(dt, 0.05);
    const mx = (dx / len) * step, my = (dy / len) * step;
    // sumbu dipisah agar bisa "meluncur" di sepanjang tembok
    if (mx !== 0 && !this._blocked(this.x + mx, this.y)) this.x += mx;
    if (my !== 0 && !this._blocked(this.x, this.y + my)) this.y += my;
    this.x = Math.min(Math.max(this.x, HB_W / 2), MAP_W - HB_W / 2);
    this.y = Math.min(Math.max(this.y, HB_H), MAP_H);
    if (dy > 0) this.dir = 'down'; else if (dy < 0) this.dir = 'up';
    if (dx < 0) this.dir = 'left'; else if (dx > 0) this.dir = 'right';
    this.animTime += dt;
  }

  _blocked(nx, ny) {
    return collidesWithWalls({ x: nx - HB_W / 2, y: ny - HB_H, w: HB_W, h: HB_H });
  }

  draw(ctx, sheet) {
    // bayangan
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 2, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (sheet) {
      const col = this.moving ? [1, 0, 2, 0][Math.floor(this.animTime * 8) % 4] : 0;
      ctx.drawImage(sheet, col * 32, ROW[this.dir] * 32, 32, 32,
        Math.round(this.x - DRAW / 2), Math.round(this.y - DRAW + 4), DRAW, DRAW);
    } else {
      ctx.fillStyle = '#e53935'; // cadangan: kotak merah (Task 1.4)
      ctx.fillRect(this.x - 10, this.y - 28, 20, 28);
    }
  }
}
