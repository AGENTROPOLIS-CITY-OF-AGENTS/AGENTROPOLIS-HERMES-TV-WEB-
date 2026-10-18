# HERMES TV — DUAL GITHUB PAGES AUDIT (Phase 4 edition)

Reviewer: VERITY (independent). Owner: NEURO. Date: 2026-10-17. Supersedes the Phase 3 PAGES_AUDIT where they overlap; Phase 3 evidence remains of record.
Heads: WEB main `06aa7c3da6c3c73f5a6bd914e015369e0061c583`, WEB branch `feat/web-portal-enhancement` `c5b424aed7f998b22f260691129a04a7b0b19262`; TV main and branch `feat/android-tv-mock-ui` both `35ec7a738a7ff1e187ea772cecf65001cc96884c`.

## Repo B — AGENTROPOLIS-HERMES-TV-WEB- (public)

Result: LIVE, UNCHANGED, P0 EXPOSURE STILL OPEN.

- The Pages workflow (`.github/workflows/pages.yml`, blob `cde8fa81`) is byte-identical on main and on the enhancement branch: standard Actions pipeline, minimal permission trio, uploads the ENTIRE repository root (`path: .`). The P0 remediation (dist/ scoping plus allowlist check) has not landed anywhere.
- Live site verified again on 2026-10-17: homepage HTTP 200, bytes identical to repo `index.html` at main head.
- Exposure re-verified (Phase 4 check 6): `docs/HERMES_HANDOFF.md` served at the public URL, HTTP 200 on six of six confirmation probes; the served body is the current 2,666-byte main version including the internal work queue, governance notes, and the two-repository Pages requirement section. /README.md, /LICENSE, /styles.css are also publicly served (expected for a public repo's site root upload; low sensitivity). /favicon.ico 404; /.github/workflows/pages.yml and /.gitignore 404 (dot-paths not served).
- Probe-method note: during one window, CDN edge responses were inconsistent (isolated 404s interleaved with 200s for the same URLs, consistent with a deployment propagation). VERITY did not report the exposure cleared on a single 404; the settled state was established by repeated probes and a full body fetch. Any future "exposure fixed" claim must be verified the same way AFTER an authorized redeploy, because changing the workflow alone does not purge the existing deployment.
- Pages settings (source, HTTPS enforcement, custom domain) remain NOT READABLE via the connector; NOT VERIFIED, as before.

## Repo A — AGENTROPOLIS-HERMES-TV (private)

Result: NO SITE, NO EXPOSURE, GATE UNCHANGED.

- Tree on main and on `feat/android-tv-mock-ui` is identical: one `README.md`. No workflow, no content, expected Pages URL returns 404.
- Eligibility rule (official GitHub Docs, retrieved 2026-10-17, full text in Phase 3 Appendix A): private-repo Pages requires Pro/Team/Enterprise plans and the published site is PUBLIC by default; access-controlled publishing requires GitHub Enterprise Cloud. The org's plan tier remains NOT VERIFIED from VERITY's access; NEURO or Hermes must confirm it from org settings before any Repo A Pages decision.
- Recommendation unchanged: keep Repo A Pages OFF unless Enterprise Cloud private publishing is confirmed and NEURO approves a curated public-safe (or access-controlled) content set.

## Cross-site state

Still one minimal live landing page and one empty repo, not two coherent sites. The enhancement branch changes nothing about deployment: it is one commit BEHIND main and carries the same workflow blob. Any Pages fix must be based on current main (`06aa7c3d`), not on the stale branch point.
