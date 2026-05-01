#!/usr/bin/env python3
"""Generate a simple stick-figure walking animation video using Python."""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter


def figure_pose(frame: int, total_frames: int) -> dict[str, tuple[tuple[float, float], tuple[float, float]]]:
    """Return line segments representing a stick figure for a frame."""
    t = 2 * math.pi * (frame / total_frames)

    # Anchor points.
    hip = (0.0, 0.0)
    shoulder = (0.0, 1.0)
    neck = (0.0, 1.3)

    # Swing limbs opposite each other for a walk cycle.
    leg_front = 0.8 * math.sin(t)
    leg_back = -0.8 * math.sin(t)
    arm_front = -0.7 * math.sin(t)
    arm_back = 0.7 * math.sin(t)

    # Limb endpoints.
    right_hand = (0.6 * math.sin(arm_front), 0.75 + 0.25 * math.cos(arm_front))
    left_hand = (0.6 * math.sin(arm_back), 0.75 + 0.25 * math.cos(arm_back))
    right_foot = (0.6 * math.sin(leg_front), -0.9 + 0.3 * math.cos(leg_front))
    left_foot = (0.6 * math.sin(leg_back), -0.9 + 0.3 * math.cos(leg_back))

    return {
        "body": (hip, shoulder),
        "neck": (shoulder, neck),
        "right_arm": (shoulder, right_hand),
        "left_arm": (shoulder, left_hand),
        "right_leg": (hip, right_foot),
        "left_leg": (hip, left_foot),
    }


def build_animation(frames: int, fps: int, out_file: Path) -> None:
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-1.6, 1.6)
    ax.set_ylim(-1.4, 2.0)
    ax.set_aspect("equal")
    ax.axis("off")

    # Ground line.
    ax.plot([-2, 2], [-1.15, -1.15], color="slategray", linewidth=2)

    # Line objects for each body segment.
    lines = {name: ax.plot([], [], color="black", linewidth=3)[0] for name in [
        "body",
        "neck",
        "right_arm",
        "left_arm",
        "right_leg",
        "left_leg",
    ]}

    # Head as a marker.
    (head,) = ax.plot([], [], "o", color="black", markersize=14)

    def update(frame: int):
        pose = figure_pose(frame, frames)

        # Horizontal drift for forward movement.
        x_shift = -1.0 + 2.0 * (frame / max(frames - 1, 1))

        for name, ((x1, y1), (x2, y2)) in pose.items():
            lines[name].set_data([x1 + x_shift, x2 + x_shift], [y1, y2])

        _, neck = pose["neck"]
        head.set_data([neck[0] + x_shift], [neck[1] + 0.25])

        return (*lines.values(), head)

    animation = FuncAnimation(fig, update, frames=frames, interval=1000 / fps, blit=True)

    out_file.parent.mkdir(parents=True, exist_ok=True)

    if out_file.suffix.lower() == ".gif":
        animation.save(out_file, writer=PillowWriter(fps=fps))
    else:
        # For .mp4 or any non-gif extension, matplotlib requires ffmpeg installed.
        animation.save(out_file, fps=fps)

    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a stick figure animation.")
    parser.add_argument("--frames", type=int, default=90, help="Number of animation frames.")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("output/stickfigure.gif"),
        help="Output file path (use .gif for no ffmpeg dependency).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.frames <= 0:
        raise ValueError("--frames must be a positive integer")
    if args.fps <= 0:
        raise ValueError("--fps must be a positive integer")

    build_animation(args.frames, args.fps, args.output)
    print(f"Saved animation to: {args.output}")


if __name__ == "__main__":
    main()
