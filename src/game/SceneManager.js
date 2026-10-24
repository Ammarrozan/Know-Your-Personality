// =====================================================================
// SceneManager.js — perpindahan dunia <-> interior lewat pintu (Task 2.2)
// Domain DEV 1 (feature/canvas-engine)
//
// Aturan anti bolak-balik (REQ-F21):
//  1. Titik kemunculan (spawn) selalu berada di luar area pintu tujuan.
//  2. Setelah pindah, pintu "dikunci" sampai pemain benar-benar keluar
//     dari semua area pintu, sehingga meski spawn digeser pun tidak
//     akan langsung memicu perpindahan balik.
// =====================================================================
import { SCENES, START } from "./mapData.js";
import { findDoor, findDoorById, getScene } from "./Collisions.js";

const FADE_TIME = 0.22; // detik untuk fade-out, dan sama untuk fade-in

export default class SceneManager {
  constructor({ onSound, onSceneChange } = {}) {
    this.onSound = onSound || (() => {});
    this.onSceneChange = onSceneChange || (() => {});
    this.currentId = START.scene;
    this.transition = null; // { phase:'out'|'in', t, door }
    this.doorLocked = true; // tidak ada pintu yang aktif sebelum pemain bergerak keluar dari area pintu
    this.bannerTime = 0;
  }

  get scene() {
    return getScene(this.currentId);
  }

  get sceneIds() {
    return Object.keys(SCENES);
  }

  get isTransitioning() {
    return this.transition !== null;
  }

  /** Alpha layar hitam (0..1) untuk efek transisi. */
  get fadeAlpha() {
    if (!this.transition) return 0;
    const p = Math.min(1, this.transition.t / FADE_TIME);
    return this.transition.phase === "out" ? p : 1 - p;
  }

  /** Dipanggil sekali saat engine siap, agar React tahu scene awal. */
  announceCurrent() {
    this.bannerTime = 1.6;
    this.onSceneChange(this.currentId);
  }

  /**
   * @returns {boolean} true bila sedang transisi (input gerak diabaikan)
   */
  update(dt, player, camera) {
    if (this.bannerTime > 0) this.bannerTime = Math.max(0, this.bannerTime - dt);

    if (this.transition) {
      this.transition.t += dt;
      if (this.transition.phase === "out" && this.transition.t >= FADE_TIME) {
        this.swap(this.transition.door, player, camera);
        this.transition = { phase: "in", t: 0, door: null };
      } else if (this.transition.phase === "in" && this.transition.t >= FADE_TIME) {
        this.transition = null;
      }
      return true;
    }

    const door = findDoor(this.currentId, player.x, player.y);
    if (!door) {
      this.doorLocked = false;
      return false;
    }
    if (this.doorLocked) return false;

    this.transition = { phase: "out", t: 0, door };
    this.doorLocked = true;
    player.stop();
    this.onSound("door");
    return true;
  }

  swap(door, player, camera) {
    const target = getScene(door.target);
    const arrive = findDoorById(target.id, door.targetDoor);
    const spawn = arrive ? arrive.spawn : { x: target.width / 2, y: target.height / 2, dir: "down" };
    this.currentId = target.id;
    player.x = spawn.x;
    player.y = spawn.y;
    player.dir = spawn.dir || player.dir;
    player.stop();
    camera.snapTo(player.x, player.y - 24, target.width, target.height);
    this.doorLocked = true;
    this.bannerTime = 1.6;
    this.onSceneChange(target.id);
  }
}
