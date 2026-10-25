#!/bin/sh
# HERMES-TV hero video encodes. Deterministic inputs (JPEG frame sequences
# captured from the same scene at fixed t); no audio by design.
# Loop: 480 frames, 24 fps, 1280x720, libx264, yuv420p.
# 360: 480 frames, 24 fps, 2048x1024, libx264, yuv420p, moov AFTER mdat
# (no +faststart) so inject_spherical.py can insert the uuid box without
# moving mdat or invalidating chunk offsets.
set -e
cd "$(dirname "$0")/../.."
ffmpeg -y -v error -framerate 24 -i frames-loop/frame-%04d.jpg \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -r 24 \
  -an hero/hero-loop.mp4
ffmpeg -y -v error -framerate 24 -i frames-360/frame-%04d.jpg \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -r 24 \
  -an hero/hero-360-raw.mp4
python3 hero/render/inject_spherical.py hero/hero-360-raw.mp4 hero/hero-360.mp4
rm hero/hero-360-raw.mp4
ffprobe -v error -show_entries stream=width,height,codec_name,r_frame_rate \
  -show_entries format=duration -of default=nw=1 hero/hero-loop.mp4
ffprobe -v error -show_entries stream=width,height,codec_name,r_frame_rate \
  -show_entries format=duration -of default=nw=1 hero/hero-360.mp4
ls -la hero/hero-loop.mp4 hero/hero-360.mp4
