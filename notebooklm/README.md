# NotebookLM study sources

All text files in [sources](sources/) are **committed** and reproducibly generated from the companion's rules and faction datasets. Use them to quiz yourself without searching the app. The source book's original PDF, diagrams, and verbatim text are linked rather than republished in this public repository.

Run `npm run build:study` to regenerate and `npm run test:study` to check consistency. GitHub Actions runs the check on every PR.

For NotebookLM, upload `00_START_HERE.txt`, `01_CORE_RULES.txt`, `02_OFFICIAL_FAQ_STUDY.txt`, `03_CURRENT_POINTS.txt`, one faction TXT, and `20_NOTEBOOKLM_QUIZ_PROMPTS.txt`. Optionally upload the publisher's original [Core Rules PDF](https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf) and [FAQ](https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf) for authoritative citations.

**Source priority:** Core Rules → publisher FAQ v1.1 for clarifications → October 2026 balance for points → official card sheets for exact abilities. This companion implements Wave 1 and selected Wave 2 only, not all publisher Wave 2/3 content.
