# HERMES TV — VERITY PHASE 4 REVIEW

Reviewer: VERITY (independent). Owner: NEURO. Builder: HERMES. Date: 2026-10-17.
Targets: AGENTROPOLIS-HERMES-TV-WEB- @ `feat/web-portal-enhancement`; AGENTROPOLIS-HERMES-TV @ `feat/android-tv-mock-ui`.
Method: full recursive census of both branches via the user-connected GitHub connector (blob SHAs compared against main), file reads, live URL probes, local rendering of the branch site files at four viewports. No merges, deployments, visibility changes, or APK actions performed.

## Headline finding

**The two review-target branches contain no Phase 3 or P0 remediation work.** Both branches exist, but one is empty and the other is stale:

- `feat/android-tv-mock-ui` (TV repo) points at `35ec7a738a7ff1e187ea772cecf65001cc96884c`, the repo's initial and only commit, identical to main. Its entire tree is one file: `README.md` (220 bytes). There is no Android source on this branch.
- `feat/web-portal-enhancement` (WEB repo) points at `c5b424aed7f998b22f260691129a04a7b0b19262` ("docs: make Hermes sole development orchestrator"), which is an ANCESTOR of main: main is one commit ahead (`06aa7c3d`, "docs: require GitHub Pages verification for both TV repositories"). The branch has zero unique commits. Every file is blob-identical to main except `docs/HERMES_HANDOFF.md`, where the branch holds the OLDER, shorter version (1,738 bytes, blob `9ef0b461`) that lacks main's two-repository Pages requirement section (2,666 bytes, blob `ea1f94e1`).
- The only open pull requests in either repository are VERITY's two assurance PRs (#1 in each, branch `verity/audit-docs-2026-10-17`). Hermes has no PR open.

Consequently most Phase 4 checks resolve to FAIL (work absent) or BLOCKED (nothing to verify), not to quality judgments on new code. Where branch content equals the already-audited main content, VERITY re-verified rather than inherited.

## The 12 checks

**1. Branch and history verification — DONE (VERIFIED).** Heads and histories above, read directly from the connector. WEB main remains `06aa7c3d`; TV main remains `35ec7a73`.

**2. Code and documentation inspection — DONE.** Complete file inventory: WEB branch 7 files (workflow, .gitignore, LICENSE, README, handoff, index.html, styles.css); TV branch 1 file (README). No other code or docs exist on either branch.

**3. Website accessibility and responsive behavior — PASS WITH FINDINGS.** Branch `index.html`/`styles.css` are blob-identical to the live main files, and live bytes were again verified equal to repo bytes. Local render at 1920x1080, 1440x900, 430x932, 390x844: landmarks header/nav/main/footer present, `lang="en"`, viewport meta present, 6 focusable elements, no horizontal overflow at any viewport, screenshots captured (review workspace `phase4/site-1920x1080.png`, `site-390x844.png`). Standing findings carry over unchanged: `:focus-visible` styling and `prefers-reduced-motion` handling present; NO skip link; NO favicon (live /favicon.ico 404, no icon link in markup, zero images on the page); CTA white-on-#ff304e contrast 3.63:1 (large text only); hero CTA links to the private TV repo (public dead end). Nothing on the "enhancement" branch changes any of this.

**4. Android TV mock implementation — FAIL (absent).** There is nothing to validate. Missing components, complete list: Gradle wrapper and `settings.gradle(.kts)`, module `build.gradle(.kts)`, `AndroidManifest.xml` (including the required `CATEGORY_LEANBACK_LAUNCHER` activity and `android:banner`), all Kotlin/Compose sources, `res/` resources including the mandatory 320x180 xhdpi banner with in-image app name and the launcher icon set, and any tests. The P0 directive's "Phase 3 mock prototype in the Hermes workspace" was not located in either repository; if it exists in a local Hermes workspace, it has never been pushed. No APK claim can be made; none was found in the repos.

**5. GitHub Pages audit, both repos — see DUAL_GITHUB_PAGES_AUDIT.md (Phase 4).** Summary: no change since the Phase 3 audit. WEB workflow blob is identical on branch and main (whole-root upload, no `dist/` scoping); TV repo has no Pages anything.

**6. Public exposure of internal documentation — FAIL, STILL LIVE (VERIFIED).** On 2026-10-17, `https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-HERMES-TV-WEB-/docs/HERMES_HANDOFF.md` returned HTTP 200 on six of six confirmation probes, and the served body is the CURRENT main version (2,666 bytes, includes the two-repository Pages requirement section). /README.md and /LICENSE are also served (public-repo content, low sensitivity). During one earlier probe window, edge responses were inconsistent (isolated 404s among 200s, consistent with deployment propagation across CDN edges); the settled state was established by repeated probes plus a full body fetch, and the exposure stands. The P0 remediation (dist/ allowlist) is NOT present on the enhancement branch: the workflow file is byte-identical to main.

**7. Licensing — PARTIAL.** WEB repo: Apache-2.0 LICENSE verified present (text read) on branch and main. The WEB README still contradicts it ("License review pending; do not assume an open-source grant until LICENSE is added") and still instructs builders to "Use Cursor", both blob-identical on the enhancement branch; the commit titled "make Hermes sole development orchestrator" evidently updated the handoff, not the README. TV repo: NO LICENSE exists on main or branch; the TV licensing question remains PENDING and is an owner decision (VERITY recommends the same Apache-2.0 for consistency, but cannot resolve it). **FAIL for documentation consistency; BLOCKED for the TV license itself.**

**8. Brand assets and HTML Video Protocol — NO CHANGE (see Phase 4 editions of both receipts).** Neither branch adds any asset or module. The brand sheet remains a raster reference with zero production assets anywhere; none of the six explainer modules exists. Phase 3 verdicts stand verbatim.

**9. Pairing-contract evidence — BLOCKED.** No pairing design, contract, or upstream-interface evidence exists in either repository. The handoff's work queue item 2 asks Hermes to inspect official upstream Hermes interfaces and propose a least-privilege bridge "based only on verified capabilities"; no output of that work has been committed anywhere VERITY can read. Nothing to verify; live pairing remains unauthorized and unimplemented.

**10. Process isolation — BLOCKED, attestations missing.** No document in either repo attests to process isolation, sandboxing, signing, or permission boundaries for the TV client or the bridge. Missing attestations: (a) TV app sandbox/process model statement; (b) bridge authentication and session-revocation design; (c) signing-key custody and release-signing procedure; (d) CI/build attestation practice. The WEB README's safety paragraph (no credentials, no device identifiers, no signing keys in repo) is a policy statement, not an attestation.

**11. RFP cost-benefit comparison — BLOCKED.** No RFP or cost-benefit document exists in either repository, although the handoff (work queue item 5) requires per-task RFP cost-benefit analysis. There is nothing to compare actual work against; the analysis is itself a missing deliverable. VERITY notes the irony without scoring it: the two target branches contain no billable-looking output to compare in any case.

**12. Findings** — this document, plus the four companion deliverables.

## Prioritized remediation queue for Hermes

P0 (publication boundary, unchanged from the P0 directive because the fix is not on the branch):
1. Implement the `dist/`-only Pages workflow with an automated allowlist check ON `feat/web-portal-enhancement` (or a fresh branch off current main, which is one commit ahead of it; rebase first). Publish the artifact file listing as PR evidence. Deployment happens only on NEURO's authorization; after it, VERITY re-probes every formerly exposed URL.
2. Push the Android TV mock source to `feat/android-tv-mock-ui`, or state in writing on the branch (README or docs note) that no prototype exists yet. A branch named for work it does not contain is a reporting defect in itself.

P1:
3. Reconcile the WEB README: licensing paragraph to match the Apache-2.0 LICENSE; remove the Cursor instruction (Hermes is orchestrator per the handoff and NEURO's directive); keep the accurate pre-release/APK statements.
4. TV repo LICENSE: NEURO to choose (Apache-2.0 recommended for fleet consistency); Hermes adds the file on the TV branch.
5. Commit the pairing-contract evidence (verified upstream capabilities only) or mark the bridge design BLOCKED in the handoff with the specific missing evidence named.
6. Commit the RFP cost-benefit analysis for the remediation program, or NEURO removes that requirement from the work queue.

P2:
7. Brand production assets per BRAND_ASSURANCE_RECEIPT (SVG master, PNG set, favicon set, mandatory 320x180 TV banner, tokens), then site brand reconciliation and favicon.
8. The six HTML video explainer modules per HTML_VIDEO_PROTOCOL_AUDIT, with conceptual labeling for pairing and installation.
9. Process-isolation attestation documents listed in check 10.
10. Fix or label the hero CTA that sends public visitors to the private TV repo.

## Evidence index

- Branch censuses: `phase4/web-branch.txt`, `phase4/tv-branch.txt` (blob SHA, size, path for every file).
- Live probes 2026-10-17: root 200; handoff 200 (6/6) with body verified as the 2,666-byte main version; README/LICENSE/styles 200; favicon 404.
- Site renders: `phase4/site-1920x1080.png`, `phase4/site-390x844.png` (branch-identical files; live bytes equal repo bytes).
- Companion docs: DUAL_GITHUB_PAGES_AUDIT.md, BRAND_ASSURANCE_RECEIPT.md, HTML_VIDEO_PROTOCOL_AUDIT.md, RELEASE_GATE.md (Phase 4 editions, same directory).
