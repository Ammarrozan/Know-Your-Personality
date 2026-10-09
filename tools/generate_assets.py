#!/usr/bin/env python3
"""Generator aset Dev 1. Jalankan dari root proyek:  python3 tools/generate_assets.py
Menghasilkan:
  public/assets/map.png          peta kampus 960x640
  public/assets/player.png       sprite sheet 96x128 (3 kolom x 4 baris, frame 32x32)
                                 baris: 0=bawah 1=kiri 2=kanan 3=atas; kolom: 0=diam 1,2=jalan
  src/game/mapData.js            tembok (SOLIDS) + 12 zona (ZONES), sumber tunggal tata letak
Ubah LAYOUT di bawah lalu jalankan ulang agar gambar dan hitbox selalu sinkron."""
import json, os, random
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 960, 640
random.seed(7)

# ---------------- LAYOUT (sumber tunggal) ----------------
# (id zona, label, x, y, w, h)  -> area interaksi (bisa dilewati)
ZONES = [
    ("kantin_01", "Kantin", 105, 152, 70, 40),
    ("perpustakaan_01", "Perpustakaan", 355, 152, 70, 40),
    ("kelas_01", "Ruang Kelas", 590, 152, 70, 40),
    ("laboratorium_01", "Lab Komputer", 800, 152, 70, 40),
    ("papan_pengumuman_01", "Papan Pengumuman", 290, 242, 90, 36),
    ("taman_01", "Taman Kampus", 410, 410, 80, 50),
    ("sekretariat_ukm_01", "Sekretariat UKM", 75, 302, 70, 40),
    ("lapangan_01", "Lapangan", 740, 420, 80, 50),
    ("koridor_01", "Koridor", 555, 224, 70, 34),
    ("gerbang_01", "Gerbang", 445, 566, 70, 34),
    ("parkiran_01", "Parkiran", 100, 470, 70, 40),
    ("ruang_dosen_01", "Ruang Dosen", 815, 292, 70, 40),
]
# bangunan: (nama, x, y, w, h, warna atap, warna dinding, label)
BUILDINGS = [
    ("kantin", 40, 40, 200, 110, (214, 96, 62), (246, 224, 190), "KANTIN"),
    ("perpus", 290, 40, 200, 110, (70, 110, 190), (226, 232, 246), "PERPUSTAKAAN"),
    ("kelas", 540, 40, 170, 110, (60, 150, 120), (226, 244, 232), "RUANG KELAS"),
    ("lab", 750, 40, 170, 110, (130, 90, 190), (236, 228, 248), "LAB KOMPUTER"),
    ("ukm", 40, 210, 140, 90, (220, 160, 40), (250, 240, 204), "UKM"),
    ("dosen", 780, 200, 140, 90, (160, 70, 90), (246, 224, 230), "RUANG DOSEN"),
]
TREES = [(310, 340), (540, 340), (310, 480), (540, 480)]  # 36x36
CARS = [(56, 404, 56, 30, (200, 60, 60)), (128, 404, 56, 30, (60, 120, 200))]
SOLIDS = [(x, y, w, h) for _, x, y, w, h, *_ in BUILDINGS]
SOLIDS += [(x, y, 36, 36) for x, y in TREES]
SOLIDS += [(x, y, w, h) for x, y, w, h, _ in CARS]
SOLIDS += [
    (300, 215, 70, 25),                      # papan pengumuman
    (430, 220, 12, 12), (718, 220, 12, 12),  # tiang koridor
    (430, 248, 12, 12), (718, 248, 12, 12),
    (0, 0, 960, 24), (0, 0, 24, 640), (936, 0, 24, 640),   # batas peta
    (0, 604, 418, 36), (542, 604, 418, 36),                # tembok bawah
    (418, 584, 16, 56), (526, 584, 16, 56), (434, 628, 92, 12),  # tiang gerbang
]

# ---------------- gambar peta ----------------
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    FS = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 11)
except OSError:
    F = FS = ImageFont.load_default()


def jitter(c, a=6):
    d = random.randint(-a, a)
    return tuple(max(0, min(255, v + d)) for v in c)


def tex(d, x, y, w, h, base, step=8, a=5):
    for i in range(x, x + w, step):
        for j in range(y, y + h, step):
            d.rectangle([i, j, i + step - 1, j + step - 1], fill=jitter(base, a))


def text_c(d, cx, cy, s, font, fill):
    b = d.textbbox((0, 0), s, font=font)
    d.text((cx - (b[2] - b[0]) / 2, cy - (b[3] - b[1]) / 2 - b[1]), s, font=font, fill=fill)


def draw_map():
    im = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(im)
    tex(d, 0, 0, W, H, (112, 176, 92))
    for _ in range(420):  # rumput & bunga kecil
        x, y = random.randint(0, W - 4), random.randint(0, H - 4)
        c = random.choice([(90, 150, 76), (130, 196, 106), (250, 230, 120), (250, 250, 250)])
        d.rectangle([x, y, x + 2, y + 2], fill=c)
    # jalan setapak
    for r in [(24, 152, 912, 53), (24, 300, 912, 40), (450, 205, 60, 400)]:
        tex(d, *r, (222, 202, 160), 8, 6)
    for r in [(24, 152, 912, 53), (24, 300, 912, 40), (450, 205, 60, 400)]:
        d.rectangle([r[0], r[1], r[0] + r[2] - 1, r[1] + r[3] - 1], outline=(190, 168, 124))
    # taman
    tex(d, 300, 330, 290, 190, (136, 200, 108), 8, 5)
    d.rectangle([300, 330, 589, 519], outline=(86, 140, 70), width=3)
    for _ in range(60):
        x, y = random.randint(306, 580), random.randint(336, 510)
        d.rectangle([x, y, x + 3, y + 3], fill=random.choice([(240, 90, 120), (250, 210, 60), (255, 255, 255), (170, 110, 230)]))
    # parkiran
    tex(d, 40, 390, 200, 140, (96, 100, 110), 8, 4)
    for i in range(5):
        d.rectangle([48 + i * 38, 440, 50 + i * 38, 470], fill=(235, 235, 235))
        d.rectangle([48 + i * 38, 500, 50 + i * 38, 524], fill=(235, 235, 235))
    text_c(d, 140, 450, "PARKIRAN", FS, (230, 230, 235))
    # lapangan
    tex(d, 640, 360, 280, 170, (70, 150, 80), 8, 5)
    d.rectangle([652, 372, 907, 517], outline=(245, 245, 245), width=3)
    d.line([780, 372, 780, 517], fill=(245, 245, 245), width=3)
    d.ellipse([750, 420, 810, 470], outline=(245, 245, 245), width=3)
    d.rectangle([652, 425, 684, 465], outline=(245, 245, 245), width=3)
    d.rectangle([875, 425, 907, 465], outline=(245, 245, 245), width=3)
    # koridor beratap
    tex(d, 430, 220, 300, 40, (200, 170, 140), 10, 4)
    d.rectangle([430, 220, 729, 259], outline=(150, 110, 80), width=3)
    for x in (430, 718):
        for y in (220, 248):
            d.rectangle([x, y, x + 11, y + 11], fill=(120, 80, 60), outline=(70, 45, 30))
    text_c(d, 580, 240, "KORIDOR", FS, (110, 70, 50))
    # papan pengumuman
    d.rectangle([300, 215, 369, 239], fill=(150, 100, 60), outline=(90, 60, 30), width=2)
    d.rectangle([306, 219, 363, 234], fill=(250, 244, 220))
    for i, c in enumerate([(230, 90, 90), (90, 150, 230), (250, 200, 60)]):
        d.rectangle([310 + i * 18, 222, 322 + i * 18, 231], fill=c)
    d.rectangle([330, 240, 340, 244], fill=(90, 60, 30))
    # bangunan
    for _, x, y, w, h, roof, wall, label in BUILDINGS:
        d.rectangle([x + 5, y + 5, x + w + 5, y + h + 5], fill=(70, 120, 60))  # bayangan
        d.rectangle([x, y, x + w - 1, y + h - 1], fill=wall, outline=(60, 50, 50), width=2)
        d.rectangle([x, y, x + w - 1, y + 34], fill=roof, outline=(60, 50, 50), width=2)
        text_c(d, x + w / 2, y + 17, label, F, (255, 255, 255))
        n = max(2, (w - 40) // 50)
        gap = (w - 20) / n
        for i in range(n):
            wx = int(x + 10 + i * gap + (gap - 30) / 2)
            if abs(wx + 15 - (x + w / 2)) < 26:
                continue
            d.rectangle([wx, y + 48, wx + 29, y + 70], fill=(150, 205, 240), outline=(60, 50, 50), width=2)
            d.line([wx + 15, y + 48, wx + 15, y + 70], fill=(60, 50, 50))
        dx = int(x + w / 2 - 13)
        d.rectangle([dx, y + h - 34, dx + 25, y + h - 1], fill=(120, 76, 44), outline=(60, 50, 50), width=2)
        d.ellipse([dx + 17, y + h - 18, dx + 20, y + h - 15], fill=(250, 210, 80))
    # pohon
    for x, y in TREES:
        d.rectangle([x + 14, y + 22, x + 22, y + 35], fill=(110, 76, 44))
        d.ellipse([x - 6, y - 8, x + 42, y + 30], fill=(48, 120, 64), outline=(30, 80, 44))
        d.ellipse([x + 2, y - 2, x + 22, y + 14], fill=(76, 152, 84))
    # mobil
    for x, y, w, h, c in CARS:
        d.rounded_rectangle([x, y, x + w - 1, y + h - 1], 6, fill=c, outline=(40, 40, 50), width=2)
        d.rectangle([x + 12, y + 5, x + w - 14, y + h - 6], fill=(190, 225, 245))
    # pagar/semak pembatas
    for r in [(0, 0, 960, 24), (0, 0, 24, 640), (936, 0, 24, 640), (0, 604, 418, 36), (542, 604, 418, 36)]:
        tex(d, *r, (52, 112, 60), 8, 8)
    # gerbang
    for x in (418, 526):
        d.rectangle([x, 584, x + 15, 639], fill=(236, 232, 224), outline=(80, 70, 70), width=2)
        d.rectangle([x - 2, 580, x + 17, 590], fill=(190, 60, 60), outline=(80, 70, 70))
    d.rectangle([434, 628, 525, 639], fill=(70, 70, 76))
    text_c(d, 480, 596, "GERBANG", FS, (60, 60, 70))
    # penanda lantai zona (samar)
    for _, _, x, y, w, h in ZONES:
        d.rounded_rectangle([x, y, x + w - 1, y + h - 1], 8, outline=(255, 255, 255), width=1)
    im.save(os.path.join(ROOT, "public/assets/map.png"))


# ---------------- sprite karakter ----------------
HAIR, SKIN, SHIRT, PANTS = (58, 38, 30), (242, 202, 164), (72, 132, 224), (52, 62, 104)
SHOE, BAG, EYE, STRAP = (30, 30, 36), (236, 172, 52), (30, 30, 36), (50, 100, 180)


def frame(direction, step):
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    p = im.load()

    def r(x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                p[x, y] = c + (255,)

    if direction == "down":
        r(5, 2, 10, 3, HAIR); r(4, 3, 11, 4, HAIR); r(5, 4, 10, 6, SKIN)
        r(4, 4, 4, 5, HAIR); r(11, 4, 11, 5, HAIR)
        p[6, 5] = EYE + (255,); p[9, 5] = EYE + (255,)
        r(4, 7, 11, 10, SHIRT); r(3, 8, 3, 10, SHIRT); r(12, 8, 12, 10, SHIRT)
        r(3, 11, 3, 11, SKIN); r(12, 11, 12, 11, SKIN); r(5, 7, 5, 10, STRAP); r(10, 7, 10, 10, STRAP)
        r(5, 11, 10, 11, PANTS)
        la, ra = (1, 0) if step == 1 else (0, 1) if step == 2 else (0, 0)
        r(5, 12, 7, 13 - la, PANTS); r(8, 12, 10, 13 - ra, PANTS)
        r(5, 14 - la, 7, 14 - la, SHOE); r(8, 14 - ra, 10, 14 - ra, SHOE)
    elif direction == "up":
        r(5, 2, 10, 3, HAIR); r(4, 3, 11, 6, HAIR); r(5, 7, 10, 7, SKIN)
        r(4, 8, 11, 10, SHIRT); r(3, 8, 3, 10, SHIRT); r(12, 8, 12, 10, SHIRT)
        r(3, 11, 3, 11, SKIN); r(12, 11, 12, 11, SKIN); r(5, 8, 10, 11, BAG); r(5, 8, 10, 8, STRAP)
        r(5, 11, 10, 11, PANTS)
        la, ra = (1, 0) if step == 1 else (0, 1) if step == 2 else (0, 0)
        r(5, 12, 7, 13 - la, PANTS); r(8, 12, 10, 13 - ra, PANTS)
        r(5, 14 - la, 7, 14 - la, SHOE); r(8, 14 - ra, 10, 14 - ra, SHOE)
    else:  # kiri (kanan = cermin)
        r(5, 2, 10, 3, HAIR); r(5, 3, 11, 4, HAIR); r(4, 4, 9, 6, SKIN); r(8, 3, 11, 6, HAIR)
        r(4, 3, 7, 3, HAIR); p[5, 5] = EYE + (255,)
        r(5, 7, 10, 10, SHIRT); r(9, 8, 12, 11, BAG); r(6, 8, 8, 10, SHIRT)
        r(6, 11, 6, 11, SKIN); r(5, 11, 10, 11, PANTS)
        if step == 0:
            r(6, 12, 9, 13, PANTS); r(6, 14, 9, 14, SHOE)
        elif step == 1:
            r(5, 12, 7, 13, PANTS); r(8, 12, 10, 12, PANTS); r(5, 14, 7, 14, SHOE); r(8, 13, 10, 13, SHOE)
        else:
            r(6, 12, 8, 12, PANTS); r(9, 12, 11, 13, PANTS); r(6, 13, 8, 13, SHOE); r(9, 14, 11, 14, SHOE)
    return im.resize((32, 32), Image.NEAREST)


def draw_sprite():
    sheet = Image.new("RGBA", (96, 128), (0, 0, 0, 0))
    for row, dname in enumerate(["down", "left", "right", "up"]):
        for col in range(3):
            f = frame("left" if dname == "right" else dname, col)
            if dname == "right":
                f = ImageOps.mirror(f)
            sheet.paste(f, (col * 32, row * 32))
    sheet.save(os.path.join(ROOT, "public/assets/player.png"))


def write_mapdata():
    out = ["// FILE HASIL GENERATE oleh tools/generate_assets.py - jangan edit manual.",
           "// Ubah LAYOUT di skrip Python lalu jalankan ulang agar gambar dan hitbox sinkron.",
           f"export const MAP_W = {W};", f"export const MAP_H = {H};", "",
           "// Tembok/objek padat: { x, y, w, h }", "export const SOLIDS = ["]
    out += [f"  {{ x: {x}, y: {y}, w: {w}, h: {h} }}," for x, y, w, h in SOLIDS]
    out += ["];", "", "// 12 zona interaksi. id HARUS sama dengan id di src/data/scenarios.js", "export const ZONES = ["]
    out += [f"  {{ id: {json.dumps(i)}, label: {json.dumps(l, ensure_ascii=False)}, x: {x}, y: {y}, w: {w}, h: {h} }}," for i, l, x, y, w, h in ZONES]
    out += ["];", "", "export const PLAYER_START = { x: 480, y: 556 };", ""]
    with open(os.path.join(ROOT, "src/game/mapData.js"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))


if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, "public/assets"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "src/game"), exist_ok=True)
    draw_map(); draw_sprite(); write_mapdata()
    print("OK: map.png, player.png, mapData.js")
