# Unit portraits — image audit and source register

**Audited against:** `main` repository unit data and the three live Army screen `portrait(u)` maps, 2026-11-09.

The previous app had **20 portraits across 43 unit records**, leaving **23 missing**. The [source manifest](../model-portraits.js) uses publisher miniature photos where available, with original local artwork retained as an automatic CSS background fallback. Shared-sculpt aliases are **not** claimed to be unique photos of that variant. External copyright remains with its original owner; no external image binaries are copied into this repository.

| Faction | Units | Previously pictured | New exact/photo mappings | Shared-sculpt aliases | Covered now | Still missing |
|---|---:|---:|---:|---:|---:|---:|
| Terran | 15 | 7 | 6 | 1 | 13 | 2 |
| Zerg | 17 | 6 | 6 | 6 | 17 | 0 |
| Protoss | 11 | 7 | 4 | 0 | 11 | 0 |

## Per-unit results

Status key: **Official model photo** = publisher/reproduction image aimed at that specific miniature (except explicitly labeled shared sculpt). **Shared sculpt placeholder** = photograph or existing local image of a related base mini, not confirmation of a distinct variant pose. **Retained local portrait** = prior binary, image type not reverified. **Unresolved** = no verified portrait.

| Faction | Unit ID | Before | After | Source / note |
|---|---|---|---|---|
| TERRAN | `jim-raynor` | [`uploads/Raynor-card.png`](../uploads/Raynor-card.png) | Official model photo | [Publisher/source page](https://www.philibertnet.com/); Published painted mini photo replacing a card art crop; local crop retained as offline fallback |
| TERRAN | `goliath` | [`portraits/terran/goliath.png`](../portraits/terran/goliath.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `marauder` | [`portraits/terran/marauder.png`](../portraits/terran/marauder.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `marine` | [`portraits/terran/marine.png`](../portraits/terran/marine.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `raynors-raider` | [`portraits/terran/raynors-raider.png`](../portraits/terran/raynors-raider.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `medic` | [`portraits/terran/medic.png`](../portraits/terran/medic.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `siege-tank` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/news/rules/siege-tank-thunder-from-the-high-ground); Publisher's painted tank/siege-mode models |
| TERRAN | `point-defense-drone` | [`portraits/terran/point-defense-drone.png`](../portraits/terran/point-defense-drone.png) | Retained local portrait | Existing local portrait retained |
| TERRAN | `nova-stealth` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-miniatures-game-raven-nova-terra-wave-3); Official Nova stealth figure alongside holo-decoy |
| TERRAN | `nova-assault` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-miniatures-game-raven-nova-terra-wave-3); Official Nova assault pose |
| TERRAN | `spec-ops-marauder` | None | Shared sculpt placeholder | Uses `marauder` local sculpt; Uses existing Marauder miniature portrait until a distinct Spec Ops pose is verified |
| TERRAN | `raven` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-miniatures-game-raven-nova-terra-wave-3); Official painted Raven miniature |
| TERRAN | `holo-decoy` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-miniatures-game-raven-nova-terra-wave-3); Same official photograph, framed toward transparent decoy figure |
| TERRAN | `sabotage-drone` | None | Unresolved | Needs exact model photography |
| TERRAN | `auto-turret` | None | Unresolved | Needs exact model photography |
| ZERG | `kerrigan` | [`uploads/Kerrigan.png`](../uploads/Kerrigan.png) | Retained local portrait | Existing local portrait retained |
| ZERG | `hydralisk` | [`portraits/zerg/hydralisk.png`](../portraits/zerg/hydralisk.png) | Retained local portrait | Existing local portrait retained |
| ZERG | `raptor` | None | Shared sculpt placeholder | Uses `zergling` local sculpt; Zergling base sculpt placeholder, not a verified dedicated Raptor portrait |
| ZERG | `kerrigan-raptor` | None | Shared sculpt placeholder | Uses `zergling` local sculpt; Zergling base sculpt placeholder, not a verified dedicated Kerrigan's Raptor portrait |
| ZERG | `corpser` | [`portraits/zerg/corpser.png`](../portraits/zerg/corpser.png) | Retained local portrait | Existing local portrait retained |
| ZERG | `roach` | [`portraits/zerg/roach.png`](../portraits/zerg/roach.png) | Retained local portrait | Existing local portrait retained |
| ZERG | `zergling` | [`portraits/zerg/zergling.png`](../portraits/zerg/zergling.png) | Retained local portrait | Existing local portrait retained |
| ZERG | `queen` | [`portraits/zerg/queen.png`](../portraits/zerg/queen.png) | Official model photo | [Publisher/source page](https://starcraft-tmg.com/shop/products/starcraft-queen); Publisher's painted miniature photography replaces older image; retains local portrait fallback |
| ZERG | `vile` | None | Shared sculpt placeholder | Uses `roach` local sculpt; Roach base miniature used until separate Vile sculpt photo verified |
| ZERG | `swarmling` | None | Shared sculpt placeholder | Uses `zergling` local sculpt; Zergling base miniature used for this variant |
| ZERG | `ravager` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/news/rules/ravager-corrosive-death-from-above); Published painted Ravager models |
| ZERG | `omega-worm` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/about-the-game); Official Omega Worm model photograph |
| ZERG | `roachling` | None | Shared sculpt placeholder | Uses `roach` local sculpt; Roach base miniature fallback for summoned Roachling |
| ZERG | `zagara` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-tmg-wave-3-zerg-defiler-zagara-bile-launcher); Official painted Zagara miniature |
| ZERG | `defiler` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-tmg-wave-3-zerg-defiler-zagara-bile-launcher); Official painted Defiler miniature |
| ZERG | `vileling` | None | Shared sculpt placeholder | Uses `zergling` local sculpt; Zergling base miniature used until Vileling photo verified |
| ZERG | `bile-launcher` | None | Official model photo | [Publisher/source page](https://archon-studio.com/blog/starcraft-tmg/starcraft-tmg-wave-3-zerg-defiler-zagara-bile-launcher); Official painted Bile Launcher |
| PROTOSS | `artanis` | [`uploads/Artanis-card.png`](../uploads/Artanis-card.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `praetor-guard` | [`portraits/protoss/praetor-guard.png`](../portraits/protoss/praetor-guard.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `stalker` | [`portraits/protoss/stalker.png`](../portraits/protoss/stalker.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `adept` | [`portraits/protoss/adept.png`](../portraits/protoss/adept.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `zealot` | [`portraits/protoss/zealot.png`](../portraits/protoss/zealot.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `sentry` | [`portraits/protoss/sentry.png`](../portraits/protoss/sentry.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `immortal` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/news/rules/immortal-glory-through-endurance); Official painted Immortal sculpt |
| PROTOSS | `pylon` | [`portraits/protoss/pylon.png`](../portraits/protoss/pylon.png) | Retained local portrait | Existing local portrait retained |
| PROTOSS | `tassadar` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/news/rules/protoss-tassadar-high-templar-wave-3); Official painted Tassadar |
| PROTOSS | `twilight-templar` | None | Official model photo (shared sculpt) | [Publisher/source page](https://starcraft-tmg.com/news/rules/protoss-tassadar-high-templar-wave-3); Same High Templar sculpt shown for Twilight Templar variant; not a separate verified photo |
| PROTOSS | `high-templar` | None | Official model photo | [Publisher/source page](https://starcraft-tmg.com/news/rules/protoss-tassadar-high-templar-wave-3); Official High Templar model |

## Image reliability and licensing

- `model-portraits.js` stores source URLs and provenance. The browser requests these images from the publisher or retailer; the repo does not rehost copyrighted photos.
- For a pre-existing portrait, CSS places that local file below the external URL. If the external URL cannot load, the local image still appears. Variant aliases reuse those local files.
- New units with an official external image but no local asset will be blank if the publisher denies hotlinking or removes the image. Retrying through another publisher-hosted source or obtaining redistribution permission to bundle optimized local images is the durable fix.
- Preserve unit IDs across the three faction data files and Wave 3 overlay; do not assign an unrelated model photo to a unique variant.
- Remaining unresolved: Terran summoned-only **Sabotage Drone** and **Auto-Turret**. The official Raven/Nova products confirm the models exist, but standalone publisher photographs were not verified.
- **Visual limitation:** This change has programmatic checks and reviewed source images; no browser screenshot/device viewport inspection or production network hotlink success was verified. Confirm crop/focal positions and hotlink access in the deployed UI.

## Sources

- [Official StarCraft: TMG publisher and unit downloads](https://starcraft-tmg.com/downloads)
- [Raven and Nova Wave 3 miniatures](https://archon-studio.com/blog/starcraft-tmg/starcraft-miniatures-game-raven-nova-terra-wave-3)
- [Zerg Wave 3 miniatures](https://archon-studio.com/blog/starcraft-tmg/starcraft-tmg-wave-3-zerg-defiler-zagara-bile-launcher)
- [Protoss Wave 3 miniatures](https://starcraft-tmg.com/news/rules/protoss-tassadar-high-templar-wave-3)
