from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "podscars-social-mockups"
TROPHY_PATH = Path("/Users/mildsdixon/Downloads/ChatGPT Image Jun 22, 2026 at 02_23_21 PM.png")
LOGO_PATH = Path("/Users/mildsdixon/Library/Mobile Documents/com~apple~CloudDocs/Podscars/Logo.png")

FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

GOLD = (235, 178, 82)
DEEP = (13, 11, 9)
WARM = (60, 42, 25)
CREAM = (255, 238, 200)


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def cover_text(draw, xy, text, fnt, fill, stroke_fill=None, stroke_width=0, anchor="mm"):
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor, stroke_fill=stroke_fill, stroke_width=stroke_width)


def fit_font(text, font_path, max_width, start_size, min_size=28):
    size = start_size
    while size >= min_size:
        fnt = font(font_path, size)
        box = ImageDraw.Draw(Image.new("RGBA", (10, 10))).textbbox((0, 0), text, font=fnt)
        if box[2] - box[0] <= max_width:
            return fnt
        size -= 2
    return font(font_path, min_size)


def gradient_background(size, spotlight=(0.5, 0.42), intensity=1.0):
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    cx, cy = spotlight[0] * w, spotlight[1] * h
    maxd = math.hypot(max(cx, w - cx), max(cy, h - cy))
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / maxd
            vignette = max(0, 1 - d * 1.38) ** 1.7
            vertical = y / h
            r = int(DEEP[0] + (120 * vignette + 15 * (1 - vertical)) * intensity)
            g = int(DEEP[1] + (85 * vignette + 9 * (1 - vertical)) * intensity)
            b = int(DEEP[2] + (42 * vignette + 5 * (1 - vertical)) * intensity)
            px[x, y] = (min(255, r), min(255, g), min(255, b))
    return img.convert("RGBA")


def add_gold_rays(base, center, radius, count=20, alpha=30):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    for i in range(count):
        a1 = (i / count) * 360
        a2 = a1 + 360 / count * 0.34
        p1 = (cx + math.cos(math.radians(a1)) * radius, cy + math.sin(math.radians(a1)) * radius)
        p2 = (cx + math.cos(math.radians(a2)) * radius, cy + math.sin(math.radians(a2)) * radius)
        d.polygon([(cx, cy), p1, p2], fill=(250, 184, 62, alpha))
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(8)))


def resize_contain(img, box):
    copy = img.copy()
    copy.thumbnail(box, Image.Resampling.LANCZOS)
    return copy


def logo_with_shadow(max_w, max_h):
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = resize_contain(logo, (max_w, max_h))
    shadow = Image.new("RGBA", (logo.width + 28, logo.height + 28), (0, 0, 0, 0))
    alpha = logo.getchannel("A").filter(ImageFilter.GaussianBlur(9))
    shadow.paste((0, 0, 0, 165), (14, 14), alpha)
    shadow.alpha_composite(logo, (0, 0))
    return shadow


def trophy_cut(max_w, max_h):
    trophy = Image.open(TROPHY_PATH).convert("RGBA")
    trophy = resize_contain(trophy, (max_w, max_h))
    glow = Image.new("RGBA", (trophy.width + 70, trophy.height + 70), (0, 0, 0, 0))
    mask = trophy.getchannel("A").filter(ImageFilter.GaussianBlur(26))
    glow.paste((246, 184, 55, 125), (35, 35), mask)
    glow.alpha_composite(trophy, (35, 35))
    return glow


def paste_center(base, item, cx, cy):
    base.alpha_composite(item, (int(cx - item.width / 2), int(cy - item.height / 2)))


def add_cta(draw, x, y, text, size):
    fnt = font(FONT_BOLD, size)
    pad_x = int(size * 0.9)
    pad_y = int(size * 0.42)
    box = draw.textbbox((0, 0), text, font=fnt)
    w = box[2] - box[0] + pad_x * 2
    h = box[3] - box[1] + pad_y * 2
    rect = [x - w / 2, y - h / 2, x + w / 2, y + h / 2]
    draw.rounded_rectangle(rect, radius=int(h / 2), fill=(238, 177, 70), outline=(255, 228, 149), width=max(2, size // 14))
    draw.text((x, y + size * 0.03), text, font=fnt, fill=(24, 15, 8), anchor="mm")


def square_feed():
    size = (1080, 1080)
    base = gradient_background(size, (0.5, 0.45), 1.1)
    add_gold_rays(base, (540, 470), 720, 24, 24)
    paste_center(base, trophy_cut(520, 560), 540, 455)
    paste_center(base, logo_with_shadow(860, 138), 540, 120)
    d = ImageDraw.Draw(base)
    headline = "THE AWARD SHOW FOR PODCASTS"
    cover_text(d, (540, 820), headline, fit_font(headline, FONT_BLACK, 930, 58), CREAM, (0, 0, 0), 3)
    cover_text(d, (540, 884), "Stream. Vote. Celebrate.", font(FONT_BOLD, 38), (246, 206, 125), (0, 0, 0), 2)
    add_cta(d, 540, 974, "FOLLOW PODSCARS", 34)
    base.save(OUT_DIR / "podscars-feed-square-1080.png")


def story_reel():
    size = (1080, 1920)
    base = gradient_background(size, (0.5, 0.35), 1.0)
    add_gold_rays(base, (540, 720), 1020, 28, 22)
    paste_center(base, logo_with_shadow(900, 150), 540, 160)
    paste_center(base, trophy_cut(760, 840), 540, 770)
    d = ImageDraw.Draw(base)
    headline = "PODCASTS DESERVE A RED CARPET"
    cover_text(d, (540, 1348), headline, fit_font(headline, FONT_BLACK, 920, 70), CREAM, (0, 0, 0), 4)
    cover_text(d, (540, 1434), "New voices. Big moments. One stage.", font(FONT_BOLD, 42), (246, 206, 125), (0, 0, 0), 2)
    add_cta(d, 540, 1610, "NOMINATE YOUR FAVORITE", 38)
    cover_text(d, (540, 1764), "@PODSCARS", font(FONT_BOLD, 34), (205, 168, 105), None, 0)
    base.save(OUT_DIR / "podscars-story-reel-1080x1920.png")


def landscape_ad():
    size = (1200, 628)
    base = gradient_background(size, (0.72, 0.43), 1.06)
    add_gold_rays(base, (835, 316), 680, 18, 21)
    paste_center(base, trophy_cut(470, 520), 880, 322)
    paste_center(base, logo_with_shadow(610, 82), 340, 92)
    d = ImageDraw.Draw(base)
    headline = "WHERE PODCASTS TAKE THE STAGE"
    cover_text(d, (78, 235), headline, fit_font(headline, FONT_BLACK, 585, 56), CREAM, (0, 0, 0), 3, anchor="lm")
    cover_text(d, (80, 313), "A social celebration for creators, fans, and standout shows.", font(FONT_BOLD, 31), (246, 206, 125), (0, 0, 0), 1, anchor="lm")
    add_cta(d, 270, 448, "FOLLOW PODSCARS", 30)
    base.save(OUT_DIR / "podscars-landscape-ad-1200x628.png")


def carousel_slide():
    size = (1080, 1350)
    base = gradient_background(size, (0.48, 0.39), 1.0)
    paste_center(base, logo_with_shadow(850, 128), 540, 112)
    trophy = trophy_cut(620, 680)
    paste_center(base, trophy, 540, 510)
    d = ImageDraw.Draw(base)
    cover_text(d, (540, 900), "CREATORS. STORIES. SOUND.", fit_font("CREATORS. STORIES. SOUND.", FONT_BLACK, 900, 62), CREAM, (0, 0, 0), 4)
    cover_text(d, (540, 982), "The spotlight is opening for podcast culture.", font(FONT_BOLD, 38), (246, 206, 125), (0, 0, 0), 2)
    add_cta(d, 540, 1110, "JOIN THE MOVEMENT", 36)
    cover_text(d, (540, 1260), "PODSCARS", font(FONT_BOLD, 28), (189, 145, 74), None, 0)
    base.save(OUT_DIR / "podscars-carousel-1080x1350.png")


def phone_frame(draw, rect, radius=48):
    x1, y1, x2, y2 = rect
    draw.rounded_rectangle((x1 + 14, y1 + 18, x2 + 14, y2 + 18), radius=radius, fill=(0, 0, 0, 90))
    draw.rounded_rectangle(rect, radius=radius, fill=(22, 20, 18), outline=(234, 178, 82), width=5)
    draw.rounded_rectangle((x1 + 32, y1 + 32, x2 - 32, y2 - 32), radius=30, fill=(0, 0, 0))
    draw.rounded_rectangle((x1 + (x2 - x1) * 0.38, y1 + 15, x1 + (x2 - x1) * 0.62, y1 + 31), radius=8, fill=(10, 9, 8))


def presentation_board():
    size = (1600, 1400)
    base = gradient_background(size, (0.44, 0.35), 0.94)
    add_gold_rays(base, (650, 480), 920, 22, 14)
    d = ImageDraw.Draw(base)
    cover_text(d, (86, 98), "PODSCARS SOCIAL AD MOCKUPS", font(FONT_BLACK, 55), CREAM, (0, 0, 0), 3, anchor="lm")
    cover_text(d, (88, 164), "Feed, story/reel, carousel, and landscape placements", font(FONT_BOLD, 31), (246, 206, 125), (0, 0, 0), 1, anchor="lm")

    story = Image.open(OUT_DIR / "podscars-story-reel-1080x1920.png").convert("RGBA")
    square = Image.open(OUT_DIR / "podscars-feed-square-1080.png").convert("RGBA")
    land = Image.open(OUT_DIR / "podscars-landscape-ad-1200x628.png").convert("RGBA")
    carousel = Image.open(OUT_DIR / "podscars-carousel-1080x1350.png").convert("RGBA")

    phone_frame(d, (112, 250, 514, 1038), 58)
    story_preview = resize_contain(story, (338, 712))
    paste_center(base, story_preview, 313, 644)
    cover_text(d, (313, 1094), "Story / Reel", font(FONT_BOLD, 28), (229, 185, 104), None, 0)

    square_preview = resize_contain(square, (450, 450))
    d.rounded_rectangle((590, 268, 1074, 752), radius=26, fill=(0, 0, 0, 118), outline=(171, 124, 55), width=3)
    base.alpha_composite(square_preview, (607, 285))
    cover_text(d, (832, 806), "Feed Square", font(FONT_BOLD, 28), (229, 185, 104), None, 0)

    carousel_preview = resize_contain(carousel, (328, 410))
    d.rounded_rectangle((1135, 294, 1501, 744), radius=26, fill=(0, 0, 0, 118), outline=(171, 124, 55), width=3)
    base.alpha_composite(carousel_preview, (1154, 314))
    cover_text(d, (1318, 806), "Carousel", font(FONT_BOLD, 28), (229, 185, 104), None, 0)

    land_preview = resize_contain(land, (780, 410))
    d.rounded_rectangle((602, 930, 1422, 1368), radius=22, fill=(0, 0, 0, 118), outline=(171, 124, 55), width=3)
    base.alpha_composite(land_preview, (621, 948))
    cover_text(d, (1012, 900), "Landscape Ad", font(FONT_BOLD, 28), (229, 185, 104), None, 0)
    base.save(OUT_DIR / "podscars-social-preview-board.png")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    square_feed()
    story_reel()
    landscape_ad()
    carousel_slide()
    presentation_board()
    print(f"Saved mockups to {OUT_DIR}")
    for path in sorted(OUT_DIR.glob("*.png")):
        print(path)


if __name__ == "__main__":
    main()
