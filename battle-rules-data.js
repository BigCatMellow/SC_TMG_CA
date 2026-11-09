// Battle-focused, source-cited summaries of the user's 2026 StarCraft TMG Core Rules PDF.
// This is an original quick-reference paraphrase, NOT the full rulebook or a replacement for cards.
// Rule text and printed page citations take priority; older companion datasets may differ.
window.SCTMG_BATTLE_RULES = {
  "source": "2026 Core Rules Book",
  "format": "paraphrased quick reference; validate diagram-heavy procedures against PDF",
  "sections": [
    {
      "scope": "core",
      "id": "quick-start",
      "num": "00",
      "name": "Battle Quick Start",
      "meta": "The essentials to reference at the table",
      "color": "#38d3e8",
      "icon": "quick-start",
      "sourceLabel": "§12.1–12.6 · pp. 92–93",
      "groups": [
        {
          "name": "Before Round 1",
          "items": [
            {
              "t": "Choose a Mission and Deployment Card; set Mission Markers and terrain as specified."
            },
            {
              "t": "Roll off; the winner assigns the First Player Marker for Round 1."
            }
          ]
        },
        {
          "name": "Four Phases",
          "items": [
            {
              "t": "**1 Movement:** Deploy, Move, Disengage, or Hold."
            },
            {
              "t": "**2 Assault:** Ranged Attack, Charge, Run, or Hold."
            },
            {
              "t": "**3 Combat:** Engaged Ground Units fight using Close Combat attacks."
            },
            {
              "t": "**4 Scoring & Cleanup:** Determine control, score VP, check game end, resolve end-of-round effects, refresh, then determine initiative."
            }
          ]
        },
        {
          "name": "Critical Distinctions",
          "items": [
            {
              "t": "The first player to **Pass** takes the First Player Marker for the next Phase; passing ends their remaining activations for that Phase."
            },
            {
              "t": "An Active Ability generally occurs immediately before declaring an action or after resolving one, not midway through it."
            },
            {
              "t": "Always use the full numbered rule and unit/card wording for disputed edge cases."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "round-flow",
      "num": "01",
      "name": "Activations & Initiative",
      "meta": "Who acts, when to Pass, and who starts next",
      "color": "#f2c14e",
      "icon": "round-flow",
      "sourceLabel": "§8.1–8.2.2 · pp. 54–55; §8.9.6 · p. 72",
      "groups": [
        {
          "name": "Alternating Activations",
          "items": [
            {
              "t": "Each Round has four Phases; Phases 1–3 use alternating Unit activations."
            },
            {
              "t": "The First Player Marker holder chooses which player activates first for each Phase."
            },
            {
              "t": "Each activated Unit takes one legal action for that Phase."
            }
          ]
        },
        {
          "name": "Passing",
          "items": [
            {
              "t": "A player can Pass instead of activating; they must Pass if they have no eligible Units."
            },
            {
              "t": "First to Pass claims the First Player Marker for the **next Phase**."
            },
            {
              "t": "After Passing, that player makes no further activations in the current Phase, even if the opponent continues."
            }
          ]
        },
        {
          "name": "Next Round",
          "items": [
            {
              "t": "During Scoring & Cleanup, the player with fewer VP gains the First Player Marker for the next Round; if tied, roll off."
            },
            {
              "t": "A game normally lasts up to five Rounds, subject to the Mission Card."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "core-terms",
      "num": "02",
      "name": "Core Rules & Unit Cards",
      "meta": "Rule priority, keywords, targets, and characteristics",
      "color": "#8b7cf6",
      "icon": "core-terms",
      "sourceLabel": "§2.4–2.7 · pp. 29–30; §5.1 · pp. 38–39",
      "groups": [
        {
          "name": "Priority",
          "items": [
            {
              "t": "Specific Unit, Mission, and ability rules take precedence when they contradict general Core Rules."
            },
            {
              "t": "Identical keywords do not stack; where numeric values differ, use the highest value."
            }
          ]
        },
        {
          "name": "Combat & Faction Tags",
          "items": [
            {
              "t": "Combat Tags affect target eligibility, weapon Surge interactions, and other abilities."
            },
            {
              "t": "Faction Tags determine whether Units and Tactical Cards may join the selected Faction Card."
            }
          ]
        },
        {
          "name": "Reading a Unit",
          "items": [
            {
              "t": "Speed applies to the Leading Model's movement. Armour and Evade are separate defenses; Evade requires eligibility."
            },
            {
              "t": "Supply varies with models remaining. Weapon profiles list Phase, Range, Target, Rate of Attack, Hit, Surge, Damage, and keywords."
            },
            {
              "t": "The Ground Combat Tag is distinct from GROUND LEVEL elevation."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "supply",
      "num": "03",
      "name": "Supply & Reserves",
      "meta": "Deployment cap and changing Current Supply",
      "color": "#38d3e8",
      "icon": "supply",
      "sourceLabel": "§6.1–6.2 · p. 44; §8.3 · p. 55",
      "groups": [
        {
          "name": "Calculate",
          "items": [
            {
              "t": "**Available Supply = Current Supply Pool − combined Current Supply of Friendly Units already on the battlefield.**"
            },
            {
              "t": "Recalculate a Unit's Current Supply as soon as casualties cross a Supply Profile threshold."
            },
            {
              "t": "A Unit can deploy only when its Current Supply is no greater than Available Supply."
            }
          ]
        },
        {
          "name": "Escalation",
          "items": [
            {
              "t": "The Mission Card specifies the Supply Pool and escalation each Round."
            },
            {
              "t": "In the final Round (as defined by the Mission Card), Supply Pool restrictions are removed; deployment actions and other restrictions still apply."
            },
            {
              "t": "Destroying or weakening Units can release Available Supply for later deployment."
            }
          ]
        },
        {
          "name": "Other Uses",
          "items": [
            {
              "t": "Current Supply also determines Mission Marker contests and the Tactical Mass exception to Disengage."
            },
            {
              "t": "A Supply 0 Unit can control an uncontested Marker if it meets the normal eligibility requirements."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "coherency",
      "num": "04",
      "name": "Coherency & Movement Geometry",
      "meta": "Leading Model, placement, and links",
      "color": "#4f8df9",
      "icon": "coherency",
      "sourceLabel": "§4.1–4.6 · pp. 33–37; §8.5.3 · pp. 56–58",
      "groups": [
        {
          "name": "Moving",
          "items": [
            {
              "t": "Choose the Leading Model; measure its movement up to Speed, then set the remaining models."
            },
            {
              "t": "At the end of a repositioning action, place models Wholly Within 3 inches of the Leading Model and maintain legal Coherency Links where possible."
            },
            {
              "t": "Coherency Links cannot pass through obstacles the Leading Model could not cross; see §4.4 for exceptions."
            }
          ]
        },
        {
          "name": "Illegal Placement",
          "items": [
            {
              "t": "If no legal position with a Coherency Link exists for a model, remove that model as a casualty."
            },
            {
              "t": "When a position within 3 inches is impossible but a legal link exists, §4.4 describes placing models as close as possible; the Unit may end Out of Coherency."
            },
            {
              "t": "Out of Coherency Units cannot contest or control Mission Markers. Casualties alone never force a new Coherency check."
            }
          ]
        },
        {
          "name": "Terrain",
          "items": [
            {
              "t": "Movement, elevation, Access Points, gap clearance, and placement restrictions have additional rules; use the illustrated rules on pp. 33–37 and 56–58 for disputed cases."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "movement-phase",
      "num": "05",
      "name": "Movement Phase",
      "meta": "Deploy · Move · Disengage · Hold",
      "color": "#4f8df9",
      "icon": "movement-phase",
      "sourceLabel": "§8.4–8.5.5 · pp. 56–59",
      "groups": [
        {
          "name": "Choose One Action",
          "items": [
            {
              "t": "**Move:** An Unengaged Unit makes a standard Move."
            },
            {
              "t": "**Deploy:** Bring a Unit from Reserves using an Entry Edge, while respecting Available Supply and placement restrictions."
            },
            {
              "t": "**Disengage:** An Engaged Unit withdraws using the normal movement procedure."
            },
            {
              "t": "**Hold:** Do nothing; the Unit still becomes activated."
            }
          ]
        },
        {
          "name": "Disengage",
          "items": [
            {
              "t": "Every model must finish outside Engagement Range of all enemies or be removed; if the Leading Model cannot escape, Disengage fails and that model is removed."
            },
            {
              "t": "After Disengaging, the Unit cannot Ranged Attack or Charge in the following Assault Phase, unless its Current Supply was greater than the combined Supply of enemies engaged with it."
            }
          ]
        },
        {
          "name": "Deploy",
          "items": [
            {
              "t": "Start the Leading Model in contact with your Entry Edge and move up to Speed; then place the rest in Coherency."
            },
            {
              "t": "The deployed Unit may not finish inside the enemy Zone of Influence and must be legally In Coherency."
            },
            {
              "t": "An activation marker is set after the action."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "assault-phase",
      "num": "06",
      "name": "Assault Phase",
      "meta": "Run · Hold · Ranged Attack · Charge",
      "color": "#f9822f",
      "icon": "assault-phase",
      "sourceLabel": "§8.6–8.7.3 · pp. 59–61",
      "groups": [
        {
          "name": "Choose One Action",
          "items": [
            {
              "t": "Only Units activated in Movement on the battlefield act in Assault; Reserves cannot act."
            },
            {
              "t": "**Run:** An Unengaged Unit repositions by a standard Move."
            },
            {
              "t": "**Hold:** The Unit takes no action."
            },
            {
              "t": "**Ranged Attack:** Resolve legal weapon attacks against an eligible target."
            },
            {
              "t": "**Charge:** An Unengaged Ground Unit attempts to engage enemy Ground Units."
            }
          ]
        },
        {
          "name": "Targeting",
          "items": [
            {
              "t": "Check attacker/target Engagement status, LoS, weapon Range and Target Tags, and other exceptions."
            },
            {
              "t": "An Engaged attacker can only target enemy Units with which it is Engaged. Unengaged ranged attackers normally cannot shoot into an Engagement."
            },
            {
              "t": "A weapon profile's individual batches are resolved completely before starting the next."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "shooting",
      "num": "07",
      "name": "Ranged Attack Resolution",
      "meta": "Check target, build pools, resolve defenses",
      "color": "#f04a4a",
      "icon": "shooting",
      "sourceLabel": "§8.7.3–8.7.5 · pp. 60–64; §12.4 · p. 92",
      "groups": [
        {
          "name": "Before Dice",
          "items": [
            {
              "t": "Choose a legal enemy target, check Range, LoS and Target Tags; observe any Engagement restrictions."
            },
            {
              "t": "Group attacks using the same weapon profile against the same target into one Batch, resolving each Batch completely."
            }
          ]
        },
        {
          "name": "Sequence",
          "items": [
            {
              "t": "**1:** Build the Attack Pool from eligible models and Rate of Attack; add applicable modifiers and Surge Dice."
            },
            {
              "t": "**2:** Roll to Hit. Successful dice move into the Armour Pool."
            },
            {
              "t": "**3:** Resolve Surge against a matching Combat Tag; its effect may bypass Armour as specified."
            },
            {
              "t": "**4:** Defender rolls Armour against remaining dice, then Evade if eligible."
            },
            {
              "t": "**5:** Apply weapon Damage to remaining dice and remove casualties using the correct allocation rules."
            }
          ]
        },
        {
          "name": "Important",
          "items": [
            {
              "t": "Not every defender gets an Evade Roll. Check the specific entitlement and a non-null Evade characteristic."
            },
            {
              "t": "Template weapons, multiple attack batches, and engaged-model casualty removal have additional procedures in §8.7."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "charging",
      "num": "08",
      "name": "Charge & Engagement",
      "meta": "Reach the target without confusing Charge with melee",
      "color": "#f9822f",
      "icon": "charging",
      "sourceLabel": "§7.2 · p. 53; §8.7.7 · pp. 65–66",
      "groups": [
        {
          "name": "Declare",
          "items": [
            {
              "t": "Charge targets must be enemy Ground Units; Line of Sight is not required."
            },
            {
              "t": "Roll D6 for Charge Distance. The Leading Model can move up to Speed plus the roll, subject to Charge rules."
            }
          ]
        },
        {
          "name": "Resolve",
          "items": [
            {
              "t": "The Leading Model must be able to end within the 1-inch Engagement Range of all declared targets for the Charge to succeed."
            },
            {
              "t": "After success, place the rest of the Unit using the Charge placement priority: Base-to-Base, Engagement Range, then Coherency."
            },
            {
              "t": "If the Charge fails, the Unit stays in place and its activation ends."
            }
          ]
        },
        {
          "name": "Timing",
          "items": [
            {
              "t": "The Charge takes place in the **Assault Phase**; normal Close Combat attacks are made in the later **Combat Phase**."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "combat-phase",
      "num": "09",
      "name": "Close Combat",
      "meta": "Which models fight and how to resolve attacks",
      "color": "#f04a4a",
      "icon": "combat-phase",
      "sourceLabel": "§8.8–8.8.1 · pp. 67–68; §12.5 · p. 93",
      "groups": [
        {
          "name": "Activation",
          "items": [
            {
              "t": "All Engaged Ground Units must activate in Combat; players alternate."
            },
            {
              "t": "A player only Passes once no eligible Engaged Units remain. Flying Units are never Engaged."
            }
          ]
        },
        {
          "name": "Close Combat Attack",
          "items": [
            {
              "t": "Optionally **Close Ranks**: Leading Model moves up to 3 inches and ends closer to an already Engaged enemy; follow the repositioning rules."
            },
            {
              "t": "**Fighting Rank:** models within 1 inch of an enemy. **Supporting Rank:** models Base-to-Base with a friendly Fighting Rank model."
            },
            {
              "t": "Eligible models attack with Combat Phase weapons; resolve attacks using the attack sequence and applicable melee exceptions."
            },
            {
              "t": "Evade during Combat requires a specific granting rule or keyword."
            }
          ]
        },
        {
          "name": "Disputes",
          "items": [
            {
              "t": "Use §8.8.1 to resolve multiple Engagements and the priority for removing models from Engaged Units."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "visibility-cover",
      "num": "10",
      "name": "Line of Sight & Cover",
      "meta": "Top-down visibility, elevation, and terrain",
      "color": "#35c76b",
      "icon": "visibility-cover",
      "sourceLabel": "§7.1–7.2.1 · pp. 45–53",
      "groups": [
        {
          "name": "LoS Basics",
          "items": [
            {
              "t": "StarCraft TMG uses top-down (2D) Line of Sight, from the acting model's base to the target model's base."
            },
            {
              "t": "Terrain's Effective Size and elevation affect whether the line is blocked or grants Cover."
            },
            {
              "t": "A target or attack can be illegal even though the models look visible from a miniature's eye level."
            }
          ]
        },
        {
          "name": "Check Before Rolling",
          "items": [
            {
              "t": "Determine whether models are individually eligible, then check their weapon Range and the target's Combat Tag."
            },
            {
              "t": "Full Cover, Direct Cover, High Ground Cover, and Flying interactions are governed by distinct illustrated rules."
            },
            {
              "t": "Because this section is diagram-heavy, consult the original PDF pp. 45–52 for exact terrain/visibility cases."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "scoring",
      "num": "11",
      "name": "Scoring & Cleanup",
      "meta": "Mission Marker control and next-round initiative",
      "color": "#35c76b",
      "icon": "scoring",
      "sourceLabel": "§8.9–8.10 · pp. 69–72; §12.6 · p. 93",
      "groups": [
        {
          "name": "Who Can Contest?",
          "items": [
            {
              "t": "A Unit must be on the battlefield, In Coherency, and have at least one model within 3 inches with LoS to the Marker on the same elevation."
            },
            {
              "t": "Flying Units cannot contest or control Mission Markers."
            },
            {
              "t": "Sum **Current Supply**, not model counts, for eligible contesting Units."
            }
          ]
        },
        {
          "name": "Control",
          "items": [
            {
              "t": "Higher summed Supply wins. A tie is Contested; it does not transfer an existing controller's ownership."
            },
            {
              "t": "**Sticky control:** a controlled Marker stays owned after friendly Units leave until the opponent takes it with a higher contesting Supply total."
            },
            {
              "t": "Scoring Victory Points follows each Mission Card, not a universal fixed VP value."
            }
          ]
        },
        {
          "name": "Cleanup",
          "items": [
            {
              "t": "Check end-of-game conditions, then end-of-round effects."
            },
            {
              "t": "Remove ordinary markers/tokens; keep STAY IN PLAY, Damage Markers, Mission Markers, and Faction Indicators representing control."
            },
            {
              "t": "Refresh Exhausted Faction and Tactical Cards. Player with fewer VP gets next Round's First Player Marker; ties require a roll-off."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "special-abilities",
      "num": "12",
      "name": "Abilities, Reactions & Cards",
      "meta": "Timing windows, resource payments, and frequency",
      "color": "#b06ef7",
      "icon": "special-abilities",
      "sourceLabel": "§2.7 · pp. 29–30; §10.1–10.5.2 · pp. 79–81",
      "groups": [
        {
          "name": "Active / Passive / Reaction",
          "items": [
            {
              "t": "**Active:** use only when the Unit is activated, immediately before declaring its action or after it fully resolves; not during the action."
            },
            {
              "t": "**Passive:** continuously applies when conditions are met; no activation is needed."
            },
            {
              "t": "**Reaction:** declare at the exact triggering event; missed timing cannot be used retroactively."
            }
          ]
        },
        {
          "name": "Limits",
          "items": [
            {
              "t": "A named Active or Reaction ability is generally once per Round per Unit, unless REPEATABLE or another rule says otherwise."
            },
            {
              "t": "Each player may resolve **one Reaction per Activation**. When both respond to the same trigger, the Active Player resolves theirs first."
            },
            {
              "t": "Reserves Units normally cannot use Active, Passive, or Reaction abilities unless a rule specifically allows it."
            }
          ]
        },
        {
          "name": "Resources",
          "items": [
            {
              "t": "Terran uses **CP**; Zerg uses **BM**; Protoss uses **PE** in this PDF."
            },
            {
              "t": "Exhaust Ready faction/tactical cards to pay full costs. Unused generated resource is lost; it cannot be banked for another ability."
            },
            {
              "t": "An Exhausted card provides no resources or abilities until refreshed in Cleanup."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "army-building",
      "num": "13",
      "name": "Army Building",
      "meta": "Tags, slots, upgrades, missions and deployment",
      "color": "#ec5f99",
      "icon": "army-building",
      "sourceLabel": "§9.1–9.3 · pp. 73–78; §5.2–5.6 · pp. 39–43",
      "groups": [
        {
          "name": "Faction & Costs",
          "items": [
            {
              "t": "Pick exactly one Faction Card. Every Faction Tag on a selected Unit or Tactical Card must appear on that Faction Card."
            },
            {
              "t": "Use Minerals for Units and upgrades; Vespene Gas purchases Tactical Cards that add Army Slots."
            },
            {
              "t": "Required slot type and count depend on each Unit's starting Supply and profile."
            }
          ]
        },
        {
          "name": "Upgrades",
          "items": [
            {
              "t": "A normal purchased upgrade applies to the whole Unit; a SPECIALIST upgrade goes on a single nominated model."
            },
            {
              "t": "Replacements remove the specified original weapon. Different SPECIALIST upgrades may be assigned to different models."
            },
            {
              "t": "Resolve each differing weapon profile as a separate attack Batch."
            }
          ]
        },
        {
          "name": "Preparing",
          "items": [
            {
              "t": "Follow the Mission / Deployment draft and Battlefield Setup rules; reference the Deployment Card for Entry Edges and Marker positions."
            },
            {
              "t": "Use the official October 9, 2026 balance table for current points; the printed Core Rules appendix contains earlier values."
            }
          ]
        }
      ]
    },
    {
      "scope": "core",
      "id": "glossary-ref",
      "num": "14",
      "name": "Keyword & Referee Lookup",
      "meta": "Where to resolve detailed rules disputes",
      "color": "#8a91a5",
      "icon": "glossary-ref",
      "sourceLabel": "Part 11 · pp. 82–91; §12.7–12.9 · pp. 93–94",
      "groups": [
        {
          "name": "Source of Truth",
          "items": [
            {
              "t": "The PDF Keyword Glossary (Part 11) gives full definitions and takes priority over any short companion tooltip."
            },
            {
              "t": "Use the numbered rule rather than a worked example when both discuss a mechanic."
            },
            {
              "t": "For template weapons, unusual casualty cases, and unresolved disputes, consult the full rule and accompanying diagrams."
            }
          ]
        },
        {
          "name": "Existing Companion Data",
          "items": [
            {
              "t": "Current clickable keyword tooltips are provided by the companion's faction datasets, which have not all been verified against the 2026 PDF."
            },
            {
              "t": "If a keyword or card seems inconsistent with this reference, check the PDF page and record the discrepancy before a game."
            }
          ]
        }
      ]
    },
    {
      "scope": "terran",
      "id": "terran-lens",
      "num": "T",
      "name": "Terran Field Reference",
      "meta": "CP, Units, faction cards, tactics and specialties",
      "color": "#4f8df9",
      "icon": "terran-lens",
      "sourceLabel": "§5.4 · p. 41; §10.5.1 · p. 81; §12.10 · pp. 96–98",
      "groups": [
        {
          "name": "Resource & Faction",
          "items": [
            {
              "t": "Terran generates and spends **CP** using Ready Faction and Tactical Cards."
            },
            {
              "t": "All Terran Units and Tactical Cards must match every relevant Faction Tag on the selected Faction Card."
            }
          ]
        },
        {
          "name": "Useful Lookup Terms",
          "items": [
            {
              "t": "Common Terran data keywords to look up: SPECIALIST, SIDEARM, BULKY, BURST FIRE, INDIRECT FIRE, CRITICAL HIT, PINPOINT."
            },
            {
              "t": "A SPECIALIST upgrade affects one nominated model, not every model; read the Unit Card for exact weapon allocation."
            }
          ]
        },
        {
          "name": "Table Reference",
          "items": [
            {
              "t": "Current Terran points are in the publisher's October 2026 balance tables, PDF pages 2–3; the printed rulebook appendix has older prices."
            },
            {
              "t": "Listed Wave 1 points follow October 2026 balance; use official cards for precise ability wording."
            }
          ]
        }
      ]
    },
    {
      "scope": "zerg",
      "id": "zerg-lens",
      "num": "Z",
      "name": "Zerg Field Reference",
      "meta": "BM, Burrowed, On Creep, summoned and respawned units",
      "color": "#ec5f99",
      "icon": "zerg-lens",
      "sourceLabel": "§10.5.1 · p. 81; Part 11 · pp. 82–91; §12.10 · pp. 99–103",
      "groups": [
        {
          "name": "Resource & Faction",
          "items": [
            {
              "t": "Zerg uses **BM** as its card-generated faction resource."
            },
            {
              "t": "ON CREEP applies to a Ground Zerg Unit within 6 inches of a Creep Tumor or Source of Creep; it enables effects that require that state."
            }
          ]
        },
        {
          "name": "Status & Timing",
          "items": [
            {
              "t": "BURROWED grants HIDDEN and has special restrictions including no Mission Marker contest/control; read the full keyword entry."
            },
            {
              "t": "SUMMON / RESPAWN effects can change Units and Supply; check the full printed keyword description before resolving them."
            }
          ]
        },
        {
          "name": "Table Reference",
          "items": [
            {
              "t": "Current Zerg points are in the publisher's October 2026 balance tables, PDF pages 4–6; the printed rulebook appendix has older prices."
            },
            {
              "t": "Listed Wave 1 points follow October 2026 balance; Swarmling and Vile Roach are now included."
            }
          ]
        }
      ]
    },
    {
      "scope": "protoss",
      "id": "protoss-lens",
      "num": "P",
      "name": "Protoss Field Reference",
      "meta": "PE, Shields, Placement and special abilities",
      "color": "#b06ef7",
      "icon": "protoss-lens",
      "sourceLabel": "§5.1 · pp. 38–39; §10.5.1 · p. 81; §12.10 · pp. 104–106",
      "groups": [
        {
          "name": "Resource & Faction",
          "items": [
            {
              "t": "The 2026 rules use **PE** for Protoss ability resources; the companion dataset now matches."
            },
            {
              "t": "Only eligible Units and Tactical Cards matching the Faction Card's tags can join an army."
            }
          ]
        },
        {
          "name": "Shield & Positioning",
          "items": [
            {
              "t": "A Unit with Shield value adds it to the first model's HP. SHIELDED status ends when its threshold is exceeded or that first model is removed."
            },
            {
              "t": "PLACE is not an ordinary Move: follow its own placement and Engagement restrictions."
            },
            {
              "t": "PSIONIC ENERGY, SHIELDED, PLACE, and other special terms must be checked against full card and glossary wording."
            }
          ]
        },
        {
          "name": "Table Reference",
          "items": [
            {
              "t": "Current Protoss points are in the publisher's October 2026 balance tables, PDF pages 7–8; the printed rulebook appendix has older prices."
            },
            {
              "t": "The companion now uses PE for Protoss resources; check printed cards and latest FAQ for exact interactions."
            }
          ]
        }
      ]
    }
  ]
};
