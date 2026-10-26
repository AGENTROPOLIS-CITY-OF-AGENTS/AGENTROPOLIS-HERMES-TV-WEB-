# AgenticTV by AGENTROPOLIS — Web

Public landing page and documentation portal for the proposed AgenticTV client.

**Status:** pre-release; no verified APK or live Hermes integration. Do not claim otherwise.

**Brand:** AgenticTV by AGENTROPOLIS. Hermes is the initial agent runtime and development orchestrator. See [brand contract](docs/AGENTICTV_BRAND.md).

## Architecture
Android TV client (separate repository) → authenticated bridge → user-owned Hermes runtime. This repository hosts only public website content.

## Development
Hermes is the designated developer and orchestrator. Build a static, accessible, mobile-first website with obsidian, cyan and red design tokens. GitHub Pages deployment must pass build, link, accessibility and security checks before publication.

## Safety
Never commit credentials, device identifiers, private runtime data, signing keys, or user conversations. Do not publish APK download links without a verified signed release.

## License
Apache-2.0; see LICENSE.
