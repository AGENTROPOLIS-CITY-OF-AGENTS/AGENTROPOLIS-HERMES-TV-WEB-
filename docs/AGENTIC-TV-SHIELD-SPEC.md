# AGENTIC TV Shield by AGENTROPOLIS

Status: PROPOSED / NOT DEPLOYED. This specification does not claim functional monitoring or blocking.

## Canonical naming
- Parent: AGENTROPOLIS
- Platform: AGENTIC TV
- Product: Agentic TV Shield
- Internal module: AGENTROPOLIS-TV-SHIELD
- Features: Privacy Checkup, Tracker Radar, Mic Guard, Network Map, Privacy Receipts
- Hermes: optional underlying agent adapter, never consumer-facing product name.
- Legacy HERMES-TV repository names: migration candidates only; preserve existing Pages URLs, integrations, and redirects until audited.

## MVP user journey
1. Select manufacturer, model, firmware, and OS; never infer support from brand alone.
2. Show model-specific instructions to inspect/disable ACR, viewing-information services, and interest-based advertising; require explicit user confirmation.
3. Optionally connect a separately authorized local DNS/network gateway to observe destination domains and apply opt-in filtering.
4. Explain observed telemetry with evidence, timestamp, source, and uncertainty. DNS lookups are not proof of microphone recording or screen capture.
5. Export a privacy receipt distinguishing self-reported setting changes, gateway-verified blocks, unsupported controls, and unknowns.
6. Offer an optional AGENTIC TV 3D portal with Vision Claw only after explicit permission.

## Nonnegotiable security and privacy
- No unauthorized root access, exploit chains, firmware modifications, hidden recording, or permission bypass.
- No false claim of detecting all trackers, microphone usage, or data exfiltration.
- Local-first; no sale of viewing, audio, or telemetry data. Retention off by default; opt-in diagnostic export.
- AEGIS: deny-by-default capabilities; 54T: device isolation, least privilege, signed change receipts, rollback and audit.
- Keep TV control separate from mic/camera access and network administration.
- Explicit user approval before DNS/firewall changes; explain streaming breakage risk and rollback.
- Never treat ad coincidence as evidence of microphone surveillance.

## MVP acceptance criteria
- Demonstrate a guided privacy checkup for at least one verified TV model and firmware.
- Show unsupported and unknown states instead of fabricated protection scores.
- Produce machine-readable receipt with evidence_source, timestamp, action, verification_state, device_id pseudonym, and rollback.
- Simulated network events clearly labeled DEMO; live telemetry only after consent and a compatible gateway.
- Validate accessibility, TV remote navigation, mobile layout, and no-HDMI browser path where supported.
- Pass 54T security review and AEGIS authorization review before deployment.

## Implementation sequence
Phase 0: inventory existing HERMES-TV and HERMES-TV-WEB- code, dependencies, Pages and naming references.
Phase 1: implement read-only guided privacy checkup and evidence-backed receipts.
Phase 2: add optional network gateway adapters and user-approved blocking with rollback.
Phase 3: integrate Agentic TV portal, 3D agents, Vision Claw, and cross-platform device connectors.

This document is a product and engineering contract, not a declaration of deployed functionality.
