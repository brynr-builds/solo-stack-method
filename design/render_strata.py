"""
STRATA canvas — geological cross-section survey artifact — REFINED PASS
Philosophy: accumulation made visible, horizontal banding, mineral palette,
dramatic scale contrast between monumental type and microscopic clinical annotation.
"""

from PIL import Image, ImageDraw, ImageFont
import math

FONTS = "/Users/jonathangarnett/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/9d420982-004e-482f-bc1f-7181a2882800/fcc993fa-7459-4a87-89f5-4e343839a246/skills/canvas-design/canvas-fonts"

W, H = 2400, 3400

C = {
    "slate":       (15,  23,  42),
    "slate2":      (30,  41,  59),
    "slate3":      (51,  65,  85),
    "slate4":      (71,  85, 105),
    "stone":       (100, 116, 139),
    "stone_light": (148, 163, 184),
    "stone_pale":  (203, 213, 225),
    "surface":     (226, 232, 240),
    "blue":        (59,  130, 246),
    "blue_deep":   (29,   78, 216),
    "blue_pale":   (96,  165, 250),
    "blue_faint":  (37,   70, 140),
}

img = Image.new("RGB", (W, H), C["slate"])
draw = ImageDraw.Draw(img)

def load(name, size):
    return ImageFont.truetype(f"{FONTS}/{name}", size)

f_title   = load("BigShoulders-Bold.ttf",  440)
f_sub     = load("BigShoulders-Bold.ttf",   60)
f_sub2    = load("BigShoulders-Regular.ttf", 48)
f_mono_lg = load("GeistMono-Regular.ttf",   32)
f_mono_md = load("GeistMono-Regular.ttf",   22)
f_mono_sm = load("GeistMono-Regular.ttf",   16)
f_mono_xs = load("IBMPlexMono-Regular.ttf", 13)
f_mono_xx = load("IBMPlexMono-Regular.ttf", 11)

# ── STRATA BANDS ────────────────────────────────────────────────────────────
# (proportion, fill_color, grain_step)
layers = [
    (0.048,  C["slate"],       0),
    (0.032,  C["slate2"],      6),
    (0.026,  C["slate3"],      4),
    (0.012,  C["slate"],       0),
    (0.058,  C["slate2"],      8),
    (0.018,  C["slate"],       0),
    (0.008,  C["stone"],       0),   # thin stone seam before type stratum
    (0.205,  C["stone_light"], 5),   # TYPE STRATUM — monumental word
    (0.006,  C["blue"],        0),   # charged blue vein
    (0.003,  C["slate"],       0),   # thin seam below vein
    (0.125,  C["slate3"],      4),
    (0.036,  C["stone_pale"],  3),
    (0.024,  C["slate2"],      0),
    (0.010,  C["stone_light"], 0),
    (0.005,  C["slate"],       0),
    (0.228,  C["slate"],       0),
    (0.044,  C["slate2"],      5),
    (0.022,  C["stone_light"], 0),
    (0.070,  C["slate"],       0),
    (0.021,  C["slate3"],      0),
]

total_w = sum(l[0] for l in layers)
layers = [(l[0] / total_w, l[1], l[2]) for l in layers]

rects = []
y = 0
for proportion, color, grain in layers:
    h = max(int(H * proportion), 2)
    draw.rectangle([0, y, W, y + h], fill=color)
    if grain > 0:
        for gy in range(y + grain, y + h, grain * 2):
            dark = tuple(max(0, c - 14) for c in color)
            draw.line([0, gy, W, gy], fill=dark, width=1)
    rects.append((y, y + h, color))
    y += h

# ── MARGINS ─────────────────────────────────────────────────────────────────
ML = 108
MR = W - 72

draw.line([ML, 0, ML, H], fill=C["slate4"], width=1)
draw.line([MR, 0, MR, H], fill=C["slate4"], width=1)

# Left depth scale
TOTAL_DEPTH_M = 1440
for py in range(0, H + 1, 20):
    depth_m = py / H * TOTAL_DEPTH_M
    if py % 200 == 0:
        draw.line([ML - 34, py, ML, py], fill=C["slate4"], width=2)
        draw.text((ML - 92, py - 8), f"{int(depth_m):04d}", font=f_mono_xs, fill=C["stone_light"])
    elif py % 100 == 0:
        draw.line([ML - 22, py, ML, py], fill=C["slate4"], width=1)
        draw.text((ML - 92, py - 7), f"{int(depth_m):04d}", font=f_mono_xx, fill=C["slate4"])
    elif py % 40 == 0:
        draw.line([ML - 14, py, ML, py], fill=C["slate4"], width=1)
    else:
        draw.line([ML - 8, py, ML, py], fill=C["slate4"], width=1)

# Right minor scale
for py in range(0, H + 1, 40):
    if py % 200 == 0:
        draw.line([MR, py, MR + 26, py], fill=C["slate4"], width=2)
    elif py % 80 == 0:
        draw.line([MR, py, MR + 16, py], fill=C["slate4"], width=1)
    else:
        draw.line([MR, py, MR + 10, py], fill=C["slate4"], width=1)

# Hairline rules at every boundary
for (sy, ey, sc) in rects:
    draw.line([ML, sy, MR, sy], fill=C["slate4"], width=1)
draw.line([ML, y, MR, y], fill=C["slate4"], width=1)

# ── LOCATE KEY STRATA ────────────────────────────────────────────────────────
# type stratum = index 7, vein = index 8
cum = 0
type_y_start = type_y_end = vein_y_start = vein_y_end = 0
for i, (prop, color, grain) in enumerate(layers):
    if i == 7:
        type_y_start = int(H * cum)
        type_y_end   = int(H * (cum + prop))
    if i == 8:
        vein_y_start = int(H * cum)
        vein_y_end   = int(H * (cum + prop))
    cum += prop

type_y_mid = (type_y_start + type_y_end) // 2
vein_y_mid = (vein_y_start + vein_y_end) // 2

# ── MONUMENTAL TYPE ─────────────────────────────────────────────────────────
word = "STRATA"
bbox = draw.textbbox((0, 0), word, font=f_title)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]

# Position upper-center of type stratum, flush left of body
tx = ML + 28
ty = type_y_start + int((type_y_end - type_y_start) * 0.18)

draw.text((tx, ty), word, font=f_title, fill=C["slate"])

# Stratum designation above word
draw.text((tx, type_y_start + 18), "STRATUM TYPE-I  ·  CALCARENITE UNIT  ·  PALE ZONE", font=f_mono_sm, fill=C["slate4"])

# Section marker right of word
draw.text((tx + tw + 28, ty + th - 44), "§ IV", font=f_mono_md, fill=C["slate3"])

# "SOLO STACK METHOD™" — single line below the monumental word
sm_y = ty + th + 24
draw.text((tx, sm_y), "SOLO STACK METHOD™", font=f_sub2, fill=C["slate3"])

# Annotation row inside type stratum — just below the sub-headline, above vein
ann_row_y = max(sm_y + 68, type_y_end - 60)
if ann_row_y + 14 < type_y_end - 4:
    ann_data = [
        ("COMPOSITION", "CaCO₃ 78%  SiO₂ 14%  MgO 4%  OTHER 4%"),
        ("POROSITY",    "22.4%"),
        ("THICKNESS",   "248m (apparent)"),
        ("FORMATION",   "SSM-IV  [TYPE LOCALITY]"),
    ]
    ax = tx
    for k, v in ann_data:
        draw.text((ax, ann_row_y), k, font=f_mono_xx, fill=C["slate4"])
        draw.text((ax, ann_row_y + 14), v, font=f_mono_xs, fill=C["slate3"])
        ax += 340
        if ax > MR - 340:
            break

# ── VEIN ANNOTATION ──────────────────────────────────────────────────────────
vein_ann_y = vein_y_start - 22
draw.text((ML + 140, vein_ann_y), "VEIN-01  Cu/Fe SULFIDE · GRADE: 4.2 g/t Au · THICKNESS: 0.21m", font=f_mono_sm, fill=C["blue_pale"])
# Arrow from left
draw.line([ML + 24, vein_y_mid, ML + 128, vein_y_mid], fill=C["blue"], width=2)
draw.polygon([
    (ML + 128, vein_y_mid - 5),
    (ML + 128, vein_y_mid + 5),
    (ML + 140, vein_y_mid),
], fill=C["blue"])

# Depth at vein
depth_at_vein = int(vein_y_mid / H * TOTAL_DEPTH_M)
draw.text((ML - 104, vein_y_mid - 22), f"↓{depth_at_vein}m", font=f_mono_xs, fill=C["blue_pale"])

# ── STRATUM LABELS ON RIGHT ──────────────────────────────────────────────────
stratum_labels = [
    (0,  "STR-A   EOLIAN CARBONATE  ·  ϕ 22%"),
    (1,  "STR-B   COMPRESSED ARGILLITE"),
    (2,  "STR-C   GRANITIC GNEISS BAND"),
    (3,  "·  DARK SEAM  ·  0.6m"),
    (4,  "STR-D   VOLCANICLASTIC TURBIDITE"),
    (5,  "·  UNCONFORMITY"),
    (6,  "·  STONE SEAM"),
    (7,  "STR-E   PALE CALCARENITE  [TYPE LOCALITY]  ·  UNIT I"),
    (8,  "VEIN-01   HYDROTHERMAL CHALCOPYRITE"),
    (9,  "·  SEAM"),
    (10, "STR-F   METAMORPHIC SCHIST  ·  FOLIATION 042°"),
    (11, "STR-G   SILICIFIED LIMESTONE  ·  SiO₂ 88%"),
    (12, "·  DARK UNCONFORMITY  ·  HIATUS ~12Ma"),
    (13, "·  PALE SEAM"),
    (14, "·  SEAM"),
    (15, "STR-H   DEEP GRANITE BASEMENT  ·  AGE 1.8Ga"),
    (16, "STR-I   COMPRESSED PHYLLITE"),
    (17, "STR-J   FOSSIL-BEARING LIMESTONE  ·  FAUNA: TRILOBITA"),
    (18, "STR-K   PRECAMBRIAN BASEMENT  ·  AGE 2.4Ga"),
    (19, "·  DEEP SEAM"),
]

for idx, label in stratum_labels:
    if idx < len(rects):
        sy, ey, _ = rects[idx]
        if (ey - sy) < 12:
            continue
        mid_y = (sy + ey) // 2 - 6
        draw.text((MR - 22, mid_y), label, font=f_mono_xx, fill=C["stone_light"], anchor="rm")
        draw.line([MR - 10, mid_y + 6, MR, mid_y + 6], fill=C["slate4"], width=1)

# ── SCATTERED CLINICAL ANNOTATIONS (left body) ──────────────────────────────
# These feel like in-field observations noted at specific strata
left_ann = [
    (rects[1][0] + 6,   "SAMPLE SSM-001 · DRILL CORE  ·  RQD 72%"),
    (rects[4][0] + 6,   "SAMPLE SSM-004 · XRF SCAN  ·  K₂O 3.1%  CaO 12.8%"),
    (rects[10][0] + 8,  "STRUCTURAL: FOLIATION 042°/68°NW  ·  LINEATION 024°/32°"),
    (rects[11][0] + 8,  "SAMPLE SSM-011 · THIN-SECTION  ·  QUARTZ ARENITE"),
    (rects[15][0] + 8,  "SAMPLE SSM-015 · U-Pb ZIRCON  ·  1823 ±14 Ma  (2σ)"),
    (rects[16][0] + 8,  "SAMPLE SSM-016 · REE PATTERN  ·  NEGATIVE Eu ANOMALY"),
    (rects[17][0] + 8,  "FOSSIL: OLENELLUS sp. (TRILOBITA)  ·  LOWER CAMBRIAN"),
    (rects[15][0] + 60, "MAGNETIC SUSCEPTIBILITY: 42 × 10⁻⁶ SI  ·  NORMAL POLARITY"),
    (rects[15][0] + 120, "WHOLE-ROCK GEOCHEMISTRY: Rb 84  Sr 312  Ba 788  (ppm)"),
    (rects[16][0] + 30, "VITRINITE REFLECTANCE: Rₒ = 0.82%  ·  MATURITY: OIL WINDOW"),
]

for ann_y, ann_text in left_ann:
    draw.text((ML + 16, ann_y), ann_text, font=f_mono_xx, fill=C["slate4"])

# ── MEASUREMENT GRID (lower right quadrant) ──────────────────────────────────
grid_y_start = type_y_end + 40
grid_x_start = ML + int((MR - ML) * 0.56)
grid_col = (28, 40, 58)
for gx in range(grid_x_start, MR - 1, 40):
    draw.line([gx, grid_y_start, gx, H - 260], fill=grid_col, width=1)
for gy in range(grid_y_start, H - 260, 40):
    draw.line([grid_x_start, gy, MR - 1, gy], fill=grid_col, width=1)

# Grid label
draw.text((grid_x_start + 4, grid_y_start - 16), "STRUCTURAL ANALYSIS GRID  ·  40px = 8m", font=f_mono_xx, fill=C["slate4"])

# ── STEREONET PLACEHOLDER (lower left) ───────────────────────────────────────
sn_cx = ML + 160
sn_cy = rects[15][0] + 180
sn_r  = 90
draw.ellipse([sn_cx - sn_r, sn_cy - sn_r, sn_cx + sn_r, sn_cy + sn_r], outline=C["slate4"], width=1)
draw.line([sn_cx - sn_r, sn_cy, sn_cx + sn_r, sn_cy], fill=C["slate4"], width=1)
draw.line([sn_cx, sn_cy - sn_r, sn_cx, sn_cy + sn_r], fill=C["slate4"], width=1)
# Tick marks
for ang_deg in range(0, 360, 10):
    ang = math.radians(ang_deg)
    r_inner = sn_r - (6 if ang_deg % 30 == 0 else 3)
    x1 = sn_cx + int(r_inner * math.sin(ang))
    y1 = sn_cy - int(r_inner * math.cos(ang))
    x2 = sn_cx + int(sn_r * math.sin(ang))
    y2 = sn_cy - int(sn_r * math.cos(ang))
    draw.line([x1, y1, x2, y2], fill=C["slate4"], width=1)
# A few plotted poles
poles = [(42, 68), (55, 72), (38, 65), (48, 70), (44, 66), (50, 74)]
for plunge, azimuth in poles:
    r_plot = sn_r * (90 - plunge) / 90
    px = sn_cx + int(r_plot * math.sin(math.radians(azimuth)))
    py = sn_cy - int(r_plot * math.cos(math.radians(azimuth)))
    draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=C["slate3"])
    draw.ellipse([px - 2, py - 2, px + 2, py + 2], outline=C["blue_pale"], width=1)
draw.text((sn_cx - sn_r, sn_cy + sn_r + 10), "SCHMIDT NET  ·  LOWER HEMISPHERE", font=f_mono_xx, fill=C["slate4"])
draw.text((sn_cx - sn_r, sn_cy + sn_r + 22), "n=6 POLES TO FOLIATION", font=f_mono_xx, fill=C["slate4"])

# ── COLUMN LITHOLOGY CODES (just right of left margin) ───────────────────────
lith_x = ML + 8
lith_labels = [
    (rects[0][0],  "Ee"),   # eolian
    (rects[1][0],  "Ar"),   # argillite
    (rects[2][0],  "Gn"),   # gneiss
    (rects[4][0],  "Vt"),   # volcaniclastic
    (rects[7][0],  "Cl"),   # calcarenite
    (rects[8][0],  "Vn"),   # vein — blue
    (rects[10][0], "Sc"),   # schist
    (rects[11][0], "Ls"),   # limestone
    (rects[15][0], "Gr"),   # granite
    (rects[17][0], "Lb"),   # limestone fossil
]
for ly, code in lith_labels:
    if code == "Vn":
        draw.text((lith_x + 2, ly + 4), code, font=f_mono_xx, fill=C["blue_pale"])
    else:
        draw.text((lith_x + 2, ly + 4), code, font=f_mono_xx, fill=C["slate3"])

# ── HEADER ────────────────────────────────────────────────────────────────────
hdr = "STRATA SECTION LOG  ·  REF: SSM-2026-IV  ·  SCALE 1:12,000  ·  DATUM WGS84  ·  AZIMUTH 047°  ·  TOTAL DEPTH 1440m"
draw.text((ML + 8, 22), hdr, font=f_mono_sm, fill=C["slate4"])
draw.line([ML, 50, MR, 50], fill=C["slate4"], width=1)

# Sub-header: classification and coordinates
draw.text((ML + 8, 56), "CLASSIFICATION: UNCLASSIFIED  ·  47°23′14″N  122°08′37″W  ·  UTM 10N  ·  ELEV: +412m MSL", font=f_mono_xx, fill=C["slate4"])
draw.line([ML, 70, MR, 70], fill=C["slate4"], width=1)

# ── COORDINATE REGISTRATION MARK (top right) ─────────────────────────────────
cx, cy = MR - 200, 110
r = 18
draw.line([cx - r - 8, cy, cx - 4, cy], fill=C["slate4"], width=1)
draw.line([cx + 4, cy, cx + r + 8, cy], fill=C["slate4"], width=1)
draw.line([cx, cy - r - 8, cx, cy - 4], fill=C["slate4"], width=1)
draw.line([cx, cy + 4, cx, cy + r + 8], fill=C["slate4"], width=1)
draw.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], outline=C["slate4"], width=1)
draw.text((cx + r + 14, cy - 12), "47°23′14″N", font=f_mono_xx, fill=C["slate4"])
draw.text((cx + r + 14, cy +  2), "122°08′37″W", font=f_mono_xx, fill=C["slate4"])

# ── TITLE BLOCK (bottom right) ───────────────────────────────────────────────
tb_x = MR - 450
tb_y = H - 235
tb_w = MR
tb_h = H - 36

draw.rectangle([tb_x, tb_y, tb_w, tb_h], outline=C["slate4"], width=1)
draw.line([tb_x, tb_y + 52, tb_w, tb_y + 52], fill=C["slate4"], width=1)
draw.line([tb_x, tb_y + 100, tb_w, tb_y + 100], fill=C["slate4"], width=1)
draw.line([tb_x + 240, tb_y + 100, tb_x + 240, tb_h], fill=C["slate4"], width=1)

draw.text((tb_x + 16, tb_y + 14), "SOLO STACK METHOD™", font=f_mono_md, fill=C["stone_pale"])
draw.text((tb_x + 16, tb_y + 38), "FOUNDATION SECTION · SHEET 1 OF 1", font=f_mono_xs, fill=C["stone_light"])

draw.text((tb_x + 16, tb_y + 110), "SCALE  1:12,000 VERT", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 16, tb_y + 126), "DATUM  MSL +0.0m", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 16, tb_y + 142), "PROJ   UTM 10N", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 16, tb_y + 158), "REV    A", font=f_mono_xx, fill=C["slate4"])

draw.text((tb_x + 256, tb_y + 110), "DATE   2026.06.08", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 256, tb_y + 126), "BY     B.R. GARNETT", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 256, tb_y + 142), "CHK    —", font=f_mono_xx, fill=C["slate4"])
draw.text((tb_x + 256, tb_y + 158), "APPR   —", font=f_mono_xx, fill=C["slate4"])

# ── BOTTOM FOOTER ─────────────────────────────────────────────────────────────
draw.line([ML, H - 60, MR, H - 60], fill=C["slate4"], width=1)
draw.text((ML + 8, H - 50), "© 2026 SOLO STACK METHOD™  ·  ALL RIGHTS RESERVED  ·  STRATA VISUAL SYSTEM REV-A", font=f_mono_xx, fill=C["slate4"])

# ── CORNER REGISTRATION MARKS ─────────────────────────────────────────────────
reg = 26
for (rx, ry) in [(40, 40), (W - 40, 40), (40, H - 40), (W - 40, H - 40)]:
    draw.line([rx - reg, ry, rx + reg, ry], fill=C["slate4"], width=1)
    draw.line([rx, ry - reg, rx, ry + reg], fill=C["slate4"], width=1)
    draw.ellipse([rx - 3, ry - 3, rx + 3, ry + 3], outline=C["slate4"], width=1)

# ── SAVE ──────────────────────────────────────────────────────────────────────
out = "/Users/jonathangarnett/projects/solostackmethod/design/STRATA-canvas.png"
img.save(out, dpi=(300, 300))
print(f"Saved → {out}")
print(f"  Size: {W}×{H}px  |  DPI: 300")
