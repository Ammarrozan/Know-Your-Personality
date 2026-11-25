# Know Your Personality?

Game edukasi 2D berbasis web untuk siswa SMA/SMK. Pemain menjalani satu hari di sekolah, menjawab situasi sosial di berbagai tempat, lalu melihat kecenderungan kepribadian sosialnya: **Introvert**, **Ekstrovert**, atau **Ambivert**.

> Hasil permainan adalah refleksi ringan dari pilihan pemain, **bukan tes psikologi tervalidasi** dan tidak untuk diagnosis.

Proyek media edukasi oleh Yardan Raditya Laksana dan Ammar Rozan Annafi, Pendidikan Teknik Informatika dan Komputer, Universitas Sebelas Maret.

## Fitur

- Home bergaya game: Main, Cara Bermain, Panduan Guru, Pengaturan, Tentang, beserta identitas pengembang
- Peta sekolah dengan kamera yang mengikuti pemain, 4 gedung yang bisa dimasuki (Kantin, Perpustakaan, Ruang Kelas, Lab Komputer), serta area luar seperti lapangan dan taman
- 20 titik interaksi (TI): 3 di setiap gedung, objek di area luar, dan 3 NPC yang berjalan acak
- 9 Action Points (AP): pemain memilih sendiri 9 dari 20 situasi yang ingin dijawab
- Setiap situasi punya 3 jawaban (I, E, A) yang urutannya diacak dan tanpa label tipe
- Layar hasil: tipe dominan, grafik skor, teks kekuatan, serta mitos dan fakta
- Musik latar dan efek suara, dengan pengaturan volume dan tombol bisu
- Tujuan pembelajaran di Cara Bermain dan Panduan Guru (langkah di kelas, persiapan, etika penggunaan)
- Tombol Keluar (atau `Esc`) dengan konfirmasi untuk kembali ke Home
- Bisa dimainkan di HP/tablet dengan tombol arah dan tombol Aksi di layar (paling nyaman dalam posisi mendatar)

## Teknologi

- React 19 + Vite 8
- HTML5 Canvas untuk dunia game (tanpa library game engine)
- Web Audio API untuk efek suara
- Python + Pillow untuk membuat peta, sprite, dan data hitbox (`tools/generate_assets.py`)

## Menjalankan di komputer sendiri

Butuh **Node.js 20.19+ atau 22.12+** dan npm.

```bash
git clone https://github.com/Ammarrozan/Know-Your-Personality.git
cd Know-Your-Personality
git checkout development
npm install
npm run dev
```

Buka `http://localhost:5173`.

| Perintah | Fungsi |
| :-- | :-- |
| `npm run dev` | Server pengembangan dengan hot reload |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build secara lokal |
| `npm run lint` | Pemeriksaan kode dengan ESLint |

Mode debug: buka `http://localhost:5173/?debug=1` untuk melihat kotak tembok (merah), pintu (biru), zona TI (kuning), hitbox pemain (hijau), dan koordinat.

## Kontrol

| Tombol | Fungsi |
| :-- | :-- |
| `W` `A` `S` `D` / tombol panah | Berjalan |
| `Spasi` | Berinteraksi dengan titik bertanda "!" |
| Klik / `1` `2` `3` | Memilih jawaban |
| `Esc` | Keluar ke Home |
| Tombol arah + Aksi di layar | Kontrol di HP/tablet |

## Struktur folder

```
public/assets/        peta, sprite, ilustrasi Home, font, audio
src/
  App.jsx             state utama dan penghubung React dengan Canvas
  audio/              AudioManager (BGM + SFX) dan hook useAudioState
  components/         Home, Cara Bermain, Pengaturan, Tentang, HUD, dialog, layar hasil
  data/               scenarios.js (20 skenario), results.js (teks edukasi)
  game/               engine Canvas: kamera, scene, pemain, NPC, input, tumbukan, mapData
  utils/gameLogic.js  pengacakan opsi dan aturan penentuan hasil
tools/
  generate_assets.py  generator peta, sprite, dan mapData.js
```

## Aturan hasil

Setiap jawaban menambah 1 poin ke tipe I, E, atau A.

- **Introvert** jika skor I lebih tinggi dari E dan A
- **Ekstrovert** jika skor E lebih tinggi dari I dan A
- **Ambivert** jika skor A tertinggi, atau bila skor tertinggi seri

## Mengubah peta

Jangan edit `src/game/mapData.js` secara manual. Ubah `tools/generate_assets.py`, lalu jalankan dari root repo:

```bash
pip install pillow
python tools/generate_assets.py
```

Gambar peta dan hitbox akan dibuat ulang bersamaan sehingga tetap sinkron. ID titik interaksi di `mapData.js` harus sama dengan ID di `src/data/scenarios.js`.

## Tim dan alur kerja

| Peran | Tanggung jawab | Branch |
| :-- | :-- | :-- |
| Dev 1 (Yardan Raditya Laksana) | Peta, tumbukan, engine Canvas, kamera, NPC, input | `feature/map-collisions`, `feature/canvas-engine` |
| Dev 2 (Ammar Rozan Annafi) | UI React, state game, skenario, layar hasil, audio | `feature/react-ui-state` |

Semua fitur digabung ke `development` lewat pull request. `main` berisi versi stabil.

## Kredit

- Font judul **Lilita One** (Juan Montoreano) dan font teks **Nunito** (The Nunito Project Authors), lisensi SIL Open Font License 1.1. Salinan lisensi ada di `public/assets/fonts/`.
- Ilustrasi latar Home dibuat dengan bantuan AI generatif.
- Peta dan sprite dibuat dengan `tools/generate_assets.py`.
- Musik latar: **"Relaxing Interlude"** oleh **3xBlast**, dari [OpenGameArt](https://opengameart.org/content/relaxing-interlude), lisensi [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). File dipakai tanpa diubah.
- Efek suara dibuat dengan kode menggunakan Web Audio API.
