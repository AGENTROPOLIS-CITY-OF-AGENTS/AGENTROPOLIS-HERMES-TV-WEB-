# Website publication boundary review

Prepared 2026-10-18 for NEURO and Hermes. Base inspected: `06aa7c3da6c3c73f5a6bd914e015369e0061c583`.
Hermes remains the development/orchestration system. This change grants no execution or release authority.

## Finding and remediation

Main uploads `path: .` with no validation. FAIL: publication isolation and required predeployment checks. The replacement rebuilds `dist/` from an exact file allowlist and validates the resulting tree before upload. Symlinks, extra files, source/artifact drift, missing relative dependencies/anchors, active HTML content and unreviewed external origins fail validation. The security checks are a narrow static baseline, not a comprehensive security audit or secret scanner.

Only `index.html` and `styles.css` are required public assets. The homepage references the stylesheet, its own section anchors, and GitHub repository links. There are no raster/vector assets, fonts, scripts, APKs, favicons or other downloads in this source tree. External repository links are not copied into the artifact. README, LICENSE, docs, scripts, tests, workflows and Git metadata stay out. LICENSE remains available in the public source repository. Future assets require an explicit allowlist and validator review; no recursive repository copy is permitted.

Push and pull-request events validate only. Deployment requires manual workflow dispatch on main with the full explicitly approved commit SHA matching the run SHA, followed by the existing `github-pages` environment gate. Environment/branch protections are not modified. The SHA input records intent; it cannot itself establish that NEURO approved a release. Operators must obtain that approval before dispatch. No merge or deployment performed by this change.

## VERITY web PR #1 reconciliation

| Finding | Disposition |
| --- | --- |
| Whole-root exposure | Fixed in proposed artifact; live exposure remains OPEN until authorized deployment and independent probes |
| Missing deployment checks | Previously FAIL; automated build, links, security baseline, accessibility baseline, regression and HTTP smoke checks added |
| CTA contrast | Foreground changed to existing obsidian token on red: computed 5.49:1, above 4.5:1 |
| Repo A absence claimed from conventional URL 404 | UNVERIFIED: no claim of no deployment/exposure; settings, custom/private URLs and deployment records still require authorized inspection |
| Whole-site zero drift from index hash | Unsupported; earlier evidence establishes homepage HTML equality only. No current live equality claim made |

This review supplements the unmerged assurance PR rather than rewriting VERITY's independent receipt or resolving its threads on the reviewer's behalf. The original gate's `LIVE, CONDITIONAL`/`NOT DEPLOYED` and whole-site equality wording must be reconciled by VERITY before that PR is approved. Android assurance PR #1 remains unmerged and unchanged; its asset specifications, evidence durability and brand-gate references remain separate review work.

Accessibility checks here cover language, viewport, main landmark, one h1, alt attributes, keyboard focus, reduced motion and the known CTA CSS regression. They do not establish full WCAG compliance. Browser-based accessibility review, keyboard testing and desktop/laptop/mobile/TV viewport evidence remain release conditions. No browser or device acceptance was performed here.

## Reproduce and evidence

Run from repository root:

```
python -m unittest discover -s tests -v
python scripts/site_build.py
python scripts/smoke.py
git diff --check
```

Local result: 7/7 regression tests PASS. HTTP checks: `/` and `/styles.css` 200; `/docs/HERMES_HANDOFF.md`, `/README.md`, `/LICENSE`, `/.github/workflows/pages.yml`, `/.git/config` 404. Exact artifact listing: `index.html`, `styles.css`.

SHA-256:

```
c4e77ba46e24caf7f6156d6b37d0dafea682e5a70475e263493db18cdda1d116  index.html
d4aa8069f47ea259f50a9a879dfc5d93df05be0c60c0b2a54ed6296132c720d3  styles.css
```

## Release hold and postdeployment verification

No live remediation claimed. After NEURO authorizes the reviewed commit and deployment, VERITY must inspect the deployment's actual URL(s), compare BOTH intended assets against this commit, and repeatedly probe formerly exposed paths with response-body checks. A single 404 is insufficient. Inspect Pages settings and historical/current deployments for both repos, including custom/private URLs. Settings access and actual CDN purge state are not verified here. No credentials were identified in the reported handoff; that does not make internal docs intended website content.

Rollback requires owner authorization. Do not restore the root-upload workflow; use a previously validated website-only artifact or suspend publication through an authorized operator. Remaining brand/legal, APK, pairing, six explainer modules and device acceptance gates are unchanged.
