// =====================================================================
// mapData.js  —  HASIL GENERATE oleh tools/generate_assets.py
// JANGAN diedit manual. Ubah generator lalu jalankan ulang:
//   python tools/generate_assets.py
// =====================================================================

export const TILE = 32;
export const VIEWPORT = { width: 960, height: 640 };

// Urutan & ejaan ID harus identik dengan src/data/scenarios.js
export const TI_IDS = [
  "kantin_01",
  "kantin_02",
  "kantin_03",
  "perpustakaan_01",
  "perpustakaan_02",
  "perpustakaan_03",
  "kelas_01",
  "kelas_02",
  "kelas_03",
  "laboratorium_01",
  "laboratorium_02",
  "laboratorium_03",
  "lapangan_01",
  "taman_01",
  "gerbang_01",
  "parkiran_01",
  "papan_pengumuman_01",
  "npc_teman_01",
  "npc_kakak_kelas_01",
  "npc_guru_01"
];

export const SPRITE = {
  "frameWidth": 32,
  "frameHeight": 48,
  "framesPerDir": 3,
  "dirs": [
    "down",
    "left",
    "right",
    "up"
  ],
  "npcRows": {
    "teman": 0,
    "kakak_kelas": 1,
    "guru": 2,
    "penjual": 3,
    "siswa_a": 4,
    "siswa_b": 5,
    "petugas": 6
  }
};

export const START = {"scene": "dunia", "x": 960, "y": 1120, "dir": "up"};

export const SCENES = {
  "dunia": {
    "id": "dunia",
    "name": "Halaman Sekolah",
    "width": 1920,
    "height": 1280,
    "image": "map_dunia.png",
    "walls": [
      { "x": 0, "y": 0, "w": 1920, "h": 32 },
      { "x": 0, "y": 0, "w": 32, "h": 1280 },
      { "x": 1888, "y": 0, "w": 32, "h": 1280 },
      { "x": 0, "y": 1248, "w": 880, "h": 32 },
      { "x": 1040, "y": 1248, "w": 880, "h": 32 },
      { "x": 868, "y": 1240, "w": 184, "h": 40 },
      { "x": 80, "y": 64, "w": 384, "h": 256 },
      { "x": 528, "y": 64, "w": 384, "h": 256 },
      { "x": 976, "y": 64, "w": 416, "h": 256 },
      { "x": 1456, "y": 64, "w": 384, "h": 256 },
      { "x": 98, "y": 616, "w": 16, "h": 80 },
      { "x": 782, "y": 616, "w": 16, "h": 80 },
      { "x": 1056, "y": 436, "w": 120, "h": 34 },
      { "x": 1622, "y": 526, "w": 180, "h": 100 },
      { "x": 1412, "y": 726, "w": 96, "h": 34 },
      { "x": 1278, "y": 534, "w": 28, "h": 16 },
      { "x": 1798, "y": 784, "w": 28, "h": 16 },
      { "x": 1558, "y": 804, "w": 28, "h": 16 },
      { "x": 1278, "y": 824, "w": 28, "h": 16 },
      { "x": 124, "y": 936, "w": 20, "h": 52 },
      { "x": 124, "y": 1148, "w": 20, "h": 52 },
      { "x": 176, "y": 936, "w": 20, "h": 52 },
      { "x": 176, "y": 1148, "w": 20, "h": 52 },
      { "x": 228, "y": 936, "w": 20, "h": 52 },
      { "x": 228, "y": 1148, "w": 20, "h": 52 },
      { "x": 280, "y": 1148, "w": 20, "h": 52 },
      { "x": 332, "y": 936, "w": 20, "h": 52 },
      { "x": 332, "y": 1148, "w": 20, "h": 52 },
      { "x": 384, "y": 936, "w": 20, "h": 52 },
      { "x": 384, "y": 1148, "w": 20, "h": 52 },
      { "x": 436, "y": 936, "w": 20, "h": 52 },
      { "x": 488, "y": 936, "w": 20, "h": 52 },
      { "x": 540, "y": 936, "w": 20, "h": 52 },
      { "x": 540, "y": 1148, "w": 20, "h": 52 },
      { "x": 592, "y": 936, "w": 20, "h": 52 },
      { "x": 592, "y": 1148, "w": 20, "h": 52 },
      { "x": 1104, "y": 1086, "w": 112, "h": 114 },
      { "x": 46, "y": 388, "w": 28, "h": 16 },
      { "x": 46, "y": 888, "w": 28, "h": 16 },
      { "x": 826, "y": 448, "w": 28, "h": 16 },
      { "x": 826, "y": 688, "w": 28, "h": 16 },
      { "x": 826, "y": 1168, "w": 28, "h": 16 },
      { "x": 706, "y": 1108, "w": 28, "h": 16 },
      { "x": 1276, "y": 948, "w": 28, "h": 16 },
      { "x": 1416, "y": 1048, "w": 28, "h": 16 },
      { "x": 1566, "y": 928, "w": 28, "h": 16 },
      { "x": 1706, "y": 1088, "w": 28, "h": 16 },
      { "x": 1826, "y": 948, "w": 28, "h": 16 },
      { "x": 1826, "y": 408, "w": 28, "h": 16 },
      { "x": 1356, "y": 1168, "w": 28, "h": 16 },
      { "x": 1806, "y": 1188, "w": 28, "h": 16 },
      { "x": 46, "y": 1208, "w": 28, "h": 16 },
      { "x": 1260, "y": 940, "w": 200, "h": 22 },
      { "x": 1500, "y": 940, "w": 200, "h": 22 }
    ],
    "doors": [
      {
        "id": "pintu_kantin",
        "rect": { "x": 244, "y": 320, "w": 56, "h": 10 },
        "target": "kantin",
        "targetDoor": "keluar",
        "spawn": { "x": 272, "y": 368, "dir": "down" }
      },
      {
        "id": "pintu_perpustakaan",
        "rect": { "x": 692, "y": 320, "w": 56, "h": 10 },
        "target": "perpustakaan",
        "targetDoor": "keluar",
        "spawn": { "x": 720, "y": 368, "dir": "down" }
      },
      {
        "id": "pintu_kelas",
        "rect": { "x": 1156, "y": 320, "w": 56, "h": 10 },
        "target": "kelas",
        "targetDoor": "keluar",
        "spawn": { "x": 1184, "y": 368, "dir": "down" }
      },
      {
        "id": "pintu_laboratorium",
        "rect": { "x": 1620, "y": 320, "w": 56, "h": 10 },
        "target": "laboratorium",
        "targetDoor": "keluar",
        "spawn": { "x": 1648, "y": 368, "dir": "down" }
      }
    ],
    "zones": [
      {
        "id": "gerbang_01",
        "label": "Gerbang Sekolah",
        "rect": { "x": 872, "y": 1160, "w": 176, "h": 80 }
      },
      {
        "id": "lapangan_01",
        "label": "Tengah Lapangan",
        "rect": { "x": 378, "y": 586, "w": 140, "h": 140 }
      },
      {
        "id": "papan_pengumuman_01",
        "label": "Mading",
        "rect": { "x": 1032, "y": 420, "w": 168, "h": 92 }
      },
      {
        "id": "taman_01",
        "label": "Bangku Taman",
        "rect": { "x": 1384, "y": 702, "w": 152, "h": 96 }
      },
      {
        "id": "parkiran_01",
        "label": "Area Parkir",
        "rect": { "x": 326, "y": 1024, "w": 150, "h": 92 }
      }
    ],
    "npcs": [
      {
        "id": "npc_teman_01",
        "label": "Teman Sekelas",
        "variant": "teman",
        "spawn": { "x": 760, "y": 940 },
        "bounds": { "x": 32, "y": 32, "w": 1856, "h": 1216 }
      },
      {
        "id": "npc_kakak_kelas_01",
        "label": "Kakak Kelas",
        "variant": "kakak_kelas",
        "spawn": { "x": 1120, "y": 690 },
        "bounds": { "x": 32, "y": 32, "w": 1856, "h": 1216 }
      },
      {
        "id": "npc_guru_01",
        "label": "Guru",
        "variant": "guru",
        "spawn": { "x": 1300, "y": 380 },
        "bounds": { "x": 32, "y": 32, "w": 1856, "h": 1216 }
      }
    ],
    "staticNpcs": []
  },
  "kantin": {
    "id": "kantin",
    "name": "Kantin",
    "width": 1280,
    "height": 768,
    "image": "map_kantin.png",
    "walls": [
      { "x": 0, "y": 0, "w": 1280, "h": 96 },
      { "x": 0, "y": 0, "w": 32, "h": 768 },
      { "x": 1248, "y": 0, "w": 32, "h": 768 },
      { "x": 0, "y": 736, "w": 1280, "h": 32 },
      { "x": 112, "y": 150, "w": 320, "h": 52 },
      { "x": 560, "y": 150, "w": 300, "h": 52 },
      { "x": 670, "y": 214, "w": 8, "h": 232 },
      { "x": 742, "y": 214, "w": 8, "h": 232 },
      { "x": 700, "y": 234, "w": 20, "h": 12 },
      { "x": 700, "y": 276, "w": 20, "h": 12 },
      { "x": 700, "y": 318, "w": 20, "h": 12 },
      { "x": 700, "y": 360, "w": 20, "h": 12 },
      { "x": 700, "y": 402, "w": 20, "h": 12 },
      { "x": 760, "y": 498, "w": 440, "h": 98 },
      { "x": 120, "y": 480, "w": 160, "h": 48 },
      { "x": 120, "y": 600, "w": 160, "h": 48 },
      { "x": 380, "y": 600, "w": 160, "h": 48 },
      { "x": 46, "y": 130, "w": 28, "h": 30 },
      { "x": 1196, "y": 130, "w": 28, "h": 30 }
    ],
    "doors": [
      {
        "id": "keluar",
        "rect": { "x": 610, "y": 724, "w": 60, "h": 12 },
        "target": "dunia",
        "targetDoor": "pintu_kantin",
        "spawn": { "x": 640, "y": 676, "dir": "up" }
      }
    ],
    "zones": [
      {
        "id": "kantin_03",
        "label": "Penjual Kantin",
        "rect": { "x": 172, "y": 190, "w": 200, "h": 76 }
      },
      {
        "id": "kantin_01",
        "label": "Antrean Pesan Makanan",
        "rect": { "x": 640, "y": 450, "w": 140, "h": 84 }
      },
      {
        "id": "kantin_02",
        "label": "Meja Makan Panjang",
        "rect": { "x": 736, "y": 454, "w": 488, "h": 210 }
      }
    ],
    "npcs": [],
    "staticNpcs": [
      {
        "variant": "penjual",
        "x": 272,
        "y": 148,
        "dir": "down"
      },
      {
        "variant": "penjual",
        "x": 710,
        "y": 148,
        "dir": "down"
      },
      {
        "variant": "siswa_a",
        "x": 710,
        "y": 246,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 710,
        "y": 288,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 710,
        "y": 330,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 710,
        "y": 372,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 710,
        "y": 414,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 800,
        "y": 510,
        "dir": "down"
      },
      {
        "variant": "siswa_a",
        "x": 870,
        "y": 510,
        "dir": "down"
      },
      {
        "variant": "siswa_b",
        "x": 940,
        "y": 510,
        "dir": "down"
      },
      {
        "variant": "siswa_a",
        "x": 1080,
        "y": 510,
        "dir": "down"
      },
      {
        "variant": "siswa_b",
        "x": 1150,
        "y": 510,
        "dir": "down"
      },
      {
        "variant": "siswa_b",
        "x": 800,
        "y": 624,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 940,
        "y": 624,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 1010,
        "y": 624,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 1150,
        "y": 624,
        "dir": "up"
      }
    ]
  },
  "perpustakaan": {
    "id": "perpustakaan",
    "name": "Perpustakaan",
    "width": 1152,
    "height": 768,
    "image": "map_perpustakaan.png",
    "walls": [
      { "x": 0, "y": 0, "w": 1152, "h": 96 },
      { "x": 0, "y": 0, "w": 32, "h": 768 },
      { "x": 1120, "y": 0, "w": 32, "h": 768 },
      { "x": 0, "y": 736, "w": 1152, "h": 32 },
      { "x": 80, "y": 150, "w": 360, "h": 44 },
      { "x": 80, "y": 280, "w": 360, "h": 44 },
      { "x": 80, "y": 410, "w": 360, "h": 44 },
      { "x": 80, "y": 540, "w": 360, "h": 44 },
      { "x": 320, "y": 348, "w": 20, "h": 12 },
      { "x": 600, "y": 290, "w": 280, "h": 120 },
      { "x": 650, "y": 274, "w": 20, "h": 12 },
      { "x": 790, "y": 274, "w": 20, "h": 12 },
      { "x": 730, "y": 436, "w": 20, "h": 12 },
      { "x": 780, "y": 600, "w": 240, "h": 52 },
      { "x": 880, "y": 586, "w": 40, "h": 14 },
      { "x": 960, "y": 150, "w": 150, "h": 44 }
    ],
    "doors": [
      {
        "id": "keluar",
        "rect": { "x": 546, "y": 724, "w": 60, "h": 12 },
        "target": "dunia",
        "targetDoor": "pintu_perpustakaan",
        "spawn": { "x": 576, "y": 676, "dir": "up" }
      }
    ],
    "zones": [
      {
        "id": "perpustakaan_01",
        "label": "Rak Buku",
        "rect": { "x": 80, "y": 322, "w": 360, "h": 90 }
      },
      {
        "id": "perpustakaan_02",
        "label": "Meja Baca Bersama",
        "rect": { "x": 570, "y": 240, "w": 340, "h": 230 }
      },
      {
        "id": "perpustakaan_03",
        "label": "Meja Petugas",
        "rect": { "x": 750, "y": 550, "w": 300, "h": 148 }
      }
    ],
    "npcs": [],
    "staticNpcs": [
      {
        "variant": "siswa_b",
        "x": 330,
        "y": 360,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 660,
        "y": 286,
        "dir": "down"
      },
      {
        "variant": "siswa_a",
        "x": 800,
        "y": 286,
        "dir": "down"
      },
      {
        "variant": "siswa_b",
        "x": 740,
        "y": 448,
        "dir": "up"
      },
      {
        "variant": "petugas",
        "x": 900,
        "y": 598,
        "dir": "down"
      }
    ]
  },
  "kelas": {
    "id": "kelas",
    "name": "Ruang Kelas",
    "width": 1024,
    "height": 704,
    "image": "map_kelas.png",
    "walls": [
      { "x": 0, "y": 0, "w": 1024, "h": 96 },
      { "x": 0, "y": 0, "w": 32, "h": 704 },
      { "x": 992, "y": 0, "w": 32, "h": 704 },
      { "x": 0, "y": 672, "w": 1024, "h": 32 },
      { "x": 440, "y": 128, "w": 144, "h": 52 },
      { "x": 80, "y": 260, "w": 72, "h": 36 },
      { "x": 106, "y": 306, "w": 20, "h": 12 },
      { "x": 192, "y": 260, "w": 72, "h": 36 },
      { "x": 218, "y": 306, "w": 20, "h": 12 },
      { "x": 304, "y": 260, "w": 72, "h": 36 },
      { "x": 330, "y": 306, "w": 20, "h": 12 },
      { "x": 80, "y": 360, "w": 72, "h": 36 },
      { "x": 106, "y": 406, "w": 20, "h": 12 },
      { "x": 192, "y": 360, "w": 72, "h": 36 },
      { "x": 304, "y": 360, "w": 72, "h": 36 },
      { "x": 330, "y": 406, "w": 20, "h": 12 },
      { "x": 80, "y": 460, "w": 72, "h": 36 },
      { "x": 106, "y": 506, "w": 20, "h": 12 },
      { "x": 192, "y": 460, "w": 72, "h": 36 },
      { "x": 218, "y": 506, "w": 20, "h": 12 },
      { "x": 304, "y": 460, "w": 72, "h": 36 },
      { "x": 80, "y": 560, "w": 72, "h": 36 },
      { "x": 106, "y": 606, "w": 20, "h": 12 },
      { "x": 192, "y": 560, "w": 72, "h": 36 },
      { "x": 304, "y": 560, "w": 72, "h": 36 },
      { "x": 330, "y": 606, "w": 20, "h": 12 },
      { "x": 660, "y": 330, "w": 220, "h": 130 },
      { "x": 700, "y": 314, "w": 20, "h": 12 },
      { "x": 820, "y": 314, "w": 20, "h": 12 },
      { "x": 896, "y": 388, "w": 20, "h": 12 },
      { "x": 900, "y": 120, "w": 80, "h": 60 }
    ],
    "doors": [
      {
        "id": "keluar",
        "rect": { "x": 482, "y": 660, "w": 60, "h": 12 },
        "target": "dunia",
        "targetDoor": "pintu_kelas",
        "spawn": { "x": 512, "y": 612, "dir": "up" }
      }
    ],
    "zones": [
      {
        "id": "kelas_02",
        "label": "Papan Tulis",
        "rect": { "x": 320, "y": 96, "w": 384, "h": 130 }
      },
      {
        "id": "kelas_01",
        "label": "Bangku Kosong",
        "rect": { "x": 168, "y": 336, "w": 120, "h": 104 }
      },
      {
        "id": "kelas_03",
        "label": "Meja Kelompok",
        "rect": { "x": 620, "y": 280, "w": 290, "h": 240 }
      }
    ],
    "npcs": [],
    "staticNpcs": [
      {
        "variant": "siswa_a",
        "x": 116,
        "y": 318,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 228,
        "y": 318,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 340,
        "y": 318,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 116,
        "y": 418,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 340,
        "y": 418,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 116,
        "y": 518,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 228,
        "y": 518,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 116,
        "y": 618,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 340,
        "y": 618,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 710,
        "y": 326,
        "dir": "down"
      },
      {
        "variant": "siswa_b",
        "x": 830,
        "y": 326,
        "dir": "down"
      },
      {
        "variant": "siswa_a",
        "x": 906,
        "y": 400,
        "dir": "left"
      }
    ]
  },
  "laboratorium": {
    "id": "laboratorium",
    "name": "Lab Komputer",
    "width": 1152,
    "height": 768,
    "image": "map_laboratorium.png",
    "walls": [
      { "x": 0, "y": 0, "w": 1152, "h": 96 },
      { "x": 0, "y": 0, "w": 32, "h": 768 },
      { "x": 1120, "y": 0, "w": 32, "h": 768 },
      { "x": 0, "y": 736, "w": 1152, "h": 32 },
      { "x": 80, "y": 160, "w": 480, "h": 52 },
      { "x": 80, "y": 300, "w": 480, "h": 52 },
      { "x": 80, "y": 440, "w": 480, "h": 52 },
      { "x": 114, "y": 224, "w": 20, "h": 12 },
      { "x": 114, "y": 364, "w": 20, "h": 12 },
      { "x": 114, "y": 504, "w": 20, "h": 12 },
      { "x": 210, "y": 224, "w": 20, "h": 12 },
      { "x": 210, "y": 364, "w": 20, "h": 12 },
      { "x": 306, "y": 224, "w": 20, "h": 12 },
      { "x": 306, "y": 364, "w": 20, "h": 12 },
      { "x": 306, "y": 504, "w": 20, "h": 12 },
      { "x": 402, "y": 224, "w": 20, "h": 12 },
      { "x": 402, "y": 364, "w": 20, "h": 12 },
      { "x": 498, "y": 224, "w": 20, "h": 12 },
      { "x": 720, "y": 220, "w": 260, "h": 90 },
      { "x": 780, "y": 336, "w": 20, "h": 12 },
      { "x": 820, "y": 520, "w": 180, "h": 34 },
      { "x": 1040, "y": 120, "w": 72, "h": 90 }
    ],
    "doors": [
      {
        "id": "keluar",
        "rect": { "x": 546, "y": 724, "w": 60, "h": 12 },
        "target": "dunia",
        "targetDoor": "pintu_laboratorium",
        "spawn": { "x": 576, "y": 676, "dir": "up" }
      }
    ],
    "zones": [
      {
        "id": "laboratorium_01",
        "label": "Komputer Kosong",
        "rect": { "x": 434, "y": 320, "w": 150, "h": 120 }
      },
      {
        "id": "laboratorium_02",
        "label": "Meja Praktik",
        "rect": { "x": 690, "y": 190, "w": 320, "h": 190 }
      },
      {
        "id": "laboratorium_03",
        "label": "Papan Jadwal Tugas",
        "rect": { "x": 790, "y": 510, "w": 240, "h": 110 }
      }
    ],
    "npcs": [],
    "staticNpcs": [
      {
        "variant": "siswa_a",
        "x": 124,
        "y": 236,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 124,
        "y": 376,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 124,
        "y": 516,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 220,
        "y": 236,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 220,
        "y": 376,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 316,
        "y": 236,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 316,
        "y": 376,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 316,
        "y": 516,
        "dir": "up"
      },
      {
        "variant": "siswa_a",
        "x": 412,
        "y": 236,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 412,
        "y": 376,
        "dir": "up"
      },
      {
        "variant": "siswa_b",
        "x": 508,
        "y": 236,
        "dir": "up"
      },
      {
        "variant": "teman",
        "x": 790,
        "y": 348,
        "dir": "up"
      }
    ]
  }
};

export const SCENE_IDS = Object.keys(SCENES);
