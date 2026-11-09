# Battle-ready rules reference — 2026 Core Rules

## What changed

The `Rules.dc.html` screen now prefers `battle-rules-data.js`, a compact **paraphrased** quick reference grounded in the user-supplied 2026 StarCraft TMG Core Rules PDF. The older `rules-data.js` remains as a fallback and as the generated output of the pre-existing HTML parser.

- The Rules screen provides **Core / Terran / Zerg / Protoss** tabs. Each faction view includes all shared rules plus that faction's reference.
- **18 cards total:** 15 shared rule cards plus one for each of the three factions.
- Cards display section / printed-page citations (PDF viewer pages are printed page + 2).
- Scope-aware search and quick navigation operate on the selected set of rules.
- Keyword tooltips can search every faction dataset (not only Zerg); they are labeled **companion data** and should be checked against the PDF glossary when disputed.

## High-impact corrections checked against the PDF

| Item | Correct 2026 interpretation | Source |
|---|---|---|
| PIERCE [TAG] X | Against the named Combat Tag, weapon Damage becomes X. It does **not** move Armour dice to Damage. | Glossary p. 88 |
| INSTANT | Enemy Units cannot respond to that weapon's attacks with Reaction abilities. | Glossary p. 86 |
| NON-LETHAL DAMAGE (X) | Add Damage but do not remove models immediately; a later standard Damage event uses combined Total Damage for casualties. | Glossary p. 88 |
| Protoss resource | **PE** (not EN); applies to faction/tactical resources. | §10.5.1 p. 81 |
| SIDEARM | Additional weapons resolve as separate Batches; each can target another eligible Unit. | Glossary p. 89 |
| BURROWED | Cannot contest/control, has special action restrictions, and must unburrow via Close Ranks to attack in Combat. | Glossary p. 82 |
| PLACE | Has special positioning, Coherency, and Assault-phase Engagement treatment. | Glossary p. 88 |
| SHIELDED | Bonus first-model HP and loss of Shielded status; HEAL does not restore the status. | Glossary p. 89 |
| RESPAWN / SUMMON | Respect Supply, legal placement and specific activation sequencing. | Glossary pp. 89–90 |

The tooltip wording was revised in **both** `*-data.js` and its generator source `uploads/*.html`; regeneration by `npm run build:units` should preserve the corrections.

## Use at the table

1. Choose **Core** for the phase sequence, activation, legal actions, shooting, scoring, and cleanup.
2. Select the faction tab to keep core rules while adding that faction's resources and keyword focus.
3. Expand the relevant card. Its printed rulebook pages are shown next to the heading.
4. For a dispute or nontrivial terrain diagram, consult the original PDF. For unit/cost disputes, use the original Unit Card or rendered faction table.
5. Keep the existing round/VP tracker separate from the rules source. It records player inputs; it does not adjudicate results.

## Current limitations

**Not a fully audited army builder yet.** PDF printed pp. 96–106 contain multi-column unit/upgrade tables; p. 107 contains tactical-card point tables. Current faction cards, unit stats, upgrades, slot counts, and point costs were **not exhaustively reconciled** to those tables. This change corrects a verified glossary subset and PE terminology, not every number. Before competitive play, complete that visual table/card-by-card audit.

The PDF text extraction has some mixed-column sections; do not convert them to hard-coded numerics without image verification. The UI summaries are concise paraphrases, not authoritative replacements for specific card text. The imported PDF and full parsed text remain user-local; the public repo contains citations, curated summaries, and references but not the full copyrighted book.

## Verification

- Run `npm run test:rules` (source invariant and screen rendering checks).
- Run `npm run build:units`; verify the three output data files remain in sync with their `uploads/*.html` sources.
- Manually inspect the Rules screen at narrow phone width and verify search, faction filters, a keyword popup, expansion, and the round tracker.
- For numeric changes, add explicit source edition, printed page, and visual evidence before updating a value.

## NotebookLM practice

The user's separately generated `StarCraft_TMG_NotebookLM_Ready.zip` contains 12 chapter-level TXT sources, faction-focused TXT sources, glossary, consolidated text, a practice prompt, and the original PDF. This user-local archive is not committed to GitHub. For self-quizzing, import the chosen faction source and original PDF; ask NotebookLM to cite the section and printed page.
