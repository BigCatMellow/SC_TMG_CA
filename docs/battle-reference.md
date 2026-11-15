# Battle reference: 2026 rules + October 2026 balance

## Source precedence

Newest wins. When sources disagree, the higher one on this list applies:

1. **[Publisher FAQ](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf)** v1.3 (11 Nov 2026).
2. **[Cost table](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Cost-Table-10.2026_EN.pdf)** (9 Oct 2026). It replaces the Core Rules appendix and any cost printed on a card.
3. **[Changelog](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Changelog-10.2026_EN.pdf)** (Oct 2026).
4. **Wave 3 card sheets**, then the **Quick Start rules**, then **Wave 2 card sheets**.
5. **2026 Core Rules Book** (`StarCraft-TMG_EN.pdf`): mechanics, phases, army legality, glossary, printed-page citation. PDF viewer page = printed page + 2.
6. **Wave 1 card sheets**: [Terran](https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-Card-Sheets-A4_EN.pdf), [Zerg](https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-Card-Sheets-A4_EN.pdf), [Protoss](https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-Card-Sheets-A4_EN.pdf).

A card's own text beats the Core Rules for that card. **Companion data** is a presentation of these sources, not a rule authority; the old `rules-data.js` is an HTML-derived fallback only. How the data is checked: [card-audit.md](card-audit.md).

Do not mistake the old Core Rules price appendix (printed pp. 96–107) for the October 2026 balance, and do not guess table cells from flattened PDF text.

## FAQ rulings and source priority

The official [publisher FAQ v1.3](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf) (November 11, 2026) is now searchable in the Rules screen as five additional source-cited sections. These cover Shields, Evade/Surge, Reaction timing, shooting batches, movement/deployment geometry, and mission-specific exceptions. In *Artefact Hunt*, Flying/Burrowed Units can **claim** Artefacts even when ordinary marker control restrictions apply; consult the mission for how a carrier can score.

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

## Wave 2 and Wave 3 missions and maps

- Missions: **Artefact Hunt** (Wave 2) and **Fire in the Sky** (Wave 3), Standard and Skirmish.
- Maps: **Green Valleys** and **Power Lines** (36×36), **Meeting Engagement** and **One Bridge Too Close** (54×36).
- Every official map prints markers 1 and 3 Red, 2 and 4 Blue, 5 Neutral. In VS, pick your zone colour once and each marker's colour follows from its number.
- Fire in the Sky tracks a Sabotage Level (1–3) per marker. Artefact Hunt's round 5 claim points are entered by hand.

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
