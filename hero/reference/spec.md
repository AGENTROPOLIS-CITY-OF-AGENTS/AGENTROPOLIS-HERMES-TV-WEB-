# HERMES-TV 3D / 360° hero: specification (reference/spec.md)

Status: DRAFT implementation for review. Nothing here is merged, deployed,
or independently reviewed. VERITY authored this build and cannot certify it.

## 1. What this is

A procedural, real-time 3D hero for the AGENTROPOLIS HERMES-TV website:
a central retro-futuristic console on a circular platform, connected by
animated light paths to five device roles (television, desktop, tablet,
phone, smart home hub), plus a secure-bridge arch, architectural rings, a
procedural skyline, and stars. The same scene drives three outputs: the
interactive page, a 20 s hero loop video, and a 20 s spherical video.

## 2. Baselines actually inspected (not assumed)

- WEB repo `AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-HERMES-TV-WEB-`,
  main `06aa7c3d`, live landing page (`index.html` + `styles.css`) read
  2026-10-24. Page chrome tokens (bg `#07090d`, cyan `#00e8ff`,
  red `#ff304e`) are mirrored in `hero.css` so the hero page integrates
  with the existing layout. The 3D scene uses the locked motion brand
  (`#080B10` / `#00E5FF` / `#FF2638`) from `scene.json`; the one-digit
  differences between the two sheets are recorded, not hidden.
- WEB PR #2 `fix/website-only-pages-boundary` @ `4c870146` (draft) and
  PR #3 `feat/brandboard-3d-tv-pages-safe` @ `9afdce05` (draft), both
  still open and unmerged as of 2026-10-24. PR #3's CSS hero was NOT
  reused: it is a separate design decision with its own brand questions,
  and reusing it here would conflate it with release authorization.
- CREATOR-CORE PR #65 `feat/motion-pipeline-canary-20261019` @ `fc486fb3`
  (draft, TEST_ONLY): `templates/motion/intelligence-grid-20s/render-plan.json`
  (schema `agentropolis.motion.canary.v1`, 20 s, 1280x720, 24 fps,
  480 frames, locked brand palette, all permissions false, publish false)
  and its template `index.html` (3D-styled HTML, not a 3D engine).
  The canary's own source pins record HyperFrames as NOT_INSTALLED, GSAP
  as INSTRUCTIONS_ONLY, and Blender as DISABLED. This hero reuses the
  canary's render-plan shape (duration, frame size, frame rate, gates)
  and extends it with a real geometry engine; it does not claim
  HyperFrames, GSAP, or Blender are installed or running.
- The named MATCH contracts (`docs/film/STORY-ASSET-MATCHING-ENGINE.md`,
  `docs/film/MATCHING-SCORE-SPEC.md`, `data/story/scene-requirements.schema.json`,
  `data/story/match-output.schema.json`) were NOT FOUND: no `docs/film/`
  in CREATOR-CORE main, no `data/` in CREATOR-CORE main, and org code
  search returns zero relevant hits for the engine name. See
  MATCH-RECEIPT.md. The hero therefore uses original procedural geometry
  (authorized as the separate local prototype step) and no third-party
  asset is claimed as matched.
- The reference panorama named in the directive did not arrive with it.
  Uploads and the media library were searched (latest upload 2026-10-23,
  a CIPHER HUNT screenshot, not a panorama). The composition follows the
  directive's written description. Rear views and unseen surroundings are
  artistic extensions, not recovered details. This is stated on the page
  itself, not only here.
- HERMES-TV Phase 4 HTML Video Protocol Audit (2026-10-17, local review
  file): the reusable baseline is the DESIGN-SYSTEM film folder protocol
  (`reference/spec.md`, `data/data.json`, `story/story.md`,
  `motion/Scene.tsx`, `direct/timing.ts`, `ship/SHIP.md`), poster-first,
  intent-gated, reduced-motion path, zero-console-error evidence. This
  hero mirrors that shape in vanilla JS (`reference/`, `data` via
  `scene.json`, `story/`, `motion/` via `engine.js`, `direct/` via
  `timing.json`, `ship/` receipt).

## 3. Architecture (separation, per the BUILD DISCIPLINE)

- CONTENT: `scene.json` (all geometry parameters, hotspot copy, palette).
- 3D ASSETS: procedural builders inside `engine.js` (no model files, no
  textures, no external media). All geometry is original; no rights
  encumbrance, no license to track beyond MIT three.js, which is NOT
  used (see section 4).
- INTERACTION LOGIC: `hero.js` (controls, hotspots, task override).
- ANIMATION TIMELINE: `timing.json` (20 s loop, camera path, task cycle).
- CAMERA SYSTEM: orbit state in `hero.js` (yaw, pitch, distance, bounds).
- DESIGN TOKENS: `scene.json` palette + `hero.css` WEB sheet tokens.
- TELEMETRY: none collected. The page exposes `window.__heroPerf`
  (fps, pixel ratio, quality) for review only; nothing is sent anywhere
  (`connect-src 'self'`, no beacons, no analytics).

## 4. Renderer: why canvas 2D, and what it is not

The engine is a zero-dependency canvas 2D painter's-algorithm renderer:
boxes, cylinders, discs, rings, bezier paths, screens, points, and a
billboard receipt card, depth-sorted far to near, with backface culling
and per-face directional shading. It is real geometry (positions, depth,
occlusion, changing perspective), not a CSS tilt, not a Ken Burns pan,
and not a stretched image. It is NOT WebGL and NOT photoreal: there is
no ray tracing, no shadow mapping, and no real reflection (floor sheen
is a radial glow plus device glow ellipses, labeled as a stylized
treatment). A WebGL renderer can replace the painter without changing
scene data, because geometry and projection are separate.

WebGL capture note: the canary renderer has no WebGL capture path
(HyperFrames NOT_INSTALLED). The smallest compatible local extension
built here is exact canvas-backing capture (`toDataURL` per frame via
CDP), which is resolution-exact and deterministic. The 360 viewer page
uses raw WebGL (no library) to sample the equirectangular video.

## 5. Deterministic time

`render()` is a pure function of (scene data, time t, camera). No
`Date.now`, no `Math.random` at render time; variation comes from a
seeded hash of integer ids. Every animated value has a period dividing
20 s (rings 20 s, path pulses 4 s, task cycle 4 s, twinkle 20/k s),
so t = 20 reproduces t = 0 exactly and the loop is seamless. The
interactive page accumulates time from animation frames (paused time
does not advance; hidden tabs stop accumulation), and capture with
`?t=` reproduces exact frames. Interactive "Send illustrative task"
uses an override measured from accumulated time, so it never disturbs
the timeline's periodicity.

## 6. Cameras

- Interactive: orbit around target (0, 1.2, 0); yaw free 0-360;
  pitch bounded [-0.15, 1.05] rad; distance bounded [6, 26]. Bounds
  prevent going under the floor or inside geometry.
- Hero loop video: yaw = 0.55 + 0.24*sin(2*PI*t/20), pitch =
  0.32 + 0.03*sin(2*PI*2*t/20), dist = 13.5 + 0.4*sin(2*PI*t/20).
  Subtle, periodic, seamless.
- Poster: t = 0 of the loop path (yaw 0.55, pitch 0.32, dist 13.5),
  which is exactly loop frame 0.
- 360 video: camera at (0, 3.6, 0), above the console (top 2.4), so no
  geometry contains the camera. Equirectangular projection:
  u = (atan2(x, z)/PI + 1)/2 * W, v = (0.5 - asin(y/r)/PI) * H.
  Ground discs centered under the camera are filled as exact
  full-width bands (a fan polygon would collapse at the pole).
  Seam-crossing faces are shifted contiguous and drawn twice (offset
  0 and -W); seam-crossing segments are split at the exact crossing
  longitude. Edges are straight segments between projected vertices
  (curves are approximated; rings and paths are finely subdivided).

## 7. Copy and honesty labels (all in HTML, never baked)

- Headline: YOUR DEVICES. / YOUR AGENTS. / YOUR RULES.
- Supporting line: LOCAL FIRST / HUMAN CONTROLLED / OPEN DEVELOPMENT.
- Status: INTERACTIVE DESIGN CONCEPT, NOT A LIVE DEVICE SESSION.
- Device roles are labeled "(concept)". No platform is shown as
  tested, connected, or supported. The task sequence is labeled
  illustrative on the page, in the chip, and in the hotspot panel.
- No fabricated telemetry, live task counts, execution receipts, or
  agent status. The receipt indicator is a wordless card with a
  checkmark drawn in-scene; its meaning is given only by HTML text.

## 8. Accessibility and performance contract

- Poster first; the heavy scene starts only on Explore 360. Reduced
  motion shows the poster by default; exploring under reduced motion
  freezes time (camera still user-drivable).
- Controls labeled exactly: Explore 360, Pause motion, Reset view,
  plus Exit explore mode and Send illustrative task.
- Keyboard: arrows orbit, +/- zoom, R reset, P pause, Esc exits.
  Hotspots are real buttons; the full device descriptions also exist
  as plain HTML below the stage, so no content requires the canvas.
- Touch: single-drag orbit, two-finger pinch zoom; wheel zoom only
  inside explore mode (the page never traps scroll: wheel over the
  poster scrolls the page).
- Suspension: IntersectionObserver stops accumulation offscreen;
  hidden tabs stop the frame loop.
- Adaptive quality: sustained frame time above 26 ms for 2 s drops
  pixel ratio to 1.0 and detail to low; the values are exposed in
  `window.__heroPerf` for review.
- Fallbacks: canvas 2D context failure shows the poster plus a
  diagnostic; missing video falls back to the poster; WebGL failure
  on the 360 page shows a fallback note. `?forcePoster=1` forces the
  poster path for testing.
- No remote requests at runtime: same-origin scripts, styles, images,
  and video only; system fonts only. CSP meta is in both pages
  (default 'self', script/style 'self', img 'self' data:, media
  'self', connect 'self' for the same-origin scene JSON, object
  'none', base 'self', form-action 'none').

## 9. Publishing boundary (proposal, not a change to the live site)

This PR adds NO workflow file and changes NO existing file. It does
NOT restore whole-repository publication or automatic deployment. The
future release vehicle is proposed as: the PR #2 shape (manual dispatch
from main with an approved-SHA gate, fail-closed on head move) with its
two-file allowlist EXPANDED to exactly the manifest in
`hero-manifest.json` (runtime files + docs + tests; binaries listed
separately as hash-pinned external files). `tests/check_artifact.py`
enforces exact file-set membership, rejects symlinks, rejects
credentials patterns, rejects remote references in runtime files, and
verifies SHA-256 of every in-PR file. Restricted paths (docs/, README,
.git/, workflows) must 404 from the served artifact; that is tested
locally in the receipt. Merging this PR must not by itself publish
anything: the current live workflow publishes the whole repo root on
push to main, so a merge without the PR #2 vehicle would publish the
hero alongside internal docs. Deployment stays BLOCKED until NEURO
picks the P0 vehicle (PR #2 vs #3), authorizes the expanded allowlist,
and dispatches an approved SHA.

## 10. What is NOT claimed

- No independent review (VERITY authored this; GROKBOT/AXIOM review
  is a merge gate).
- No production readiness (merge and deploy are NOT authorized).
- No real-device behavior, no pairing, no control, no network scan.
- No hardware compatibility beyond the test environment actually used
  (headless Chromium in the Linux sandbox; see ship/RECEIPT.md).
- No photogrammetry, no recovered panorama, no accurate reconstruction.
- The 360 video is a 2048x1024 DRAFT (the directive allows a draft for
  initial qualification; 4096x2048 is the target when resources permit).
