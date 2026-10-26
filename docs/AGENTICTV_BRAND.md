# AgenticTV brand contract

Owner decision: NEURO selected AgenticTV and authorized the branding change on 2026-10-26.

- Product: **AgenticTV**. Exact spelling and casing; no space.
- Attribution: **AgenticTV by AGENTROPOLIS**.
- Tagline: **Your screen. Your agents. Your rules.**
- Web surface: **AgenticTV Portal**.
- TV client: **AgenticTV TV app**.
- Hermes remains the designated developer/orchestrator and initial runtime integration. The product remains device-, protocol-, and runtime-agnostic by design. Planned compatibility is not verified support.

## Migration rules

Replace product-facing HERMES TV / HERMES-TV / HermesTV labels in page titles, metadata, navigation, accessibility descriptions, scene labels and current product docs. Keep Hermes when it names the runtime or orchestrator. The unrelated asimons81/hermestv project is not renamed, adopted or represented as an AGENTROPOLIS project.

Existing repository identifiers and URLs remain AGENTROPOLIS-HERMES-TV and AGENTROPOLIS-HERMES-TV-WEB- so links, Pages paths and integrations remain valid. This is a product-brand change; no repository transfer or URL migration is performed. A future slug migration requires a separate link/Pages/integration review.

Historical audit receipts, SHA-bound evidence, branch names and old release records retain their original text. A renamed source tree needs fresh hashes and review; old evidence is not relabeled as proof for new bytes. Use AgenticTV in new work on pending TV/web PRs. The old design and agent-layer drafts must adopt this contract when rebased; assurance receipts remain historical.

## Release hold

Web publishing PR #2 and follow-up #7 remain prerequisites. This branding branch is based on #7; do not bypass that chain by merging branding under the root-upload workflow. The two-file artifact allowlist and manual approved-SHA deployment gate are unchanged. Hero PR #5 still requires a separate reviewed runtime allowlist, complete media and independent review. No merge, deploy, endpoint change, integration enablement or availability/trademark clearance is granted by this contract.

## Local validation for this branding revision

9/9 existing tests pass under normal Python and Python -O. Local HTTP checks return 200 for both intended assets and 404 for all five excluded repository paths. No production deployment or independent review was performed. Artifact hashes:

- `index.html`: `2fce87e61136dba5300137d2da6fd4534a4b52d7931110b4d4c7144494850f7e`
- `styles.css`: `d4aa8069f47ea259f50a9a879dfc5d93df05be0c60c0b2a54ed6296132c720d3`
