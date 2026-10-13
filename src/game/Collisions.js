// Collisions.js - tembok & 12 zona interaksi. Data ada di mapData.js (hasil generate). Dev 1.
import { SOLIDS, ZONES, MAP_W, MAP_H } from './mapData.js';

export { SOLIDS, ZONES, MAP_W, MAP_H };

const overlap = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// Apakah kotak r menabrak tembok / keluar peta?
export function collidesWithWalls(r) {
  if (r.x < 0 || r.y < 0 || r.x + r.w > MAP_W || r.y + r.h > MAP_H) return true;
  return SOLIDS.some((s) => overlap(r, s));
}

// Zona aktif yang berisi titik (px, py). Zona di luar activeIds diabaikan.
export function getZoneAt(px, py, activeIds) {
  return (
    ZONES.find(
      (z) =>
        activeIds.includes(z.id) &&
        px >= z.x && px <= z.x + z.w && py >= z.y && py <= z.y + z.h
    ) || null
  );
}
