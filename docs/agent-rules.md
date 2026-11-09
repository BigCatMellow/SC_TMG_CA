# PDF rules for agents — shared core + faction lenses

This repository already has separate faction implementation datasets (`terran-data.js`, `zerg-data.js`, `protoss-data.js`) and an HTML-derived summary (`rules-data.js`). **Do not duplicate the common rules three times or assume the current companion data is reconciled with the 2026 Core Rules PDF.**

## Source authority

1. **User-supplied 2026 Core Rules PDF**: primary source for general rules. Retain section IDs and printed/PDF page references; for numbered pages, PDF page = printed page + 2.
2. **Official Unit, Tactical, and Faction Cards**: verify faction-specific abilities, upgrades, and figures with the card or a readable PDF table. A flattened multi-column PDF is not a reliable source for table cell values.
3. **Companion `*-data.js` files**: current app implementation only. Flag disagreements with source material instead of assuming the app is already correct.
4. **`rules-data.js`**: a short rules reference rebuilt from `uploads/rules.html`, not the full PDF or evidence of newer errata.

Faction lenses are **navigation overlays**, not competing rule systems. Shared rules always remain available. A focus keyword such as `HIDDEN`, `SHIELDED`, or `PLACE` is not exclusive to a faction just because it appears in one index.

## Generate locally

Extract the agent reference pack from the accompanying project conversation. Then, from the repository root:

```sh
node scripts/build-agent-rules.mjs /path/to/starcraft_agent_pack
```

This validates the PDF SHA-256 and all required section IDs, then creates `agent-rules/generated/shared-index.json` and `terran.json`, `zerg.json`, `protoss.json`. The generated directory is ignored by Git. The tracked `agent-rules/factions.json` contains only the compact source map and navigation metadata, not full rulebook text.

## Faction tables in the PDF

| Faction | Unit and upgrade tables | Example armies |
|---|---|---|
| Terran | Printed pages 96–98 | 108–109 |
| Zerg | Printed pages 99–103 | 110–111 |
| Protoss | Printed pages 104–106 | 112–113 |

The tactical-card point tables for all factions appear on printed page 107. **Verify numbers against the rendered PDF** before answering about points or upgrades. Example rosters illustrate army building; they do not override formal rules.

## Agent retrieval protocol

1. Find relevant shared sections in the generated `shared-index.json` and retrieve their complete text from `rules_sections.jsonl`.
2. Read the chosen faction's lens and corresponding `*-data.js` for current unit/card/ability details.
3. Verify numeric or diagram-dependent facts in the original PDF or original card image; note any remaining discrepancy.
4. Answer with the rulebook section ID and **printed** page. Do not treat a glossary definition, worked example, or navigation index as a complete rule.

## Updating

Changes to `uploads/rules.html` affect only the HTML-based summary. Changes to faction `uploads/*.html` rebuild companion datasets by the existing scripts. A new rulebook edition needs a fresh extraction, source hash, and page-map review.
