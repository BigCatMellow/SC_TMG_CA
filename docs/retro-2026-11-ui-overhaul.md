# Retro: the November 2026 UI overhaul (PRs #27–#132)

These notes cover how this work was done, not just what came out of it. They record what worked, what went wrong, and what we would do differently next time. Mistakes are fine. Making the same mistake twice is the thing to avoid.

Work done by bt 7274 with Claude, 9–15 November 2026. Sections 1–4 cover PRs #27–#53. Section 5 covers the design pass that followed (#55–#65), section 6 the polish pass (#66–#73), and section 7 the afternoon of 12 November (#74–#88), ending with getting ready to share. Section 8 covers 12–15 November (#89–#132): Roster and VS taking over from the Battle tab, Quick build, sharing and lists, and two full audits against the official cards, and measurements drawn on the maps. Open threads are at the end.

---

## 1. What happened, in order

| Stage | PRs | What drove it |
|---|---|---|
| UI review from phone screenshots | #27–#28 | bt 7274 asked for a review of how the app looks and works on a phone. |
| Keep the model art, but make it work | #27, #29–#31 | Pushback on the review: the unit art adds flavour and must stay. We mocked up options (B + D, "more space" version 1) before building. |
| "Look at it like a player mid-game" | #32 | The key question: *"There's a difference between useful and needed."* That led to a lean play mode. |
| Bring back auto-scoring | #33 | We built a mockup first to check it would actually get used. |
| Battle cards like Library cards, one supply recorder | #34 | Bug-like report: two supply recorders, mismatched cards. |
| Reopen where you left off | #35 | The app reset on every open. |
| Wall of text, 3 taps to card info | #36–#38 | Readability report from real use. |
| Helper-agent playtest | #39–#41, #45 | A separate agent played the app and found 19 issues, including real bugs. |
| Models only, no concept art | #42–#44 | Taste call: concept art "looks terrible". Promo photos were cut out per unit. |
| Where am I in the list? | #46, #50, #52 | Floating section tab and jump menu. |
| Information overload check | #47 | An audit before adding more: closed Battle cards went from 275px to about 140px. |
| Back gesture, indents, headings, role colours | #48–#49, #52 | Feel and polish from use on a real phone. |
| VS mode | #53 | Mockup (Design canvas), then a tweak (score centre-top), then a VS button instead of a separate desktop mode. |
| Army share codes | — | **Parked on purpose.** A 40-character code is too much to type. |

---

## 2. What we did right (keep doing these)

**Mock it up before building anything that's a judgement call.** Model art options, auto-scoring and VS mode all got a mockup first. Each time the feedback changed the build: "more space" version 1, "is this used or just more stuff?", and "score centre-top for a VS feel". Building first would have meant building the wrong thing.

**Ask "is it needed?", not just "is it useful?"** The best design call came from bt 7274: players won't stop to tap phase buttons every turn. That one question removed more clutter than any visual tweak. Use it on every new feature.

**Check for overload before adding more.** After a run of features we stopped and measured the screens before adding anything else. Cutting the "Fits" line, squad damage rows, collapsed tags and the full roster warning nearly doubled how many units fit on screen. Plan a declutter pass after every few features.

**Get an independent playtest.** The helper agent used the app like a player, at several screen sizes, and found things two people looking at the same screens had missed:
- upgrades could not be bought at all;
- the round tracker's Round + skipped the end-of-round steps;
- a 360px layout was clipped;
- keywords were matched in the middle of words ("place|d").

Run one after any big batch of changes.

**Screenshot every change at phone width.** Rendering at 390px (and 360px) before sending caught several issues before bt 7274 saw them:
- a tag chip broken mid-word ("Groun d");
- the "S / S" header labels;
- the Ravager flame cut off flat;
- a mislabelled marker in the mockup.

**Small PRs, one theme each, merge on request.** Each PR had one theme, a screenshot set and a merge question. Rolling back would always have been easy.

**Tests that guard decisions, not just code.** When we decided something, a test locked it in:
- no `&&` in templates;
- one supply stepper only;
- no concept-art paths;
- a weekly remote-photo link check;
- VS scoring auto-fills from the casualties logged on both sides.

**One source of truth across screens.** VS mode reads and writes the same saved data as the Battle tab (`sctmg_play`, `sctmg_<faction>_v5`), plus one new key for the opponent. Nothing is copied, so nothing can drift. Making VS its own page (not a fourth copy inside three faction files) kept it to one place.

**Choose honest fallbacks over pretty fakes.** When no miniature photo existed, the card shows plain rather than concept art. When the publisher crop clipped the Ravager, we said so instead of hiding it.

---

## 3. Mistakes, what they cost, and the lesson

### Template engine limits
- **What happened:** we used `&&` and ternaries inside `{{ }}`. They fail silently, which caused the tactical-button bug and a stray `title="true"`.
- **Lesson:** the template engine supports dotted paths only. Compute values in `renderVals()` and bind by name. A test now rejects expressions in templates.

### Interpolated text is wrapped in a `<span>`
- **What happened:** the VS chips CSS used `.sc-vs-chips span`. The runtime wraps every `{{ value }}` in `<span class="sc-interp">`, so that rule hit the numbers too and drew a box inside each box.
- **Lesson:** use child selectors (`> span`) or classes in dc pages. Never style a bare `span` by descendant.

### CSS class name clash
- **What happened:** the new `sc-battle-card` class already existed for tactical cards, and the art broke out of the wrong card.
- **Lesson:** `grep` the stylesheet for a class name before you introduce it.

### The back-gesture fix broke the jump menu
- **What happened:**
  - The back-gesture work (#48) adds a history entry while a panel is open and removes it on close.
  - The section jump (#46) scrolled, then the menu closed.
  - The history pop restored the old scroll position, so every jump was undone.
  - Nobody noticed until bt 7274 reported "the menu isn't working anymore".
- **Lessons:**
  - When you add a global mechanism (history, scroll, storage), re-test the features that touch it: anything that scrolls, navigates or closes a panel.
  - Set `history.scrollRestoration = 'manual'` when using `pushState` for overlays.
  - Run follow-up actions after the `popstate` fires, not before.

### Editing three near-duplicate faction files
- **What happened:** scripted edits succeeded on Zerg and failed half-way on Terran, because colours and small details differ per file. Once, a failed run left one file edited and two not.
- **Lessons:**
  - Make edit scripts assert per file, and use patterns, not exact strings, where factions differ.
  - Run them file by file when re-trying.
- **Bigger lesson:** the three ~150KB faction files are the main source of friction and risk. New shared features should live in shared files (`shared-styles.css`, `*.js` helpers, a separate page like VS) rather than a fourth edit in three places. **Worth a dedicated refactor:** one army page parameterised by faction.

### A shell command that does too much
- **What happened:** "commit, push, open PR, merge" in one command. When the merge step was blocked, the whole command was refused, including the commit, and we only found out later ("No commits between main and …").
- **Lesson:** run commit/push separately from merge. Check the result of each step.

### CI and deploy surprises
- **Flaky Chrome:** the home-viewport check failed twice because headless Chrome took more than 12s to start on a cold runner. Re-running from here wasn't allowed. The fix was to wait up to 60s (#51).
- **Deploy didn't fire:** after #51 the site didn't deploy, because the deploy workflow only triggers on site files and that PR only changed a test. bt 7274 had to start it by hand.
- **Lessons:**
  - Give anything that launches a browser in CI a generous timeout.
  - Check a workflow's `paths:` filter before assuming a merge will deploy.
  - Consider adding test files that gate the deploy to its trigger paths.

### Merge conflicts from stacked PRs
- **What happened:**
  - #31 was branched from #30's branch, and conflicted after #30 was squash-merged. It needed `git rebase --onto`.
  - #46 included #45's commit, so #45 had to be closed by hand.
- **Lesson:** branch from fresh `main` after each merge. If you must stack, say so in the PR and expect to rebase.

### Too strict once, so a second fix was needed
- **What happened:** "lock roles with no slots" (#39) also locked units that a tactical card could unlock. Queen and Defiler became un-addable under Kerrigan's Swarm.
- **Lesson:** when adding a restriction, list what can lift it before shipping. The fix was a hint ("Needs a Support slot: Hatchery or Overseer") instead of a lock.

### A tap target that destroyed data
- **What happened:** the first VS pip design set the alive count to wherever you tapped. One mistap on the first pip wiped out a whole squad. The test caught it before merge.
- **Lesson:** a tap that can destroy data should change things by one, not by "jump to here".

### Two ways to do one thing
- **What happened:** the round tracker had Round +, and the Battle tab had End round. Only End round readied cards and raised the pool, so the game state went out of sync.
- **Lesson:** one action, one path. Remove shortcuts that skip side effects.

### Auto cut-outs need a human check
- **What happened:** the first automatic cut-outs of publisher photos grabbed several things:
  - twin models;
  - unit-card scans;
  - tokens;
  - a size badge.
- **Lesson:** always produce a side-by-side preview sheet, and review it before anything ships. Per-unit crop boxes fixed every case.

### Tools we couldn't reach
- **What happened:** publisher sites were blocked from the work machine, so remote photos and cut-outs had to run on GitHub Actions. Starting a workflow from here wasn't allowed either.
- **Lesson:** design jobs that need the internet as Actions workflows from the start. Save the downloaded originals in the repo (unpublished) so re-runs don't need the network.

---

## 4. Rules of thumb for next time

1. **Mockup first** for anything that is a judgement call. Build after the "yes".
2. **"Needed, not just useful."** Every new element must earn its pixels mid-game.
3. **Declutter pass** after every three or four features.
4. **Playtest with fresh eyes** (an agent or another player) after big batches. How: [playtesting.md](playtesting.md).
5. **Screenshot at 360/390px** for every UI change, before asking to merge.
6. **Shared code goes in shared files.** Stop growing the three faction copies.
7. **Global mechanisms need regression checks** (history, scroll, storage, back gesture).
8. **One action, one path.** No shortcuts that skip side effects.
9. **Destructive taps change by one.** Undo for removals.
10. **Separate commit/push from merge.** Verify each step.
11. **Check CI triggers and timeouts** when touching tests or workflows.
12. **Lock decisions with tests:** design rules, not just functions.
13. **Real models only.** Plain cards beat concept art.
14. **The card is the source, not the app.** Check data against the card sheets (and their page images), not against what the app already shows. How: [card-audit.md](card-audit.md).
15. **Test the uneven case.** Long names, one column fuller than the other, a 360px screen, an asymmetric map. The tidy case hides layout bugs.

---

## 5. Part 2: the design pass (12 November, PRs #55–#65)

### What happened, in order

| Stage | PRs | What drove it |
|---|---|---|
| White card outlines on the phone | #55 | Screenshot from a real phone. Cause: new styles on an old cached page. Fixed the fallback colour and made scripts and styles network-first. |
| Splash screen stuck in Firefox | #56 | Couldn't reproduce here (no Firefox). bt 7274 chose to skip the splash for now. |
| Every unit gets a model photo | #57–#58 | bt 7274 sent publisher promo images for the drones, Roachling, Auto-Turret and Pylon. Shared sculpts borrow the base model's cutout. |
| Second helper-agent playtest | #59 | 4 major bugs, 7 minor, 7 UX notes. All fixed in one PR, together with VS layout feedback. |
| Playtesting guide | #60 | "Note the process so we can give instructions to others." See [playtesting.md](playtesting.md). |
| VS rows line up | #61–#62 | Screenshots: cards of different heights, then empty space, then a cramped health bar. Three small rounds, each from one screenshot. |
| Squad HP | #63 | Question: how do Roaches with 4 HP × 3 models work? We checked the rules first (8.7.4: one Damage Marker per Unit), then designed the bar. |
| Background texture | #64 | "Break up the plain blackness without drawing attention." |
| Unit detail hierarchy | #65 | "It all looks the same." |

### How the design moved (the loop)

Almost every change followed the same loop:

1. bt 7274 sends a screenshot from real use, with one sentence about what feels wrong.
2. We change one thing and render it at phone and desktop size.
3. We send the screenshot back.
4. bt 7274 merges, or names the next thing.

The VS screen went through four rounds in under an hour:
- models on the inside edge;
- rows the same height;
- bigger models to fill the space;
- supply moved up to give the health bar room.

Each round fixed the problem the previous round revealed. Small rounds with a picture each time beat one big redesign.

### Design principles that came out of it

- **Mirror toward the centre.** On a two-sided screen, each side's art faces the middle and controls sit on the outer edge. It reads as "versus".
- **Same size, same shape.** Rows that hold different content still get the same height and the same one stepper. Uneven rows ("size creep") break alignment across columns.
- **Fill empty space with the thing people look at.** Bigger model art beat padding or extra text.
- **Give the important number room.** Supply moved up so the health bar could use the full width.
- **Check the rule before designing the control.** Squad damage is one pool per Unit, so the bar is one track split per model, not separate bars per model.
- **Hierarchy through contrast, not more boxes:**
  - one stats strip instead of five boxes;
  - big numbers for the values you roll;
  - colour by phase on the edge of each weapon and ability;
  - section headings in the faction colour;
  - cost-paying abilities in gold.
- **Texture behind, never on top.** The hex grid sits behind the content at about 8% opacity and fades lower down; cards stay solid.

### Mistakes and lessons

**Two deploys fighting.** Every push ran our deploy and GitHub's built-in branch deploy, which overwrote ours with raw files. That left the service-worker version stuck, so phones mixed cached and new files.
- Lesson: check *what* is live, not just that a deploy went green. Settings → Pages → Source should be GitHub Actions.
- Status: bt 7274 has to make the change; I can't reach that setting.

**We couldn't test Firefox.** The sandbox only has Chrome. We fell back on asking for a console error, then removed the splash at bt 7274's call.
- Lesson: keep a quick real-device check on the list, and say early when a browser can't be tested here.

**Bad test data looked like bugs.** VS screenshots showed "Destroyed" units because the test armies used tiers that don't exist.
- Lesson: build test data from legal tiers. This is now in the playtesting guide.

**The playtester reported a design choice as a bug** (shared drone photos).
- Lesson: give the tester a "known by design" list.

**The section tab covered buttons.** A floating element that "never moves" will eventually sit on something you need to tap. Docking it as a strip above the tab bar fixed it for good.

**Reset was destructive and only half-reset the game.** This is the second time a data-clearing tap shipped without a confirm (pip taps were the first).
- Lesson: every clearing action gets a confirm or an undo, and the playtest checklist now says so.

**Long screenshots repeat fixed bars.** Full-page screenshots draw the tab bar part-way down.
- Lesson: crop to the element instead, or say so when sending.

### What worked

- **Rules lookups before building game logic.** It took a few minutes and avoided building the wrong damage model.
- **One PR per screenshot round.** Easy to review and easy to merge.
- **Tests that pin each decision:**
  - VS: the supply cap, unique scouting, the scoreline, the HP/Models stepper and squad damage;
  - portraits: the "promo photo needs provenance" rule.
- **Write the process down while it's fresh.** The playtesting guide and this section were written the same day.

---

## 6. Part 3: the polish pass (12 November, PRs #66–#73)

### What happened, in order

| Stage | PRs | What drove it |
|---|---|---|
| Tab highlight moved under the label | #67 | The section strip's progress line ran into the active-tab line. |
| VS commanders on phones | #68–#69 | "Put the models on top so they have room to be big." Then: make the chips line up across both panels. |
| Painted faction emblems | #70 | The early traced logos "stand out in the wrong ways". bt 7274 supplied the rules PDF and the emblems were taken from it. Then: "fill the space, don't worry about the edges". |
| Team-coloured health bars | #71 | The green stood out too much. First a gradient in the team colour, then just the darker end of it. |
| Faction and tactical card abilities | #72–#73 | "Add a little colour like the Library", then "something light on the header". |

### How it moved

The loop stayed the same: a screenshot and one sentence, one change, a screenshot back.

Two things were different this time:

- **Iterations got smaller.** Several requests were "now just the darker side" or "now the header too". Each was a one-line CSS change sent back with a picture within minutes. Small asks deserve small, fast answers.
- **bt 7274 brought the source material.** The rules PDF arrived just as we needed it. With the real file in hand, the emblems came out of it with their own transparency, so they look cleaner than screenshots of them would.

### Design principles that came out of it

- **Official art beats traced art.**
  - Flat traced logos looked like clip-art next to painted models.
  - The book's painted emblems match the miniatures.
  - Low resolution is fine for a background mark; it just shouldn't be the focal point.
- **Background marks should fill, not decorate.** A small emblem in a corner looks like a sticker. Filling the panel and cropping freely turns it into texture.
- **Colour means team, not status.** Health bars in the team colour read as "whose unit"; bright green said nothing and drew the eye. Flat and muted beats a gradient.
- **Every block gets a little colour.** "Any phase" abilities were grey, so a list of them still looked the same. Using the faction tint for them gives every ability a coloured edge and header.
- **Line things up across columns.** Chips at the bottom of each panel stay level even when one name wraps. Same idea as the same-height VS rows.

### Mistakes and lessons

**I didn't check the PDF until it arrived.** When asked about better logos, I listed three options and asked which to take. Fair at the time, but the answer turned out to be sitting in the book.
- Lesson: when the user owns the source material, ask for it early ("can you send the rules PDF?"). It is quicker than describing workarounds.

**The first emblem placement was too timid.** A 170px mark in the corner at 16% opacity cut off the Protoss emblem and left the Zerg one small.
- Lesson: for background art, start bold (fill the space) and dial down. Starting small means an extra round.

**The gradient was one step too many.** The team-coloured gradient still had a bright end that stood out.
- Lesson: when the complaint is "it stands out", go flat and muted first.

### What worked

- **Matching patterns across screens.** The unit-detail ability style (#65) was reused for faction and tactical cards (#72), so the whole app now reads the same way.
- **Provenance kept with the assets.** `portraits/factions/README.md` records the PDF pages the emblems came from, like the portrait audit does for photos.
- **Merging as we go.** Each round merged before the next started, so there were no stacked PRs or conflicts this time.

---

## 7. Part 4: build tab, VS and getting ready to share (12 November, PRs #74–#88)

### What happened, in order

| Stage | PRs | What drove it |
|---|---|---|
| Colour on weapons and the VS screen | #75–#76 | "Same treatment for the Library weapons, then for VS." VS also got the army tab bar. |
| Sticky section headings | #77–#78 | Idea from bt 7274: drop the scoreboard while building, let headings stick. The last section ("Other") needed room to reach the top. |
| Scroll "notch" (snap, vibration, click) | #79, #81–#82 | Tried, then removed: the snap hid the breakout models and needed a fix, and the vibration and click did nothing on bt 7274's Android phone. |
| Same-size Library cards | #80 | First pass ran text right over the art. Second pass: shorter closed-card names and lock notes, Unique under the name. |
| Tactics overhaul | #83, #86–#87 | "A wall of text compared to the Library." Colour first, then real groups with a line each (from the first version of the app), then readable phase words. |
| Scout tiles | #84 | Models ran off the right edge. |
| Remove units in the Library; Terran missing from VS | #85 | Two reports in one message. The second was a real bug: Terran and Protoss save their army under `_v1`, everything else read `_v5`. |
| New game in VS | #88 | "How do I start a new game in VS?" There was no way. |
| Sharing | #89 | "How do I protect the repo and let others use it safely?" |

### Design principles that came out of it

- **Edit where you build.** Removing a unit lived behind Battle › Edit Army while the warning pointed to the Library. Controls belong where the user is when they need them.
- **Overlap a little, never a lot.** Text may nudge into the model art; a whole line of text running over a model is noise. Shorten the text before shrinking the art.
- **Groups need names and a purpose.** Colour alone didn't fix the Tactics wall. What fixed it was every card being in a named group with a one-line "what this is for", as in the first version.
- **Spell it out.** Single-letter phase badges (M, A, C) were unreadable without a key. Short words are worth the width; drop labels ("Used in") before you let a row wrap.
- **Every game screen needs a way out.** A finished game should say so (game-over banner), and a reset should exist mid-game, with a confirm and an undo.

### Mistakes and lessons

**Two storage keys for the same thing.** The Zerg page moved to `sctmg_zerg_v5`, Terran and Protoss stayed on `_v1`, and every new feature (VS, home summary, War Room pool) was written against `_v5`. Only Zerg ever worked, and nobody noticed because testing mostly used Zerg.
- Lesson: one map of storage keys, and a test that each page's save key matches what readers use (now in `test-vs`).
- Lesson: playtest every faction, not just the first one.

**Building haptics without a device to test on.** The notch shipped untested on a real phone and didn't work there. I guessed iPhone limits before asking what phone bt 7274 had.
- Lesson: ask about the device first. For anything that depends on hardware or browser permissions, get a real-device check before building more on it, and say up front that it can't be verified here.

**A trial that touches scrolling needs to be easy to remove.** Keeping the notch in its own file (`notch.js`) and a few hooks made removing it one clean PR.

**First fixes overshoot.** Text over the art went from "too little room" to "too much overlap" before it settled. Several requests followed the same arc (the gradient health bars, the emblem placement).
- Lesson: aim for the middle on the first try, and send the screenshot of the trickiest card, not the easiest one.

**Element screenshots lie.** Screenshots of single elements, or long page captures, showed repeated tab bars and missing text that weren't really there.
- Lesson: take viewport screenshots, or hide fixed bars before capturing.

### What worked

- **Measuring instead of eyeballing.** Card heights, pill overflow and header offsets were checked in code for all three factions at 393 and 360px, so "all cards are 100px" was a fact, not a hope.
- **Looking at the old version.** The first app (`uploads/*.html`) already had good Tactics groups and descriptions; reusing that idea beat inventing a new one.
- **Quick reverts.** When something didn't land (the notch), it came out the same afternoon instead of lingering.

---

## 8. Part 5: Roster, Quick build, sharing and the card audits (12–15 November, PRs #89–#132)

### What happened, in order

| Stage | PRs | What drove it |
|---|---|---|
| Getting ready to share | #89–#90 | README notice, CONTRIBUTING, issue forms. The rules check had been failing since #86 (data added to generated files, not their sources). |
| Battle tab catch-up | #91–#97 | Battle cards: abilities in view, one tap to Use. Unit rows built like VS rows, sticky headings, one compact mission block. |
| Battle splits into Roster + VS | #98–#101 | A VS mock (tap any unit or card for its full reference) showed VS could do everything Battle did in play. Battle became **Roster** (army management), VS is gameplay. Editing a unit is opening it: no Edit Army mode. |
| Keywords against the Core Rules | #102 | BULKY, DODGE, SPECIALIST and INDIRECT FIRE said the wrong thing. |
| Supply-drop warning | #103–#104 | Amber, then stripes, then accent colour; settled on the bright team colour for every model whose loss drops Supply. |
| Command Center exports | #105 | One script to archive the official Command Center references. |
| Quick build | #106–#116, #121 | Mocked in VS, then in the Library. Tiles per unit with a button per tier, role-colour outline, a small Army tab, an info sheet per model, a count and − per tier. A key bug (two adds in one millisecond shared a key) was found while testing. |
| Sharing and lists | #117–#120 | QR code, link or code from VS, then every header. A list bar on Roster and a My lists sheet. README rewritten to cover every feature. |
| Tactical cards in Quick build | #122–#123 | Mocked inside the Library, then moved: "the tactical cards should have their own quick build section, not combined in the library." |
| First card audit | #124 | bt 7274 added the official PDFs to a claude.ai Project and asked for everything to be checked, newest source first. |
| Upgrades on the VS card | #125–#126 | An outside reviewer said upgrade info was hard to find mid-game. bt 7274: "if an upgrade gives them more movement then that should be on the VS card so you can't miss it." Mocked, then done for every upgrade and card bonus. A helper agent checked it before merge. |
| Second full review | #127–#129 | bt 7274 raised the model and effort and asked to "review EVERYTHING from the UI to the Keywords and Stats". Found 8 data errors, 2 missing missions, 4 missing maps, VS scoring gaps and narrow-phone layout bugs. |
| Measurements on the maps | #131–#132 | bt 7274: draw the measurements on the map "so rather than reading text, you see it on the map where it's supposed to go", then "include the table measurements too". Worked out from the map data, so every map (and any new one) gets them. |

### Design principles that came out of it

- **One screen per job.** Roster is for building and checking an army; VS is for playing it. Having both do both (Battle) meant two of everything and they drifted apart.
- **Show the effect, not the rule.** An upgrade that adds Speed changes the Speed number on the VS card, in gold. A reminder you have to go and read gets missed mid-game.
- **Every way in, the same sheet.** Tapping a unit in Quick build, Roster or VS opens the same kind of reference sheet.
- **Draw it, don't describe it.** Map setup was paragraphs of "measure 12\" right, then 6\" down". The same numbers drawn on the map, where they apply, are read at a glance.
- **Derive pictures from data.** The map measurements are computed from each map's zones and markers, not typed in, so they can't drift from the data and new maps get them free.
- **Mock inside the closest screen, then move it if it's crowded.** Tactical cards were mocked in Library Quick build, which showed they needed their own place.

### Mistakes and lessons

**Plain text extraction hid half the cards.** The card sheets print the back of each unit card upside down and the tactical cards sideways. The first audit read the PDF text and missed what it couldn't see: Malignant Creep's faction tag and the last sentence of Omega Network.
- Lesson: extract at every rotation (`scripts/card-audit/extract_card_text.py`), and read numbers in boxes from the page image.

**Tests locked in wrong data.** The Roach had a 4–6 model bracket that isn't on the card, and a test asserted it. Another test asserted the old FAQ version label.
- Lesson: take a test's expected values from the source, never from the app's current output. When a test and the card disagree, the card wins.

**Two scoring screens drifted apart.** The Roster's End round sheet could set marker colours; the VS one couldn't, so Hold Position and Gather the Resources scored wrong in VS.
- Lesson: when two screens do the same job, give them the same inputs, or share the code. (Rule of thumb 8 again.)

**Assuming a pattern from a few examples.** A new map test assumed both deployment zones are always the same size. Proving Grounds isn't.
- Lesson: check the source before turning a pattern into a test.

**Grid items wider than the phone.** A `display: grid` child defaults to `min-width: auto`, so one no-wrap row of tag chips made the whole page scroll sideways at 360px. Right-aligned names that were too long lost their first letters.
- Lesson: `min-width: 0` on grid and flex children that hold no-wrap rows, and screenshot the longest names at 360px.

**Columns that don't line up.** The VS End round sheet's two columns put Adjust at different heights when one side had more score lines (bt 7274 spotted it after merge, #129).
- Lesson: screenshot the uneven case, not just the matched one.

**Stacked PRs and squash merges.** #128 was built on #127's branch. After #127 was squash-merged, #128 had to be rebased onto `main` and retargeted before it could merge.
- Lesson: for stacked PRs, rebase with `git rebase --onto origin/main <old base>` after the first merge, then change the PR's base.

**Labels fighting for the same spot.** The first drawn measurements put a zone's depth label on top of a marker's distance line (Acropolis), and the table height on top of a zone's length (Frontier, Green Valleys).
- Lesson: place each label by checking it against the others (the code tries the middle, then other spots), and look at every map, not two.

### What worked

- **The card is the source of truth, with a written order of precedence.** Having the PDFs in one Project, and a list of which source beats which, settled every disagreement quickly.
- **A script to print the app's data in card order** made reading a card against the app fast enough to do for every card.
- **A helper agent before merge** on the large upgrade-effects change (#126).
- **Mocks for the uncertain bits** (VS reference sheets, Quick build, tactical strip, upgrade effects), each with a yes or a redirect before building.
- **Measuring overflow in code at 360 and 393px** found the sideways-scroll bugs on screens that looked fine at a glance.

---

## Open threads

- ~~Miniature photos missing~~: done. Every unit has a painted-model photo (#57–#58, issue #7 closed).
- Firefox: the app didn't start there and the cause wasn't found (the splash is skipped for now). Needs a console error from a real Firefox.
- GitHub Pages source should be set to GitHub Actions so only one deploy runs.
- The `uploads/*logo.png` traced logos are no longer used anywhere and can be deleted.
- Repo protection (bt 7274, in GitHub settings): a ruleset on `main` requiring pull requests and passing checks; read-only workflow permissions; approval for outside contributors' workflows.
- Consider asking Archon Studio for their blessing before sharing widely.
- ~~Tier and upgrade editing under Battle › Edit Army~~: done. Open a unit in Roster (#100), or use Quick build's Army tab.
- Terran and Protoss still save under `_v1` while Zerg uses `_v5`; unify the keys (with a migration) when the faction pages are refactored into one.
- ~~The card-by-card audit against official PDFs~~: done twice (#124, #127–#128). Process in [card-audit.md](card-audit.md).
- ~~Glial Reconstitution CP vs BM~~: checked on the page images. Roach and Corpser print 1 CP, Vile prints 1 BM; the app now follows the cards (issue #2).
- Zagara's Broodmother upgrade has no published price; kept at 0m until there is one.
- Artefact Hunt's round 5 claim points are entered by hand; the app doesn't track which unit carries a marker.
- The printed battle sheet still shows the plain map; the War Room measurements could be added to it.
- The written map setup steps are still shown under the drawn map; drop or fold them away if the drawing is enough.
- ~~Army share codes~~: done as a QR code carrying a link, plus Send link and Copy code (#117–#118).
- The VS battle log: left out of v1 on purpose. Revisit once VS mode has been used in real games.
- Refactor the three faction army files into one parameterised page.
