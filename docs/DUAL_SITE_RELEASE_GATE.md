# HERMES TV — DUAL SITE RELEASE GATE

Reviewer: VERITY. Owner and release authority: NEURO. Date: 2026-10-17.
This gate governs BOTH HERMES TV sites. Nothing in it authorizes a merge, a deployment, a visibility change, or an APK publication.

## Current gate state

| Surface | State | Basis |
|---|---|---|
| Repo B public site (landing page) | LIVE, CONDITIONAL | Live and byte-identical to head `06aa7c3d`; conditions below |
| Repo B explainer modules | NOT BUILT | Census: no modules exist |
| Repo A Pages site | NOT DEPLOYED (gate closed) | No content, no workflow; plan/visibility question open |
| TV application (Android) | NOT REVIEWED | No code exists in Repo A to review |
| Brand asset package | NOT PRODUCED | Sheet is a raster reference only |

## Conditions on the live Repo B site (Hermes to clear)

1. Stop publicly serving internal docs (whole-root upload exposes `docs/HERMES_HANDOFF.md`). Scope the published artifact or move internal material out of the published tree. Priority: highest; it is live now.
2. Reconcile the README: Apache-2.0 LICENSE exists while the README says licensing is pending; the README's Cursor instruction contradicts the owner's no-Cursor directive.
3. Fix or label the hero CTA that links public visitors to the private Repo A.
4. Brand reconciliation once NEURO rules on the sheet: logo, favicon, approved hex values and fonts, primary tagline.

## Gates that must open before Repo A gets a Pages site

1. Written answer on the org's GitHub plan and Pages-for-private-repos behavior (official-docs basis in PAGES_AUDIT.md). Default assumption until then: anything published from Repo A is public.
2. NEURO's explicit decision on WHAT, if anything, from Repo A is public-safe (curated docs subset only; never code, receipts, or internal material).
3. A deployment workflow equivalent in discipline to Repo B's (minimal permission trio, scoped artifact, no whole-root upload of a repo that will hold app code).

## Gates for the explainer modules (per module)

1. Production folder complete (reference/spec.md, data/data.json, story/story.md, motion/, timing, ship/qa evidence).
2. Conceptual labeling verified on screen for unimplemented features (pairing, installation) and mock data (command center).
3. VERITY acceptance reproduced: four-viewport structure pass (desktop, laptop, mobile portrait, TV 16:9), zero console errors, reduced-motion and no-WebGL fallbacks, captions present.
4. PR opened by Hermes; merge and deploy only on NEURO's separate authorization.

## Gates for any public brand use

1. NEURO approves the brand sheet (with the "togline" defect noted) or a corrected regeneration.
2. Production assets produced and validated (SVG master, PNG set, favicon set, Android TV banner/icons to official spec, token files). Specs: PENDING RESEARCH appendices in BRAND_ASSURANCE_RECEIPT.md.
3. Token governance decided: HERMES TV hex values registered as product tokens or aligned to an established set; Rajdhani registered or removed.
4. IP scan reviewed by NEURO (flags in BRAND_ASSURANCE_RECEIPT.md; a trademark attorney review is recommended before public launch, app store submission, or merchandising).

## Rollback

- Repo B: redeploy of the previous commit via the same workflow restores the prior site (the pipeline is stateless static hosting; live==head is verified each time by byte comparison).
- Repo A: no deployment exists; rollback is a non-event.
- Brand: the sheet is a reference file in NEURO's library; no published asset depends on it yet.

## Sign-off block

- VERITY assurance: issued with this gate (findings in PAGES_AUDIT.md, HTML_VIDEO_PROTOCOL_AUDIT.md, BRAND_ASSURANCE_RECEIPT.md).
- HERMES corrections: pending (conditions above).
- NEURO release decision: NOT GIVEN. The live landing page predates this gate; no new deployment is authorized by this document.
