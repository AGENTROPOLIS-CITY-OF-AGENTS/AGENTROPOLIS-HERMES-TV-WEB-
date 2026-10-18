# Hermes handoff — HERMES TV

## Mandate
Coordinate Cursor development of two separate repos: the public website (this repository) and the Android TV client (AGENTROPOLIS-HERMES-TV). Do not assume AGENTROPOLIS governance services are deployed.

## Work queue
1. Audit both repositories and confirm licensing, visibility, CI, and actual implementation status.
2. Audit official Hermes interfaces and select an authenticated, least-privilege pairing bridge based on verified APIs.
3. Build Android TV MVP in Cursor: D-pad navigation, connection health, mock chat, then tested real pairing.
4. Refine web landing page and documentation; keep APK links disabled until a signed, verified release.
5. Add build, accessibility, security and smoke-test CI, with cost-benefit analysis for dependencies and hosting.
6. Produce evidence receipts: commit SHAs, build logs, tests, screenshots, risks, rollback, and release recommendation.

## Governance
No credentials in repositories. No ADB/package removal. No auto-merge, deployment, release or privileged agent execution without explicit owner authorization. Route independent review to VERITY when available; do not claim review occurred without receipts.

## Acceptance
Working website preview, passing tests, Android emulator or physical TV evidence, secure pairing proof, and clear blocked items. Report installed vs loaded vs live vs authorized separately.
