# Dev 1 — Hasil v1.2 & Cara Memasang

## Isi paket (per branch)

### `feature/map-collisions` (Task 1.1–1.5)
| File | Keterangan |
| :-- | :-- |
| `tools/generate_assets.py` | Generator tunggal: peta dunia, 4 interior, sprite, `mapData.js`. Validasi otomatis 20 ID TI. |
| `public/assets/map_dunia.png` | Dunia luar 1920×1280: 4 gedung + pintu, lapangan, taman, gerbang, parkiran, mading, pos satpam |
| `public/assets/map_kantin.png` | Interior 1280×768 (kantin_01..03) |
| `public/assets/map_perpustakaan.png` | Interior 1152×768 (perpustakaan_01..03) |
| `public/assets/map_kelas.png` | Interior 1024×704 (kelas_01..03) |
| `public/assets/map_laboratorium.png` | Interior 1152×768 (laboratorium_01..03) |
| `public/assets/player.png` | Sprite pemain 4 arah × 3 frame (32×48) |
| `public/assets/npc.png` | 7 varian NPC: teman, kakak_kelas, guru, penjual, siswa_a, siswa_b, petugas |
| `src/game/mapData.js` | HASIL GENERATE: `SCENES`, `TI_IDS`, `START`, `SPRITE`, `VIEWPORT` |
| `src/game/Collisions.js` | Tumbukan per scene, pintu, deteksi TI objek & NPC |

### `feature/canvas-engine` (Task 2.1–2.6)
| File | Keterangan |
| :-- | :-- |
| `src/game/Camera.js` | Mengikuti pemain (halus), dibatasi ukuran scene; scene kecil diletakkan di tengah |
| `src/game/SceneManager.js` | Dunia ↔ interior lewat pintu, fade 0,44 detik, kunci pintu anti bolak-balik, `onSound("door")`, `onSceneChange(id)` |
| `src/game/Npc.js` | 3 NPC acak (jalan → jeda → ganti arah), menabrak tembok/pemain/NPC lain, berhenti & menoleh saat pemain dekat |
| `src/game/GameEngine.js` | Loop rAF, render hanya potongan peta yang terlihat, y-sorting, penanda "!", petunjuk "Spasi · nama TI", banner lokasi |
| `src/game/Player.js` | Gerak 170 px/detik, animasi jalan |
| `src/game/Input.js` | W/A/S/D + panah, Spasi sekali tekan; saat `paused` semua diabaikan dan Spasi tidak bisa "mengklik" tombol dialog |
| `src/game/GameCanvas.jsx` | Pembungkus React, aman di StrictMode |

## Kontrak untuk Dev 2 (SRS 3.3) — tidak berubah
```jsx
import GameCanvas from "./game/GameCanvas.jsx";
import { TI_IDS } from "./game/mapData.js";   // 20 ID, sama persis dengan scenarios.js

<GameCanvas
  onTrigger={(scenarioId) => ...}        // "kantin_01", "npc_guru_01", ...
  paused={activeScenarioId !== null}
  activeZoneIds={TI_IDS.filter(id => !completedScenarios.includes(id))}
  onSound={(name) => audio.playSfx(name)} // name === "door"
  onSceneChange={(sceneId) => setLocation(sceneId)} // opsional (Task 3.9)
/>
```
- `activeZoneIds` sebaiknya dibungkus `useMemo` (bukan wajib).
- Nama lokasi siap pakai ada di `SCENES[sceneId].name` ("Halaman Sekolah", "Kantin", "Perpustakaan", "Ruang Kelas", "Lab Komputer").
- Canvas berukuran 960×640, class CSS `game-canvas`.

## Tombol debug
Buka `http://localhost:5173/?debug=1` untuk melihat kotak tembok (merah), pintu (biru), zona TI (kuning), hitbox pemain (hijau), dan koordinat.

## Mengubah peta
Ubah `tools/generate_assets.py` lalu jalankan (dari root repo):
```
pip install pillow
python tools/generate_assets.py
```
Jangan edit `mapData.js` manual, supaya gambar dan hitbox tetap sinkron.

## Hasil QA Dev 1 (otomatis)
- 20/20 TI dan 8/8 pintu dapat dijangkau (BFS dari titik spawn), ID identik dengan daftar PRD.
- 50/50 cek di browser lulus: gerak, tembok, kamera, 60 FPS dengan NPC, Spasi memicu TI, paused menghentikan pemain/NPC, Spasi saat dialog tidak memicu apa pun, TI terjawab tidak bisa dipicu, NPC berbasis jarak, masuk/keluar 4 gedung tanpa bolak-balik, `onSceneChange` tidak ganda di StrictMode, simulasi 60 detik NPC tidak menembus tembok.
