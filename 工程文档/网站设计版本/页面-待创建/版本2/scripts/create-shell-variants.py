#!/usr/bin/env python3
"""Create shell-colour studies from the approved EgoClip concept cutout.

Only the pale exterior shell is recoloured. The black glass, camera, status light
and white U-shaped light guide stay unchanged.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


COLORS = {
    "cream": "#f3ede2",
    "navy": "#183b68",
    "coral": "#e87856",
    "sage": "#91aa8d",
    "lilac": "#9d96af",
}


def rgb(value: str) -> np.ndarray:
    value = value.removeprefix("#")
    return np.array([int(value[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()

    source = np.asarray(Image.open(args.source).convert("RGBA"), dtype=np.uint8)
    pixels = source[..., :3].astype(np.float32)
    alpha = source[..., 3]
    height, width = alpha.shape
    yy, xx = np.mgrid[:height, :width]

    maximum = pixels.max(axis=2)
    minimum = pixels.min(axis=2)
    lightness = pixels.mean(axis=2) / 255
    low_saturation = (maximum - minimum) < 72

    # The product cutout has a near-circular front with the physical shell around
    # its perimeter and extending into the right-hand side profile. The bright U
    # guide sits inside this ellipse and is intentionally excluded.
    radius = np.sqrt(((xx - width * 0.50) / (width * 0.34)) ** 2 + ((yy - height * 0.48) / (height * 0.39)) ** 2)
    shell_region = (radius > 0.84) | (xx > width * 0.74) | (yy < height * 0.15)
    shell_mask = (alpha > 8) & (lightness > 0.36) & low_saturation & shell_region

    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, value in COLORS.items():
        target = rgb(value)
        result = source.copy()
        shade = np.clip(lightness * 0.78 + 0.26, 0.34, 1.08)
        tinted = np.clip(target[None, None, :] * shade[..., None], 0, 255)
        # Keep a portion of the source highlight so the moulded surface remains dimensional.
        tinted = tinted * 0.88 + pixels * 0.12
        result[..., :3][shell_mask] = tinted[shell_mask].astype(np.uint8)
        Image.fromarray(result, "RGBA").save(args.output_dir / f"egoclip-shell-{name}.png", optimize=True)

    print(f"Created {len(COLORS)} shell variants in {args.output_dir}")


if __name__ == "__main__":
    main()
