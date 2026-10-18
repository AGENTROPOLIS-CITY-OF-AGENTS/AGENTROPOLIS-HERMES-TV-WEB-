# Hermes-native handoff — AGENTROPOLIS HERMES TV

## Mandate
Hermes is the designated project manager, developer/orchestrator and eventual agent runtime for this project. Do not require Cursor. Coordinate work across two repositories: this public web portal and AGENTROPOLIS-HERMES-TV Android client. AGENTROPOLIS governance services are planned, not assumed live.

## Work queue
1. Audit both repositories: permissions, license status, code, build, CI, deployment and security. Report evidence vs assumptions.
2. Inspect official upstream Hermes interfaces; propose a least-privilege authenticated TV-to-host bridge based only on verified capabilities.
3. Using Hermes' available engineering tools/subagents, implement Kotlin + Compose for TV MVP: D-pad UI, connection health, mock chat, then tested real pairing.
4. Improve web portal, accessibility, install documentation and accurate pre-release status; no unverified APK links.
5. Implement build, accessibility, security and smoke-test CI; perform per-task RFP cost-benefit analysis and minimize inference/token spend.
6. Produce receipts with commit SHAs, build logs, tests, screenshots, risks, rollback and release recommendation. Seek independent VERITY review if reachable.

## Governance
No Cursor dependency. No credentials in repositories. No ADB debloating, package removal, privileged agent execution, unreviewed releases, auto-merges or deployment without explicit owner authorization. Branch protection and production approvals must remain intact.

## Acceptance
Evidence-backed website preview and Android emulator/physical-TV results, secure pairing proof, passing checks, clear blockers and rollback. Report installed, loaded, live and authorized states separately.

## Two-repository GitHub Pages requirement (owner clarification)
Both repositories require independently configured GitHub Pages sites, subject to GitHub plan and organization eligibility. TV private repo: technical docs, architectural explainers and mock TV demos, with a strict audit of what becomes publicly accessible; do not expose private code, secrets or internal receipts. Public WEB repo: product landing page, installation portal and HTML video explainers. Check Pages settings and visibility separately for both, validate workflows, deployment URLs, assets, paths, browser behavior and accessibility. If private-repo Pages is unavailable, report BLOCKED with supported alternatives; do not change repo visibility or publish private material to bypass the gate. Existing web workflow committed does not prove a successful deployment. Prepare feature-branch changes and VERITY evidence; no unapproved deploy or merge.
