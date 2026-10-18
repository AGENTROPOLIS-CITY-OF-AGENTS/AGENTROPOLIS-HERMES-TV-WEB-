# HERMES TV — BRAND ASSURANCE RECEIPT

Reviewer: VERITY (independent). Owner: NEURO. Builder: HERMES.
Date: 2026-10-17. Reference: NEURO-supplied brand sheet (1536x1024 PNG, `workspace/user/media_library/image/5d/5d990d449b8a4a829d5a6e936397b09759c43b1a4d6bdde51f819f4d03b02cba.png`).
Scope: sheet internal audit, color verification (WCAG 2.x contrast), production-asset existence, AGENTROPOLIS system compatibility, IP risk flags. No redesign performed; nothing merged, published, or overwritten.

Repository heads at audit time (VERIFIED via the user-connected GitHub connector):
- AGENTROPOLIS-HERMES-TV (Repo A, private): `35ec7a738a7ff1e187ea772cecf65001cc96884c`
- AGENTROPOLIS-HERMES-TV-WEB- (Repo B, public): `06aa7c3da6c3c73f5a6bd914e015369e0061c583`

## PASS (verified)

- Primary lockup: winged H monogram, "AGENTROPOLIS", "HERMES TV", and the primary tagline "AGENTS ON YOUR SCREEN" all spelled correctly; proportions consistent across the primary, hero, social banner, and launch poster renderings.
- Horizontal variants (dark and light) and the monochrome logo are present on the sheet, spelled correctly, and proportionally consistent with the primary mark.
- App icon set on the sheet (full color, dark, light, minimal, 32x32 favicon depiction) is internally consistent; the monogram stays legible at the smallest depicted size.
- Sheet color labels match the values in NEURO's directive exactly: Obsidian #05060A, Agent Red #FF1E2D, Neuro Cyan #00E5FF, Grid Lime #A4FF00, Steel #1F2A33, Cloud #E4E8EE.
- Contrast on Obsidian #05060A (computed, WCAG relative luminance): Cloud 16.47:1, Grid Lime 16.28:1, Neuro Cyan 13.17:1 (all AAA for text), Agent Red 5.28:1 (AA for normal text). Obsidian text on cyan or lime also passes (13.17:1 / 16.28:1).
- Mascot continuity: the black Labrador with collar appears in the TV interface mock and the launch poster, consistent with AGENTROPOLIS canon.
- TV interface mock labels (Chat, Agents, Media, Apps, Settings) spelled correctly.
- Sheet quick rules 1 to 6 are internally coherent (approved assets only, contrast for TV readability, clear space, no distortion or recoloring, typography assignments, tagline tone).

## FAIL (confirmed defects)

1. Generated-text error on the sheet itself: the TAGLINES / USAGE panel reads "Primary togline", "Secondary togline", and "Support togline" — "togline" three times instead of "tagline". The taglines themselves are spelled correctly; the panel labels are wrong. Any derivative brand document must not inherit this.
2. Live website brand drift (Repo B, live bytes verified identical to repo head): the site uses NO logo imagery at all (text-only wordmark), NO favicon (live /favicon.ico returns 404), off-sheet color values (background #07090d vs sheet Obsidian #05060A; cyan #00e8ff vs #00E5FF; red #ff304e vs #FF1E2D), system-ui/Arial fonts instead of Orbitron / Rajdhani / Inter, and a different headline ("YOUR TV. YOUR AGENTS. YOUR RULES.") instead of the primary tagline. Caveat: the sheet is itself pending approval, so this is drift to reconcile at approval time, not a violation of an approved standard yet.

## BLOCKED (missing assets / evidence)

- Production assets DO NOT EXIST in either repository (VERIFIED by full root census of both repos at the heads above). Missing: SVG master logo, transparent PNG logos, light/dark logo files, monochrome file, Android TV launcher icons, Android TV banner, website favicon files, social banner files, brand token files (CSS/JSON). The brand sheet is a raster reference only; no claim of production readiness can be made until Hermes produces and validates these.
- Android TV conformance of icon/banner assets cannot be assessed until the assets exist. Official requirement baseline (developer.android.com, retrieved 2026-10-17): a TV app must ship BOTH a launcher icon and a home-screen banner per localization; the banner is an xhdpi 320x180 px resource and MUST include the app name as text inside the image ("Create and run a TV app"; "TV app quality" TV-LB/TV-BN). Launcher icon minimum at xhdpi is 160x160 px; adaptive icon safe zone is the central 72x72 of the 108x108 layer; the Play Store icon is 512x512 px PNG. Android TV OS does not support themed icons, so the sheet's monochrome variant is not a TV requirement (it remains valid for web/print). A 32x32 favicon has NO Android TV role; it is a website asset only. Current official docs give NO numeric minimum text size for TV (guidance is qualitative: legible from 10 feet, nothing cut off by overscan, full D-pad navigability), so no numeric TV legibility claim should be made in brand documents.
- Sheet gap against that baseline: the sheet depicts app icons and a favicon but does NOT depict the mandatory 320x180 TV banner as a deliverable. Hermes must add it (full logo, icon + text, logo inside the safe area, no added borders, per the official TV icon guidelines) to the production asset list.
- Repo A contains no brand material of any kind (single README.md, 220 bytes).

## Usage constraints from contrast (binding on derivatives)

- White text on Agent Red #FF1E2D is 3.84:1: passes AA for LARGE text only; fails AA for normal text (needs 4.5:1). Button labels on red must be large/bold, or the red must darken for text-bearing controls. Same constraint on the live site's CTA red #ff304e (3.63:1).
- Neuro Cyan on Cloud (light background) is 1.25:1: FAIL for any text or essential UI. Cyan on light surfaces is decorative only.
- Agent Red on Cloud is 3.12:1: large text only.
- Steel #1F2A33 on Obsidian is 1.39:1: acceptable as a panel fill only; never for text, icons, or essential borders without an additional outline.

## System compatibility notes (owner decisions, not defects)

- Token drift across the fleet: HERMES TV proposes Obsidian #05060A and Agent Red #FF1E2D. Established sets already differ (motion brand Obsidian #080B10 / Red #FF2638 / Cyan #00E5FF; DESIGN-SYSTEM tokens Obsidian #05070A / Red #FF2A2A / Cyan #19E6E6). HERMES TV cyan matches the motion brand exactly. Recommendation: NEURO either registers the HERMES TV values as deliberate product-level tokens or aligns them; three near-identical reds and obsidians across one system is a governance debt.
- Typography: the sheet adds Rajdhani (subheads/UI) to the shared Orbitron (display) + Inter (body) system. Rajdhani is not part of the shared AGENTROPOLIS system as previously recorded. Owner decision: register as a HERMES TV sub-brand font or remove from derivatives.
- Grid Lime #A4FF00 as "Success / Verified": consistent with the fleet's lime-equals-verified convention in product language (note: in AGENTROPOLIS-DESIGN-SYSTEM, lime is not yet top-level canon; an open owner question there. HERMES TV's use should follow the same ruling NEURO makes for the design system).

## Intellectual property (flags only, no legal conclusions)

Public-source scan, 2026-10-17. All items REPORTED from public sources (trademark aggregators, company and news sources); no USPTO TESS direct search was performed by VERITY, and no ownership or infringement conclusion is made. A licensed trademark attorney with a full clearance search is required before public launch, store submission, or merchandising.

1. Hermès International (Paris): globally famous luxury mark with documented enforcement into digital markets (MetaBirkins, S.D.N.Y. 2023, infringement found plus permanent injunction). Aggregator records report a US "H" word mark (serial 86688096) in International Class 009 covering computers, software, and related electronics, and an Australian counterpart whose goods list explicitly includes "television sets, video screens, video recorders". This is the sharpest flag for a product named HERMES TV: verify the live status and exact goods of that Class 009 family in TESS first. Counterweight, also reported: Hermès' house emblem is a horse-drawn Duc carriage, not a winged H, and some of its oppositions against similar marks (HAIRMES, HERDES in Japan) were dismissed.
2. Nous Research "Hermes": a prominent open-weights AI model family (Hermes 2/3/4) plus a reported MIT-licensed "Hermes Agent" framework (Feb 2026). Directly AI-adjacent: same "agent" semantic space and developer audience as HERMES TV. Nous is also already a vendor in NEURO's orbit (paid API credits). Counsel should answer whether shipping a "Hermes"-named AI product alongside Nous API usage creates contractual or confusion exposure.
3. Domain collision: hermes-tv.com is already live and occupied by an unrelated tech product (GuestKeyTS, a Tesla guest-access app). A domain and handle strategy question regardless of trademark.
4. Meta "Hermes" JS engine: the default React Native engine. If the TV app is built on React Native it would literally run on Hermes; a developer-ecosystem overlap, not a consumer brand conflict on its face.
5. Hermes logistics (Evri, ex-Hermes UK; Hermes Europe, Otto Group): unrelated field (parcels), minimal collision; the retired UK brand carried negative service press, a reputational note only.
6. HERMES Live Technology Ltd (Hong Kong): broadcast live-streaming platform and encoders; media-adjacent use of the name in streaming infrastructure.
7. The winged H monogram: does not reproduce Hermès' carriage emblem; whether it conflicts with Hermès' registered letter-H marks is a visual-comparison question for counsel against the actual registration specimens (not viewed in this scan).

Attorney question list (from the scan): live TESS status of "HERMES"/"HERMES TV" filings in IC 009/038/041/042; status of Hermès' Class 009 family; any filings/oppositions by Nous, Meta, or HERMES Live in software/entertainment classes; intended Nice classes and filing geography; descriptiveness of "HERMES TV"; phonetic-equivalent clearance; separate design-mark filing for the winged H; domain strategy given hermes-tv.com; the Nous vendor-relationship question; enforcement-risk posture toward Hermès International; state/common-law media uses a federal search would miss.

## Recommendations to Hermes

1. Correct "togline" if the sheet is ever regenerated; do not propagate the sheet's label text into BRAND_GUIDELINES.md.
2. Produce the production asset set under `assets/brand/`, `assets/icons/`, `assets/banners/` in Repo B (and mirrored where the TV app needs them in Repo A): SVG master, transparent PNGs (dark/light/mono), favicon set (16/32/180/512), the mandatory Android TV banner (320x180 px at xhdpi, app name text inside the image, plus the density ladder 160x90 / 240x135 / 480x270 / 640x360) and launcher icons (160x160 px at xhdpi minimum, adaptive-icon layers with the 72x72 safe zone, 512x512 Play icon), social banners, tokens as CSS + JSON using the approved hex values.
3. Reconcile Repo B's live CSS values and fonts with the approved sheet values (or record an owner-approved deviation), add the logo and favicon to the site, and use the primary tagline as the site headline or record why not.
4. Keep white-on-red text large/bold only, per the contrast constraint above.

## Evidence

- Sheet crops read by VERITY at 2x: primary lockup, color panel, typography/taglines panel, guidelines panel, variants, app icons, bottom artwork (working copies in the review workspace).
- Repo censuses and file reads via connector at the heads above; live site bytes compared by SHA-256: live index `c4e77ba46e24caf7f6156d6b37d0dafea682e5a70475e263493db18cdda1d116` equals repo index exactly.
- Contrast ratios computed locally from the WCAG relative-luminance formula (script rerun on request).
