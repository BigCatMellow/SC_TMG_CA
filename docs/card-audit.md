# Checking the app's data against the official cards

How to check every stat, keyword, cost, mission and map in the app against the publisher's files. Two full passes have been done this way (PR #124, then #127–#128). Follow it again whenever a new wave, cost table or FAQ comes out.

## Which source wins

Newest wins. When two sources disagree, use the higher one on this list:

1. **FAQ** (v1.3, 11 Nov 2026)
2. **Cost table** (9 Oct 2026). Ignore any cost printed on a card.
3. **Changelog** (Oct 2026)
4. **Wave 3 card sheets** (cards stamped v1.09.26)
5. **Quick Start rules**
6. **Wave 2 card sheets** (v1.06.26)
7. **Core Rules** (2026)
8. **Wave 1 card sheets** (v1.03.26 / v1.04.26)

Card text beats the Core Rules for that card. If two printings of one card disagree, use the higher version stamp.

All of these are on the [official downloads page](https://starcraft-tmg.com/downloads). Keep the PDFs out of the repo (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

## Reading the card sheets

The sheets are print-and-fold PDFs, which makes them awkward to read by machine:

- The back half of every unit card is printed **upside down**.
- Tactical cards are printed **sideways**.
- Plain text extraction drops both, and mixes the two halves of a card. The first audit missed Malignant Creep's faction tag and the last sentence of Omega Network partly because of this.

So:

1. Extract the text at all four rotations:
   `python3 scripts/card-audit/extract_card_text.py <folder with the card-sheet PDFs> <out folder>`
   Search the resulting `card-text.txt` for a unit or card name.
2. For anything that's a number in a box (stats, supply brackets, map distances), **look at the page image**, not the text. Text extraction loses which number sits in which box.
3. Print what the app has, in card order:
   `node scripts/card-audit/show-app.mjs zerg units roach` or `node scripts/card-audit/show-app.mjs zerg cards`

## What to check, card by card

**Units**
- Stat line: Speed, Armour, Evade, HP, Shield (Protoss: the box left of Speed), Size.
- Supply brackets: models → supply for every bracket printed, and no extra ones. (The Roach had a 4–6 bracket that isn't on the card.)
- Name as printed, including the bracketed base unit: "Kerrigan Swarm Raptor (Zergling)".
- Combat tags, Unique, and any faction tag (KERRIGAN'S SWARM, ZAGARA'S SWARM…).
- Every weapon row: range, target, RoA, hit, surge type, surge dice, damage, keywords. Upgrade weapons too.
- Every ability and upgrade: name, phase, Active / Passive / Reaction, cost (CP, BM, PE), and every number and keyword in the text. The app's text is paraphrased on purpose; the numbers and keywords must match exactly.

**Faction and tactical cards**
- Slots given, resource, gas cost, Unique.
- **Faction tag** (Core Rules 9.1.2): a card with a sub-faction tag can only go in that sub-faction's army. The app enforces this with `factionTag`.
- Every ability, as for units.

**Costs**
- Every unit composition, upgrade and tactical card against the cost table. `npm run test:appendix` checks this against `agent-rules/appendix-2026.json`; update that file first when a new cost table comes out.

**Keywords**
- Against the Core Rules glossary (Part 11) and any FAQ ruling. `npm run test:keywords` checks that every weapon keyword has a definition.

**Missions** (scenario cards, in the card sheets)
- Supply, supply per round, game length, early-win lead, for both Standard and Skirmish. They differ: Gather the Resources ends on 10+ in Standard and 8+ in Skirmish.
- Scoring lines, parameters and additional rules (Claim/Drop, Sabotage, Gather…).

**Maps** (deployment cards)
- Read the distances off the page image. In `uploads/missions.html`, x is measured from the left edge and y from the top, in inches.
- Zones are lists of rectangles `{x, y, w, h}`; an L-shape is two rectangles.
- Markers: every official map prints **1 and 3 Red, 2 and 4 Blue, 5 Neutral**. The VS screen relies on this to work out marker colours from your zone colour.
- Don't assume symmetry. Proving Grounds gives Red both short edges and Blue one strip.
- `test-mission-scoring` checks every map's size, markers and zone bounds, and the numbers above for the newer missions.
- The measurements drawn on each War Room map come from this data (`map-dims.js`). After changing a map, open it in the War Room and compare the drawing with the card: if the numbers match the card, the data is right.

## Known mistakes on the cards

The app uses the correct spelling; the card has a typo:

- Marauder: "CONCUSIVE SHELLS"
- Adept: "RESONATING GLAVES"
- Spec Ops Marauder: "AGG-12 RIFFLE"
- Nerazim faction card: no colon after "MIGHT OF THE NERAZIM"

Still open: Zagara's **Broodmother** upgrade has no published price. The app keeps it at 0m (decided 14 Nov 2026).

## When tests disagree with the cards

Two tests had locked in wrong data (the Roach's extra bracket, an old FAQ version label). The card wins: fix the data, then fix the test, and say so in the pull request. When writing a new test, take the expected values from the card, not from what the app shows.

## After a pass

- Edit `uploads/*.html` (or `wave3-data.js` for Wave 2/3 overlays), then `npm run build:units` / `npm run build:missions`.
- `npm run build:study` refreshes the NotebookLM sources; `npm run test:study` fails until you do.
- Run every `scripts/test-*.mjs`, add a test for each fix, and screenshot any screen the data shows on.
- Log the pass below.

## Log

| Date | PRs | Found |
|---|---|---|
| 14 Nov 2026 | #124 | Zergling stats and Surge; Vile upgrade phase; Wave 3 text from the cards; High Templar upgrades; missing Wave 2 Protoss (Zeratul, Nerazim Watchers, Nerazim card, Void Seeker); Rapid Ingress name; Air slots; two wrong BM costs; keyword glossary unified. |
| 14 Nov 2026 | #127, #128 | Malignant Creep faction tag; Omega Network sentence; Gather the Resources (Skirmish) 8+; Dirt Side layout; Roach bracket; two card names; Structure text; FAQ label v1.1 → v1.3. Added Artefact Hunt, Fire in the Sky and four maps. VS scoring didn't know marker colours. |
