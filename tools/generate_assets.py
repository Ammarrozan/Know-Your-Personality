"""
generate_assets.py  —  Know Your Personality? (v1.2, tema sekolah SMA/SMK)
Domain DEV 1 (branch feature/map-collisions)

Menghasilkan dari SATU sumber data (agar gambar dan hitbox selalu sinkron):
  public/assets/map_dunia.png          dunia luar sekolah 1920x1280
  public/assets/map_kantin.png         interior Kantin
  public/assets/map_perpustakaan.png   interior Perpustakaan
  public/assets/map_kelas.png          interior Ruang Kelas
  public/assets/map_laboratorium.png   interior Lab Komputer
  public/assets/player.png             sprite pemain (1 baris)
  public/assets/npc.png                sprite NPC (1 baris per varian)
  src/game/mapData.js                  SCENES, tembok, pintu, 20 TI, NPC

Cara pakai (dari root repo):
  pip install pillow
  python tools/generate_assets.py

Konvensi koordinat:
  - Semua rect = {x, y, w, h} dalam piksel scene.
  - Posisi karakter (pemain/NPC) = titik KAKI (tengah-bawah sprite).
  - Hitbox karakter = 20x12 piksel di atas titik kaki (lihat Collisions.js).
"""

import json
import re
import os
import random

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(ROOT, "public", "assets")
MAPDATA_PATH = os.path.join(ROOT, "src", "game", "mapData.js")

TILE = 32
VIEWPORT = (960, 640)
FRAME_W, FRAME_H = 32, 48
DIRS = ["down", "left", "right", "up"]
FRAMES_PER_DIR = 3

# Urutan 20 TI — HARUS identik dengan scenarios.js (PRD Bagian 4)
TI_IDS = [
    "kantin_01", "kantin_02", "kantin_03",
    "perpustakaan_01", "perpustakaan_02", "perpustakaan_03",
    "kelas_01", "kelas_02", "kelas_03",
    "laboratorium_01", "laboratorium_02", "laboratorium_03",
    "lapangan_01", "taman_01", "gerbang_01", "parkiran_01", "papan_pengumuman_01",
    "npc_teman_01", "npc_kakak_kelas_01", "npc_guru_01",
]

# --------------------------------------------------------------------------
# Font
# --------------------------------------------------------------------------
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]


def font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow lama
        return ImageFont.load_default()


def text_center(d, cx, cy, text, size, fill, stroke=None):
    f = font(size)
    kw = {}
    if stroke:
        kw = {"stroke_width": 2, "stroke_fill": stroke}
    box = d.textbbox((0, 0), text, font=f, stroke_width=kw.get("stroke_width", 0))
    tw, th = box[2] - box[0], box[3] - box[1]
    d.text((cx - tw / 2 - box[0], cy - th / 2 - box[1]), text, font=f, fill=fill, **kw)


# --------------------------------------------------------------------------
# Pembangun scene: menggambar sekaligus mencatat tembok/pintu/TI
# --------------------------------------------------------------------------
def R(x, y, w, h):
    return {"x": int(x), "y": int(y), "w": int(w), "h": int(h)}


class Scene:
    def __init__(self, sid, name, w, h, bg):
        self.id = sid
        self.name = name
        self.w = w
        self.h = h
        self.img = Image.new("RGBA", (w, h), bg)
        self.d = ImageDraw.Draw(self.img)
        self.walls = []
        self.doors = []
        self.zones = []
        self.npcs = []
        self.static_npcs = []

    def wall(self, x, y, w, h):
        self.walls.append(R(x, y, w, h))

    def zone(self, zid, label, x, y, w, h):
        assert zid in TI_IDS, zid
        self.zones.append({"id": zid, "label": label, "rect": R(x, y, w, h)})

    def static_npc(self, variant, x, y, d="down", solid=True):
        self.static_npcs.append({"variant": variant, "x": int(x), "y": int(y), "dir": d})
        if solid:
            self.wall(x - 10, y - 12, 20, 12)

    def export(self):
        return {
            "id": self.id,
            "name": self.name,
            "width": self.w,
            "height": self.h,
            "image": f"map_{self.id}.png",
            "walls": self.walls,
            "doors": self.doors,
            "zones": self.zones,
            "npcs": self.npcs,
            "staticNpcs": self.static_npcs,
        }


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c[:3]) + ((c[3],) if len(c) == 4 else ())


def box3d(d, x, y, w, h, top, side=None, outline=(40, 30, 25)):
    """Benda top-down sederhana: permukaan + sisi depan lebih gelap."""
    side = side or shade(top, 0.7)
    lip = max(4, min(10, h // 4))
    d.rectangle([x, y, x + w - 1, y + h - 1], fill=side, outline=outline)
    d.rectangle([x, y, x + w - 1, y + h - 1 - lip], fill=top, outline=outline)


def speckle(d, rect, base, rng, n, var=14, size=2):
    x, y, w, h = rect
    for _ in range(n):
        px = x + rng.randrange(w)
        py = y + rng.randrange(h)
        k = 1 + rng.uniform(-var, var) / 100
        d.rectangle([px, py, px + size - 1, py + size - 1], fill=shade(base, k))


# --------------------------------------------------------------------------
# DUNIA LUAR (1920 x 1280)
# --------------------------------------------------------------------------
GRASS = (112, 168, 86, 255)
GRASS_DARK = (92, 148, 72, 255)
PAVE = (206, 196, 176, 255)
PAVE_LINE = (184, 172, 150, 255)
ASPHALT = (92, 96, 104, 255)
FENCE = (120, 72, 48, 255)

BUILDINGS = [
    # id, label, x, w, roof color, wall color
    ("kantin", "KANTIN", 80, 384, (196, 84, 60), (244, 228, 196)),
    ("perpustakaan", "PERPUSTAKAAN", 528, 384, (70, 110, 160), (236, 232, 214)),
    ("kelas", "RUANG KELAS", 976, 416, (178, 120, 64), (246, 238, 220)),
    ("laboratorium", "LAB KOMPUTER", 1456, 384, (84, 140, 120), (228, 236, 232)),
]
B_Y, B_H = 64, 256


def draw_tree(s, x, y, rng, solid=True):
    """x,y = pangkal batang."""
    d = s.d
    d.ellipse([x - 22, y - 6, x + 22, y + 8], fill=(60, 100, 50, 255))
    d.rectangle([x - 5, y - 22, x + 5, y + 2], fill=(110, 74, 44, 255), outline=(70, 45, 28))
    c = (64, 128, 64, 255)
    d.ellipse([x - 30, y - 70, x + 30, y - 14], fill=c, outline=(40, 86, 40))
    d.ellipse([x - 22, y - 66, x + 12, y - 36], fill=shade(c, 1.15))
    for _ in range(6):
        px, py = x + rng.randint(-20, 20), y + rng.randint(-60, -24)
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=shade(c, 0.85))
    if solid:
        s.wall(x - 14, y - 12, 28, 16)


def draw_bush(s, x, y, w, rng):
    d = s.d
    d.rounded_rectangle([x, y, x + w, y + 26], 10, fill=(70, 136, 66, 255), outline=(44, 92, 44))
    for i in range(0, w, 14):
        d.ellipse([x + i, y - 4, x + i + 16, y + 12], fill=(84, 150, 74, 255))
        if rng.random() < 0.5:
            fx = x + i + 6
            d.ellipse([fx, y + 2, fx + 4, y + 6], fill=(236, 110, 150, 255))
    s.wall(x, y + 4, w, 22)


def draw_bike(s, x, y, color):
    """Motor tampak atas, vertikal 24x56; x,y = pojok kiri atas."""
    d = s.d
    d.rounded_rectangle([x + 8, y, x + 16, y + 10], 3, fill=(30, 30, 30))
    d.rounded_rectangle([x + 8, y + 46, x + 16, y + 56], 3, fill=(30, 30, 30))
    d.rounded_rectangle([x + 4, y + 8, x + 20, y + 48], 6, fill=color, outline=(30, 30, 30))
    d.rectangle([x + 7, y + 22, x + 17, y + 40], fill=(40, 40, 44))
    d.line([x, y + 12, x + 24, y + 12], fill=(60, 60, 60), width=3)
    s.wall(x + 2, y + 2, 20, 52)


def build_dunia():
    s = Scene("dunia", "Halaman Sekolah", 1920, 1280, GRASS)
    d = s.d
    rng = random.Random(7)
    speckle(d, (0, 0, s.w, s.h), GRASS, rng, 9000)
    for _ in range(260):  # rumput kecil
        x, y = rng.randrange(s.w), rng.randrange(s.h)
        d.line([x, y, x + 2, y - 5], fill=GRASS_DARK, width=1)

    # --- Jalan setapak (paving) ---
    def pave(x, y, w, h):
        d.rectangle([x, y, x + w - 1, y + h - 1], fill=PAVE)
        for gx in range(x, x + w, 32):
            d.line([gx, y, gx, y + h - 1], fill=PAVE_LINE)
        for gy in range(y, y + h, 32):
            d.line([x, gy, x + w - 1, gy], fill=PAVE_LINE)

    pave(32, 320, 1856, 96)          # jalan depan gedung
    pave(896, 416, 128, 832)         # jalan tengah ke gerbang
    pave(640, 900, 256, 96)          # jalan ke parkiran
    pave(1024, 640, 176, 96)         # jalan ke taman

    # --- Pagar keliling ---
    def fence(x, y, w, h):
        d.rectangle([x, y, x + w - 1, y + h - 1], fill=FENCE, outline=(80, 46, 30))
        if w > h:
            for px in range(x, x + w, 24):
                d.rectangle([px + 2, y + 4, px + 14, y + h - 5], fill=(150, 98, 64))
        else:
            for py in range(y, y + h, 24):
                d.rectangle([x + 4, py + 2, x + w - 5, py + 14], fill=(150, 98, 64))
        s.wall(x, y, w, h)

    fence(0, 0, 1920, 32)
    fence(0, 0, 32, 1280)
    fence(1888, 0, 32, 1280)
    fence(0, 1248, 880, 32)
    fence(1040, 1248, 880, 32)

    # --- Gerbang (tertutup, berupa tembok) ---
    gx, gy, gw = 880, 1240, 160
    d.rectangle([gx - 12, gy - 16, gx + 4, gy + 40], fill=(150, 150, 156), outline=(60, 60, 64))
    d.rectangle([gx + gw - 4, gy - 16, gx + gw + 12, gy + 40], fill=(150, 150, 156), outline=(60, 60, 64))
    d.rectangle([gx, gy, gx + gw, gy + 40], fill=(70, 74, 82))
    for px in range(gx + 6, gx + gw, 12):
        d.rectangle([px, gy + 2, px + 4, gy + 38], fill=(170, 176, 186))
    s.wall(gx - 12, 1240, gw + 24, 40)
    text_center(d, 960, 1220, "GERBANG", 16, (255, 255, 255), stroke=(50, 50, 50))
    s.zone("gerbang_01", "Gerbang Sekolah", 872, 1160, 176, 80)

    # --- Gedung ---
    for bid, label, bx, bw, roof, wallc in BUILDINGS:
        by = B_Y
        front_h = 84
        # bayangan
        d.rectangle([bx + 6, by + 8, bx + bw + 6, by + B_H + 6], fill=(60, 90, 50, 120))
        # atap
        d.rectangle([bx, by, bx + bw - 1, by + B_H - front_h], fill=roof, outline=(60, 30, 20))
        for ry in range(by + 8, by + B_H - front_h, 14):
            d.line([bx + 2, ry, bx + bw - 3, ry], fill=shade(roof, 0.82), width=2)
        d.rectangle([bx + bw // 2 - 3, by, bx + bw // 2 + 3, by + B_H - front_h], fill=shade(roof, 0.7))
        # dinding depan
        fy = by + B_H - front_h
        d.rectangle([bx, fy, bx + bw - 1, by + B_H - 1], fill=wallc, outline=(80, 60, 50))
        d.rectangle([bx, by + B_H - 10, bx + bw - 1, by + B_H - 1], fill=shade(wallc, 0.72))
        cx = bx + bw // 2
        # jendela
        for wx in list(range(bx + 20, cx - 60, 56)) + list(range(cx + 44, bx + bw - 40, 56)):
            d.rectangle([wx, fy + 18, wx + 34, fy + 52], fill=(150, 200, 230), outline=(70, 70, 80), width=2)
            d.line([wx + 17, fy + 18, wx + 17, fy + 52], fill=(70, 70, 80), width=2)
        # pintu
        d.rectangle([cx - 28, fy + 16, cx + 28, by + B_H - 1], fill=(120, 76, 46), outline=(60, 36, 20), width=2)
        d.line([cx, fy + 16, cx, by + B_H - 1], fill=(60, 36, 20), width=2)
        d.ellipse([cx - 8, fy + 44, cx - 4, fy + 48], fill=(230, 200, 90))
        d.ellipse([cx + 4, fy + 44, cx + 8, fy + 48], fill=(230, 200, 90))
        # papan nama
        sw = max(140, len(label) * 12 + 24)
        d.rounded_rectangle([cx - sw // 2, fy - 30, cx + sw // 2, fy - 4], 5, fill=(40, 52, 80), outline=(240, 220, 140), width=2)
        text_center(d, cx, fy - 17, label, 15, (255, 240, 190))
        # keset depan pintu
        d.rectangle([cx - 30, by + B_H, cx + 30, by + B_H + 14], fill=(150, 60, 50), outline=(100, 40, 30))
        s.wall(bx, by, bw, B_H)
        # Pintu masuk: menyentuh strip ini -> masuk interior.
        # Titik kemunculan saat keluar (spawn) berada 44px di bawah strip.
        s.doors.append({
            "id": f"pintu_{bid}",
            "rect": R(cx - 28, by + B_H, 56, 10),
            "target": bid,
            "targetDoor": "keluar",
            "spawn": {"x": cx, "y": by + B_H + 48, "dir": "down"},
        })

    # --- Lapangan ---
    lx, ly, lw, lh = 96, 456, 704, 400
    d.rectangle([lx, ly, lx + lw, ly + lh], fill=(176, 92, 70), outline=(240, 240, 240), width=4)
    d.rectangle([lx + 12, ly + 12, lx + lw - 12, ly + lh - 12], outline=(240, 240, 240), width=3)
    d.line([lx + lw // 2, ly + 12, lx + lw // 2, ly + lh - 12], fill=(240, 240, 240), width=3)
    ccx, ccy = lx + lw // 2, ly + lh // 2
    d.ellipse([ccx - 60, ccy - 60, ccx + 60, ccy + 60], outline=(240, 240, 240), width=3)
    for gx2 in (lx + 12, lx + lw - 92):
        d.rectangle([gx2, ccy - 90, gx2 + 80, ccy + 90], outline=(240, 240, 240), width=3)
    # gawang
    d.rectangle([lx + 2, ccy - 40, lx + 18, ccy + 40], fill=(235, 235, 235), outline=(90, 90, 90), width=2)
    d.rectangle([lx + lw - 18, ccy - 40, lx + lw - 2, ccy + 40], fill=(235, 235, 235), outline=(90, 90, 90), width=2)
    s.wall(lx + 2, ccy - 40, 16, 80)
    s.wall(lx + lw - 18, ccy - 40, 16, 80)
    # bola
    d.ellipse([ccx + 30, ccy + 10, ccx + 44, ccy + 24], fill=(250, 250, 250), outline=(30, 30, 30))
    text_center(d, ccx, ly + lh + 18, "LAPANGAN", 18, (255, 255, 255), stroke=(60, 80, 40))
    s.zone("lapangan_01", "Tengah Lapangan", ccx - 70, ccy - 70, 140, 140)

    # --- Papan pengumuman (mading) ---
    mx, my, mw = 1056, 440, 120
    d.rectangle([mx + 10, my + 26, mx + 16, my + 50], fill=(90, 60, 40))
    d.rectangle([mx + mw - 16, my + 26, mx + mw - 10, my + 50], fill=(90, 60, 40))
    d.rectangle([mx, my - 30, mx + mw, my + 30], fill=(140, 96, 60), outline=(70, 46, 28), width=3)
    d.rectangle([mx + 6, my - 24, mx + mw - 6, my + 24], fill=(214, 180, 130))
    for i, col in enumerate([(250, 250, 240), (250, 220, 120), (170, 210, 250), (250, 170, 170)]):
        px = mx + 12 + i * 26
        d.rectangle([px, my - 18 + (i % 2) * 6, px + 20, my + 8 + (i % 2) * 6], fill=col, outline=(120, 100, 80))
        d.ellipse([px + 8, my - 20 + (i % 2) * 6, px + 12, my - 16 + (i % 2) * 6], fill=(200, 40, 40))
    text_center(d, mx + mw // 2, my - 42, "MADING", 13, (255, 255, 255), stroke=(60, 60, 60))
    s.wall(mx, my - 4, mw, 34)
    s.zone("papan_pengumuman_01", "Mading", mx - 24, my - 20, mw + 48, 92)

    # --- Taman ---
    tx, ty, tw, th = 1232, 456, 640, 400
    d.rounded_rectangle([tx, ty, tx + tw, ty + th], 24, fill=(98, 160, 80, 255), outline=(70, 120, 60), width=3)
    speckle(d, (tx + 10, ty + 10, tw - 20, th - 20), (98, 160, 80, 255), rng, 1500)
    for _ in range(70):  # bunga
        fx, fy = tx + rng.randint(20, tw - 20), ty + rng.randint(20, th - 20)
        col = rng.choice([(240, 90, 120), (250, 210, 80), (250, 250, 250), (180, 120, 230)])
        d.ellipse([fx - 3, fy - 3, fx + 3, fy + 3], fill=col)
    # kolam
    px0, py0 = tx + 380, ty + 60
    d.ellipse([px0, py0, px0 + 200, py0 + 120], fill=(90, 160, 210), outline=(60, 110, 150), width=4)
    d.ellipse([px0 + 40, py0 + 30, px0 + 70, py0 + 46], fill=(130, 190, 230))
    s.wall(px0 + 10, py0 + 10, 180, 100)
    # jalan setapak taman
    d.rectangle([tx, ty + 184, tx + 320, ty + 248], fill=PAVE)
    # bangku taman
    bx0, by0 = tx + 180, ty + 270
    d.rectangle([bx0, by0, bx0 + 96, by0 + 10], fill=(150, 98, 60), outline=(80, 50, 30))
    d.rectangle([bx0, by0 + 14, bx0 + 96, by0 + 30], fill=(170, 112, 70), outline=(80, 50, 30))
    d.rectangle([bx0 + 4, by0 + 30, bx0 + 10, by0 + 38], fill=(60, 60, 60))
    d.rectangle([bx0 + 86, by0 + 30, bx0 + 92, by0 + 38], fill=(60, 60, 60))
    s.wall(bx0, by0, 96, 34)
    s.zone("taman_01", "Bangku Taman", bx0 - 28, by0 - 24, 152, 96)
    for (x, y) in [(tx + 60, ty + 90), (tx + 620 - 40, ty + 340), (tx + 340, ty + 360), (tx + 60, ty + 380)]:
        draw_tree(s, x, y, rng)
    text_center(d, tx + tw // 2, ty + th + 18, "TAMAN SEKOLAH", 18, (255, 255, 255), stroke=(60, 80, 40))

    # --- Parkiran ---
    ax, ay, aw, ah = 96, 920, 544, 296
    d.rectangle([ax, ay, ax + aw, ay + ah], fill=ASPHALT, outline=(60, 62, 70), width=3)
    speckle(d, (ax, ay, aw, ah), ASPHALT, rng, 1500, var=10)
    for i in range(10):
        x = ax + 20 + i * 52
        d.line([x - 6, ay + 6, x - 6, ay + 76], fill=(230, 230, 230), width=2)
        d.line([x - 6, ay + ah - 76, x - 6, ay + ah - 6], fill=(230, 230, 230), width=2)
    colors = [(200, 50, 50), (40, 90, 180), (30, 30, 30), (230, 230, 230), (230, 160, 40), (60, 150, 90)]
    for i in range(10):
        x = ax + 26 + i * 52
        if i not in (3,):
            draw_bike(s, x, ay + 14, colors[i % len(colors)])
        if i not in (6, 7):
            draw_bike(s, x, ay + ah - 70, colors[(i + 3) % len(colors)])
    d.text((ax + 24, ay + 128), "P", font=font(40), fill=(240, 240, 240))
    text_center(d, ax + aw // 2, ay - 16, "PARKIRAN", 18, (255, 255, 255), stroke=(50, 50, 60))
    s.zone("parkiran_01", "Area Parkir", ax + 230, ay + 104, 150, 92)

    # --- Pos satpam & dekorasi kanan bawah ---
    sx, sy = 1104, 1104
    box3d(d, sx, sy, 112, 96, (220, 214, 200))
    d.rectangle([sx, sy - 18, sx + 112, sy + 6], fill=(60, 80, 130), outline=(30, 40, 70))
    text_center(d, sx + 56, sy - 6, "POS SATPAM", 11, (255, 255, 255))
    d.rectangle([sx + 16, sy + 30, sx + 50, sy + 60], fill=(150, 200, 230), outline=(70, 70, 80), width=2)
    s.wall(sx, sy - 18, 112, 114)

    # Pepohonan tepi (dengan hitbox batang)
    edge_trees = [
        (60, 400), (60, 900), (840, 460), (840, 700), (840, 1180), (720, 1120),
        (1290, 960), (1430, 1060), (1580, 940), (1720, 1100), (1840, 960), (1840, 420),
        (1370, 1180), (1820, 1200), (60, 1220)
    ]
    for (x, y) in edge_trees:
        draw_tree(s, x, y, rng)
    draw_bush(s, 1260, 936, 200, rng)
    draw_bush(s, 1500, 936, 200, rng)

    # --- NPC bergerak (3) ---
    world_bounds = R(32, 32, 1856, 1216)
    s.npcs = [
        {"id": "npc_teman_01", "label": "Teman Sekelas", "variant": "teman",
         "spawn": {"x": 760, "y": 940}, "bounds": world_bounds},
        {"id": "npc_kakak_kelas_01", "label": "Kakak Kelas", "variant": "kakak_kelas",
         "spawn": {"x": 1120, "y": 690}, "bounds": world_bounds},
        {"id": "npc_guru_01", "label": "Guru", "variant": "guru",
         "spawn": {"x": 1300, "y": 380}, "bounds": world_bounds},
    ]
    return s


# --------------------------------------------------------------------------
# INTERIOR
# --------------------------------------------------------------------------
def interior_base(sid, name, w, h, floor, wallface, pattern="tile"):
    s = Scene(sid, name, w, h, floor)
    d = s.d
    rng = random.Random(sum(map(ord, sid)))
    if pattern == "tile":
        for x in range(32, w - 32, 32):
            for y in range(96, h - 32, 32):
                c = floor if ((x // 32 + y // 32) % 2 == 0) else shade(floor, 0.93)
                d.rectangle([x, y, x + 31, y + 31], fill=c, outline=shade(floor, 0.85))
    elif pattern == "wood":
        for y in range(96, h - 32, 16):
            off = (y // 16 % 3) * 40
            d.line([32, y, w - 32, y], fill=shade(floor, 0.82))
            for x in range(32 - off, w - 32, 120):
                d.line([x, y, x, y + 15], fill=shade(floor, 0.82))
    elif pattern == "plain":
        speckle(d, (32, 96, w - 64, h - 128), floor, rng, 2500, var=6)
    # dinding atas (tampak muka)
    d.rectangle([0, 0, w - 1, 95], fill=wallface)
    d.rectangle([0, 84, w - 1, 95], fill=shade(wallface, 0.7))
    d.rectangle([0, 0, w - 1, 10], fill=shade(wallface, 0.5))
    # dinding samping & bawah
    side = (70, 60, 56, 255)
    d.rectangle([0, 0, 31, h - 1], fill=side)
    d.rectangle([w - 32, 0, w - 1, h - 1], fill=side)
    d.rectangle([0, h - 32, w - 1, h - 1], fill=side)
    s.wall(0, 0, w, 96)
    s.wall(0, 0, 32, h)
    s.wall(w - 32, 0, 32, h)
    s.wall(0, h - 32, w, 32)
    # pintu keluar di tengah bawah
    cx = w // 2
    d.rectangle([cx - 36, h - 32, cx + 36, h - 1], fill=(120, 76, 46), outline=(60, 36, 20), width=2)
    d.rectangle([cx - 34, h - 50, cx + 34, h - 33], fill=(160, 60, 50), outline=(100, 40, 30))
    text_center(d, cx, h - 16, "KELUAR", 12, (255, 240, 200))
    s.doors.append({
        "id": "keluar",
        "rect": R(cx - 30, h - 44, 60, 12),
        "target": "dunia",
        "targetDoor": f"pintu_{sid}",
        "spawn": {"x": cx, "y": h - 92, "dir": "up"},
    })
    return s, rng


def window_on_wall(d, x, w=80):
    d.rectangle([x, 18, x + w, 70], fill=(160, 210, 236), outline=(90, 80, 70), width=3)
    d.line([x + w // 2, 18, x + w // 2, 70], fill=(90, 80, 70), width=3)


def build_kantin():
    s, rng = interior_base("kantin", "Kantin", 1280, 768, (236, 226, 206, 255), (214, 150, 110, 255), "tile")
    d = s.d
    for x in (900, 1040):
        window_on_wall(d, x)
    text_center(d, 640, 46, "KANTIN SEKOLAH", 26, (255, 245, 220), stroke=(120, 60, 40))

    # Stand A (penjual, kantin_03)
    ax, ay = 112, 150
    d.rectangle([ax, ay - 46, ax + 320, ay - 30], fill=(230, 90, 70))
    for i in range(0, 320, 32):
        d.rectangle([ax + i, ay - 46, ax + i + 15, ay - 30], fill=(250, 250, 250))
    box3d(d, ax, ay, 320, 52, (190, 140, 90))
    for i in range(4):
        d.ellipse([ax + 20 + i * 70, ay + 6, ax + 56 + i * 70, ay + 30], fill=(250, 250, 250), outline=(120, 120, 120))
        d.ellipse([ax + 28 + i * 70, ay + 10, ax + 48 + i * 70, ay + 24], fill=[(220, 160, 60), (200, 80, 50), (120, 170, 80), (240, 210, 120)][i])
    text_center(d, ax + 160, ay - 38, "NASI & LAUK", 11, (90, 30, 20))
    s.wall(ax, ay, 320, 52)
    s.static_npc("penjual", ax + 160, ay - 2, "down", solid=False)
    s.zone("kantin_03", "Penjual Kantin", ax + 60, ay + 40, 200, 76)

    # Stand B + antrean panjang (kantin_01)
    bx, by = 560, 150
    d.rectangle([bx, by - 46, bx + 300, by - 30], fill=(60, 120, 200))
    for i in range(0, 300, 32):
        d.rectangle([bx + i, by - 46, bx + i + 15, by - 30], fill=(250, 250, 250))
    box3d(d, bx, by, 300, 52, (190, 140, 90))
    for i in range(4):
        d.rectangle([bx + 24 + i * 66, by + 8, bx + 60 + i * 66, by + 28], fill=(240, 120 + i * 30, 80), outline=(120, 80, 40))
    text_center(d, bx + 150, by - 38, "MIE & MINUMAN", 11, (20, 30, 80))
    s.wall(bx, by, 300, 52)
    s.static_npc("penjual", bx + 150, by - 2, "down", solid=False)
    # tiang antrean
    qx = bx + 150
    for qy in range(by + 70, by + 290, 44):
        for side in (-34, 34):
            d.ellipse([qx + side - 5, qy - 5, qx + side + 5, qy + 5], fill=(200, 170, 60), outline=(90, 70, 20))
        d.line([qx - 34, qy, qx - 34, qy + 44], fill=(180, 40, 40), width=3)
        d.line([qx + 34, qy, qx + 34, qy + 44], fill=(180, 40, 40), width=3)
    s.wall(qx - 40, by + 64, 8, 232)
    s.wall(qx + 32, by + 64, 8, 232)
    variants = ["siswa_a", "siswa_b", "teman", "siswa_a", "siswa_b"]
    for i, v in enumerate(variants):
        s.static_npc(v, qx, by + 96 + i * 42, "up")
    s.zone("kantin_01", "Antrean Pesan Makanan", qx - 70, by + 300, 140, 84)

    # Meja makan panjang (kantin_02) dengan kursi kosong
    tx, ty, tw = 760, 520, 440
    box3d(d, tx, ty - 22, tw, 14, (150, 100, 60))  # bangku atas
    box3d(d, tx, ty + 62, tw, 14, (150, 100, 60))  # bangku bawah
    box3d(d, tx, ty, tw, 56, (210, 170, 120))
    for i in range(6):
        px = tx + 30 + i * 70
        d.ellipse([px, ty + 12, px + 26, ty + 32], fill=(250, 250, 250), outline=(140, 140, 140))
    s.wall(tx, ty - 22, tw, 98)
    seats_top = [0, 1, 2, 4, 5]  # kursi ke-3 kosong
    for i in seats_top:
        s.static_npc(["teman", "siswa_a", "siswa_b"][i % 3], tx + 40 + i * 70, ty - 10, "down", solid=False)
    for i in (0, 2, 3, 5):
        s.static_npc(["siswa_b", "teman", "siswa_a"][i % 3], tx + 40 + i * 70, ty + 104, "up", solid=False)
    s.zone("kantin_02", "Meja Makan Panjang", tx - 24, ty - 66, tw + 48, 210)

    # meja kecil dekorasi
    for (x, y) in [(120, 480), (120, 600), (380, 600)]:
        box3d(d, x, y, 160, 48, (210, 170, 120))
        s.wall(x, y, 160, 48)
    # tong sampah & tanaman
    for x in (60, 1210):
        d.ellipse([x - 16, 110, x + 16, 150], fill=(60, 140, 70))
        d.rectangle([x - 10, 140, x + 10, 160], fill=(150, 90, 60))
        s.wall(x - 14, 130, 28, 30)
    return s


def build_perpustakaan():
    s, rng = interior_base("perpustakaan", "Perpustakaan", 1152, 768, (196, 150, 104, 255), (120, 150, 140, 255), "wood")
    d = s.d
    for x in (560, 700, 840):
        window_on_wall(d, x, 72)
    text_center(d, 280, 46, "PERPUSTAKAAN", 24, (255, 250, 230), stroke=(50, 70, 60))
    text_center(d, 280, 74, "Harap tenang", 12, (240, 240, 230))

    book_colors = [(180, 60, 60), (60, 100, 170), (220, 180, 60), (70, 140, 90), (140, 80, 150), (230, 230, 220)]

    def shelf(x, y, w):
        box3d(d, x, y, w, 44, (120, 80, 50), (90, 56, 34))
        bx = x + 4
        while bx < x + w - 8:
            bw = rng.randint(5, 9)
            d.rectangle([bx, y + 4, bx + bw, y + 30], fill=rng.choice(book_colors), outline=(50, 30, 20))
            bx += bw + 1
        s.wall(x, y, w, 44)

    for y in (150, 280, 410, 540):
        shelf(80, y, 360)
    # siswa lain di rak yang sama
    s.static_npc("siswa_b", 330, 360, "up")
    s.zone("perpustakaan_01", "Rak Buku", 80, 322, 360, 90)

    # Meja baca bersama (perpustakaan_02)
    mx, my, mw, mh = 600, 290, 280, 120
    box3d(d, mx, my, mw, mh, (170, 120, 80))
    for (x, y) in [(mx + 30, my + 20), (mx + 150, my + 50), (mx + 210, my + 20)]:
        d.rectangle([x, y, x + 40, y + 28], fill=(250, 250, 240), outline=(120, 120, 120))
        d.line([x + 20, y, x + 20, y + 28], fill=(140, 140, 140))
    s.wall(mx, my, mw, mh)
    s.static_npc("teman", mx + 60, my - 4, "down")
    s.static_npc("siswa_a", mx + 200, my - 4, "down")
    s.static_npc("siswa_b", mx + 140, my + mh + 38, "up")
    s.zone("perpustakaan_02", "Meja Baca Bersama", mx - 30, my - 50, mw + 60, mh + 110)

    # Meja petugas (perpustakaan_03)
    px, py = 780, 600
    box3d(d, px, py, 240, 52, (140, 96, 60))
    d.rectangle([px + 20, py + 6, px + 60, py + 30], fill=(40, 40, 50), outline=(20, 20, 20))
    d.rectangle([px + 150, py + 10, px + 200, py + 30], fill=(230, 210, 120))
    text_center(d, px + 120, py + 40, "PEMINJAMAN", 10, (255, 240, 210))
    s.wall(px, py, 240, 52)
    s.static_npc("petugas", px + 120, py - 2, "down", solid=False)
    s.wall(px + 100, py - 14, 40, 14)
    s.zone("perpustakaan_03", "Meja Petugas", px - 30, py - 50, 300, 148)

    # rak dinding kanan
    shelf(960, 150, 150)
    return s


def build_kelas():
    s, rng = interior_base("kelas", "Ruang Kelas", 1024, 704, (226, 222, 210, 255), (236, 214, 160, 255), "tile")
    d = s.d
    # Papan tulis di dinding (kelas_02)
    d.rectangle([352, 14, 672, 80], fill=(40, 80, 60), outline=(150, 110, 70), width=5)
    d.text((372, 26), "Presentasi hari ini:", font=font(13), fill=(240, 240, 230))
    d.text((372, 48), "Kelompok 3 - maju ke depan", font=font(12), fill=(240, 240, 200))
    d.rectangle([380, 80, 640, 86], fill=(150, 110, 70))
    window_on_wall(d, 80)
    window_on_wall(d, 860)
    # meja guru
    box3d(d, 440, 128, 144, 52, (150, 100, 60))
    d.rectangle([460, 136, 500, 154], fill=(250, 250, 240), outline=(120, 120, 120))
    s.wall(440, 128, 144, 52)
    s.zone("kelas_02", "Papan Tulis", 320, 96, 384, 130)

    # Bangku (kelas_01): grid meja kiri
    def desk(x, y):
        box3d(d, x, y, 72, 36, (196, 150, 96))
        d.rectangle([x + 22, y + 44, x + 50, y + 56], fill=(120, 80, 50), outline=(70, 40, 20))  # kursi
        s.wall(x, y, 72, 36)

    occupied = {(0, 0), (1, 0), (2, 0), (0, 1), (2, 1), (0, 2), (1, 2), (0, 3), (2, 3)}
    for row in range(4):
        for col in range(3):
            x, y = 80 + col * 112, 260 + row * 100
            desk(x, y)
            if (col, row) in occupied:
                s.static_npc(["siswa_a", "siswa_b", "teman"][(row + col) % 3], x + 36, y + 58, "up", solid=False)
                s.wall(x + 26, y + 46, 20, 12)
    # bangku kosong yang disorot: kolom 1 baris 1 dan kolom 1 baris 3
    s.zone("kelas_01", "Bangku Kosong", 80 + 112 - 24, 260 + 100 - 24, 120, 104)

    # Meja kelompok (kelas_03)
    gx, gy, gw, gh = 660, 330, 220, 130
    box3d(d, gx, gy, gw, gh, (190, 150, 100))
    d.rectangle([gx + 60, gy + 30, gx + 160, gy + 90], fill=(250, 250, 240), outline=(120, 120, 120))
    d.text((gx + 70, gy + 40), "TUGAS\nKELOMPOK", font=font(11), fill=(60, 60, 60))
    s.wall(gx, gy, gw, gh)
    s.static_npc("teman", gx + 50, gy - 4, "down")
    s.static_npc("siswa_b", gx + 170, gy - 4, "down")
    s.static_npc("siswa_a", gx + gw + 26, gy + 70, "left")
    s.zone("kelas_03", "Meja Kelompok", gx - 40, gy - 50, gw + 70, gh + 110)

    # lemari & tanaman
    box3d(d, 900, 120, 80, 60, (140, 96, 60))
    s.wall(900, 120, 80, 60)
    return s


def build_laboratorium():
    s, rng = interior_base("laboratorium", "Lab Komputer", 1152, 768, (200, 206, 212, 255), (150, 176, 200, 255), "tile")
    d = s.d
    text_center(d, 576, 46, "LABORATORIUM KOMPUTER", 24, (255, 255, 255), stroke=(40, 60, 90))
    window_on_wall(d, 80)
    window_on_wall(d, 980)

    def pc_row(x, y, n, empty=()):
        w = n * 96
        box3d(d, x, y, w, 52, (220, 220, 226), (170, 170, 180))
        for i in range(n):
            px = x + 16 + i * 96
            d.rectangle([px, y + 4, px + 56, y + 34], fill=(30, 30, 40), outline=(10, 10, 10))
            d.rectangle([px + 4, y + 8, px + 52, y + 30], fill=(70, 150, 220) if i not in empty else (40, 90, 140))
            d.rectangle([px + 22, y + 34, px + 34, y + 40], fill=(60, 60, 60))
            d.rectangle([px + 6, y + 42, px + 50, y + 48], fill=(90, 90, 96))
            d.rectangle([px + 14, y + 58, px + 42, y + 70], fill=(60, 70, 90), outline=(30, 30, 40))
        s.wall(x, y, w, 52)

    pc_row(80, 160, 5)
    pc_row(80, 300, 5, empty=(4,))
    pc_row(80, 440, 5)
    for i in range(5):
        s.static_npc(["siswa_a", "siswa_b", "teman"][i % 3], 80 + 44 + i * 96, 160 + 76, "up", solid=False)
        s.wall(80 + 34 + i * 96, 160 + 64, 20, 12)
        if i < 4:
            s.static_npc(["teman", "siswa_a", "siswa_b"][i % 3], 80 + 44 + i * 96, 300 + 76, "up", solid=False)
            s.wall(80 + 34 + i * 96, 300 + 64, 20, 12)
        if i in (0, 2):
            s.static_npc("siswa_b", 80 + 44 + i * 96, 440 + 76, "up", solid=False)
            s.wall(80 + 34 + i * 96, 440 + 64, 20, 12)
    # komputer kosong = laboratorium_01
    s.zone("laboratorium_01", "Komputer Kosong", 80 + 4 * 96 - 30, 300 + 20, 150, 120)

    # Meja praktik berpasangan (laboratorium_02)
    mx, my = 720, 220
    box3d(d, mx, my, 260, 90, (180, 190, 200), (130, 140, 150))
    d.rectangle([mx + 20, my + 14, mx + 90, my + 54], fill=(40, 120, 70), outline=(20, 60, 30))
    for i in range(6):
        d.ellipse([mx + 26 + i * 10, my + 20, mx + 32 + i * 10, my + 26], fill=(220, 200, 80))
    d.rectangle([mx + 130, my + 14, mx + 200, my + 50], fill=(230, 230, 230), outline=(100, 100, 100))
    d.line([mx + 90, my + 34, mx + 130, my + 30], fill=(200, 40, 40), width=2)
    s.wall(mx, my, 260, 90)
    s.static_npc("teman", mx + 70, my + 128, "up")
    s.zone("laboratorium_02", "Meja Praktik", mx - 30, my - 30, 320, 190)

    # Papan jadwal tugas (laboratorium_03)
    jx, jy = 820, 520
    d.rectangle([jx + 10, jy + 30, jx + 16, jy + 60], fill=(80, 80, 80))
    d.rectangle([jx + 164, jy + 30, jx + 170, jy + 60], fill=(80, 80, 80))
    d.rectangle([jx, jy - 40, jx + 180, jy + 32], fill=(250, 250, 250), outline=(80, 80, 90), width=4)
    d.text((jx + 10, jy - 34), "PEMBAGIAN PERAN TIM", font=font(11), fill=(40, 40, 60))
    roles = ["Ketua: ......", "Programmer: ...", "Desainer: ......", "Presenter: ...."]
    for i, r in enumerate(roles):
        d.text((jx + 12, jy - 18 + i * 12), r, font=font(10), fill=(60, 60, 90))
    s.wall(jx, jy, 180, 34)
    s.zone("laboratorium_03", "Papan Jadwal Tugas", jx - 30, jy - 10, 240, 110)

    # rak server
    box3d(d, 1040, 120, 72, 90, (60, 64, 72))
    for y in range(128, 196, 12):
        d.rectangle([1048, y, 1104, y + 6], fill=(30, 30, 34))
        d.ellipse([1094, y + 1, 1098, y + 5], fill=(80, 220, 120))
    s.wall(1040, 120, 72, 90)
    return s


# --------------------------------------------------------------------------
# SPRITE
# --------------------------------------------------------------------------
PALETTES = {
    # skin, hair, shirt, pants/skirt, accent, hijab(None)
    "player":      dict(skin=(242, 200, 160), hair=(40, 30, 30), shirt=(250, 250, 250), pants=(60, 70, 110), accent=(200, 60, 60), hijab=None),
    "teman":       dict(skin=(226, 180, 140), hair=(30, 25, 25), shirt=(250, 250, 250), pants=(120, 120, 130), accent=(70, 90, 160), hijab=None),
    "kakak_kelas": dict(skin=(214, 168, 128), hair=(60, 40, 30), shirt=(40, 60, 120), pants=(110, 110, 120), accent=(240, 200, 60), hijab=None),
    "guru":        dict(skin=(220, 176, 136), hair=(110, 110, 110), shirt=(150, 90, 50), pants=(40, 40, 50), accent=(230, 190, 110), hijab=None),
    "penjual":     dict(skin=(210, 160, 120), hair=(20, 20, 20), shirt=(240, 150, 60), pants=(80, 60, 50), accent=(250, 250, 250), hijab=None),
    "siswa_a":     dict(skin=(236, 196, 156), hair=(50, 30, 20), shirt=(250, 250, 250), pants=(120, 120, 130), accent=(120, 120, 130), hijab=None),
    "siswa_b":     dict(skin=(232, 190, 150), hair=(20, 20, 20), shirt=(250, 250, 250), pants=(120, 120, 130), accent=(120, 120, 130), hijab=(245, 245, 245)),
    "petugas":     dict(skin=(228, 186, 146), hair=(20, 20, 20), shirt=(90, 130, 110), pants=(50, 50, 60), accent=(250, 250, 250), hijab=(120, 70, 110)),
}
NPC_VARIANTS = ["teman", "kakak_kelas", "guru", "penjual", "siswa_a", "siswa_b", "petugas"]


def draw_char(d, ox, oy, direction, frame, p):
    OUT = (40, 28, 24)
    skin, hair, shirt, pants, acc, hijab = p["skin"], p["hair"], p["shirt"], p["pants"], p["accent"], p["hijab"]
    # bayangan
    d.ellipse([ox + 7, oy + 42, ox + 25, oy + 47], fill=(0, 0, 0, 70))
    step = [0, 1, -1][frame]
    # kaki
    if direction in ("down", "up"):
        ly = 2 if step == 1 else 0
        ry = 2 if step == -1 else 0
        d.rectangle([ox + 11, oy + 34, ox + 15, oy + 44 - ly], fill=pants, outline=OUT)
        d.rectangle([ox + 17, oy + 34, ox + 21, oy + 44 - ry], fill=pants, outline=OUT)
        d.rectangle([ox + 11, oy + 42 - ly, ox + 15, oy + 44 - ly], fill=(30, 30, 30))
        d.rectangle([ox + 17, oy + 42 - ry, ox + 21, oy + 44 - ry], fill=(30, 30, 30))
    else:
        d.rectangle([ox + 13 - step * 3, oy + 34, ox + 18 - step * 3, oy + 44], fill=pants, outline=OUT)
        d.rectangle([ox + 14 + step * 3, oy + 34, ox + 19 + step * 3, oy + 44], fill=shade(pants, 0.85), outline=OUT)
        d.rectangle([ox + 13 - step * 3, oy + 42, ox + 18 - step * 3, oy + 44], fill=(30, 30, 30))
    # badan
    d.rounded_rectangle([ox + 9, oy + 21, ox + 23, oy + 36], 3, fill=shirt, outline=OUT)
    d.rectangle([ox + 10, oy + 32, ox + 22, oy + 36], fill=pants)
    if direction == "down":
        d.polygon([(ox + 15, oy + 22), (ox + 17, oy + 22), (ox + 16, oy + 30)], fill=acc)
    # lengan
    sw = step * 2
    if direction in ("down", "up"):
        d.rectangle([ox + 6, oy + 22 + sw, ox + 9, oy + 32 + sw], fill=shirt, outline=OUT)
        d.rectangle([ox + 23, oy + 22 - sw, ox + 26, oy + 32 - sw], fill=shirt, outline=OUT)
        d.rectangle([ox + 6, oy + 31 + sw, ox + 9, oy + 33 + sw], fill=skin)
        d.rectangle([ox + 23, oy + 31 - sw, ox + 26, oy + 33 - sw], fill=skin)
    else:
        d.rectangle([ox + 14 + sw, oy + 23, ox + 18 + sw, oy + 33], fill=shade(shirt, 0.9), outline=OUT)
        d.rectangle([ox + 14 + sw, oy + 32, ox + 18 + sw, oy + 34], fill=skin)
    # kepala
    d.ellipse([ox + 7, oy + 3, ox + 25, oy + 23], fill=skin, outline=OUT)
    if hijab:
        if direction == "up":
            d.ellipse([ox + 6, oy + 2, ox + 26, oy + 26], fill=hijab, outline=OUT)
        else:
            d.ellipse([ox + 6, oy + 2, ox + 26, oy + 26], fill=hijab, outline=OUT)
            if direction == "down":
                d.ellipse([ox + 10, oy + 8, ox + 22, oy + 22], fill=skin)
            elif direction == "left":
                d.ellipse([ox + 8, oy + 8, ox + 18, oy + 22], fill=skin)
            else:
                d.ellipse([ox + 14, oy + 8, ox + 24, oy + 22], fill=skin)
    else:
        if direction == "up":
            d.ellipse([ox + 7, oy + 3, ox + 25, oy + 22], fill=hair, outline=OUT)
        elif direction == "down":
            d.chord([ox + 7, oy + 2, ox + 25, oy + 20], 180, 360, fill=hair, outline=OUT)
            d.rectangle([ox + 8, oy + 10, ox + 10, oy + 15], fill=hair)
            d.rectangle([ox + 22, oy + 10, ox + 24, oy + 15], fill=hair)
        elif direction == "left":
            d.chord([ox + 7, oy + 2, ox + 25, oy + 20], 180, 360, fill=hair, outline=OUT)
            d.rectangle([ox + 17, oy + 9, ox + 24, oy + 17], fill=hair)
        else:
            d.chord([ox + 7, oy + 2, ox + 25, oy + 20], 180, 360, fill=hair, outline=OUT)
            d.rectangle([ox + 8, oy + 9, ox + 15, oy + 17], fill=hair)
    # wajah
    eye = (30, 30, 40)
    if direction == "down":
        d.rectangle([ox + 12, oy + 14, ox + 13, oy + 16], fill=eye)
        d.rectangle([ox + 19, oy + 14, ox + 20, oy + 16], fill=eye)
        d.line([ox + 15, oy + 19, ox + 17, oy + 19], fill=(170, 90, 80))
    elif direction == "left":
        d.rectangle([ox + 10, oy + 14, ox + 11, oy + 16], fill=eye)
    elif direction == "right":
        d.rectangle([ox + 21, oy + 14, ox + 22, oy + 16], fill=eye)


def build_sprite_sheet(variants):
    cols = len(DIRS) * FRAMES_PER_DIR
    img = Image.new("RGBA", (cols * FRAME_W, len(variants) * FRAME_H), (0, 0, 0, 0))
    for row, v in enumerate(variants):
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        for di, direction in enumerate(DIRS):
            for f in range(FRAMES_PER_DIR):
                col = di * FRAMES_PER_DIR + f
                draw_char(d, col * FRAME_W, row * FRAME_H, direction, f, PALETTES[v])
        img = Image.alpha_composite(img, layer)
    return img


# --------------------------------------------------------------------------
# Validasi & ekspor
# --------------------------------------------------------------------------
def validate(scenes):
    ids = []
    for s in scenes:
        ids += [z["id"] for z in s.zones] + [n["id"] for n in s.npcs]
    missing = set(TI_IDS) - set(ids)
    extra = [i for i in ids if i not in TI_IDS]
    dup = {i for i in ids if ids.count(i) > 1}
    assert not missing, f"TI hilang: {missing}"
    assert not extra, f"TI tak dikenal: {extra}"
    assert not dup, f"TI ganda: {dup}"
    assert len(ids) == 20
    sid = {s.id for s in scenes}
    for s in scenes:
        for door in s.doors:
            assert door["target"] in sid, door
    for building in ("kantin", "perpustakaan", "kelas", "laboratorium"):
        n = sum(1 for s in scenes if s.id == building for _ in s.zones)
        assert n >= 3, f"{building} hanya punya {n} TI"


def to_js(scenes):
    data = {s.id: s.export() for s in scenes}
    header = (
        "// =====================================================================\n"
        "// mapData.js  —  HASIL GENERATE oleh tools/generate_assets.py\n"
        "// JANGAN diedit manual. Ubah generator lalu jalankan ulang:\n"
        "//   python tools/generate_assets.py\n"
        "// =====================================================================\n\n"
    )
    out = header
    out += f"export const TILE = {TILE};\n"
    out += f"export const VIEWPORT = {{ width: {VIEWPORT[0]}, height: {VIEWPORT[1]} }};\n\n"
    out += "// Urutan & ejaan ID harus identik dengan src/data/scenarios.js\n"
    out += f"export const TI_IDS = {json.dumps(TI_IDS, indent=2)};\n\n"
    out += "export const SPRITE = " + json.dumps({
        "frameWidth": FRAME_W, "frameHeight": FRAME_H,
        "framesPerDir": FRAMES_PER_DIR, "dirs": DIRS,
        "npcRows": {v: i for i, v in enumerate(NPC_VARIANTS)},
    }, indent=2) + ";\n\n"
    out += "export const START = " + json.dumps({"scene": "dunia", "x": 960, "y": 1120, "dir": "up"}) + ";\n\n"
    scenes_json = json.dumps(data, indent=2)
    # rapikan: rect {x,y,w,h} dan spawn {x,y,...} ditulis satu baris
    scenes_json = re.sub(r"\{\s+(\"x\": -?\d+,\s+\"y\": -?\d+(?:,\s+\"(?:w|h|dir)\": [^,}\s]+)*)\s+\}",
                         lambda m: "{ " + re.sub(r"\s+", " ", m.group(1)) + " }", scenes_json)
    out += "export const SCENES = " + scenes_json + ";\n\n"
    out += "export const SCENE_IDS = Object.keys(SCENES);\n"
    return out


def main():
    os.makedirs(ASSET_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MAPDATA_PATH), exist_ok=True)
    scenes = [build_dunia(), build_kantin(), build_perpustakaan(), build_kelas(), build_laboratorium()]
    validate(scenes)
    for s in scenes:
        path = os.path.join(ASSET_DIR, f"map_{s.id}.png")
        s.img.convert("RGB").save(path, optimize=True)
        print(f"  {path}  ({s.w}x{s.h}, {len(s.walls)} tembok, {len(s.zones) + len(s.npcs)} TI)")
    build_sprite_sheet(["player"]).save(os.path.join(ASSET_DIR, "player.png"), optimize=True)
    build_sprite_sheet(NPC_VARIANTS).save(os.path.join(ASSET_DIR, "npc.png"), optimize=True)
    with open(MAPDATA_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(to_js(scenes))
    print(f"  {MAPDATA_PATH}")
    print("Selesai: 5 scene, 20 TI, sprite player + npc.")


if __name__ == "__main__":
    main()
