# Data build pipeline

Regenerates `terran-data.js`, `zerg-data.js`, `protoss-data.js`, `missions-data.js`, and
`rules-data.js` from the source files in `uploads/`. The UI (`*.dc.html`, `support.js`) never
changes — it just reads whatever these files currently contain.

## Updating the game data

1. Replace/edit the relevant file in `uploads/` (`terran.html`, `zerg.html`, `protoss.html`,
   `missions.html`, or `rules.html`).
2. Run `npm run build` (or a single `npm run build:units` / `build:missions` / `build:rules`).
3. Reload the app — the `*-data.js` files are regenerated in place.

## How each generator works

- **`build-units.mjs`** (terran/zerg/protoss): `uploads/<faction>.html` is itself a full
  army-builder page with its own `KEYWORDS`/`TAGS`/`UNITS`/etc. embedded as a plain `<script>`
  data block. This just lifts that block out verbatim and wraps it as `window.SCTMG_<FACTION>`.
  It's a copy, not a parser — if you paste in a newer exported version of that faction's page,
  whatever it contains becomes the new data 1:1.

- **`build-missions.mjs`**: same idea, for the `MISSIONS`/`MAPS` block embedded in
  `uploads/missions.html`.

- **`build-rules.mjs`**: `uploads/rules.html` is real prose HTML (`.section` / `.subsection` /
  `.rule-item` markup), so this one actually parses it — section names, meta text, intros,
  and rule bullets are read fresh from the HTML every run. A `SECTION_CONFIG` table at the top
  of the script holds the handful of things that aren't in the source markup at all (accent
  color, icon key, a couple of display-name tweaks, and the synthetic group names used where a
  section has a bare bullet list with no subsection heading). If you add a brand-new top-level
  section to rules.html, the build will throw and tell you to add a one-line entry there.

Note: the auto-generated rules text is pulled verbatim from `uploads/rules.html`. A few
sentences in the previous hand-tuned `rules-data.js` had been lightly trimmed for concision
(e.g. "Bring units onto the table..." vs. the source's "Movement is for bringing units onto the
table..."). That polish doesn't exist in the source HTML, so it won't reappear on rebuild unless
you tighten the wording in `uploads/rules.html` itself.

## Unit art cutouts

The Library's breakout cards use transparent "cutout" portraits in `portraits/cutout/`,
mapped from each original portrait src by `portraits/cutout/index.js`. Units without a
cutout fall back to the original framed photo automatically.

```
pip install "rembg[cpu]" pillow
python3 scripts/cutout-portraits.py            # local publisher JPEGs
python3 scripts/cutout-portraits.py --remote   # also the external gallery images
```

Re-run after adding a portrait to `model-portraits.js`; existing cutouts are kept unless
`--force` is passed. Group photos may need a crop box in the script's `CROPS` table.
