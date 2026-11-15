# Updating the game data

This project's rules, units, and missions are generated from source files in `uploads/`. The
app itself (`*.dc.html`, `support.js`) never needs to change for a data update — it just reads
whatever the generated `*-data.js` files currently contain.

## How to update something

1. Replace or edit the relevant file in `uploads/`:
   - `terran.html`, `zerg.html`, `protoss.html` — faction units, cards, keywords, tags
   - `missions.html` — missions and deployment maps
   - `rules.html` — rules reference text
2. From the project root, run:
   ```
   npm run build
   ```
   (or one generator at a time: `npm run build:units`, `npm run build:missions`,
   `npm run build:rules`)
3. Reload the app. The corresponding `*-data.js` file(s) have been rewritten in place.

## Data that isn't generated

- `wave3-data.js`: Wave 2/3 units and cards, layered on top of the generated faction data, plus the shared keyword glossary. Edit it directly.
- `unit-effects.js`: what each upgrade and card bonus changes on the VS unit card. A new upgrade needs an entry here; `scripts/test-effects.mjs` fails until it has one.
- `mission-scoring.js`: the End round suggestions. A new mission falls back to "destroyed supply only" until it gets a case here.

## After any data change

1. `npm run build:units` and/or `npm run build:missions`.
2. `npm run build:study` to refresh the NotebookLM sources (`test:study` fails otherwise).
3. Run every `scripts/test-*.mjs`. CI also fails if the generated `*-data.js` files don't match their `uploads/` sources.
4. To check the data against the official cards, follow [card-audit.md](card-audit.md).

## What the build actually does

- **Faction & mission files** (`build-units.mjs`, `build-missions.mjs`): `uploads/*.html` are
  themselves full standalone army-builder/mission pages with their own data embedded as a plain
  `<script>` block. The build just lifts that block out verbatim and wraps it as
  `window.SCTMG_<FACTION>` / `window.SCTMG_MISSIONS`. It's a copy, not an interpretation — paste
  in a newer exported version of one of those pages and its contents become the new data 1:1.

- **Rules file** (`build-rules.mjs`): `uploads/rules.html` is real prose HTML
  (`.section` / `.subsection` / `.rule-item` markup), so this one is an actual parser — section
  names, meta text, intros, and rule bullets are read fresh from the HTML every run. A small
  `SECTION_CONFIG` table at the top of the script holds the handful of purely visual choices
  that aren't in the source markup at all (accent color, icon key, a couple of display-name
  tweaks, and the group name used where a section has a bare bullet list with no subsection
  heading). Adding a brand-new top-level section to `rules.html` will make the build stop and
  tell you to add a one-line entry there.

## One known gap

The generated rules text is pulled verbatim from `uploads/rules.html`. A few sentences in the
original hand-tuned `rules-data.js` had been lightly trimmed for concision (e.g. "Bring units
onto the table..." vs. the source's "Movement is for bringing units onto the table..."). That
polish only existed in the old hand-edited file — it won't reappear on rebuild unless you
tighten the wording in `uploads/rules.html` itself.

See `../scripts/README.md` for the same notes closer to the code.
