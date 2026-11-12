"""Restrained editorial treatment of Shohrux's supplied portrait.

Only crop, tonal balance, edge vignette and light sharpening are applied.
Facial features are never retouched, warped or regenerated.
Usage: python3 assets-src/portrait/process_portrait.py
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets-src/portrait/originals/shohrux-original-1.webp"
OUT = ROOT / "public/images/shohrux-portrait.webp"

# 4:5 crop, shoulders up, excluding wall signage, mug and chess set.
CROP = (485, 80, 1125, 880)

img = Image.open(SRC).convert("RGB").crop(CROP)
w, h = img.size

# Gentle global tonal balance (no local face edits).
img = ImageEnhance.Contrast(img).enhance(1.04)
img = ImageEnhance.Color(img).enhance(0.94)

# Edge vignette: darken background corners and the lower edge so the
# subject separates from the room. The face region stays untouched (mask = 255).
mask = Image.new("L", (w, h), 0)
d = ImageDraw.Draw(mask)
d.ellipse((-w * 0.12, -h * 0.02, w * 1.0, h * 1.02), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(radius=w * 0.14))
dark = ImageEnhance.Brightness(img).enhance(0.55)
img = Image.composite(img, dark, mask)

# Fade the bottom 20% toward the page background colour (#080B12).
bg = Image.new("RGB", (w, h), (8, 11, 18))
fade = Image.new("L", (w, h), 0)
fd = ImageDraw.Draw(fade)
start = int(h * 0.80)
for y in range(start, h):
    fd.line((0, y, w, y), fill=int(255 * ((y - start) / (h - start)) ** 1.6))
img = Image.composite(bg, img, fade)

# Light, restrained sharpening for the web.
img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=3))

img.save(OUT, "WEBP", quality=88, method=6)
print(OUT, img.size, OUT.stat().st_size // 1024, "KB")
