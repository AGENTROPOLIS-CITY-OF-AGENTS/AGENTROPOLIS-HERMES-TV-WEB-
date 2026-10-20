# Agent Layer pilot · HERMES TV WEB

Implements Layer 1 (TRUTH) of the AGENTROPOLIS Agent Layer design v0.1
on this surface. Base: main at 06aa7c3da6c3c73f5a6bd914e015369e0061c583.
Prepared by VERITY under NEURO's 2026-10-20 "Execute" directive.

## What this adds

- `index.html`: two additive injections only. A JSON-LD block and a
  fact-sheet link in the head, and a "What HERMES TV is" definition
  section (what / who / does / status with as-of date) before the
  closing main tag. Removing the injections reproduces the previous
  index.html byte for byte (sha256 verified during the build).
- `facts.json`: machine-readable fact sheet. Every fact names its
  source; file-sourced facts carry the sha256 of their source so any
  reader can recompute and compare.
- `llms.txt`: a short curated map of this surface for language models,
  including an explicit list of what is NOT claimed.
- `robots.txt`: crawler policy by class. INDEX crawlers (for example
  meta-webindexer) allowed, FETCH (user-requested agent fetchers)
  allowed, TRAIN crawlers (meta-externalagent, GPTBot, CCBot,
  Google-Extended, Bytespider) disallowed. Training use is a separate
  rights decision and is never bundled with indexing.
- `agent-layer.json`: the surface manifest (exposure matrix, twin
  locations, spec pins). Layer 2 (interfaces) is design-only; this
  manifest grants no agent any capability.

## Conformance audit (design section 7, pilot subset)

Run against the built payload before this PR was staged:

- Check 1 twin present: PASS
- Check 2 truth match (receipts recompute against LICENSE and
  index.html sources; commit consistency): PASS
- Check 3 freshness (as-of 2026-10-20): PASS
- Check 4 robots agreement with the exposure matrix: PASS
- Check 5 readability floor (semantic structure, labels, definition in
  raw HTML, fact sheet linked): PASS
- Check 9 language scan (no live, operating, or download claims in
  machine copy): PASS
- Checks 6, 7, 8: not applicable to this surface yet (no canvas, no
  interface endpoint; receipt reproduction is exercised inside check 2).

## Maintenance rule

Facts are generated from sources, never hand-edited in two places. If
page copy changes (install status, roadmap, license), regenerate the
fact sheet in the same change and re-run the audit. A stale fact sheet
is worse than none: it lies at machine speed.

## Merge warning

This repo's Pages workflow uploads the whole repository root. Merging
this PR publishes all five files to the live site immediately,
including the modified index.html. That is the intent of the pilot,
but the merge is a publication act and stays a human decision.
