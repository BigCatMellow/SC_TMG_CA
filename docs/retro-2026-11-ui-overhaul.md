# Retro: the November 2026 UI overhaul (PRs #27–#53)

These notes cover how this work was done, not just what came out of it. They record what worked, what went wrong, and what we would do differently next time. Mistakes are fine. Making the same mistake twice is the thing to avoid.

Work done by bt 7274 with Claude, 9–11 November 2026.

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

---

## 5. Open threads

- Miniature photos still missing for Pylon, Point Defense Drone, Sabotage Drone and Auto-Turret (issue #7).
- The card-by-card audit against official PDFs, and the Glial Reconstitution CP vs BM question (issue #2).
- Army share codes: parked until a short, human-friendly format exists. A QR code carrying a link (the code never typed) is the likely route.
- The VS battle log: left out of v1 on purpose. Revisit once VS mode has been used in real games.
- Refactor the three faction army files into one parameterised page.
