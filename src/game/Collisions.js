// =====================================================================
// Collisions.js — deteksi tumbukan PER SCENE (Task 1.5)
// Domain DEV 1 (feature/map-collisions)
//
// Semua data tembok/pintu/TI berasal dari mapData.js (hasil generator),
// jadi gambar peta dan hitbox selalu sinkron.
// Posisi karakter = titik kaki (tengah-bawah sprite).
// =====================================================================
import { SCENES } from "./mapData.js";

export const HITBOX_W = 20;
export const HITBOX_H = 12;
export const NPC_TALK_RANGE = 56; // jarak (px) pemain ke NPC agar bisa diajak bicara

/** Hitbox kaki untuk karakter di (x, y). */
export function hitboxAt(x, y) {
  return { x: x - HITBOX_W / 2, y: y - HITBOX_H, w: HITBOX_W, h: HITBOX_H };
}

export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

export function getScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) throw new Error(`Scene tidak dikenal: ${sceneId}`);
  return scene;
}

export function getWalls(sceneId) {
  return getScene(sceneId).walls;
}

/**
 * Apakah hitbox di (x, y) menabrak tembok scene, keluar batas scene,
 * atau menabrak salah satu `extraSolids` (hitbox NPC / pemain)?
 */
export function collidesAt(sceneId, x, y, extraSolids = []) {
  const scene = getScene(sceneId);
  const box = hitboxAt(x, y);
  if (box.x < 0 || box.y < 0 || box.x + box.w > scene.width || box.y + box.h > scene.height) {
    return true;
  }
  for (const wall of scene.walls) if (overlaps(box, wall)) return true;
  for (const solid of extraSolids) if (solid && overlaps(box, solid)) return true;
  return false;
}

/**
 * Gerakkan entitas {x, y} sejauh (dx, dy) dengan resolusi per sumbu,
 * sehingga bisa "meluncur" di sepanjang tembok. Dipecah per langkah kecil
 * agar tidak menembus tembok tipis saat frame melambat.
 * @returns {{movedX:boolean, movedY:boolean}}
 */
export function moveWithCollisions(sceneId, ent, dx, dy, extraSolids = []) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4));
  const sx = dx / steps;
  const sy = dy / steps;
  let movedX = false;
  let movedY = false;
  for (let i = 0; i < steps; i++) {
    if (sx !== 0) {
      if (!collidesAt(sceneId, ent.x + sx, ent.y, extraSolids)) {
        ent.x += sx;
        movedX = true;
      }
    }
    if (sy !== 0) {
      if (!collidesAt(sceneId, ent.x, ent.y + sy, extraSolids)) {
        ent.y += sy;
        movedY = true;
      }
    }
  }
  return { movedX, movedY };
}

/** Pintu yang sedang disentuh hitbox pemain (atau null). */
export function findDoor(sceneId, x, y) {
  const box = hitboxAt(x, y);
  for (const door of getScene(sceneId).doors) if (overlaps(box, door.rect)) return door;
  return null;
}

export function findDoorById(sceneId, doorId) {
  return getScene(sceneId).doors.find((d) => d.id === doorId) || null;
}

/**
 * TI objek (statis) terdekat yang memuat titik tengah hitbox pemain
 * dan masih aktif. Mengembalikan {id, label, kind:'zone', anchor} atau null.
 */
export function findZone(sceneId, x, y, activeSet) {
  const px = x;
  const py = y - HITBOX_H / 2;
  let best = null;
  let bestDist = Infinity;
  for (const z of getScene(sceneId).zones) {
    if (!activeSet.has(z.id)) continue;
    if (!pointInRect(px, py, z.rect)) continue;
    const cx = z.rect.x + z.rect.w / 2;
    const cy = z.rect.y + z.rect.h / 2;
    const dist = Math.hypot(px - cx, py - cy);
    if (dist < bestDist) {
      bestDist = dist;
      best = { id: z.id, label: z.label, kind: "zone", dist };
    }
  }
  return best;
}

/** NPC aktif terdekat dalam jangkauan bicara. */
export function findNpc(npcs, x, y, activeSet) {
  let best = null;
  for (const npc of npcs) {
    if (!activeSet.has(npc.id)) continue;
    const dist = Math.hypot(npc.x - x, npc.y - y);
    if (dist <= NPC_TALK_RANGE && (!best || dist < best.dist)) {
      best = { id: npc.id, label: npc.label, kind: "npc", dist, npc };
    }
  }
  return best;
}
