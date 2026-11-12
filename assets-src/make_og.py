"""Generate public/og.png (1200x630) from the processed portrait + Geist type.
Usage: python3 assets-src/make_og.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "node_modules/geist/dist/fonts"
W, H = 1200, 630
BG = (8, 11, 18)

img = Image.new("RGB", (W, H), BG)

# Aura light source behind the portrait.
glow = Image.new("RGB", (W, H), BG)
gd = ImageDraw.Draw(glow)
gd.ellipse((640, -120, 1300, 600), fill=(46, 64, 140))
gd.ellipse((780, 300, 1240, 760), fill=(24, 86, 104))
glow = glow.filter(ImageFilter.GaussianBlur(140))
img = Image.blend(img, glow, 0.9)

# Portrait, feathered on the left and bottom.
p = Image.open(ROOT / "public/images/shohrux-portrait.webp").convert("RGB")
ph = H
pw = int(p.width * ph / p.height)
p = p.resize((pw, ph), Image.LANCZOS)
mask = Image.new("L", (pw, ph), 255)
md = ImageDraw.Draw(mask)
for x in range(int(pw * 0.28)):
    md.line((x, 0, x, ph), fill=int(255 * (x / (pw * 0.28)) ** 1.3))
img.paste(p, (W - pw, 0), mask)

d = ImageDraw.Draw(img)
mono = ImageFont.truetype(str(FONTS / "geist-mono/GeistMono-Regular.ttf"), 18)
sans = ImageFont.truetype(str(FONTS / "geist-sans/Geist-Medium.ttf"), 64)
small = ImageFont.truetype(str(FONTS / "geist-sans/Geist-Regular.ttf"), 24)

d.line((72, 92, 108, 92), fill=(109, 141, 255), width=2)
d.text((122, 81), "SHOHRUX  ·  UZBEKISTAN", font=mono, fill=(163, 173, 188))
y = 200
for line in ["I build thoughtful", "digital experiences."]:
    d.text((70, y), line, font=sans, fill=(244, 245, 247))
    y += 76
d.text((72, 400), "Developer · AI Product Builder · Creative Technologist", font=small, fill=(163, 173, 188))
d.text((72, 436), "Web · AI · Desktop · Interactive 3D", font=small, fill=(128, 138, 156))

img.save(ROOT / "public/og.png", optimize=True)
print("og.png written")
