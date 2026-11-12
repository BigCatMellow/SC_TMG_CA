# StarCraft TMG Companion

Player-focused rules, faction army builders, current point maps and agent-friendly study references.

> **Unofficial fan project.** Not affiliated with or endorsed by Blizzard Entertainment or Archon Studio. StarCraft and all related names, images, miniature photographs and rules text belong to their owners and are used here for a free, non-commercial player aid. Nothing you enter leaves your device: armies and games are saved only in your browser.

- [Rules screen](Rules.dc.html) and [source-cited quick reference](battle-rules-data.js).
- Army builders: [Terran](Terran%20Army.dc.html) · [Zerg](Zerg%20Army.dc.html) · [Protoss](Protoss%20Army.dc.html).
- [NotebookLM TXT sources](notebooklm/sources/) and [generation instructions](notebooklm/README.md).
- [October 2026 current-cost map](agent-rules/appendix-2026.json), [agent retrieval guide](docs/agent-rules.md), and [battle reference](docs/battle-reference.md).
- Checks: `npm run test:rules`, `npm run test:appendix`, `npm run test:study`, `npm run build:units`.

The official [Downloads page](https://starcraft-tmg.com/downloads) hosts the complete rulebook, FAQ, card sheets and balance updates. Full publisher PDFs and verbatim rulebook transcriptions are linked, not mirrored here. Later-wave catalogue coverage remains tracked in [Issue #2](https://github.com/BigCatMellow/SC_TMG_CA/issues/2).


## Installable companion (web and Android)

Live app: **https://bigcatmellow.github.io/SC_TMG_CA/**

The GitHub Pages deployment serves this repository's current root `index.html` as the Command Center, together with all faction screens, rules, images, and the web-app manifest. Every push to `main` that changes the site triggers the Pages deployment workflow.

On Android Chrome, open that URL and choose **Add to Home screen / Install app** to launch the companion in a standalone window. This uses Chrome's storage, so named rosters remain in that browser profile.

For an Android APK, the separate [HTML2APK `starcraft-tmg` project](https://github.com/BigCatMellow/html2apk/tree/main/apps/starcraft-tmg) provides a lightweight Capacitor shell that loads the same live website. The APK and browser installation have separate local roster storage. Always export rosters before clearing app data or uninstalling. After the first visit the web app works offline: React and the fonts are bundled in `vendor/`, and a service worker (`sw.js`, stamped by `scripts/prepare-pages.mjs`) caches every screen. External gallery portraits are cached once viewed.

Check the [Pages workflow](https://github.com/BigCatMellow/SC_TMG_CA/actions/workflows/deploy-pages.yml) if the site is unavailable or a new change is not visible. The repository's GitHub Pages source must be set to **GitHub Actions**.


## Sharing, reporting and contributing

- Share the live app link above. Players need nothing else; there are no accounts and no data is collected.
- Found a problem? Open an [issue](https://github.com/BigCatMellow/SC_TMG_CA/issues/new/choose) (bug report or rules correction).
- Want to help? See [CONTRIBUTING.md](CONTRIBUTING.md). Changes reach the live site only through pull requests reviewed by the owner.
