"""
Builds the Open Graph / share card shown when the URL is pasted into
WhatsApp, Instagram, Slack, iMessage, X and so on.

The supplied logo is placed at its native 500x500 with no scaling and no
keying, so not a single pixel of the artwork is resampled. That works because
the card background is pure black, exactly matching the ground baked into the
PNG, so the logo's empty canvas is invisible and the mark simply sits on the
card. Only the surrounding text and layout are generated here.
"""
from PIL import Image, ImageDraw, ImageFont
import os

LOGO = "public/vibeployed-logo.png"
FONT = "tools/fonts/DMSans.ttf"
OUT = "public"

W, H = 1200, 630
BLACK = (0, 0, 0)
INK = (250, 250, 250)
MUTED = (138, 138, 138)
RULE = (48, 48, 48)

# Ink bounds inside the 500x500 logo canvas, measured from the artwork.
INK_X0, INK_Y0, INK_X1, INK_Y1 = 91, 190, 406, 301
INK_CX = (INK_X0 + INK_X1) / 2


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


card = Image.new("RGB", (W, H), BLACK)
d = ImageDraw.Draw(card)

# Logo, native size, centred horizontally, ink top at y=118.
logo = Image.open(LOGO).convert("RGB")
card.paste(logo, (int(W / 2 - INK_CX), int(118 - INK_Y0)))

# Headline, two tones like the hero.
h1 = font(66, "Bold")
h2 = font(66, "Bold")
d.text((W / 2, 320), "Ship to any cloud.", font=h1, fill=INK, anchor="mm")
d.text((W / 2, 396), "Optimized and protected.", font=h2, fill=MUTED, anchor="mm")

# Hairline, then the supporting line and the domain.
d.line([(W / 2 - 300, 470), (W / 2 + 300, 470)], fill=RULE, width=1)

sub = font(27, "Medium")
d.text(
    (W / 2, 512),
    "See the architecture and the monthly bill before anything is built",
    font=sub,
    fill=MUTED,
    anchor="mm",
)

dom = font(25, "SemiBold")
d.text((W / 2, 560), "vibeployed.com", font=dom, fill=(190, 190, 190), anchor="mm")

os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, "share-card.png")
card.save(path, optimize=True)
print("wrote", path, card.size, os.path.getsize(path), "bytes")
