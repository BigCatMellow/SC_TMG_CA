# Miniature portrait audit — 9 November 2026

## Current status

The live companion covers **43 units**. **22 original, distinct painted-miniature photos** are extracted *byte-for-byte* from the 2026 Core Rules PDF and are now the preferred portrait for their matching Wave 1 unit. Other units retain official galleries or existing local assets.

| Image category | Units |
|---|---:|
| Original local Core Rules miniature photographs | **22** |
| External publisher/retailer miniature galleries (primarily Waves 2–3) | 14 |
| Clearly labeled related-sculpt substitutes | 3 |
| Existing local portraits not replaced | 2 |
| No verified image | **2** |
| **Total** | **43** |

The two unresolved units are summoned Terran **Sabotage Drone** and **Auto-Turret**. The three remaining related-sculpt substitutions are Spec Ops Marauder, Roachling, and Vileling. Every other Wave 1 model now has its *own* correct embedded miniature image, including Raptor, Kerrigan's Raptor, Swarmling, Vile Roach, Corpser, Praetor Guard, and Artanis.

## 22 exact Core Rules photographs

Each image retains its original pixel data, unit ID, PDF page, and SHA-256 in [source-manifest.json](../portraits/pdf/source-manifest.json).

| Faction | Unit ID | Printed / PDF page | Image |
|---|---|---|---|
| terran | `marine` | 96 / 98 | [JPEG](../portraits/pdf/terran/marine.jpg) |
| terran | `raynors-raider` | 96 / 98 | [JPEG](../portraits/pdf/terran/raynors-raider.jpg) |
| terran | `marauder` | 97 / 99 | [JPEG](../portraits/pdf/terran/marauder.jpg) |
| terran | `medic` | 97 / 99 | [JPEG](../portraits/pdf/terran/medic.jpg) |
| terran | `goliath` | 98 / 100 | [JPEG](../portraits/pdf/terran/goliath.jpg) |
| terran | `jim-raynor` | 98 / 100 | [JPEG](../portraits/pdf/terran/jim-raynor.jpg) |
| zerg | `zergling` | 99 / 101 | [JPEG](../portraits/pdf/zerg/zergling.jpg) |
| zerg | `raptor` | 99 / 101 | [JPEG](../portraits/pdf/zerg/raptor.jpg) |
| zerg | `kerrigan-raptor` | 100 / 102 | [JPEG](../portraits/pdf/zerg/kerrigan-raptor.jpg) |
| zerg | `swarmling` | 100 / 102 | [JPEG](../portraits/pdf/zerg/swarmling.jpg) |
| zerg | `roach` | 101 / 103 | [JPEG](../portraits/pdf/zerg/roach.jpg) |
| zerg | `vile` | 101 / 103 | [JPEG](../portraits/pdf/zerg/vile.jpg) |
| zerg | `corpser` | 102 / 104 | [JPEG](../portraits/pdf/zerg/corpser.jpg) |
| zerg | `hydralisk` | 102 / 104 | [JPEG](../portraits/pdf/zerg/hydralisk.jpg) |
| zerg | `queen` | 103 / 105 | [JPEG](../portraits/pdf/zerg/queen.jpg) |
| zerg | `kerrigan` | 103 / 105 | [JPEG](../portraits/pdf/zerg/kerrigan.jpg) |
| protoss | `zealot` | 104 / 106 | [JPEG](../portraits/pdf/protoss/zealot.jpg) |
| protoss | `praetor-guard` | 104 / 106 | [JPEG](../portraits/pdf/protoss/praetor-guard.jpg) |
| protoss | `adept` | 105 / 107 | [JPEG](../portraits/pdf/protoss/adept.jpg) |
| protoss | `sentry` | 105 / 107 | [JPEG](../portraits/pdf/protoss/sentry.jpg) |
| protoss | `stalker` | 106 / 108 | [JPEG](../portraits/pdf/protoss/stalker.jpg) |
| protoss | `artanis` | 106 / 108 | [JPEG](../portraits/pdf/protoss/artanis.jpg) |

The original [source PDF](https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf) has SHA-256 `27639c562e6db9777dd9ba984d0c9f9b581841ec30166848e021f893cd00ea54`. Re-extraction is reproducible with [scripts/extract-pdf-miniatures.py](../scripts/extract-pdf-miniatures.py). The script rejects changed source versions instead of silently substituting a similar image. The app’s [model-portraits.js](../model-portraits.js) maps photos to cards. Each card renders **one** image element anchored to the card's top edge: the model head stays framed in the collapsed header, and expanding the card reveals the rest of the same stationary miniature. Images are no longer CSS background stacks. If the primary image fails, that same element switches to the next existing image source (published fallback, then related local artwork where available).

## Review — 11 November 2026

**Narrow phones.** All three Army screens were rendered at 360 px and 480 px (Library, Battle, Edit Army, open cards). There is no horizontal scroll at either width. Breakout figures, framed art and card text stay inside their cards, and names wrap without covering the art.

**Remote photos.** 14 units use publisher-hosted photos (starcraft-tmg.com, archon-studio.com, philibertnet.com). A live phone check showed them loading on the deployed site. `scripts/check-remote-portraits.mjs` now requests each one the way the site does (GitHub Pages Referer). It runs weekly, on demand, and whenever `model-portraits.js` changes, through the **Remote portrait links** workflow. A broken link fails the workflow; in the app the card falls back to local art.

**The 20 original local PNGs.** In the table below, *Photo* means a painted-miniature photograph and *Art* means game render or illustration.

| File | Type | Used as |
|---|---|---|
| protoss/adept, artanis, sentry, stalker | Photo | Fallback (PDF photo is primary) |
| protoss/praetor-guard, zealot | Art (game render) | Fallback only |
| protoss/pylon | Art (game render) | **Primary**, no miniature photo yet |
| terran/goliath, jim-raynor, marauder, marine, medic | Photo | Fallback (PDF photo is primary) |
| terran/raynors-raider | Art (illustration) | Fallback only |
| terran/point-defense-drone | Art (game render) | Not used; promo photo in portraits/promo/ is primary |
| zerg/hydralisk, kerrigan, roach, zergling | Photo | Fallback (PDF photo is primary) |
| zerg/corpser, queen | Art (concept) | Fallback only |

**Decision (11 Nov 2026): painted-miniature photos only.** Game renders, card art and concept art are no longer used anywhere in the army screens. That includes the Terran tactical-card building art and the art-only fallbacks above. Units without a miniature photo show a plain card until one is found: **Pylon**, **Sabotage Drone** and **Auto-Turret**.

**Promo photos (12 Nov 2026).** bt 7274 supplied publisher promo images for the **Point Defense Drone** and **Roachling**. Each is cropped to the one model in `portraits/promo/` (originals in `portraits-src/remote/`) and cut out like the PDF photos. Roachling no longer borrows the Roach photo. `test-portraits.mjs` fails if any render or concept-art path comes back.

## Remaining sources

Wave 2–3 units still use official [publisher galleries](https://starcraft-tmg.com/downloads), where available. Their URL, unit ID, and source page are retained in the portrait manifest. Existing portrait binaries are not deleted.

## Rights and release notes

Miniature imagery and source book © 2026 Blizzard Entertainment / Archon Studio. The publishers retain copyright and distribution rights; repository attribution **does not** establish a redistribution license. This project does not claim ownership or endorse reuse elsewhere.

The thumbnail extractor is run under GitHub Actions. A PR run validates the exact PDF version and image checksums; after the code is merged, Actions pushes the 22 JPEG binaries to a separate review branch, which is then merged to `main`. On the live companion, local images avoid external hotlink failure for Wave 1. Verify final image crops on a phone-sized viewport after deployment.
