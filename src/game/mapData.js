// FILE HASIL GENERATE oleh tools/generate_assets.py - jangan edit manual.
// Ubah LAYOUT di skrip Python lalu jalankan ulang agar gambar dan hitbox sinkron.
export const MAP_W = 960;
export const MAP_H = 640;

// Tembok/objek padat: { x, y, w, h }
export const SOLIDS = [
  { x: 40, y: 40, w: 200, h: 110 },
  { x: 290, y: 40, w: 200, h: 110 },
  { x: 540, y: 40, w: 170, h: 110 },
  { x: 750, y: 40, w: 170, h: 110 },
  { x: 40, y: 210, w: 140, h: 90 },
  { x: 780, y: 200, w: 140, h: 90 },
  { x: 310, y: 340, w: 36, h: 36 },
  { x: 540, y: 340, w: 36, h: 36 },
  { x: 310, y: 480, w: 36, h: 36 },
  { x: 540, y: 480, w: 36, h: 36 },
  { x: 56, y: 404, w: 56, h: 30 },
  { x: 128, y: 404, w: 56, h: 30 },
  { x: 300, y: 215, w: 70, h: 25 },
  { x: 430, y: 220, w: 12, h: 12 },
  { x: 718, y: 220, w: 12, h: 12 },
  { x: 430, y: 248, w: 12, h: 12 },
  { x: 718, y: 248, w: 12, h: 12 },
  { x: 0, y: 0, w: 960, h: 24 },
  { x: 0, y: 0, w: 24, h: 640 },
  { x: 936, y: 0, w: 24, h: 640 },
  { x: 0, y: 604, w: 418, h: 36 },
  { x: 542, y: 604, w: 418, h: 36 },
  { x: 418, y: 584, w: 16, h: 56 },
  { x: 526, y: 584, w: 16, h: 56 },
  { x: 434, y: 628, w: 92, h: 12 },
];

// 12 zona interaksi. id HARUS sama dengan id di src/data/scenarios.js
export const ZONES = [
  { id: "kantin_01", label: "Kantin", x: 105, y: 152, w: 70, h: 40 },
  { id: "perpustakaan_01", label: "Perpustakaan", x: 355, y: 152, w: 70, h: 40 },
  { id: "kelas_01", label: "Ruang Kelas", x: 590, y: 152, w: 70, h: 40 },
  { id: "laboratorium_01", label: "Lab Komputer", x: 800, y: 152, w: 70, h: 40 },
  { id: "papan_pengumuman_01", label: "Papan Pengumuman", x: 290, y: 242, w: 90, h: 36 },
  { id: "taman_01", label: "Taman Kampus", x: 410, y: 410, w: 80, h: 50 },
  { id: "sekretariat_ukm_01", label: "Sekretariat UKM", x: 75, y: 302, w: 70, h: 40 },
  { id: "lapangan_01", label: "Lapangan", x: 740, y: 420, w: 80, h: 50 },
  { id: "koridor_01", label: "Koridor", x: 555, y: 224, w: 70, h: 34 },
  { id: "gerbang_01", label: "Gerbang", x: 445, y: 566, w: 70, h: 34 },
  { id: "parkiran_01", label: "Parkiran", x: 100, y: 470, w: 70, h: 40 },
  { id: "ruang_dosen_01", label: "Ruang Dosen", x: 815, y: 292, w: 70, h: 40 },
];

export const PLAYER_START = { x: 480, y: 556 };
