# Contributing

Thanks for helping. This is a small fan project run by bt 7274, so please keep changes focused.

## Reporting

- **Bugs:** open an issue with the *Bug report* form: where it happened, what you expected, your device and browser, and a screenshot if you can.
- **Rules or points:** use the *Rules or points correction* form and cite the official source (rulebook page, FAQ version, balance update). Don't paste whole pages of rules text.

## Changing code

1. Fork, branch from `main`, and open a pull request. `main` only changes through reviewed pull requests.
2. Run the checks before you open it: every `scripts/test-*.mjs` (for example `node scripts/test-vs.mjs`).
3. For anything visual, add phone-width screenshots (360–393px) to the pull request.
4. Keep the three army pages (`Zerg/Terran/Protoss Army.dc.html`) in step: a change to one usually belongs in all three.

How we work, what went wrong before and why things look the way they do: [docs/retro-2026-11-ui-overhaul.md](docs/retro-2026-11-ui-overhaul.md) and [docs/playtesting.md](docs/playtesting.md).

## Art and rules

- Only painted-miniature photos, no concept art or game renders. Record where each image came from (see `portraits/pdf/README.md`, `portraits/factions/README.md`, `docs/unit-portrait-audit.md`).
- Official images and rules belong to Blizzard Entertainment and Archon Studio. Don't add full publisher PDFs or long verbatim rule text; link to the [official downloads](https://starcraft-tmg.com/downloads) instead.
