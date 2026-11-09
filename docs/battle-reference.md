# Battle reference: 2026 rules + October 2026 balance

## Source precedence

1. **2026 Core Rules Book** (`StarCraft-TMG_EN.pdf`, provided by the user): mechanics, game phases, army legality, glossary, printed-page citation. PDF viewer page = printed page + 2.
2. **Publisher October 9, 2026 cost table**: [latest balance table](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Cost-Table-10.2026_EN.pdf) supersedes the Core Rules Appendix for unit, upgrade, and Tactical Card costs. [Official changelog](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Changelog-10.2026_EN.pdf).
3. **Publisher official card sheets**: [Terran](https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-Card-Sheets-A4_EN.pdf), [Zerg](https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-Card-Sheets-A4_EN.pdf), [Protoss](https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-Card-Sheets-A4_EN.pdf) for card-specific abilities and stats, subject to newer errata.
4. **[Publisher FAQ](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf)** when it clarifies or modifies the above.
5. **Companion data** is a presentation of sources, not a separate rule authority. The old `rules-data.js` is an HTML-derived fallback only.

Do not mistake the old Core Rules price appendix (printed pp. 96–107) for the October 2026 balance, and do not guess table cells from flattened PDF text.

## FAQ rulings and source priority

The official [publisher FAQ v1.1](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf) (September 25, 2026) is now searchable in the Rules screen as five additional source-cited sections. These cover Shields, Evade/Surge, Reaction timing, shooting batches, movement/deployment geometry, and mission-specific exceptions. In *Artefact Hunt*, Flying/Burrowed Units can **claim** Artefacts even when ordinary marker control restrictions apply; consult the mission for how a carrier can score.

## At-table interface

- `Rules.dc.html`: 20 common rule cards (15 core + five FAQ sections), plus one Terran/Zerg/Protoss-specific card each. All faction views retain common rules, search, jump chips, and printed rule citations.
- Faction Army pages: roster, unit/card details, Tactical Cards, battle trackers, saved rosters, and source-based costs.
- The implemented Wave 1 and selected Wave 2 compositions and upgrades use **October 2026** prices from `agent-rules/appendix-2026.json`. The data covers 25 purchasable mapped Units across the 3 factions and 34 Tactical Card entries. Zerg Swarmling and Vile Roach are newly included.
- Purchasable model counts match listed compositions; casualty ranges are **not** additional starting sizes.
- A Unit uses as many **Army Slots as its starting Supply Value**, not one slot per Unit.
- For upgrades with `low/high` point pairs, the higher cost applies to the larger composition.
- Summoned-only units are visible for reference but cannot be added through the muster button. Unique Units cannot be duplicated, and wrong-subfaction Units are blocked.
- Non-Unique Tactical Cards can have multiple copies. Each copy has its own Ready/Exhausted state; Unique Tactical Cards are limited to one.
- Saved rosters are not silently destroyed or rewritten: the app warns about wrong-faction Units, exceeded Minerals/Gas/Army Slots, duplicates of Unique cards, and invalid Units or compositions.

## Specific corrected keyword/card defects

The previous datasets misrepresented **PIERCE**, **INSTANT**, and **NON-LETHAL DAMAGE**. All three were corrected using the glossary, together with SIDEARM, BURROWED, SHIELDED, PLACE, SUMMON, RESPAWN, and Protoss **PE** terminology. Source `uploads/*.html` and generated `*-data.js` are kept in sync.

The Zerg Queen, Roach, and Corpser had mismatched weapons/abilities; these profiles were reconciled against the publisher's official printed cards. Vile Roach and Swarmling were added from the same cards. Jim Raynor's 0-point C-14 Rifle replacement upgrade was restored. See official unit-card sheets for exact card interactions.

## Wave 2 release addition

- Terran: **Siege Tank** and **Factory (Tech Lab)**.
- Zerg: **Ravager** and **Cocoon**.
- Protoss: **Immortal** and **Robotics Facility**.

The Army detail display applies selected full-unit weapon replacements (instead of showing replaced base weapons), retains base equipment alongside **SPECIALIST** weapons (which affect individual models), and excludes conflicting whole-unit replacements targeting the same base weapon. This is a reference representation; physical model-by-model Specialist assignments still need player attention.

Two legacy tooltip corrections: **PINPOINT** permits shots at Engaged targets, not selection of individual models; **LOCKED IN** adds Rate of Attack dice against targets with Stationary Status. Source HTML and generated data are updated together.

## Verification commands

```sh
npm run test:rules
```

```sh
npm run test:appendix
```

```sh
npm run build:units
```

Run `git diff --exit-code -- terran-data.js zerg-data.js protoss-data.js` immediately after regeneration to prove source and compiled data match. The PR GitHub Actions workflow runs these checks. The appendix test compares every listed unit composition, upgrade cost, and Tactical Card cost against the official 2026-10-09 map. It tests duplicate Tactical Cards and independent exhaustion, plus effective weapon profiles for full-unit replacements and Specialists.

## Limits and release scope

**Current verified target: the implemented Wave 1 dataset and three selected Wave 2 Units/cards, not the publisher's full October 2026 catalogue.** Many Wave 2/3 Units and Tactical Cards remain unimplemented. Do not assume those missing Units/cards are available. See issue #2 for the remaining comprehensive unit-card/ability audit.

The app does not automate mission-specific scoring, all terrain geometry, or every card's conditional logic; it is a companion, not a rules engine. For disputed game states or modifiers, consult the printed page or publisher FAQ. The Rules screen is a paraphrase, not a substitute for the full official rulebook. The full PDF and NotebookLM study sources are user-local, not committed into this public repository.
