# HERMES TV — RELEASE GATE (Phase 4)

Reviewer: VERITY. Owner and release authority: NEURO. Date: 2026-10-17. Supersedes the Phase 3 DUAL_SITE_RELEASE_GATE.
This gate authorizes nothing by itself: no merge, deployment, visibility change, APK publication, or live pairing.

## Gate state after Phase 4

| Surface | State | Basis |
|---|---|---|
| Repo B public site (landing page) | LIVE, CONDITIONAL, P0 OPEN | Exposure of internal handoff still live (verified 2026-10-17); remediation not on any branch |
| Repo B explainer modules | NOT BUILT | No modules in either repo |
| Repo A Pages site | NOT DEPLOYED (gate closed) | No content; plan/visibility question open |
| Android TV app | NOT PRESENT | Target branch contains only the initial README; nothing to build, test, or release |
| Brand asset package | NOT PRODUCED | Raster sheet only |
| Audit docs PRs (VERITY) | OPEN, awaiting NEURO | PR #1 in each repo, branch `verity/audit-docs-2026-10-17` |

## Hard blockers (must clear before any new deployment or release claim)

1. P0 publication boundary: the whole-root Pages upload still serves internal documentation publicly. Clears only when (a) Hermes lands the dist/ allowlist workflow on a branch based on CURRENT main, (b) NEURO authorizes the deploy, and (c) VERITY re-probes the formerly exposed URLs against the new deployment and confirms the settled state (repeated probes, not a single response, because CDN propagation produced inconsistent edge responses during Phase 4).
2. Android branch truthfulness: `feat/android-tv-mock-ui` must either receive the actual mock source or carry a written statement that no prototype exists yet. No build, test, emulator, or APK statement may be made until source exists and a build is reproduced.
3. TV repo license: unresolved. NEURO decision required (Apache-2.0 recommended); no public or store distribution of TV software before this clears.
4. IP clearance: attorney search on HERMES TV (flags in the brand receipt) before public launch, store submission, or merchandising.

## Conditions (non-blocking for the current static landing page, blocking for expansion)

- WEB README reconciliation (license text, Cursor instruction) on Hermes' next branch.
- Pairing-contract evidence and process-isolation attestations: required before any bridge, pairing, or runtime claim appears in product copy.
- RFP cost-benefit analysis: required by the handoff work queue; commit it or NEURO removes the requirement.
- Brand assets and site reconciliation: required before the site presents itself as the branded product portal (logo, favicon, approved tokens, primary tagline, mandatory TV banner in the asset package).
- Explainer modules: per-module gates as defined in the Phase 3 gate (production folder, conceptual labeling, VERITY four-viewport acceptance, PR, NEURO merge/deploy authorization).

## Rollback

Repo B redeploys statelessly from main via the existing workflow; rollback is redeploy of a prior commit, with live==head byte comparison as the verification. Repo A has nothing deployed. No APK or pairing state exists to roll back.

## Sign-off block

- VERITY Phase 4 assurance: issued (VERITY_PHASE4_REVIEW.md + four companion docs).
- HERMES corrections: QUEUED (prioritized list in VERITY_PHASE4_REVIEW.md). No Hermes PR is currently open in either repo.
- NEURO decisions pending: audit-doc PR merges (2), org GitHub plan confirmation for Repo A Pages, TV repo license choice, sheet/token/Rajdhani rulings (shared with DESIGN-SYSTEM lime call), IP attorney engagement, any deployment authorization for the P0 fix.
