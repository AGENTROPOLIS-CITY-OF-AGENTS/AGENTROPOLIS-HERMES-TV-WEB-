# HERMES TV — HTML VIDEO PROTOCOL AUDIT

Reviewer: VERITY (independent). Owner: NEURO. Builder/PM: HERMES. Date: 2026-10-17.
Scope: whether the established AGENTROPOLIS HTML Video Explainer Protocol exists as a verified baseline, whether the six HERMES TV modules exist, and what Hermes must reuse. No modules were built by VERITY (assurance lane); nothing merged or deployed.

## Result: FRAMEWORK NOT YET IMPLEMENTED — BASELINE EXISTS AND IS VERIFIED ELSEWHERE

### BLOCKED (nothing to assure yet)

- No HTML explainer modules exist in either HERMES TV repository (VERIFIED by full census at heads A `35ec7a73`, B `06aa7c3d`). Repo B contains one static landing page (index.html + styles.css); Repo A contains one README. None of the six modules (01 Introduction, 02 How It Works, 03 Secure Pairing, 04 Agent Command Center, 05 Installation, 06 Governance) exists in any form: no `reference/`, `data/`, `story/`, `motion/`, `timing/`, `render/`, or `qa/` folders anywhere in either repo.
- Consequently there is nothing to test for playback controls, captions, reduced motion, keyboard or D-pad behavior, or responsive scaling in the TV context. VERITY reports NO PASS for the modules; they are unbuilt, not failed.

### Source discovery (VERITY-verified status of the six named references)

The directive requires Hermes to locate the existing explainers before writing new ones. Status from VERITY's own prior verified work (not repo reads of the TV repos):

1. ATG Atralith explainer — EXISTS. HTML explainer built and verified in headless Chromium, with verified MP4 export (75 to 90 second, 7-scene cut) in NEURO's workspace (`your_files/`, ATG series). Not in either TV repo.
2. AGENTROPOLIS City Tour — EXISTS as a verified video asset (source MP4 in `your_files/agentropolis-videos/`); VERITY frame-verified segments of it on 2026-10-17 during the DESIGN-SYSTEM root-film work. HTML-native source: NOT VERIFIED (the verified artifact is the video, not an HTML scene implementation).
3. AGENTROPOLIS Agent Mission — EXISTS as a verified video asset (same library, frame-verified segment 51.5 to 57.5 s). HTML-native source: NOT VERIFIED.
4. Creative Assurance architecture explainer — EXISTS as a verified video asset (segment 6.0 to 12.0 s frame-verified). HTML-native source: NOT VERIFIED.
5. Motion Style Guide explainer — EXISTS as a verified video asset (segment 2.5 to 8.5 s frame-verified). HTML-native source: NOT VERIFIED.
6. Benchmark specification explainer — REPORTED as one of the delivered PDF explainer videos in the motion-brand run (VERITY delivered 3 PDF explainer videos, 2026-10-12); individual re-verification for this audit: NOT PERFORMED. Hermes must locate and present it; treat as SOURCE TO CONFIRM, not as verified.

The living implementation of the protocol today is the AGENTROPOLIS-DESIGN-SYSTEM film system (built and VERITY-accepted 2026-10-17, pending NEURO push): root cinematic film plus films 02 to 11, each with the production folder protocol (`reference/spec.md`, `data/data.json`, `story/story.md`, `motion/Scene.tsx`, `direct/timing.ts`, `ship/SHIP.md`), a shared film engine, poster-first quantization (initial JS budget, intent-gated heavy scenes), reduced-motion and MINIMUM-tier semantic fallbacks, and per-film acceptance at four viewports with zero-console-error evidence. That system, not a new invention, is the reusable baseline for HERMES TV.

### Conformance requirements for Hermes (checked at assurance time)

1. Reuse the established production protocol folder shape. The directive's folder names (`timing/`, `render/`, `qa/`) map onto the verified system's `direct/timing.ts`, rendered previews, and `ship/` receipts; Hermes must document the mapping in `reference/spec.md` rather than forking a parallel structure.
2. Claims discipline: modules 03 (pairing) and 05 (installation) describe UNIMPLEMENTED functionality and must carry on-screen "conceptual / proposed" labels, per the directive; module 04 uses mock data and must say so on screen. Module 02's flow (TV Client → Secure Bridge → Hermes Runtime → Authorized Agent Actions → Receipts) and module 06's sequence (Identity → Mandate → Plan → Execute → Receipt → Audit) are architecture diagrams, not operational claims; wording must keep that distinction visible.
3. Brand: HERMES TV sheet values (pending NEURO approval) with the usage constraints in BRAND_ASSURANCE_RECEIPT.md; grid lime only for verified states; no autoplay audio; captions or transcripts for every module; reduced-motion path; keyboard navigation everywhere and D-pad behavior specified for TV embedding.
4. Performance: follow the quantization pattern (poster-first, intent-gated heavy scenes, small initial JS). No remote dependencies beyond what the protocol already sanctions; the sandbox lesson stands: CDN references that fail silently degrade scenes to posters, so vendor or self-host three.js equivalents and verify with console evidence.
5. Delivery: feature branches and PRs only; no merge or deploy without NEURO authorization; each module ships with its `qa/` equivalent evidence (screenshots at desktop, mobile, and TV aspect; console logs; accessibility results) for VERITY to reproduce.

### What VERITY will verify when modules land

Source fidelity against this baseline, brand consistency, claim accuracy (especially the conceptual labels), animation performance evidence, accessibility (captions, reduced motion, keyboard, focus visibility), dependency exposure, responsive behavior at desktop/mobile/TV viewports, and rollback readiness. PASS requires reproduced evidence, not builder attestation.

## Evidence

- Repo censuses at the heads above (module absence is a census fact, not an inference).
- DESIGN-SYSTEM film system acceptance records: `~/workspace/reviews/design-system/build/films/*/ship/SHIP.md` and the hub/root receipts.
- Motion asset frame-verification notes: `~/workspace/your_files/agentropolis-gifs/README.md` (2026-10-17 corrections recorded there).
