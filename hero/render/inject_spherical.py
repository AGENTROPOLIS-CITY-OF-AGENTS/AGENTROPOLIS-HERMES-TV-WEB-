#!/usr/bin/env python3
"""Inject Google spherical (360) metadata into an MP4.

The metadata is a `uuid` box carrying the spherical XML, inserted as a
child of `moov`. This script requires the input to have `moov` AFTER
`mdat` (ffmpeg default without +faststart): inserting into a trailing
moov does not move `mdat`, so no chunk-offset (stco) fixup is needed.
If `moov` comes first, the script refuses rather than corrupt offsets.

Usage: inject_spherical.py <in.mp4> <out.mp4>
Verifies afterwards by re-parsing: uuid box present inside moov, moov
size consistent, and ffprobe still reads the duration.
"""
import struct
import subprocess
import sys

SPHERICAL_UUID = bytes.fromhex("ffcc8263f8554a938814587a02521fdd")
XML = b"""<?xml version="1.0"?>
<rdf:SphericalVideo xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <GSpherical:Spherical>true</GSpherical:Spherical>
  <GSpherical:Stitched>true</GSpherical:Stitched>
  <GSpherical:StitchingSoftware>AGENTROPOLIS hero engine equirectangular projector</GSpherical:StitchingSoftware>
  <GSpherical:ProjectionType>equirectangular</GSpherical:ProjectionType>
  <GSpherical:StereoMode>mono</GSpherical:StereoMode>
  <GSpherical:SourceCount>1</GSpherical:SourceCount>
</rdf:SphericalVideo>
"""


def parse_boxes(buf, start, end):
    boxes = []
    off = start
    while off + 8 <= end:
        size, typ = struct.unpack(">I4s", buf[off:off + 8])
        if size == 1:
            size = struct.unpack(">Q", buf[off + 8:off + 16])[0]
            hdr = 16
        elif size == 0:
            size = end - off
            hdr = 8
        else:
            hdr = 8
        boxes.append((off, size, typ, hdr))
        off += size
    return boxes


def main():
    src, dst = sys.argv[1], sys.argv[2]
    buf = bytearray(open(src, "rb").read())
    top = parse_boxes(buf, 0, len(buf))
    moov = [b for b in top if b[2] == b"moov"]
    mdat = [b for b in top if b[2] == b"mdat"]
    assert len(moov) == 1, "expected exactly one moov box"
    assert len(mdat) == 1, "expected exactly one mdat box"
    moov_off, moov_size = moov[0][0], moov[0][1]
    assert mdat[0][0] < moov_off, "moov must come after mdat (no +faststart)"
    uuid_payload = SPHERICAL_UUID + XML
    uuid_box = struct.pack(">I4s", 8 + len(uuid_payload), b"uuid") + uuid_payload
    # Insert as the first child of moov, right after the moov header.
    insert_at = moov_off + 8
    new_buf = buf[:insert_at] + uuid_box + buf[insert_at:]
    # Grow the moov size field by the inserted box length.
    struct.pack_into(">I", new_buf, moov_off, moov_size + len(uuid_box))
    open(dst, "wb").write(new_buf)
    # Verify by re-parsing.
    check = open(dst, "rb").read()
    top2 = parse_boxes(check, 0, len(check))
    moov2 = [b for b in top2 if b[2] == b"moov"][0]
    kids = parse_boxes(check, moov2[0] + 8, moov2[0] + moov2[1])
    kinds = [k[2] for k in kids]
    assert b"uuid" in kinds, "uuid box missing after injection"
    uuid_kid = [k for k in kids if k[2] == b"uuid"][0]
    assert check[uuid_kid[0] + 8:uuid_kid[0] + 24] == SPHERICAL_UUID
    assert b"equirectangular" in check
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", dst], capture_output=True, text=True)
    print("injected spherical uuid box:", len(uuid_box), "bytes;",
          "moov children:", [k.decode() for k in kinds][:8])
    print("ffprobe duration:", probe.stdout.strip())
    assert probe.returncode == 0 and probe.stdout.strip(), "ffprobe failed"


if __name__ == "__main__":
    main()
