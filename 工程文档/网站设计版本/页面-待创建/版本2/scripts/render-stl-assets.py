#!/usr/bin/env python3
"""Render the supplied EgoClip binary STL parts into lightweight PNG assets.

The renderer is deliberately dependency-light: NumPy projects the triangle mesh and
Pillow performs the final compositing. It is not a CAD renderer, but it preserves
the geometry of the supplied prototypes and produces deterministic web artwork.

Example:
  python3 scripts/render-stl-assets.py \
    --opaque /path/to/opaque.stl \
    --clear /path/to/clear.stl \
    --output-dir public/media/product
"""

from __future__ import annotations

import argparse
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


SHELLS = {
    "navy": "#183b68",
    "cream": "#f4ecdc",
    "coral": "#e9734f",
    "sage": "#91aa8d",
    "lilac": "#9c94ad",
}


def hex_rgb(value: str) -> np.ndarray:
    value = value.lstrip("#")
    return np.array([int(value[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def load_binary_stl(path: Path) -> tuple[np.ndarray, np.ndarray]:
    with path.open("rb") as handle:
        handle.seek(80)
        face_count = struct.unpack("<I", handle.read(4))[0]

    record = np.dtype(
        [("normal", "<f4", (3,)), ("vertices", "<f4", (3, 3)), ("attribute", "<u2")]
    )
    mesh = np.memmap(path, dtype=record, mode="r", offset=84, shape=(face_count,))
    vertices = np.array(mesh["vertices"], dtype=np.float32, copy=True)
    normals = np.array(mesh["normal"], dtype=np.float32, copy=True)

    invalid = np.linalg.norm(normals, axis=1) < 1e-5
    if invalid.any():
        edge_a = vertices[:, 1] - vertices[:, 0]
        edge_b = vertices[:, 2] - vertices[:, 0]
        normals[invalid] = np.cross(edge_a[invalid], edge_b[invalid])
    normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-6)
    return vertices, normals


def rotation_matrix(rx: float, ry: float, rz: float) -> np.ndarray:
    ax, ay, az = np.radians([rx, ry, rz])
    cx, sx = np.cos(ax), np.sin(ax)
    cy, sy = np.cos(ay), np.sin(ay)
    cz, sz = np.cos(az), np.sin(az)
    rot_x = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]], dtype=np.float32)
    rot_y = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], dtype=np.float32)
    rot_z = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]], dtype=np.float32)
    return rot_z @ rot_y @ rot_x


def projected_points(
    vertices: np.ndarray,
    normals: np.ndarray,
    rotation: np.ndarray,
    color: str,
    alpha: int,
    origin: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    transformed = (vertices - origin) @ rotation.T
    transformed_normals = normals @ rotation.T

    # Triangle centroids plus source vertices keep small bevels and openings legible.
    points = np.concatenate([transformed.mean(axis=1), transformed.reshape(-1, 3)], axis=0)
    face_normals = np.concatenate(
        [transformed_normals, np.repeat(transformed_normals, 3, axis=0)], axis=0
    )
    light = np.array([-0.35, -0.5, 0.79], dtype=np.float32)
    light /= np.linalg.norm(light)
    diffuse = np.clip(face_normals @ light, -0.25, 1)
    rim = np.clip(1 - np.abs(face_normals[:, 2]), 0, 1)
    brightness = np.clip(0.58 + diffuse * 0.34 + rim * 0.16, 0.28, 1.2)
    base = hex_rgb(color)
    rgb = np.clip(base[None, :] * brightness[:, None] + 7, 0, 255).astype(np.uint8)
    rgba = np.column_stack([rgb, np.full(len(rgb), alpha, dtype=np.uint8)])
    return points, rgba, transformed_normals


def rasterize(
    layers: list[tuple[np.ndarray, np.ndarray]],
    size: int,
    padding: float = 0.12,
) -> Image.Image:
    combined = np.concatenate([layer[0] for layer in layers], axis=0)
    low = combined[:, :2].min(axis=0)
    high = combined[:, :2].max(axis=0)
    span = np.maximum(high - low, 1e-5)
    scale = (size * (1 - padding * 2)) / span.max()
    center = (low + high) / 2

    rgba_canvas = np.zeros((size * size, 4), dtype=np.uint8)
    depth_canvas = np.full(size * size, -np.inf, dtype=np.float32)

    for points, colors in layers:
        projected = (points[:, :2] - center) * scale
        x = np.rint(projected[:, 0] + size / 2).astype(np.int32)
        y = np.rint(size / 2 - projected[:, 1]).astype(np.int32)
        valid = (x >= 0) & (x < size) & (y >= 0) & (y < size)
        x, y = x[valid], y[valid]
        depth = points[valid, 2]
        colors = colors[valid]
        pixel = y * size + x

        # Keep the nearest projected sample per pixel.
        order = np.lexsort((depth, pixel))
        ordered_pixel = pixel[order]
        last = np.r_[ordered_pixel[1:] != ordered_pixel[:-1], True]
        selected = order[last]
        selected_pixel = pixel[selected]
        nearer = depth[selected] >= depth_canvas[selected_pixel]
        selected, selected_pixel = selected[nearer], selected_pixel[nearer]
        rgba_canvas[selected_pixel] = colors[selected]
        depth_canvas[selected_pixel] = depth[selected]

    image = Image.fromarray(rgba_canvas.reshape(size, size, 4), "RGBA")
    # Dense STL tessellation already supplies most pixels; this closes sub-pixel pinholes.
    image = image.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.SMOOTH)
    return image


def render_view(
    opaque: tuple[np.ndarray, np.ndarray],
    clear: tuple[np.ndarray, np.ndarray],
    color: str,
    rotation: tuple[float, float, float],
    size: int,
) -> Image.Image:
    matrix = rotation_matrix(*rotation)
    all_vertices = np.concatenate([opaque[0].reshape(-1, 3), clear[0].reshape(-1, 3)], axis=0)
    origin = (all_vertices.min(axis=0) + all_vertices.max(axis=0)) / 2
    opaque_points, opaque_color, _ = projected_points(*opaque, matrix, color, 255, origin)
    clear_points, clear_color, _ = projected_points(*clear, matrix, "#bad5df", 232, origin)
    return rasterize([(opaque_points, opaque_color), (clear_points, clear_color)], size=size)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--opaque", type=Path, required=True)
    parser.add_argument("--clear", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--size", type=int, default=1400)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    opaque = load_binary_stl(args.opaque)
    clear = load_binary_stl(args.clear)

    for name, color in SHELLS.items():
        render_view(opaque, clear, color, (18, -16, -13), args.size).save(
            args.output_dir / f"egoclip-{name}.png", optimize=True
        )

    render_view(opaque, clear, SHELLS["navy"], (70, -8, -8), args.size).save(
        args.output_dir / "egoclip-side.png", optimize=True
    )
    print(f"Rendered {len(SHELLS) + 1} STL-derived assets to {args.output_dir}")


if __name__ == "__main__":
    main()
