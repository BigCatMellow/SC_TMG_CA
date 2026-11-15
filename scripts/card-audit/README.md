# Card audit tools

Helpers for checking the app's data against the official card sheets. The full process, what to check and the log of past passes are in [docs/card-audit.md](../../docs/card-audit.md).

- `extract_card_text.py <pdf folder> <out folder>`: text from every card sheet, read at 0/90/180/270° so the upside-down and sideways cards come through. Needs `pip install pdfminer.six pypdf`.
- `show-app.mjs <faction> units|cards [ids…]`: the app's data for one faction, laid out in card order.

The card-sheet PDFs come from the [official downloads page](https://starcraft-tmg.com/downloads). Don't commit them.
