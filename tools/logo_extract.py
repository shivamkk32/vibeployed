"""
Turn the supplied vibeployed-logo.png into theme-agnostic assets.

The source is cream ink baked onto a warm-brown ground, which cannot sit on
the Graphite Mono surfaces. The ink is a single flat colour and the ground is
uniform, so luminance keys out cleanly and keeps the antialiasing. The result
is white ink with a real alpha channel, which we then use as a CSS mask so the
wordmark takes whatever colour the theme asks for.
"""
from PIL import Image
import os

SRC = "vibeployed-logo.png"
OUT = "public/brand"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
lum = im.convert("L")

# Ground sits at ~50, ink at ~245. Map that range onto 0..255 so the ground
# goes fully transparent and the ink stays fully opaque, antialiasing intact.
LO, HI = 70.0, 235.0
alpha = lum.point(lambda v: 0 if v <= LO else (255 if v >= HI else int((v - LO) / (HI - LO) * 255)))

white = Image.new("RGBA", im.size, (255, 255, 255, 255))
white.putalpha(alpha)


def trim(img, pad=8):
    box = img.getbbox()
    if not box:
        return img
    l, t, r, b = box
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(img.width, r + pad), min(img.height, b + pad)
    return img.crop((l, t, r, b))


def save(img, name, target_h=None):
    if target_h:
        ratio = target_h / img.height
        img = img.resize((max(1, round(img.width * ratio)), target_h), Image.LANCZOS)
    path = os.path.join(OUT, name)
    img.save(path, optimize=True)
    print(f"  {name:28} {img.width}x{img.height}")


# 1. Full lockup: wordmark plus the curved tagline.
save(trim(white), "lockup.png", target_h=320)

# 2. Wordmark only. Letter segmentation puts the glyphs at x 114-2215,
#    y 675-1115; the arc tagline and sparkle sit outside that.
wordmark = trim(white.crop((100, 660, 2230, 1130)))
save(wordmark, "wordmark.png", target_h=160)

# 3. App mark: the dotted "o" is the one distinct glyph in the lockup, so it
#    doubles as the icon. It opens segment 5 of the wordmark, at x 1287.
mark = trim(white.crop((1280, 762, 1502, 1020)), pad=2)
save(mark, "mark.png", target_h=256)

print("done")
