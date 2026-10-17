from pathlib import Path
import shutil

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src"
SOURCE_ASSETS = SOURCE / "assets"
DIST = ROOT / "dist"
DIST_ASSETS = DIST / "assets"


def open_image(filename: str) -> Image.Image:
    with Image.open(SOURCE_ASSETS / filename) as image:
        return ImageOps.exif_transpose(image).convert("RGB")


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    width = min(width, image.width)
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def crop_to_size(
    image: Image.Image,
    size: tuple[int, int],
    centering: tuple[float, float],
) -> Image.Image:
    return ImageOps.fit(
        image,
        size,
        method=Image.Resampling.LANCZOS,
        centering=centering,
    )


def save_webp(image: Image.Image, filename: str) -> None:
    image.save(
        DIST_ASSETS / filename,
        "WEBP",
        quality=80,
        method=6,
    )


def build() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST_ASSETS.mkdir(parents=True)

    for filename in ("index.html", "regalos.html", "styles.css", "script.js", "regalos.js"):
        shutil.copy2(SOURCE / filename, DIST / filename)
    (DIST / ".nojekyll").touch()

    hero = open_image("portada-desenfoque.jpg")
    save_webp(resize_to_width(hero, 2000), "portada-2000.webp")
    save_webp(crop_to_size(hero, (900, 1600), (0.5, 0.42)), "portada-900.webp")

    rsvp = open_image("pareja-1.jpg")
    save_webp(crop_to_size(rsvp, (1800, 2400), (0.5, 0.58)), "pareja-2000.webp")
    save_webp(crop_to_size(rsvp, (900, 1125), (0.5, 0.58)), "pareja-900.webp")

    for filename in (
        "nuevo-viaje-1.jpg",
        "nuevo-viaje-2.jpg",
        "nuevo-viaje-3.jpg",
    ):
        image = open_image(filename)
        output_name = f"{Path(filename).stem}.webp"
        save_webp(resize_to_width(image, 1000), output_name)

    source_bytes = sum(path.stat().st_size for path in SOURCE_ASSETS.iterdir())
    output_bytes = sum(path.stat().st_size for path in DIST_ASSETS.iterdir())
    reduction = 1 - output_bytes / source_bytes
    print(
        f"Built {DIST} — images: "
        f"{source_bytes / 1024 / 1024:.2f} MB -> "
        f"{output_bytes / 1024 / 1024:.2f} MB "
        f"({reduction:.0%} smaller)"
    )


if __name__ == "__main__":
    build()
