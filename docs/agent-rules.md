# PDF rules for agents — shared core + faction lenses

This repository already has separate faction implementation datasets (`terran-data.js`, `zerg-data.js`, `protoss-data.js`) and an HTML-derived summary (`rules-data.js`). **Do not duplicate the common rules three times or assume the current companion data is reconciled with the 2026 Core Rules PDF.**

## Source authority

1. **User-supplied 2026 Core Rules PDF**: game mechanics, glossary, full numbered rule citations (PDF page = printed page + 2).
2. **October 9, 2026 publisher balance update**: [Official cost table](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Cost-Table-10.2026_EN.pdf) overrides the book's older cost appendix. The machine-readable checked map is `agent-rules/appendix-2026.json`; do not use the book's older numerical costs in answers.
3. **Official unit/faction/tactical card sheets** and [publisher FAQ](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf): specific card wording, weapon data, status interactions, and later clarifications. Flattened multi-column PDFs can lose row alignment: use the rendered page.
4. **Companion `*-data.js` files**: implemented Wave 1 dataset for the app, not proof of full publisher Wave 2/3 coverage. Flag unresolved source disagreements.
5. **`rules-data.js`**: older HTML-derived summary fallback; `battle-rules-data.js` is the newer paraphrased and page-cited reference.

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

The printed Core Rules appendix is retained only for book citations. **Current costs are from the publisher's October 2026 balance table**, which includes newer-wave Units not implemented in this companion. Example rosters are illustrative and do not override formal rules or current costs.

## Agent retrieval protocol

1. Find relevant shared sections in the generated `shared-index.json` and retrieve their complete text from `rules_sections.jsonl`.
2. Read the chosen faction's lens and corresponding `*-data.js` for current unit/card/ability details.
3. Verify current numeric values against `agent-rules/appendix-2026.json` and the October 2026 official tables; consult the publisher's rendered card pages for stats/abilities and the original PDF for diagrams. Note any unresolved discrepancies.
4. Answer with the rulebook section ID and **printed** page. Do not treat a glossary definition, worked example, or navigation index as a complete rule.

## Updating

Changes to `uploads/rules.html` affect only the HTML-based summary. Changes to faction `uploads/*.html` rebuild companion datasets by the existing scripts. A new rulebook edition needs a fresh extraction, source hash, and page-map review.
