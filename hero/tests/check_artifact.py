#!/usr/bin/env python3
"""Artifact membership test for the HERMES-TV hero publication set.

Enforces the expanded allowlist proposal (see reference/spec.md section 9):
the served artifact must contain EXACTLY the files in hero-manifest.json
`files`, no symlinks, no credentials patterns, no remote references in
runtime files, and SHA-256 must match for every in-PR file. Binaries
listed under `externalBinaries` must NOT be present in the PR tree: they
are delivered alongside the PR and pinned by hash in the manifest, because
the connector snapshot path accepts UTF-8 files only.

Usage: check_artifact.py <artifact_dir> <manifest.json>
Exit 0 only when every check passes.
"""
import hashlib
import json
import os
import re
import sys

SECRET_RE = re.compile(
    r"(api[_-]?key|access[_-]?token|secret|password|bearer)\s*[:=]\s*\S+",
    re.IGNORECASE)
REMOTE_RE = re.compile(r"https?://|//cdn\.|//fonts\.|src\s*=\s*\"http")
RUNTIME_EXT = (".html", ".css", ".js")


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    root, manifest_path = sys.argv[1], sys.argv[2]
    manifest = json.load(open(manifest_path))
    expected = set(manifest["files"].keys())
    # The manifest itself is always part of the artifact but cannot list
    # its own hash; it is expected implicitly.
    expected.add(os.path.basename(manifest_path))
    failures = []

    found = set()
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root)
            found.add(rel)
            if os.path.islink(full):
                failures.append("symlink: " + rel)
            if os.path.getsize(full) == 0:
                failures.append("empty file: " + rel)
    for banned in (".git", ".env", "credentials.json"):
        if any(part == banned for part in found) or os.path.exists(os.path.join(root, banned)):
            failures.append("banned path present: " + banned)

    missing = expected - found
    extra = found - expected
    if missing:
        failures.append("missing from artifact: " + ", ".join(sorted(missing)))
    if extra:
        failures.append("unexpected files in artifact: " + ", ".join(sorted(extra)))

    for rel, want in manifest["files"].items():
        full = os.path.join(root, rel)
        if not os.path.isfile(full):
            continue
        got = sha256(full)
        if got != want:
            failures.append("sha mismatch: %s (want %s, got %s)" % (rel, want[:12], got[:12]))
        if rel.endswith(RUNTIME_EXT):
            text = open(full, "r", encoding="utf-8", errors="strict").read()
            if REMOTE_RE.search(text):
                failures.append("remote reference in runtime file: " + rel)
            if SECRET_RE.search(text):
                failures.append("credentials pattern in runtime file: " + rel)

    for rel in manifest.get("externalBinaries", {}):
        if os.path.exists(os.path.join(root, rel)):
            failures.append("binary must not be in the PR tree: " + rel)

    if failures:
        print("ARTIFACT CHECK: FAIL")
        for f in failures:
            print(" -", f)
        return 1
    print("ARTIFACT CHECK: PASS (%d files, hashes match, no symlinks, "
          "no remote runtime refs, no credentials patterns)" % len(expected))
    return 0


if __name__ == "__main__":
    sys.exit(main())
