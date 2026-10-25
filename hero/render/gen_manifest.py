#!/usr/bin/env python3
"""Generate hero-manifest.json for the HERMES-TV hero PR tree.

Hashes every text file under the hero/ tree (excluding the manifest
itself, which cannot hash itself) and records the delivered binaries
(poster + videos) under externalBinaries with their SHA-256, since the
connector snapshot path accepts UTF-8 files only and binaries travel
alongside the PR, not inside it.

Usage: gen_manifest.py <hero_dir>   (writes <hero_dir>/hero-manifest.json)
"""
import hashlib
import json
import os
import sys

SKIP_NAMES = {"hero-manifest.json"}
SKIP_DIRS = set()


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    root = sys.argv[1]
    files = {}
    binaries = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in sorted(filenames):
            if name in SKIP_NAMES:
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root)
            if name.endswith((".mp4", ".jpg", ".png", ".webp")):
                binaries[rel] = sha256(full)
            else:
                files[rel] = sha256(full)
    manifest = {
        "artifact": "AGENTROPOLIS HERMES-TV 3D/360 hero",
        "version": "1.0.0",
        "note": "files: exact publication set for the expanded allowlist proposal. "
                "externalBinaries: delivered alongside the PR (connector "
                "snapshot path accepts UTF-8 only) and pinned by SHA-256; "
                "the release vehicle must place them next to index.html.",
        "files": files,
        "externalBinaries": binaries,
    }
    out = os.path.join(root, "hero-manifest.json")
    with open(out, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
        f.write("\n")
    print("manifest:", out)
    print("files:", len(files), "externalBinaries:", len(binaries))


if __name__ == "__main__":
    main()
