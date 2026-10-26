# Publishing remediation recheck, 2026-10-25

Status: BLOCKED FOR RELEASE. No merge, deployment, protection change, or independent VERITY approval performed by this review.

## Exact inspected state

- main: 06aa7c3da6c3c73f5a6bd914e015369e0061c583. pages.yml still uploads repository root and deploys on push.
- PR #2: 4c870146cb9f5d34b1fba95c7a85d188be1d8734. Draft, open, based on main. Two-file artifact, regression/build/smoke checks, manual dispatch with matching SHA, deploy-only Pages/OIDC permissions.
- PR #3: 9afdce05638893bd6b74b9ddde85bfecc7b0842b. Draft, open, based on main. Copies two files but auto-deploys on main push, grants deployment privileges at workflow scope, lacks #2's regression/link checks and manual SHA gate. Do not merge its workflow over #2.
- PR #5: 218bf1657c82c344d76c307795e52ea1d483449a. Draft, open, based on main, NOT a Git dependency on #2 despite the STACKED label. Additive hero files only; current workflow would publish these on merge.

## Reproduced evidence

PR #2 unmodified: 7/7 unittest tests pass. Build hashes match its published receipt. Local HTTP: / and /styles.css 200; /docs/HERMES_HANDOFF.md, /README.md, /LICENSE, /.github/workflows/pages.yml and /.git/config 404. This proves local artifact behavior only.

GitHub run 39174559813 at #2's inspected SHA: validation success, deployment SKIPPED. https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-HERMES-TV-WEB-/actions/runs/39174559813
The recent run list has no newer remediation deployment; main's successful push run 39093113123 used the old root-upload workflow. Green PR CI is not production protection.

PR #5 existing checker: PASS (19 text files). This is source membership evidence, NOT a complete release-artifact pass.

## Confirmed defects and fixes in this follow-up

1. #2 uses assert for enforcement. Under python -O, 6/7 original tests FAIL because checks disappear. Workflow currently invokes ordinary Python, so this is a latent validation defect, not evidence the current workflow was exploited. Replace assertions with explicit runtime checks. Add artifact-root symlink and source/artifact drift regressions. Result: 9/9 pass in ordinary and optimized Python.
2. smoke.py served cwd-relative dist, while build() used repository-relative dist. Invoke from another directory and it can probe the wrong directory. Fix to the same absolute ROOT/dist and retain status enforcement under optimization.
3. #3's files are not a drop-in compatible design update under #2's validator: independently combining the assets with #2's build fails with CTA contrast regression. Its CSS differs from the exact-string assertion; this result does NOT measure its actual contrast. Port its design separately, measure colors and update tests without weakening the release workflow.

## Hero release blockers

- #2's exact two-file allowlist intentionally excludes ALL hero files. A merge after #2 would not expose the hero until a separately reviewed runtime allowlist is implemented.
- #5's manifest calls render scripts, tests, reference/spec.md, MATCH-RECEIPT.md, story and ship receipts part of the public artifact. Split source/provenance inventory from the minimal runtime artifact before allowing publication. Do not recursively copy hero/.
- poster.jpg, hero-loop.mp4 and hero-360.mp4 are absent. Manifest pins them but the checker rejects their presence rather than requiring and hashing them. Its PASS therefore cannot validate the deployable page. Obtain exact bytes from a durable source; require all runtime assets with verified hashes and file sizes. Do not invent binaries or silently regenerate different hashes.
- os.walk does not follow directory symlinks and the checker does not inspect dirnames for symlinks, so an extra symlink directory can evade its no-symlinks claim. Reject root/file/directory symlinks and validate manifest paths before reading them. Keep a separate test for the final assembled release, including binaries.
- viewer.js autoplays without a prefers-reduced-motion check; hero page handling does not cover the separate 360 viewer. Require motion preference handling, keyboard scroll prevention and pointer-cancel cleanup before viewer acceptance. Mobile/touch hardware and actual media playback remain unverified.
- VERITY authored #5 per its own receipt. Use GROKBOT or AXIOM as an independent reviewer for #5. VERITY can independently audit #2 and this follow-up.

## Correct release sequence

1. Independently review #2 plus this follow-up at their final exact commits. Preserve the human-controlled release hold; resolve findings before requesting authorization. A typed SHA is an intent record, not proof of NEURO consent. Actual github-pages environment approval protections remain unverified.
2. NEURO explicitly authorizes the remediation merge. Merge only that reviewed remediation; do not restore #3's automatic workflow. No merge is authorized by this document.
3. Validate the resulting main commit, because its SHA may differ from a PR head. Obtain separate explicit deployment approval for that exact full main SHA. An authorized operator dispatches pages.yml on main with approved_sha matching the run SHA. Preserve existing environment approval controls.
4. VERITY independently inspects deployment records and actual Pages/custom URLs, compares both asset bytes against the approved commit, and repeatedly probes excluded paths with response-body checks, including after cache refresh. Record timestamps, redirects, hashes, HTTP status and deployed SHA. Local 404s, assumed URLs or one production probe are insufficient. Keep issue #6 open until evidence supports closure.
5. Only after production boundary verification, rebase #3 design-only and #5 on the remediated main. Review expanded runtime allowlist, media availability/hashes, accessibility/device testing and MATCH gaps. #5 requires independent GROKBOT/AXIOM review. Each later merge and deployment needs explicit human authorization for its own final SHA.

## Independent review routing

No reviews/comments were present on #2, #3 or #5 when inspected. Slack directory search returned no VERITY account. Prior project messages establish #agentropolis as the coordination route and explicitly warn that a channel handoff does not prove agent acceptance. Request a VERITY ACK and a SHA-bound review receipt there; until returned, independent review is PENDING, never PASS.

## Live observation during this review

On 2026-10-25 at approximately 21:37 UTC (14:37 PDT), direct read-only GETs to https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-HERMES-TV-WEB-/ returned 200 for index, styles.css, docs/HERMES_HANDOFF.md, README.md and LICENSE; workflow and .git/config returned 404. This confirms unwanted documentation publication at that URL; it is not a claim of credential exposure. The production CSS hash is bb1a78787b96a589c54d38c6ee471cbaa3f0b571506d639ceb8d8d9b642ce7c3, unlike #2's proposed corrected stylesheet. No remediation deployment was performed.

Additional negative test: adding an unlisted symlink DIRECTORY to a temporary copy of #5's hero tree still produces checker PASS / exit 0. This confirms the directory-symlink defect. Fixed smoke.py also passes from /tmp, proving it serves the built repository artifact independently of working directory.
