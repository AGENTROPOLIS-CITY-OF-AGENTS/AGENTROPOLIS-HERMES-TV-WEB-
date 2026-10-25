# HERMES-TV 3D/360 hero: VERITY execution receipt v1.0.0

Author: VERITY (implementer). VERITY authored this build and therefore does
NOT certify it as independently reviewed. Independent review by GROKBOT or
AXIOM is a merge gate. This receipt is evidence for that reviewer, not a
verdict.

## Per-output status

| Output | Status | Evidence |
| --- | --- | --- |
| Interactive HTML hero (hero/index.html) | IMPLEMENTED, TESTED | verify_interactive.mjs page mode: ALL PASS (14 checks). Poster mode: ALL PASS. |
| Hero loop video, 20 s (hero-loop.mp4) | IMPLEMENTED, TESTED | 1280x720, 24 fps, 20.000 s, h264 yuv420p, no audio. Loop seam: t=0 vs t=20 mean abs channel diff 0.18/255 (JPEG re-encode noise). |
| Spherical video, 20 s draft (hero-360.mp4) | IMPLEMENTED, TESTED | 2048x1024 (2:1), 24 fps, 20.000 s, h264 yuv420p, no audio. Google spherical uuid box injected as first moov child (541 bytes), equirectangular mono. 4096x2048 master is future work, NOT RUN. |
| Spherical viewer (hero/360.html + viewer.js) | IMPLEMENTED, TESTED | Raw WebGL, no library. Viewer verify: ALL PASS (WebGL context, arrow-key look changes the view, no console errors, no net fails). |
| Optimized poster (poster.jpg) | IMPLEMENTED, TESTED | Loop frame 0 exactly (t=0, yaw 0.55, pitch 0.32, dist 13.5). 63,038 bytes. |
| Reduced-motion fallback | IMPLEMENTED, TESTED | Poster by default under reduced motion; time frozen at t=0 in poster mode (verified). Visible pause control; offscreen suspension via IntersectionObserver (code present, suspension timing not separately measured). |
| Scene source + reproducible render commands | IMPLEMENTED, TESTED | hero/scene.json + timing.json + engine.js + render/capture_frames.mjs + render/encode.sh. All 480 + 480 frames captured from the same deterministic timeline. |
| MATCH receipt | IMPLEMENTED (gap receipt) | hero/MATCH-RECEIPT.md: environments/models/materials/footage NO_EXISTING_MATCH; motion PARTIAL (protocol shape only, via the CREATOR-CORE canary render-plan); layout/copy MATCH from WEB main. Gaps G1 (MATCH contracts unlocatable), G2 (panorama missing), G3 (no approved device models). |
| Asset/license manifest + SHA-256 | IMPLEMENTED, TESTED | hero/hero-manifest.json (files + externalBinaries). tests/check_artifact.py enforces exact membership. All geometry is original procedural code; no models, textures, fonts, or remote media. No paid generation. |
| Browser / performance / accessibility | TESTED (local only) | See below. No hardware claims. |
| Publishing boundary | PROPOSED, NOT AUTHORIZED | reference/spec.md section 9: expanded allowlist = exactly hero-manifest.json files. No workflow file. No existing file modified. Deployment BLOCKED. |
| Stacked draft PR | PENDING (this receipt precedes the push) | Branch feat/hermes-tv-hero-3d, base main, draft only. Binaries travel alongside (connector snapshot path is UTF-8 only) and are hash-pinned in the manifest. |

## Payload and hashes (SHA-256)

- poster.jpg: 63,038 bytes, 6f7d13ec82d4f136f1ea23d82226d72a8b3308561beaaf23a133fe41bf7b4bbd
- hero-loop.mp4: 4,508,138 bytes, a1ccae748449aca863bf464bcd09ca8839c869fc0048f6967b29289413300194
- hero-360.mp4: 1,047,442 bytes, c103da89c80d3a73e8c342e63ebc3bd159d863bc742b202351d23d1c42174b49
- PR text tree: 17 files (index.html, 360.html, viewer.js, hero.css, engine.js, hero.js, scene.json, timing.json, MATCH-RECEIPT.md, reference/spec.md, story/story.md, render/capture_frames.mjs, render/encode.sh, render/gen_manifest.py, render/inject_spherical.py, render/verify_interactive.mjs, tests/check_artifact.py) plus hero-manifest.json and this receipt. Text bytes 106,674 before receipt + manifest.
- Scene: 5 devices (tv, desktop, tablet, phone, smarthome hub), console, bridge arch, platform radius 9 with rings, 26 skyline towers, 220 stars, 9 hotspots. Palette is the locked motion brand (#080B10 / #00E5FF / #FF2638); page chrome mirrors the WEB sheet tokens for integration fidelity (difference documented in the spec).

## Verification evidence (local)

Test environment, stated honestly: headless Chromium in the Linux sandbox,
software rasterizer (SwiftShader). Measured interactive frame rate ~14-20 fps
at device pixel ratio 1.5 is a sandbox artifact, not a device claim. Adaptive
quality exists (sustained frame time over 26 ms for 2 s drops pixel ratio to
1.0 and quality to 0); its trigger was not separately exercised under load.
Real-browser Three.js check does not apply: the renderer is zero-dependency
canvas 2D, not WebGL (the 360 viewer page itself is raw WebGL and was verified).

- Four views (t=2.0, pitch 0.32, dist 13.5): front (yaw 0.55), rear (3.69),
  left (2.12), right (5.26). Front, rear, left read visually with real
  occlusion (rear shows console back, desktop screen facing center, TV body
  with cyan trim, hub). Right view captured, same pattern. Engine
  projectPoint at yaw 3.69 confirmed receipt card over TV top (916,267) and
  desktop screen center at (324,332), matching the render.
- Loop seam: frame at t=20 vs frame 0, mean abs channel diff 0.18.
- Spherical seam: edge-column mean diff 0.46/255. 13 of 1024 rows exceed 50;
  those rows are identical in renders before and after the pole fix and are
  stars and tower features near the seam (different objects on each side),
  not a tear. The column test cannot prove continuity for point features;
  the viewer wrap check (arrow-key look across the seam) is the operative
  seam evidence and it passes.
- Poles: zenith row uniform (mean 16, std 0.0, dark sky, no smear). Nadir
  cap verified numerically: console body color (22,32,44) at all sampled
  longitudes in the cap zone, platform color (16,24,35) unchanged at the
  front-wedge control point that is not console.
- Keyboard/touch/pause/reset/reduced-motion: page verify ALL PASS (arrow
  keys change pixels, pause freezes time, reset, exit to poster, poster
  mode freezes time). Touch drag/pinch code paths exist (pointer events +
  wheel zoom in explore mode only); touch itself was not exercised on a
  touch device. NOT VERIFIED on mobile hardware.
- WebGL-unavailable fallback: 360.html shows the fallback note when no
  WebGL context; the hero page degrades to poster when video assets are
  absent (tested: the two missing binaries were the only net fails before
  assets existed). Context-loss handling is not separately tested.
- Network: no remote references in runtime files (artifact check enforces
  it); page CSP is default-src 'self', script-src 'self', style-src 'self',
  img-src 'self' data:, media-src 'self', connect-src 'self', object-src
  'none', base-uri 'self', form-action 'none'. One benign net fail remains
  in capture runs: /favicon.ico 404 (no favicon link on the page; the live
  WEB site behaves the same). Not a defect.
- Served-artifact test (local http server over the allowlist tree): all
  hero files 200; docs/HERMES_HANDOFF.md, .git/config, .env,
  credentials.json, root index.html and styles.css all 404.
- Renderer facts, not claims: zero-dependency canvas 2D painter's
  algorithm (real geometry, depth-sorted, backface-culled, per-face
  shading). NOT WebGL, NOT photoreal (no shadow mapping; floor sheen is a
  radial glow plus device glow ellipses, a stylized treatment). The 360
  viewer page is raw WebGL sampling the equirect video.

## Bugs found and fixed during this build (all VERITY's, all caught by testing)

1. CSP connect-src 'none' blocked the page's own same-origin fetch of
   scene.json. Fixed to 'self'.
2. Equirect band-fill code referenced the camera before it was defined.
   Fixed by ordering.
3. Seam math rewritten: whole-polygon shifting streaked and was wrong for
   wide faces near the camera. Final: per-edge 3D bisection splitting into
   separate polygons, plus pole caps for horizontal faces containing the
   camera's vertical axis (console top, pedestal top), with subdivided rims.
4. Tablet trim rendered as a bright slab from above. Fixed with the
   flat-slab front-edge bar rule.
5. Receipt card normal pointed away from the camera (culled in equirect).
   Fixed to face the camera.
6. Scanline tilt math applied tilt after yaw. Fixed with local-space tilt.
7. Viewer canvas stayed hidden: the shared sheet hides stage canvases
   until activation, and the viewer page never activated it. Fixed with an
   explicit display once WebGL is confirmed.
8. Viewer script was inline and therefore blocked by the page's own
   script-src 'self' CSP, so the viewer never ran at all in early tests.
   Fixed by extracting it to viewer.js (CSP unchanged, no unsafe-inline).
9. Viewer verify clipped the viewport top, which holds only static text,
   and the canvas sits below the intro block. Fixed by scrolling the
   canvas into view and clipping to its box.

## Honesty labels (carried into the PR body and the page)

- The attached panorama did NOT arrive with the directive. Composition
  follows the written description; rear and unseen views are artistic
  extensions, not recovered details.
- No device is shown as connected or supported. Status on the page:
  INTERACTIVE DESIGN CONCEPT, NOT A LIVE DEVICE SESSION.
- The task sequence is illustrative. No fabricated telemetry, live task
  counts, execution receipts, or agent status.
- The hero is a full page under hero/, not the landing page. Wiring it as
  the default landing hero is a separate NEURO-gated step.
- 360 video is a 2048x1024 DRAFT. The 4096x2048 master is future work.
- The loop video and poster are renders of the procedural scene, not
  footage of a live device session.

## Remaining blockers and review requirements

1. Independent review by GROKBOT or AXIOM (VERITY authored this build).
2. NEURO picks the P0 vehicle (WEB PR #2 vs #3) and authorizes the
   expanded allowlist plus a manual dispatch SHA. Merging this PR alone
   under the current whole-root workflow would publish it alongside
   internal docs and must not happen.
3. Merge and deploy are NOT authorized by this PR.
4. MATCH gaps G1-G3 stay open until re-run against located MATCH contracts.
5. Mobile hardware, touch devices, and real-browser playback of the
   viewer video are NOT VERIFIED (headless background-tab policy pauses
   video there; muted autoplay in a real browser is standard behavior,
   not a verified fact here).
6. The 4096x2048 spherical master, the landing-page wiring, and any
   web-UI binary upload are separate future steps, none authorized here.
