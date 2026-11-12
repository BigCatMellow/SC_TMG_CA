# Playtesting the companion

How we run playtests, so anyone (a person or an AI agent) can repeat them and we can improve the process each time. Update the **Log** and **Lessons** sections after every run.

## When to run one

- After any big batch of changes, before calling a feature "done".
- When a new screen or mode lands (VS, War Room, a new tab).
- When bt 7274 notices something odd on a real device: the playtest checks how widespread it is.

## Who runs it

A **separate helper agent** that has not seen the code changes. Fresh eyes catch what the builder has stopped seeing.

- In playtest 1 it found that upgrades could not be bought at all.
- In playtest 2 it found that the Reset button half-reset the game.

The agent only tests and reports. It never edits files, runs git, or opens PRs. Fixing is a separate step (see **After the report**).

A short **real-device pass by bt 7274** complements it. Headless Chrome cannot see:
- stale caches on a phone;
- Firefox or Safari quirks;
- how things feel in the hand.

## Setup the tester needs

- **Serve the site:** `cd <repo> && (python3 -m http.server 8765 >/dev/null 2>&1 &) ; sleep 1.5`
  - Start the server in the same shell call as the test run. Background servers can die between calls; restart on `ERR_CONNECTION_REFUSED`.
- **Drive the browser:** Python Playwright with the system Chrome:
  - `p.chromium.launch(executable_path="/usr/bin/google-chrome")`
  - Block everything that isn't localhost with `ctx.route`, so the run is offline and repeatable.
- **Viewports:**
  - Phone: 393×873, scale 2, `is_mobile=True`, `has_touch=True`.
  - Also try 360px wide.
  - Tablet/desktop: 1024×768 and 1280×800, especially for VS and the home screen.
- **Clean start:** on `index.html`, run `localStorage.clear(); sessionStorage.clear()` before each scenario. `resume.js` may redirect a fresh session to the last page used.
- **Errors:** capture `pageerror`, console errors and any response with status ≥ 400 on every page.
- **Screenshots:** save to `shots/playtestN/` with numbered names, and look at them. Judge layout from the image, not from the DOM.
- **Test data must be legal.** Use a tier that has a cost (`tiers[i].cost > 0`). An unavailable tier has 0 models and shows as "Destroyed", which looks like a bug but isn't.

## The brief (copy, then adjust)

> You are playtesting the StarCraft TMG companion web app as a player would, before and during a real game. Report concrete, prioritised feedback. Do not edit repo files, run git, or open PRs. Read-only testing and screenshots only.
>
> [Setup section above]
>
> Scenarios: [pick from the checklist below, add anything new since the last run]
>
> Known by design (don't report): [see list below]
>
> Report, under ~700 words:
> - a short verdict;
> - bugs ordered blocker / major / minor, each with page, steps, expected vs actual and a screenshot path;
> - UX friction ordered by impact, each with a concrete suggestion;
> - what works well (brief).
>
> Reproduce every bug twice before reporting it, and don't pad with guesses.

Run it as a background agent. A full run takes about 25 minutes and around 100 tool calls.

## Scenario checklist

1. **First open:** home screen, pick a faction, work out what to do with no prior knowledge.
2. **Army building, per faction:**
   - add units, change tiers, buy upgrades, add tactical cards;
   - check the minerals, gas, supply and slot totals by hand;
   - try to break it: over-cap slots, a unique unit twice, wrong-faction units, removing units, odd orders.
3. **A game in Battle:**
   - pick a mission in War Room;
   - step phases and rounds, End round scoring, VP;
   - casualties, damage and undo;
   - spend and ready cards, the supply pool and deploying.
4. **Phone back gesture:** use `page.go_back()` on every sheet and overlay. It must close the overlay, not leave the page.
5. **VS mode:**
   - scout an opponent and play two rounds;
   - check that VS and Battle agree on score, round, pool and casualties afterwards.
6. **Reading:**
   - Codex and Rules, the plain-English toggles, the section strip, search;
   - can you find a rule fast? Is any screen a wall of text?
7. **Visuals:**
   - every Library card has a painted-model cutout and its role colour (Hero orange, Elite purple, Core blue, Support green, Other grey);
   - no clipping, overlap or overflow at 360 and 393px, and no broken desktop layout;
   - floating UI must not cover buttons: tap the things under it.
8. **Persistence:**
   - reload mid-game and cold-start; state comes back;
   - Reset clears what it should, and Undo restores it.

Not covered yet: printing, roster import/export, Grand battle size, Firefox and Safari. Add them when we can.

## Known by design (tell the tester)

- **Shared photos:** Sabotage Drone, Vileling and Spec Ops Marauder use another unit's photo because they are the same miniature.
- **Over-cap adds:** adding past a full slot is allowed. It shows a warning; it is not blocked.
- **The opponent's supply pool** in VS follows the mission. There is no limit without a mission, or in the final round.

## After the report

1. **Verify each claim yourself before fixing.** Drop anything that is by design and add it to the list above, so the next tester doesn't report it again.
2. **Sort and share.** Group into major bugs, minor bugs and UX notes, and give bt 7274 the short list. Ask whether to fix everything in one PR or the majors first.
3. **Fix in one branch.** Add a test for each bug class (for example `scripts/test-vs.mjs` covers the supply limit, unique scouting and the scoreline).
4. **Check the fixes:**
   - run every `scripts/test-*.mjs`;
   - screenshot the affected screens at phone and desktop size, and send them with the PR.
5. **Write it up:** log the run below, and add any new lessons.

## Log

| # | Date | Found | Fixed in | Notes |
|---|---|---|---|---|
| 1 | 11 Nov 2026 | 19 issues | #39–#41, #45 | Upgrades could not be bought; Round + skipped end-of-round steps; 360px clipping; keywords matched mid-word |
| 2 | 12 Nov 2026 | 4 major, 7 minor (1 by design), 7 UX | #59 | VS ignored the supply pool; mission didn't set the R1 pool; Reset was one-tap and partial; the section tab covered + buttons |

## Lessons

- **Give the tester the "known by design" list.** In run 2 it flagged the shared drone photos as a bug.
- **Real devices find what headless Chrome can't.** A stale cache mixed old and new files on a phone, and Firefox wouldn't start the app; both came from bt 7274, not from the playtest. Ask for a quick real-device check after big changes.
- **Tap things, don't just look.** The section tab covering a + button only showed up when the tester tapped where a player would.
- **Check cross-screen agreement.** Battle and VS disagreed on the supply pool; testing each screen alone didn't show it.
- **Destructive actions need a confirm or an undo.** Reset was the second one to slip through (the first was pip taps wiping a squad). Add this to the checklist for every new button that clears data.
- **Verify the test data before trusting a "bug".** Illegal tiers make units look destroyed.
