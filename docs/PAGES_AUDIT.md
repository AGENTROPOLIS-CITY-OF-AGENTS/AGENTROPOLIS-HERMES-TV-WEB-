# HERMES TV — DUAL GITHUB PAGES AUDIT

Reviewer: VERITY (independent). Owner: NEURO. Date: 2026-10-17.
Method: repository reads via the user-connected GitHub connector (read-only), live URL probes, byte comparison of live vs repo content. Repository SETTINGS (Pages source configuration, environment rules, plan tier) are not readable through the connector and were not inspected in the GitHub UI; items depending on them are labeled accordingly.
No visibility changes, merges, or deployments were performed.

Heads: Repo A `35ec7a738a7ff1e187ea772cecf65001cc96884c` · Repo B `06aa7c3da6c3c73f5a6bd914e015369e0061c583`

---

## REPO A — AGENTROPOLIS-HERMES-TV (private, per NEURO)

Intended purpose: technical documentation, architecture explainers, Android TV demonstrations, HTML video protocol.

### Result: BLOCKED / NOT DEPLOYED

PASS:
- No confidential content is currently exposed through Pages: the expected site URL returns 404 and the repo contains no publishable content beyond a README.
- Repo contents (VERIFIED, full census): exactly one file, `README.md` (220 bytes). No workflows, no docs, no code, no assets, no `.github`.

FAIL:
- None against current state (nothing is published). The intended site simply does not exist yet.

BLOCKED:
- No Pages deployment workflow, no site content, and no `docs/` tree exist. The intended technical-docs site cannot be built or validated until Hermes creates content and a workflow.
- Pages eligibility and visibility for this private org repo depend on the org's GitHub plan and on GitHub's rule that Pages sites are publicly accessible unless privately published (Enterprise Cloud feature). Plan tier: NOT READABLE via connector. Doc-verified rules in Appendix A below; the org's actual plan tier is for NEURO/Hermes to confirm from org settings.
- README claim hygiene: the single README paragraph describes voice control, secure pairing, and spatial dashboards in the present tense with no pre-release status line. In a private repo this is low-risk, but if this text is ever published to a Pages site it would overstate the product. Recommend adding the same explicit pre-release wording Repo B uses.

RECOMMENDATION (safe alternatives, in order):
1. Do NOT enable Pages on Repo A for internal material until the plan question is answered in writing. On github.com, a Pages site from a private repo must be treated as PUBLIC unless the org has Enterprise Cloud private publishing.
2. Publish any public-safe technical docs from Repo B (or a dedicated public docs repo) using a curated subset, never a whole-repo upload.
3. If the org is on Enterprise Cloud, evaluate privately published Pages for Repo A; otherwise keep Repo A Pages OFF.

---

## REPO B — AGENTROPOLIS-HERMES-TV-WEB- (public)

Intended purpose: public landing page, installation portal, brand presentation, HTML video explainers.

Live URL: https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-HERMES-TV-WEB-/ (HTTP 200, VERIFIED 2026-10-17)

### Result: LIVE, with FAIL items

PASS:
- Deployment is real and current: live homepage bytes are SHA-256 identical to `index.html` at head (`c4e77ba46e24caf7f6156d6b37d0dafea682e5a70475e263493db18cdda1d116` both sides). Live != repo drift: none.
- Workflow `.github/workflows/pages.yml` is the standard Actions Pages pipeline with the minimal permission trio (contents: read, pages: write, id-token: write), deploys on push to main plus manual dispatch, concurrency-guarded.
- Claim hygiene on the page itself is good: "IN DEVELOPMENT · NO APK AVAILABLE YET", install section states no tested APK is published and instructions will appear only after signed builds and security checks pass. No unverified download links.
- Accessibility baseline in code: semantic landmarks, aria-labeled nav, `:focus-visible` outline, `prefers-reduced-motion` handling, responsive single-column layout under 700px, all computed text contrasts pass WCAG AA except the CTA (see BRAND_ASSURANCE_RECEIPT: white on #ff304e is 3.63:1, large text only).

FAIL:
1. Internal material is publicly served. The workflow uploads the ENTIRE repo root (`path: .`), so `docs/HERMES_HANDOFF.md` (internal work queue, governance notes, acceptance criteria) is live at https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-HERMES-TV-WEB-/docs/HERMES_HANDOFF.md (HTTP 200, VERIFIED). It contains no credentials, but it is internal process material the owner clarification in that very document says to audit for public accessibility. Fix options for Hermes: move internal docs out of the published tree, or scope the upload artifact to the site files only, or add a publish allowlist step.
2. README contradicts repo state (VERIFIED by reading both): README says "License review pending; do not assume an open-source grant until LICENSE is added", but an Apache-2.0 LICENSE (11,357 bytes) already exists at head. One of the two is wrong; reconcile.
3. README contradicts the owner's standing directive: it instructs builders to "Use Cursor", while NEURO's protocol directive and the handoff both say no Cursor ("Do not use Cursor" / "No Cursor dependency"). Correct the README.
4. Brand drift on the live site: no logo, no favicon (live /favicon.ico 404), off-sheet colors and fonts, different headline. Detailed in BRAND_ASSURANCE_RECEIPT.md.
5. Public dead end: the hero CTA links to Repo A (https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-HERMES-TV), which is private; an unauthenticated visitor gets GitHub's 404/login wall. Label it as private source or remove until public.
6. No HTML video explainer modules exist on the site yet (see HTML_VIDEO_PROTOCOL_AUDIT.md). The intended "explainer" purpose is unmet so far.
7. Workflow runs on `ubuntu-latest` (fleet-wide note: GitHub begins migrating ubuntu-latest from 24.04 to 26.04 on 2026-10-19; pin to ubuntu-24.04 if reproducibility matters).

BLOCKED:
- Pages settings (source type, HTTPS enforcement, custom domain) are not readable via the connector; the working Actions deployment is strong evidence of an Actions-based source, but the settings themselves are NOT VERIFIED.
- Actions run history / check conclusions are not readable via the connector; the deployment's success is established by the live-site evidence above, not by run logs.

---

## Cross-site coherence

- The two sites are NOT yet two coherent sites: Repo B is a minimal live landing page; Repo A has no site. Navigation, branding, and the explainer protocol are not shared yet because only one site exists.
- One naming note: Repo B's name ends with a trailing dash (`AGENTROPOLIS-HERMES-TV-WEB-`), which propagates into the public URL. Cosmetic, but renaming later breaks links; decide early.

## Appendix A — GitHub Pages rules for private repositories (from official GitHub Docs, retrieved 2026-10-17)

1. Plan matrix: GitHub Pages is available in public repositories on Free plans, and "in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server". On a Free org plan, the repository must be public. (docs.github.com, "Creating a GitHub Pages site"; repeated in "GitHub Pages limits".)
2. Default visibility, quoted from the docs: "GitHub Pages sites are publicly available on the internet, even if the repository for the site is private (if your plan or organization allows it). If you have sensitive data in your site's repository, you may want to remove the data before publishing."
3. Access-controlled ("privately published") Pages sites require GitHub Enterprise Cloud: a privately published site "can only be accessed by people with read access to the repository", is available for project sites from private/internal org-owned repos, and gets a unique `*.pages.github.io` subdomain. Not available on Free/Pro/Team.
4. Limits: published site max 1 GB; soft bandwidth 100 GB/month; 10 builds/hour soft limit does not apply to custom Actions workflows; Actions minutes are billed for private repos beyond the free allotment.

Consequence for Repo A: unless the org is on Enterprise Cloud AND the site is published privately, enabling Pages on the private TV repo makes the published content world-readable. The org's plan tier is NOT VERIFIED from VERITY's access; NEURO or Hermes can read it in org settings. Gate 1 in DUAL_SITE_RELEASE_GATE.md stands until that is answered.

## Evidence

- Connector censuses and file reads at the heads above (file SHAs recorded in the review workspace).
- Live probes 2026-10-17: Repo B root 200, Repo A root 404, Repo B /favicon.ico 404, Repo B /docs/HERMES_HANDOFF.md 200.
- Evidence copies and hashes: `~/workspace/reviews/hermes-tv/evidence/`.
