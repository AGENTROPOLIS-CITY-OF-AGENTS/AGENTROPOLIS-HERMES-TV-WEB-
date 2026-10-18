# HERMES TV — BRAND ASSURANCE RECEIPT (Phase 4 edition)

Reviewer: VERITY (independent). Owner: NEURO. Builder: HERMES. Date: 2026-10-17.
Scope of this edition: whether the Phase 4 target branches change any Phase 3 brand finding. Full Phase 3 receipt remains of record (`~/workspace/reviews/hermes-tv/docs/BRAND_ASSURANCE_RECEIPT.md`).

## Result: NO CHANGE ON EITHER BRANCH

Full censuses (blob-level) of `feat/web-portal-enhancement` and `feat/android-tv-mock-ui` confirm: neither branch adds, modifies, or removes any brand material. There are still NO production assets in either repository: no SVG master, no transparent PNGs, no light/dark/mono logo files, no favicon files, no Android TV launcher icons, no 320x180 TV banner, no social banner files, no CSS/JSON token files. The brand sheet remains a raster reference only.

Phase 3 verdicts therefore stand verbatim:
- PASS: sheet internal consistency (lockups, variants, icons, taglines), palette labels matching the directive hexes, computed contrast on Obsidian (Cloud 16.47:1, Lime 16.28:1, Cyan 13.17:1, Red 5.28:1), mascot continuity.
- FAIL: "togline" for "tagline" three times in the sheet's taglines panel; live-site brand drift (no logo, no favicon, off-sheet hexes #07090d/#00e8ff/#ff304e, system fonts, different headline).
- Binding usage constraints: white on Agent Red 3.84:1 is large-text only; cyan on light backgrounds (1.25:1) is prohibited for text/essential UI; red on light (3.12:1) is large-text only; Steel on Obsidian (1.39:1) is panel fill only.
- Android TV baseline: banner 320x180 px at xhdpi with the app name as text inside the image is MANDATORY (developer.android.com); the sheet does not depict it; a 32x32 favicon has no Android TV role.
- Owner decisions still open: HERMES TV token registration vs alignment (three near-identical reds/obsidians across the fleet); Rajdhani registration vs removal; the lime-canon ruling shared with DESIGN-SYSTEM Film 01.
- IP flags (REPORTED, no legal conclusions): Hermès International's reported Class 009 "H" family (Australian counterpart lists television sets), Nous Research Hermes models/agent framework, hermes-tv.com occupied, Meta Hermes JS engine, HERMES Live Technology (streaming). Attorney clearance search required before public launch, store submission, or merchandising.

## Phase 4 site re-verification (brand surface)

The live site is byte-identical to the branch files; VERITY re-rendered them locally at 1920x1080 and 390x844 (screenshots in the Phase 4 review evidence). The render confirms the Phase 3 drift findings are all still live: text-only wordmark, no logo imagery anywhere (zero images on the page), no favicon, headline "YOUR TV. YOUR AGENTS. YOUR RULES." instead of the primary tagline "AGENTS ON YOUR SCREEN".

## Remediation (to Hermes, unchanged priority P2 after the P0 publication fix)

Produce the production asset package under `assets/brand/`, `assets/icons/`, `assets/banners/` (SVG master; transparent PNGs dark/light/mono; favicon set 16/32/180/512; TV banner 320x180 xhdpi plus density ladder, with in-image app name; launcher icons 160x160 xhdpi minimum with adaptive layers and 72x72 safe zone; 512x512 Play icon; tokens as CSS + JSON at the approved hexes), correct "togline" in any regenerated or derivative material, and reconcile the site to the approved sheet once NEURO rules on it.
