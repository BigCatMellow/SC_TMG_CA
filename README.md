# StarCraft TMG Companion

A free, phone-first companion for the **StarCraft Tabletop Miniatures Game**: build armies for all three factions, look up any rule, and run a game against your opponent on one shared scoreboard.

> **Unofficial fan project.** Not affiliated with or endorsed by Blizzard Entertainment or Archon Studio. StarCraft and all related names, images, miniature photographs and rules text belong to their owners and are used here for a free, non-commercial player aid. Nothing you enter leaves your device: armies, lists and games are saved only in your browser.

**Live app: https://bigcatmellow.github.io/SC_TMG_CA/**

---

## What's in the app

### Command Center (home)
- Pick a faction: **Terran** (The Dominion), **Zerg** (The Swarm) or **Protoss** (The Firstborn).
- **War Room** for missions, maps and battle setup, and the **Field Manual** for rules.
- A live panel with the current mission, round and victory points.

### Army pages (one per faction)
Every army page shares the same header and the same six tabs.

**Header**
- **Minerals, vespene and supply** against your game size's limits.
- **Role slots** (Hero, Elite, Core, Support), each name in its role colour. A count turns red when you go over.
- **Roster issues** chip: tap it for a list of what's wrong and how to fix it.
- **Lists** (briefcase): your saved lists. See *Lists* below.
- **Share**: a QR code, link or code for the army on screen. See *Sharing* below.
- **Search**: units, abilities, keywords and tactics in one box.

**Tabs**
- **Brood / Command / Nexus** (faction tab)
  - Choose the game size (Skirmish, Standard, Grand).
  - Pick your faction card, which sets your base role slots and faction abilities.
- **Library**
  - **Quick build**:
    - A tile per unit with a button for each tier and its cost. One tap adds the unit.
    - Units already in your army are outlined in their role colour, with a ×count and a − to remove one.
    - Tap a model for its stats, weapons, abilities and tiers.
    - The **Army** tab (bottom right) opens your army: change tier, toggle upgrades (priced for that tier), or remove a unit.
    - Summoned units and other faction cards' units are listed too, with a note on why they can't be added.
  - **Unit cards**: the full card for every unit (stats, weapons, abilities, tags, upgrade hints), grouped by role with sticky headings. Tap **View** for the model fullscreen.
- **Tactics**: tactical cards grouped by category. Each card shows its phases, what it does, and the slots or resources it gives.
- **Roster**: your army, ready to review.
  - **List bar**: the current list's name, *Saved / Unsaved changes*, and **Save**.
  - **Cards**: your faction card and tactical cards, with their abilities readable in place. Pills like *+1 Elite* show the slots each card gives.
  - **Units**, grouped by role. Open one to change tier, set upgrades, remove it, or read its stats, weapons and abilities.
- **VS**: opens the game screen (below) with this army.
- **Codex**: worked rules, keywords and tags with search and examples. Keywords anywhere in the app are tappable for their definition.

### VS (play a game)
One screen for both armies and the score.
- **Scoreboard**: victory points for each side, round, mission, and a lead meter.
- **Your forces / Battlefield / Opponent** views.
- **Unit rows**:
  - Deploy or reserve each unit; the supply cap comes from the mission.
  - One HP or Models stepper per unit, with a split health bar (one segment per model).
  - The models whose loss would drop the unit's supply are shown in the bright team colour, so you can see a supply drop coming.
  - Damage carries over between models the way the rules say: one damage marker per unit, and models removed as their HP runs out.
- **Tap a unit** (yours or theirs) for a sheet with its stats, weapons and abilities, upgrades included.
- **Tap a card** to read its abilities and **Use** one. The card is exhausted and remembers which ability you used this round.
- **Mission markers** and **End round**:
  - Markers can be held by you, them or nobody, and activated when the mission needs it.
  - End round suggests scoring, readies cards, and raises the supply pool.
  - **New game** comes with undo. A game-over banner appears when the mission ends.
- **Scout the enemy**: enter the opponent's faction, faction card, tactical cards and units by tier. Or skip that and load their shared army.
- **Share** on the top bar.

### War Room (missions and setup)
- Pick the mission, map and game size.
- Read the briefing, scoring and marker placement.
- Use the round tracker, and print a battle sheet.

### Field Manual (rules)
- Searchable rules: phases, actions, keywords and judge calls.
- A source-cited quick reference ([battle-rules-data.js](battle-rules-data.js)).

### Lists (save and manage armies)
- **Save** updates the list you're on.
- **Save as new** names a new list.
- **New list** starts empty, asking first if you have unsaved changes.
- Every saved list shows its faction card, units, minerals and date. Tap one to load it; the app asks first if loading would lose unsaved changes.
- The **⋯** menu on a list: **Share**, **Rename**, **Duplicate**, **File** (JSON download) and **Delete**.
- **Import file** brings back a downloaded list, and **Export Army Sheet** prints your army.
- Lists are kept per faction, in this browser.

### Sharing (QR code, link or code)
- **Share** is on every army page header and on the VS top bar. It's also in each list's ⋯ menu.
- It shows a **QR code**, plus **Send link** (your phone's share menu) and **Copy code**.
- Your opponent scans the QR code with their phone's camera, or taps the link. The app asks whether to load the army **as my opponent** (fills their VS) or **as my army**.
- On a PC, paste a code or link into **Have a code?** in VS's Share sheet.
- The code carries:
  - faction and faction card
  - each unit's tier and upgrades
  - tactical cards
- No server is involved: the army travels inside the link.
- Codes are versioned. Anything a newer or older app doesn't know is skipped, with a note.

### Works offline and installs like an app
- After the first visit the app works with no connection. React, the fonts and the QR library are bundled in `vendor/`, and a service worker (`sw.js`) caches every screen.
- On Android Chrome, open the live link and choose **Add to Home screen / Install app**.
- There's also a lightweight Android APK shell in the [HTML2APK `starcraft-tmg` project](https://github.com/BigCatMellow/html2apk/tree/main/apps/starcraft-tmg) that loads the same site.
- The APK and the browser keep separate storage. Share or download your lists before clearing app data or uninstalling.

---

## Rules sources and accuracy

- The official [Downloads page](https://starcraft-tmg.com/downloads) hosts the complete rulebook, FAQ, card sheets and balance updates. Full publisher PDFs and verbatim rulebook text are linked, not mirrored here.
- Costs follow the **October 2026** cost table ([agent-rules/appendix-2026.json](agent-rules/appendix-2026.json)). The rulebook's own appendix is the older price list.
- Keyword definitions are checked against the 2026 Core Rules glossary (Part 11) by `test-keywords`.
- Later-wave catalogue coverage is tracked in [Issue #2](https://github.com/BigCatMellow/SC_TMG_CA/issues/2).
- Spot an error? Use the **rules correction** issue template (see below).

---

## For developers and agents

**Layout**
- One page per screen, as `*.dc.html`:
  - Home: [index.html](index.html), [Command Center](Command%20Center.dc.html)
  - Armies: [Terran](Terran%20Army.dc.html) · [Zerg](Zerg%20Army.dc.html) · [Protoss](Protoss%20Army.dc.html)
  - [VS](Vs.dc.html), [War Room](Missions.dc.html), [Rules](Rules.dc.html), [Unit detail](UnitDetail.dc.html)
- Styles are shared in [shared-styles.css](shared-styles.css).

**Data**
- Unit data (`terran-data.js`, `zerg-data.js`, `protoss-data.js`) is **generated** from `uploads/*.html` by `npm run build:units`. Edit the sources, not the generated files. CI fails if they drift.
- Hand-maintained: `wave3-data.js`, `missions-data.js`, `mission-scoring.js`, `plain-english.js`, `model-portraits.js`.
- Army share codes live in [share-code.js](share-code.js).
- See [docs/updating-data.md](docs/updating-data.md) for updating data.

**Docs**
- [Agent retrieval guide](docs/agent-rules.md)
- [Battle reference](docs/battle-reference.md)
- [Playtesting process](docs/playtesting.md)
- [UI overhaul retro](docs/retro-2026-11-ui-overhaul.md)
- [NotebookLM study sources](notebooklm/README.md)

**Checks**
- Every `scripts/test-*.mjs` runs on each pull request (the required **rules** check). Run them all locally with:
  `for s in scripts/test-*.mjs; do node "$s" || break; done`
- Useful named ones:
  - `npm run test:rules`, `test:appendix`, `test:keywords`, `test:share`, `test:vs`, `test:unified-army`
  - `npm run build:units`, then `test:study`

**Deploy**
- Every merge to `main` that changes the site runs the [Pages workflow](https://github.com/BigCatMellow/SC_TMG_CA/actions/workflows/deploy-pages.yml).
- The repository's Pages source must be **GitHub Actions**. `scripts/prepare-pages.mjs` stamps the service worker so each deploy refreshes the offline cache.

---

## Sharing, reporting and contributing

- Share the live app link above. Players need nothing else: there are no accounts and no data is collected.
- Found a problem? Open an [issue](https://github.com/BigCatMellow/SC_TMG_CA/issues/new/choose): a bug report or a rules correction.
- Want to help? See [CONTRIBUTING.md](CONTRIBUTING.md). Changes reach the live site only through pull requests reviewed by the owner.
