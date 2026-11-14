// Wave 2 (Nerazim) and Wave 3 add-on data: official publisher card sheets + Oct 2026 points.
// Ability text is copied from the cards (checked 14 Nov 2026).
// Source: https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Cost-Table-10.2026_EN.pdf
// Load AFTER each base *-data.js. Preserve this overlay when rebuilding uploads/*.html.
(function (w) {
const extra = {
  "terran": {
    "units": [
      {
        "id": "nova-stealth",
        "name": "Nova (Stealth Mode)",
        "role": "Hero",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "5+",
          "armour": "5+",
          "hp": 8,
          "size": 2
        },
        "tags": [
          "Biological",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 240,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "C-20A Canister Rifle",
            "phase": "Assault",
            "range": "12",
            "target": "All",
            "roa": 4,
            "hit": "3+",
            "surge": "-",
            "sDie": "-",
            "damage": 2,
            "keywords": [
              "CRITICAL HIT (2)",
              "LONG RANGE (18\")"
            ]
          },
          {
            "name": "Combat Knife",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 3,
            "hit": "5+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Battle Preparation",
            "type": "Passive",
            "description": "During Army Building, your army cannot include both the Nova Assault Mode Unit and the Nova Stealth Mode Unit."
          },
          {
            "phase": "Any Phase",
            "name": "Tactical Stealth Suit",
            "type": "Passive",
            "description": "After this Unit fully resolves an Action, it gains the HIDDEN Status."
          },
          {
            "phase": "Any Phase",
            "name": "Ghost Visor",
            "type": "Passive",
            "description": "While Enemy Units are Within 6\" of this Unit, they lose the HIDDEN Status."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Super Stimpack",
              "type": "Active (1 CP)",
              "description": "This Unit gains BUFF Speed (2). Additionally, all its Weapons gain PRECISION (2)."
            },
            {
              "phase": "Movement Phase",
              "name": "Holo Decoy",
              "type": "Active (1 CP)",
              "description": "Resolve the SUMMON (Holo Decoy) effect. Then, Holo Decoy may immediately perform a Move action."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Operational Efficiency",
              "type": "Passive",
              "description": "After this Unit fully resolves a Ranged Attack with its C-20A Canister Rifle, if the target Enemy Unit was Destroyed or its Current Supply Value was reduced, the active player may return one of their Exhausted non-Unique Tactical Cards to its Ready state."
            },
            {
              "phase": "Assault Phase",
              "name": "Head Shot",
              "type": "Reaction (1 CP)",
              "description": "Once Per Game. While this Unit is Unengaged and has the Stationary Status, when it makes a Ranged Attack with its C-20A Canister Rifle, treat that weapon's Damage characteristic as 3, and it gains CONCENTRATED FIRE (1)."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "unique": true,
        "exclusiveGroup": "nova-mode",
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "nova-assault",
        "name": "Nova (Assault Mode)",
        "role": "Hero",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "5+",
          "armour": "5+",
          "hp": 8,
          "size": 2
        },
        "tags": [
          "Biological",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 260,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Hellfire Shotgun",
            "phase": "Assault",
            "range": "8",
            "target": "Ground",
            "roa": 3,
            "hit": "4+",
            "surge": "Light",
            "sDie": "D3",
            "damage": 2,
            "keywords": [
              "ANTI-EVADE (1)",
              "BURST FIRE 4\" (3)"
            ]
          },
          {
            "name": "Monomolecular Blade",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 8,
            "hit": "3+",
            "surge": "Light, Armoured",
            "sDie": "D6",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Battle Preparation",
            "type": "Passive",
            "description": "During Army Building, your army cannot include both the Nova Assault Mode Unit and the Nova Stealth Mode Unit."
          },
          {
            "phase": "Any Phase",
            "name": "Ghost Visor",
            "type": "Passive",
            "description": "While Enemy Units are Within 6\" of this Unit, they lose the HIDDEN Status."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Super Stimpack",
              "type": "Active (1 CP)",
              "description": "This Unit gains BUFF Speed (2). Additionally, all its Weapons gain PRECISION (2)."
            },
            {
              "phase": "Movement Phase",
              "name": "Holo Decoy",
              "type": "Active (1 CP)",
              "description": "Resolve the SUMMON (Holo Decoy) effect. Then, Holo Decoy may immediately perform a Move action."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Phase Reactor Suit",
              "type": "Active (1 CP)",
              "description": "If Unengaged, resolve the PLACE (6) effect."
            },
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 4+ effect."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "unique": true,
        "exclusiveGroup": "nova-mode",
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "spec-ops-marauder",
        "name": "Spec Ops Marauder",
        "role": "Core",
        "stats": {
          "shield": null,
          "speed": "4/7",
          "evade": "6+",
          "armour": "4+",
          "hp": 5,
          "size": 2
        },
        "tags": [
          "Armoured",
          "Biological",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 230,
            "models": "2",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Quad K12",
            "phase": "Assault",
            "range": "12",
            "target": "Ground",
            "roa": 3,
            "hit": "3+",
            "surge": "Armoured",
            "sDie": "D3",
            "damage": 1,
            "keywords": [
              "LONG RANGE (16\")",
              "PIERCE Armoured (2)"
            ]
          },
          {
            "name": "Strike",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 3,
            "hit": "4+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Spec Ops Armour",
            "type": "Active (1 CP)",
            "description": "This Unit gains the HIDDEN Status until it performs another action."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Commando Stimpack",
              "type": "Active (1 CP)",
              "description": "This Unit gains BUFF Speed (3). Additionally, its Quad K12 and all Close Combat Weapons gain PRECISION (2)."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Magrail Munitions",
              "type": "Passive",
              "description": "This Unit's first Attack in the game with its Quad K12 gains PIERCE Armoured (3)."
            },
            {
              "phase": "Assault Phase",
              "name": "Suppression Shells",
              "type": "Reaction (1 CP)",
              "description": "When an Enemy declares a Charge against a Friendly Unit Within 8\", that Enemy gains DEBUFF Speed (3)."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "factionTag": "Nova Covert Ops",
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "raven",
        "name": "Raven",
        "role": "Support",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "6+",
          "armour": "5+",
          "hp": 8,
          "size": "-"
        },
        "tags": [
          "Light",
          "Mechanical",
          "Flying"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 170,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Railguns",
            "phase": "Assault",
            "range": "12",
            "target": "Ground",
            "roa": 4,
            "hit": "3+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Detection",
            "type": "Passive",
            "description": "While Enemy Units are Within 6\" of this Unit, they lose the HIDDEN Status."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Deploy Auto-Turret",
              "type": "Active (1 CP)",
              "description": "Set a Friendly Auto-Turret Unit Within 6\", and not Within the Engagement Range of any Enemy Unit."
            },
            {
              "phase": "Movement Phase",
              "name": "Anti-Armour Missile",
              "type": "Active (1 CP)",
              "description": "Select one Enemy Unit Within 12\". Apply DEBUFF Armour (1)."
            }
          ]
        },
        "upgrades": {
          "Any Phase": [
            {
              "phase": "Any Phase",
              "name": "Corvid Reactor",
              "type": "Passive",
              "description": "This Unit may resolve its first Special Ability with the CP cost reduced by 1 if it targets the closest Enemy Unit.",
              "cost": 30
            }
          ],
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Internal Tech Module",
              "type": "Passive",
              "description": "When this Unit is nominated to deploy from Reserves, it may Deploy from any table edge that is not a player's Entry Edge. This Unit cannot be set Within 8\" of any Enemy model.",
              "cost": 20
            },
            {
              "phase": "Movement Phase",
              "name": "Seeker Missile",
              "type": "Active (1 CP)",
              "description": "Select one Enemy Unit Within 12\". At the End of the Assault Phase, if that Enemy Unit has the Stationary Status or it is Within 8\" of this Unit, it suffers HITS 4 (2). If that Unit is Engaged, it is eligible to make an Evade Roll against these hits.",
              "cost": 20
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Explosive Shrapnel Shells",
              "type": "Passive",
              "description": "The Gauss Cannon of the Auto-Turret set by this Unit gains Surge Type: Light and S Dice: D3+1.",
              "cost": 10
            }
          ]
        },
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Terran-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "holo-decoy",
        "name": "Holo Decoy",
        "role": "Other",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "6+",
          "armour": "6+",
          "hp": 1,
          "size": 2
        },
        "tags": [
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 0,
            "models": "1",
            "supply": 0
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Timed Life",
            "type": "Passive",
            "description": "Remove this Unit at the End of the Round."
          },
          {
            "phase": "Any Phase",
            "name": "Decoy",
            "type": "Passive",
            "description": "This Unit is never Engaged. It cannot Engage Enemy Units, cannot be Engaged by Enemy Units and cannot perform a Charge Action. This Unit cannot be the target of an ability, unless stated otherwise. It can never Control or Contest Mission Markers."
          },
          {
            "phase": "Any Phase",
            "name": "Surprise!",
            "type": "Passive",
            "description": "At the End of the Round, you can set a Friendly Nova Stealth Mode or Nova Assault Mode in Coherency with this Unit."
          },
          {
            "phase": "Any Phase",
            "name": "Lethal Hologram",
            "type": "Passive",
            "description": "All Weapons of Friendly Units targeting an Enemy Unit Within 4\" of this Unit gain PRECISION (1)."
          }
        ],
        "phaseAbilities": {},
        "upgrades": {},
        "wave": 3,
        "summonedOnly": true
      },
      {
        "id": "sabotage-drone",
        "name": "Sabotage Drone",
        "role": "Other",
        "stats": {
          "shield": null,
          "speed": "-",
          "evade": "6+",
          "armour": "6+",
          "hp": 3,
          "size": 1
        },
        "tags": [
          "Armoured",
          "Mechanical",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 0,
            "models": "1",
            "supply": 0
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Structure",
            "type": "Passive",
            "description": "This Unit cannot be Activated in any Phase and cannot perform actions. Additionally, its Current Supply Value is treated as 0, and it can never Control or Contest Mission Markers, ignoring the standard Zero Supply Exception. This Unit cannot be a target of an ability, unless stated otherwise."
          }
        ],
        "phaseAbilities": {
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Have a Nice Day",
              "type": "Passive",
              "description": "At the End of the Assault Phase, each Unit Within 3\" of this Unit (including Units with the Structure ability) suffers HITS 5 (1). If an affected Unit has the Structure ability, that Unit suffers an additional HITS 5 (1)."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "summonedOnly": true,
        "factionTag": "Nova Covert Ops"
      },
      {
        "id": "auto-turret",
        "name": "Auto-Turret",
        "role": "Other",
        "stats": {
          "shield": null,
          "speed": "-",
          "evade": "-",
          "armour": "5+",
          "hp": 3,
          "size": 2
        },
        "tags": [
          "Armoured",
          "Mechanical",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 0,
            "models": "1",
            "supply": 0
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Gauss Cannon",
            "phase": "Assault",
            "range": "8",
            "target": "All",
            "roa": 6,
            "hit": "3+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": [
              "PINPOINT"
            ]
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Timed Life",
            "type": "Passive",
            "description": "Remove this Unit at the End of the Round."
          },
          {
            "phase": "Any Phase",
            "name": "Structure",
            "type": "Passive",
            "description": "This Unit cannot be Activated in any Phase and cannot perform actions. Additionally, its Current Supply Value is treated as 0, and it can never Control or Contest Mission Markers, ignoring the standard Zero Supply Exception. This Unit cannot be a target of an ability, unless stated otherwise."
          }
        ],
        "phaseAbilities": {
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Overwatch",
              "type": "Reaction (0 CP)",
              "description": "Use when an Enemy Unit ends its Activation Within 8\" of this Unit. This Unit immediately performs a Ranged Attack against that Enemy Unit."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "summonedOnly": true
      }
    ],
    "factions": [
      {
        "id": "nova-covert-ops",
        "name": "Nova Covert Ops",
        "unique": true,
        "resource": "+1 CP",
        "slots": {
          "hero": 1,
          "elite": 1,
          "core": 3,
          "support": 1
        },
        "wave": 3,
        "abilities": [
          {
            "phase": "Movement Phase",
            "name": "Griffin Support",
            "type": "Active",
            "description": "Set a Friendly Sabotage Drone Unit Within 12\" of a Friendly Unit, more than 1\" away from any Enemy model. Remove this Unit at the End of the Round."
          },
          {
            "phase": "Movement Phase",
            "name": "Mark for Death",
            "type": "Active",
            "description": "Target an Enemy Unit on the battlefield. When a Friendly Unit makes an Attack targeting that Unit, its first Melee or Ranged Weapon used gains CRITICAL HIT (1) and PRECISION (1)."
          }
        ]
      }
    ],
    "tactical": [
      {
        "id": "vanadium-plating",
        "category": "defense",
        "name": "Vanadium Plating",
        "unique": false,
        "cost": 25,
        "resource": "+1 CP",
        "slots": {
          "support": 1
        },
        "wave": 3,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Crystalline Alloy",
            "type": "Reaction",
            "description": "Use before a Friendly Mechanical Unit makes an Armour Roll. That Unit gains DODGE (2) for this roll."
          }
        ]
      }
    ]
  },
  "protoss": {
    "units": [
      {
        "id": "tassadar",
        "name": "Tassadar",
        "role": "Hero",
        "stats": {
          "shield": 3,
          "speed": "7",
          "evade": "5+",
          "armour": "5+",
          "hp": 6,
          "size": 2
        },
        "tags": [
          "Biological",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 230,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Resonance Beam",
            "phase": "Assault",
            "range": "12",
            "target": "All",
            "roa": 6,
            "hit": "3+",
            "surge": "Armoured",
            "sDie": "D3",
            "damage": 1,
            "keywords": [
              "INSTANT"
            ]
          },
          {
            "name": "Strike",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 6,
            "hit": "4+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Commander",
            "type": "Passive",
            "description": "Treat this Unit's Supply characteristic as increased by 1 for Controlling and Contesting Mission Markers, completing objectives, and resolving Disengage checks."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Force Wall",
              "type": "Active (1 PE)",
              "description": "Set two Force Wall tokens Wholly Within 8\" in an unoccupied space. Units of Size 2 or lower cannot move across the Force Wall. Models of Size 3 or more can move over it, and it's then removed."
            },
            {
              "phase": "Movement Phase",
              "name": "Khala's Gift",
              "type": "Active (0 PE)",
              "description": "Target another Friendly Biological Unit Within 12\". Until the End of the Round, that Unit resolves its first Special Ability with the cost reduced by 1 (to a minimum of 0)."
            },
            {
              "phase": "Movement Phase",
              "name": "Executor's Will",
              "type": "Active (1 PE)",
              "description": "Target two Enemy Units on the battlefield (Line of Sight is not required) and place a Faction Indicator next to each of them. During the next Assault Phase, if either of these Units ends its Activation while its Faction Indicator remains on the battlefield, you may Activate two Friendly Units consecutively. Remove both Faction Indicators after any Enemy Unit completes its Activation in the following Assault Phase."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Psi Lightning",
              "type": "Active (0 PE)",
              "description": "Each Unit Within 2\" of one or more Friendly Force Wall tokens suffers 1 Damage."
            },
            {
              "phase": "Assault Phase",
              "name": "Telekinetic Push",
              "type": "Active (1 PE)",
              "description": "Set each Friendly Force Wall token Wholly Within 6\" of its current position."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "unique": true,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "twilight-templar",
        "name": "Twilight Templar",
        "role": "Support",
        "stats": {
          "shield": 3,
          "speed": "4/7",
          "evade": "6+",
          "armour": "5+",
          "hp": 3,
          "size": 2
        },
        "tags": [
          "Biological",
          "Light",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 230,
            "models": "2",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Psi Blast",
            "phase": "Assault",
            "range": "8",
            "target": "All",
            "roa": 2,
            "hit": "3+",
            "surge": "Light",
            "sDie": "D3",
            "damage": 2,
            "keywords": [
              "INSTANT"
            ]
          },
          {
            "name": "Strike",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 1,
            "hit": "4+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Bound by the Khala",
            "type": "Reaction (0 PE)",
            "description": "Use when the Current Supply Value of another Friendly Unit Within 8\" of this Unit is reduced. Return one Non-Unique Exhausted Tactical Card to the Ready state."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Psionic Gale",
              "type": "Active (2 PE)",
              "description": "Set a Psionic Storm token Within 10\" and Line of Sight of this Unit. This token is not removed if this Unit is Destroyed. At the End of each Phase, set a Psionic Storm Blast Template on the centre of this token. For each Unit that has at least one model whose base is partially covered by the template, roll 3 dice, plus 1 additional die for each model in that Unit whose base is partially covered. For each result of 4+, that Unit suffers an effect depending on the current Phase: Movement Phase: NON-LETHAL DAMAGE (1). Assault Phase: 1 Damage. If multiple effects trigger at the End of the Assault Phase, resolve them in the order specified in Part 8.9.4."
            },
            {
              "phase": "Movement Phase",
              "name": "Feedback",
              "type": "Active (1 PE)",
              "description": "Target one Enemy Mechanical or Psionic Unit Within 8\". Until the End of the Round, after that Unit resolves an Active or Reaction Special Ability (excluding abilities granted by a Tactical Card or Faction Card), it suffers NON-LETHAL DAMAGE (3)."
            },
            {
              "phase": "Movement Phase",
              "name": "Warp-In",
              "type": "Active (1 PE)",
              "description": "Resolve the PLACE (6) effect."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "unique": true,
        "factionTag": "Templar Caste",
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "high-templar",
        "name": "High Templar",
        "role": "Support",
        "stats": {
          "shield": 3,
          "speed": "4/7",
          "evade": "6+",
          "armour": "5+",
          "hp": 3,
          "size": 2
        },
        "tags": [
          "Biological",
          "Light",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T3",
            "cost": 200,
            "models": "3-4",
            "supply": 2
          },
          {
            "tier": "T2",
            "cost": 130,
            "models": "2",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Psi Blast",
            "phase": "Assault",
            "range": "8",
            "target": "All",
            "roa": 1,
            "hit": "3+",
            "surge": "Light",
            "sDie": "D3",
            "damage": 2,
            "keywords": [
              "INSTANT"
            ]
          },
          {
            "name": "Strike",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 1,
            "hit": "4+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Our Minds as One",
            "type": "Passive",
            "description": "While this Unit's Current Supply Value is 2, it gains the following effects: The first Special Ability resolved by this Unit each Round has its PE cost reduced by 1 (to a minimum of 0). Apply a +1 Modifier to the dice rolled for its Psionic Storm Special Ability."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Feedback",
              "type": "Active (1 PE)",
              "description": "Target one Enemy Mechanical or Psionic Unit Within 8\". Until the End of the Round, after that Unit resolves an Active or Reaction Special Ability (excluding abilities granted by a Tactical Card or Faction Card), it suffers NON-LETHAL DAMAGE (3)."
            }
          ]
        },
        "upgrades": {
          "Movement Phase": [
            {
              "name": "Psionic Storm",
              "cost": "20/30",
              "type": "Active (2 PE)",
              "description": "Set a Psionic Storm token Within 10\" and Line of Sight of this Unit. This token is not removed if this Unit is Destroyed. At the End of each Phase, set a Psionic Storm Blast Template on the centre of this token. For each Unit that has at least one model whose base is partially covered by the template, roll 3 dice, plus 1 additional die for each model in that Unit whose base is partially covered. For each result of 5+, that Unit suffers an effect depending on the current Phase: Movement Phase: NON-LETHAL DAMAGE (1). Assault Phase: 1 Damage. If multiple effects trigger at the End of the Assault Phase, resolve them in the order specified in Part 8.9.4."
            },
            {
              "name": "Farsight",
              "cost": "20/20",
              "type": "Active (1 PE)",
              "description": "Target one Friendly Unit Within 12\". Until the End of the Round, that Unit is eligible to make an Evade Roll against any attacks targeting it."
            }
          ]
        },
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "zeratul",
        "name": "Zeratul",
        "role": "Hero",
        "stats": {
          "shield": 3,
          "speed": "7",
          "evade": "5+",
          "armour": "5+",
          "hp": 5,
          "size": 2
        },
        "tags": [
          "Biological",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 230,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Master Warp Blade",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 4,
            "hit": "3+",
            "surge": "Light, Armoured",
            "sDie": "D3",
            "damage": 2,
            "keywords": [
              "INSTANT"
            ]
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "One with the Shadows",
            "type": "Passive",
            "description": "After this Unit fully resolves an Action, it gains the HIDDEN Status."
          },
          {
            "phase": "Any Phase",
            "name": "Prophetic Vision",
            "type": "Reaction (1 PE)",
            "description": "REPEATABLE. Use when this Unit is selected as the target of an attack. This Unit's Evade characteristic is treated as 4+ against this attack and cannot be modified."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Sentenced to Death",
              "type": "Active (1 PE)",
              "description": "Target Enemy Unit on the battlefield. Whenever Zeratul makes a Close Combat Attack targeting the selected Unit, its weapon gains CRITICAL HIT (2)."
            },
            {
              "phase": "Movement Phase",
              "name": "Void Prison",
              "type": "Active (1 PE)",
              "description": "Set a Faction Indicator on the battlefield Within 8\" of this Unit. While Enemy Units are Within 2\" of this Faction Indicator they suffer DEBUFF Speed (2)."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Void Blink",
              "type": "Active (1 PE)",
              "description": "If Unengaged, resolve the PLACE (6) effect."
            },
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 4+ effect."
            }
          ],
          "Combat Phase": [
            {
              "phase": "Combat Phase",
              "name": "Shadow Strike",
              "type": "Active (1 PE)",
              "description": "All Enemy Units Engaged with this Unit suffer HITS 4 (1)."
            }
          ]
        },
        "upgrades": {},
        "wave": 2,
        "unique": true,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W2-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "nerazim-watchers",
        "name": "Nerazim Watchers (Adept)",
        "role": "Core",
        "stats": {
          "shield": 2,
          "speed": "5/8",
          "evade": "5+",
          "armour": "5+",
          "hp": 3,
          "size": 2
        },
        "tags": [
          "Biological",
          "Light",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 210,
            "models": "3-4",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "1-2",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Glaive Cannon",
            "phase": "Assault",
            "range": "8",
            "target": "All",
            "roa": 3,
            "hit": "3+",
            "surge": "Light",
            "sDie": "D3+1",
            "damage": 1,
            "keywords": [
              "ANTI-EVADE (1)",
              "PINPOINT"
            ]
          },
          {
            "name": "Strike",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 1,
            "hit": "5+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Path of Shadows",
            "type": "Active (1 PE)",
            "description": "This Unit gains HIDDEN Status until it performs another action."
          },
          {
            "phase": "Any Phase",
            "name": "Nerazim Farsight",
            "type": "Passive",
            "description": "While Enemy Units are Within 6\" of this Unit's Shade token, they lose HIDDEN Status."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Psionic Transfer",
              "type": "Active (1 PE)",
              "description": "Set a Shade token Wholly Within 12\" of any model in this Unit. At the End of the Round, the controlling player may set all models of this Unit in Coherency, treating the Shade token as the Leading Model. The Shade token has DISPLACEMENT."
            }
          ]
        },
        "upgrades": {},
        "wave": 2,
        "factionTag": "Nerazim",
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W2-Card-Sheets-A4_EN.pdf"
      }
    ],
    "factions": [
      {
        "id": "templar-caste",
        "name": "Templar Caste",
        "unique": true,
        "resource": "+1 PE",
        "slots": {
          "hero": 1,
          "core": 3,
          "support": 2
        },
        "wave": 3,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Our Duty Is Unending",
            "type": "Active",
            "description": "Once per Game. Select up to two of your Exhausted Tactical Cards. Return them to the Ready state."
          },
          {
            "phase": "Any Phase",
            "name": "Khassar de Templari",
            "type": "Active",
            "description": "Instead of performing an action, select one other Friendly Biological Unit that has already been Activated this Phase. That Unit immediately performs one action available in the current Phase, then suffers NON-LETHAL DAMAGE (3)."
          }
        ]
      },
      {
        "id": "nerazim",
        "name": "Nerazim",
        "unique": true,
        "resource": "+1 PE",
        "slots": {
          "hero": 1,
          "elite": 3,
          "core": 2
        },
        "wave": 2,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Might of the Nerazim",
            "type": "Reaction",
            "description": "If a Friendly Unit loses the HIDDEN Status, it gains BUFF Speed (2) and its first Weapon used gains CRITICAL HIT (2)."
          },
          {
            "phase": "Movement Phase",
            "name": "Darkness Descends",
            "type": "Active",
            "description": "The active Biological Unit gains the HIDDEN Status until the End of the Round."
          }
        ]
      }
    ],
    "tactical": [
      {
        "id": "templar-archives",
        "category": "support",
        "name": "Templar Archives",
        "unique": true,
        "cost": 40,
        "resource": "+1 PE",
        "slots": {
          "support": 2
        },
        "wave": 3,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Ancestral Wisdom",
            "type": "Reaction",
            "description": "Once per Round, when a Friendly Support Unit activates a Special Ability that costs PE, resolve that ability with its PE cost reduced by 1 (to a minimum of 0). Do not Exhaust this card."
          }
        ]
      },
      {
        "id": "void-seeker",
        "category": "positioning",
        "name": "Void Seeker",
        "unique": true,
        "cost": 40,
        "resource": "+1 PE",
        "slots": {
          "core": 1
        },
        "factionTag": "Nerazim",
        "wave": 2,
        "summary": "Recall and redeploy a unit, or hide the active unit",
        "abilities": [
          {
            "phase": "Movement Phase",
            "name": "Personal Transport",
            "type": "Active",
            "description": "Instead of performing an action, the active, Unengaged Ground Unit is returned to Reserves. Then, it performs a Deploy action."
          },
          {
            "phase": "Movement Phase",
            "name": "Anakh Su'n",
            "type": "Active",
            "description": "This Unit gains the HIDDEN Status until it performs another action."
          }
        ]
      }
    ]
  },
  "zerg": {
    "units": [
      {
        "id": "zagara",
        "name": "Zagara",
        "role": "Hero",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "6+",
          "armour": "4+",
          "hp": 10,
          "size": 3
        },
        "tags": [
          "Biological",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 250,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Zagara's Talons",
            "phase": "Assault",
            "range": "8",
            "target": "Ground",
            "roa": 4,
            "hit": "3+",
            "surge": "Light, Armoured",
            "sDie": "D3",
            "damage": 2,
            "keywords": []
          },
          {
            "name": "Zagara's Acid Spines",
            "phase": "Assault",
            "range": "14",
            "target": "Flying",
            "roa": 8,
            "hit": "3+",
            "surge": "Light, Armoured",
            "sDie": "D3",
            "damage": 1,
            "keywords": []
          },
          {
            "name": "Talons",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 4,
            "hit": "3+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Commander",
            "type": "Passive",
            "description": "Treat this Unit's Supply characteristic as increased by 1 for Controlling and Contesting Mission Markers, completing objectives, and resolving Disengage checks."
          },
          {
            "phase": "Any Phase",
            "name": "Transfusion",
            "type": "Reaction (1 BM)",
            "description": "Use when another Friendly Biological Unit (including a Structure) suffers Damage Within 4\". Reduce the Total Damage before allocation by 2."
          },
          {
            "phase": "Any Phase",
            "name": "Psionic Link",
            "type": "Passive",
            "description": "Once per Round, if there are at least 7 Friendly models Within 6\" of this Unit, it may resolve its Special Ability with the BM cost reduced by 1."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Infested Drop",
              "type": "Passive",
              "description": "The base of the Zagara counts as an Entry Edge. Each Round, Friendly Units with a combined Supply cost of 1 may be Deployed via this Entry Edge."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Indomitable",
              "type": "Passive",
              "description": "While Engaged, this Unit may target and be targeted by Unengaged Enemy Units. In both cases, the defending Unit gains an Evade Roll against those attacks."
            },
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "Immediately after this Unit completes a successful Charge, resolve the IMPACT (6) 3+ effect."
            }
          ]
        },
        "upgrades": {
          "Movement Phase": [
            {
              "name": "Broodmother",
              "cost": 0,
              "type": "Active (1 BM)",
              "description": "Not priced in the Oct 2026 Cost Table (shown here at 0m; agree it with your opponent). Apply one of the following effects to all Friendly units (Line of Sight is not required). You cannot apply the effect chosen in the previous Game Round: Units of Size 1 gain a +1 Modifier to all IMPACT Rolls. All weapons of Size 2 Units gain CRITICAL HIT (1). Units of Size 3 or more gain TOUGH (1)."
            }
          ]
        },
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-W3-Card-Sheets-A4_EN.pdf",
        "unique": true
      },
      {
        "id": "defiler",
        "name": "Defiler",
        "role": "Support",
        "stats": {
          "shield": null,
          "speed": "7",
          "evade": "5+",
          "armour": "5+",
          "hp": 8,
          "size": 2
        },
        "tags": [
          "Biological",
          "Light",
          "Psionic",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 130,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Claws",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 4,
            "hit": "3+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Consume",
            "type": "Passive",
            "description": "When this Unit resolves a Special Ability that costs BM, it can remove one model from a Friendly Unit Within 4\" to generate 1 BM to spend towards that ability's cost."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Gestate Dark Swarm",
              "type": "Active (0 BM)",
              "description": "Set a Dark Swarm token in an unoccupied space Within 4\" and Line of Sight of this Unit. The Dark Swarm token has DISPLACEMENT."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Dark Swarm",
              "type": "Reaction (1 BM)",
              "description": "REPEATABLE. Use when a Friendly Unit Within 4\" of a Friendly Dark Swarm token is selected as the target of an attack. If this Unit is Within 4\" of the same token, the targeted Friendly Unit is eligible to make an Evade Roll against that attack. If the targeted Unit is Size 1, it gains a +1 Modifier to this Evade Roll."
            },
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 4+ effect."
            }
          ]
        },
        "upgrades": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Burrow Ambush",
              "type": "Passive",
              "description": "When this Unit is nominated to deploy from Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be placed Within 10\" of any Enemy model. This Unit's Activation ends.",
              "cost": 20
            }
          ],
          "Assault Phase": [
            {
              "name": "Plague",
              "cost": 20,
              "type": "Active (1-3 BM)",
              "description": "You may spend 1 to 3 BM to activate this ability. Set a Plague Blast Template Wholly Within 10\" and Line of Sight of this Unit. For each Unit that has at least one model whose base is partially covered by the template, roll 2 dice, plus 1 additional die for each model in that Unit whose base is partially covered. That Unit loses its HIDDEN Status, and, depending on the BM spent, it suffers NON-LETHAL DAMAGE (1) for: 1 BM: each result of 5+. 2 BM: each result of 4+. 3 BM: each result of 3+."
            }
          ],
          "Combat Phase": [
            {
              "name": "Cancerous Bite",
              "cost": 20,
              "type": "Weapon",
              "description": "Optional SIDEARM weapon: E / Ground / RoA 2 / Hit 3+ / Damage 2 / CRITICAL HIT (1).",
              "weaponProfile": {
                "name": "Cancerous Bite",
                "phase": "Combat",
                "range": "E",
                "target": "Ground",
                "roa": 2,
                "hit": "3+",
                "surge": "-",
                "sDie": "-",
                "damage": 2,
                "keywords": [
                  "CRITICAL HIT (1)",
                  "SIDEARM"
                ]
              }
            }
          ]
        },
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-W3-Card-Sheets-A4_EN.pdf"
      },
      {
        "id": "vileling",
        "name": "Vileling (Zergling)",
        "role": "Core",
        "stats": {
          "shield": null,
          "speed": "4/8",
          "evade": "5+",
          "armour": "6+",
          "hp": 1,
          "size": 1
        },
        "tags": [
          "Biological",
          "Light",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": 180,
            "models": "7-18",
            "supply": 2
          },
          {
            "tier": "T2",
            "cost": null,
            "models": "1-6",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Claws",
            "phase": "Combat",
            "range": "E",
            "target": "Ground",
            "roa": 2,
            "hit": "5+",
            "surge": "-",
            "sDie": "-",
            "damage": 1,
            "keywords": []
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Squadron",
            "type": "Passive",
            "description": "This Unit's Horizontal Coherency is 4\"."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Zergling Reconstitution",
              "type": "Active (1 BM)",
              "description": "Resolve the RESPAWN (2) effect, or RESPAWN (3) if the Unit is ON CREEP."
            },
            {
              "phase": "Movement Phase",
              "name": "Burrow Ambush",
              "type": "Passive",
              "description": "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "Immediately after this Unit completes a successful Charge, resolve the IMPACT (1) 5+ effect."
            },
            {
              "phase": "Assault Phase",
              "name": "Metabolic Boost",
              "type": "Active (1 BM)",
              "description": "When determining Charge Distance for this Unit, roll 2D6 instead of D6 and use the higher result to add to the Unit's Speed characteristic."
            }
          ],
          "Combat Phase": [
            {
              "phase": "Combat Phase",
              "name": "Debilitating Claws",
              "type": "Passive",
              "description": "After an Enemy Unit suffers Damage from this Unit, apply DEBUFF Hit (1) to each of that Unit's Weapons."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-W3-Card-Sheets-A4_EN.pdf",
        "factionTag": "Zagara's Swarm"
      },
      {
        "id": "bile-launcher",
        "name": "Bile Launcher",
        "role": "Support",
        "stats": {
          "shield": null,
          "speed": "-",
          "evade": "-",
          "armour": "4+",
          "hp": 10,
          "size": 3
        },
        "tags": [
          "Armoured",
          "Biological",
          "Ground"
        ],
        "tiers": [
          {
            "tier": "T3",
            "cost": null,
            "models": "-",
            "supply": 0
          },
          {
            "tier": "T2",
            "cost": 150,
            "models": "1",
            "supply": 1
          },
          {
            "tier": "T1",
            "cost": null,
            "models": "-",
            "supply": 0
          }
        ],
        "weapons": [
          {
            "name": "Bile Bomb",
            "phase": "Assault",
            "range": "12",
            "target": "Ground",
            "roa": 6,
            "hit": "3+",
            "surge": "Light, Armoured",
            "sDie": "D3",
            "damage": 1,
            "keywords": [
              "PIERCE Armoured (2)",
              "PINPOINT"
            ]
          }
        ],
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Biological Structure",
            "type": "Passive",
            "description": "This Unit cannot gain the BURROWED Status, cannot be returned to Reserves, and is immune to the IMPACT keyword."
          },
          {
            "phase": "Any Phase",
            "name": "Detection",
            "type": "Passive",
            "description": "While Enemy Units are Within 6\" of this Unit, they lose the HIDDEN Status."
          },
          {
            "phase": "Any Phase",
            "name": "Source of Creep",
            "type": "Passive",
            "description": "A Friendly or Enemy Ground Zerg Unit Within 6\" of this Unit counts as being ON CREEP."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Burrow Ambush",
              "type": "Passive",
              "description": "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends."
            },
            {
              "phase": "Movement Phase",
              "name": "Bombard",
              "type": "Active (1 BM)",
              "description": "Set a Bile Bomb token on the battlefield Within 24\" of this Unit. When this Unit resolves a Ranged Attack using the Bile Bomb weapon profile this Round, it may choose to ignore the weapon's standard Range characteristic. If it does, it may target an Enemy Unit that is Within 3\" of that token (Line of Sight is not required), ignoring the HIDDEN Status. After the attack is fully resolved, remove the Bile Bomb token from the battlefield. When the Bile Bomb token is about to be removed, set a Creep Tumor token in base-to-base contact with it. The Bile Bomb token has DISPLACEMENT."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Indomitable",
              "type": "Passive",
              "description": "While Engaged, this Unit may target and be targeted by Unengaged Enemy Units. In both cases, the defending Unit gains an Evade Roll against those attacks."
            }
          ]
        },
        "upgrades": {},
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Zerg-P2P-W3-Card-Sheets-A4_EN.pdf",
        "unique": true
      }
    ],
    "factions": [
      {
        "id": "zagaras-swarm",
        "name": "Zagara's Swarm",
        "unique": true,
        "resource": "+1 BM",
        "slots": {
          "hero": 1,
          "core": 4,
          "support": 1
        },
        "wave": 3,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Instinctive Reaction",
            "type": "Reaction",
            "description": "Use when an Enemy Unit declares a Close Combat Attack against a Friendly Unit. That Friendly Unit becomes eligible to make an Evade Roll against that attack."
          },
          {
            "phase": "Any Phase",
            "name": "Zerg Creep",
            "type": "Passive",
            "description": "During Army Building, select exactly one Creep Card and add it to their Army List, paying its listed cost (if any)."
          },
          {
            "phase": "Combat Phase",
            "name": "Scourge Queen",
            "type": "Active",
            "description": "If the active Unit contains more models than the combined number of models in all Engaged Enemy Units, its Close Combat Weapons gain INSTANT and PRECISION (4)."
          }
        ]
      }
    ],
    "tactical": [
      {
        "id": "defiler-mound",
        "name": "Defiler Mound",
        "unique": true,
        "cost": 35,
        "resource": "+1 BM",
        "slots": {
          "elite": 1,
          "support": 1
        },
        "category": "combat",
        "wave": 3,
        "abilities": [
          {
            "phase": "Movement Phase",
            "name": "Poisonous Essence",
            "type": "Active",
            "description": "Set a Faction Indicator on the active Friendly Unit. At the end of the Assault Phase, all Biological Enemy Units Engaged with the marked Unit suffer NON-LETHAL DAMAGE (2)."
          },
          {
            "phase": "Movement Phase",
            "name": "Tunnel Network",
            "type": "Active",
            "description": "The active, Unengaged Ground Unit is returned to Reserves instead of performing an action."
          }
        ]
      },
      {
        "id": "reactive-creep",
        "name": "Reactive Creep",
        "unique": true,
        "cost": 10,
        "resource": null,
        "slots": {},
        "category": "creep",
        "factionTag": "Zagara's Swarm",
        "wave": 3,
        "abilities": [
          {
            "phase": "Any Phase",
            "name": "Reactive Tissue",
            "type": "Passive",
            "description": "While a Friendly Zerg Unit is ON CREEP, it gains DODGE (1) against any attacks targeting it."
          },
          {
            "phase": "Any Phase",
            "name": "Living Glob of Tissue",
            "type": "Passive",
            "description": "Creep Tumor tokens have STAY IN PLAY and DISPLACEMENT."
          },
          {
            "phase": "Any Phase",
            "name": "Creep Removal",
            "type": "Passive",
            "description": "If an Enemy Unit ends a Move, Deploy, Run, Charge or Disengage action Within 1\" of a Friendly Creep Tumor token, remove that token from the battlefield."
          }
        ]
      }
    ]
  }
};
for(const [name,patch] of Object.entries(extra)) {
  const data=w['SCTMG_'+name.toUpperCase()];
  if(!data) continue;
  for(const [key,items] of [['UNITS',patch.units],['FACTION_CARDS',patch.factions],['TACTICAL_CARDS',patch.tactical]]) {
    for(const item of items) {
      if(data[key].some(old => old.id === item.id)) throw new Error('Duplicate '+name+' '+key+': '+item.id);
      data[key].push(item);
    }
  }
}
})(window);

// One-line summaries for tactical cards that shipped without one, so the Tactics
// list can be compared without expanding every card.
(function (root) {
  const SUMMARIES = {
    'defiler-mound': 'Poison engaged enemies, tunnel a unit back to Reserves',
    'reactive-creep': 'Dodge (1) on creep, creep tokens persist',
    academy: 'Support CP abilities cost 1 less once per round',
    armory: 'Tough (1) or Critical Hit (1) for Mechanical units',
    barracks: 'Free 2" move for a Biological unit',
    'barracks-proxy': 'Free 2" move, deploy Biological units from a side edge',
    'barracks-tech-lab': 'Free 2" move, Anti-Evade (1) on first ranged weapon',
    dropship: 'Pull a unit to Reserves, drop one in at a marker',
    'engineering-bay': 'Tough (1) or Critical Hit (1) for Biological units',
    factory: 'Heal (2) a Mechanical unit',
    'orbital-command': 'Block an enemy deploy edge, reveal hidden units',
    'supply-depot': '+1 supply for holding and scoring objectives',
    'vanadium-plating': 'Dodge (2) on a Mechanical unit’s armour roll',
    forge: 'Tough (1) or Critical Hit (1) for Ground units',
    'gate-chronoboosted': '+2 Speed, Precision (2) on first melee weapon',
    gateway: 'Precision (2) on first melee weapon',
    nexus: 'First weapon gains Instant, recall a unit to Reserves',
    observer: 'Reveal hidden units, +1 charge distance',
    'overcharged-nexus': 'Shoot flanking arrivals, recall a unit to Reserves',
    'power-field': 'Dodge (2) on a Ground unit’s armour roll',
    'twilight-council': 'Heal (2) after a Place, +4" range on first ranged weapon',
    'warp-gate': 'Warp a Ground unit in from a side edge, Precision (2) melee',
    'warp-prism': 'Place (3) a unit, warp one in at a marker',
    'templar-archives': 'Support PE abilities cost 1 less once per round'
  };
  ['SCTMG_ZERG', 'SCTMG_TERRAN', 'SCTMG_PROTOSS'].forEach(k => {
    const data = root[k];
    if (!data || !data.TACTICAL_CARDS) return;
    data.TACTICAL_CARDS.forEach(t => { if (!t.summary && SUMMARIES[t.id]) t.summary = SUMMARIES[t.id]; });
  });
})(window);

// Shared keyword glossary: Core Rules Part 11, with FAQ v1.3 (11 Nov 2026) rulings folded in.
// Every faction gets every keyword, because Vs and the Codex show the opponent's cards too.
// Faction-only entries (like PSIONIC ENERGY) are kept.
(function (root) {
  const GLOSSARY = {
    "ANTI-EVADE": { type: "Weapon", description: "When attacking with this weapon, the target suffers a -X Modifier to its Evade Roll. A target number can never be worse than 6+, so this never removes the Evade Roll (FAQ v1.3)." },
    "BUFF": { type: "Effect", description: "The Unit gains a bonus of X to the named characteristic until the End of the Round. A target number (Armour, Hit) gets X easier to roll; a value (Speed, RoA) goes up by X." },
    "BULKY": { type: "Weapon", description: "This weapon cannot be used to make a Ranged Attack while the Unit is Engaged (Core Rules Part 8.7.3)." },
    "BURROWED": { type: "Status", description: "BURROWED also gives HIDDEN (regained at the Start of each Round). Size counts as 0, and Supply counts as 0 for Disengage checks. The Unit cannot Control or Contest Mission Markers. It may only Deploy, Move, Disengage, Run, Hold or Close Ranks; any of these except Hold removes BURROWED. It may make an Evade Roll against every attack, and other models may move through it (not ending Within 1\"). If Engaged in the Combat Phase it must Activate, and can only attack after removing BURROWED with Close Ranks." },
    "BURST FIRE": { type: "Weapon", description: "BURST FIRE Y\" (X): when the target is Within Y\" of the attacking model, increase this weapon's RoA by X for that attack." },
    "CONCENTRATED FIRE": { type: "Weapon", description: "Attacks with this weapon may remove no more than X models as casualties. Once X models are removed, discard any remaining Total Damage, including Damage the Unit already had; it is not kept as a Damage Marker (FAQ v1.3)." },
    "CRITICAL HIT": { type: "Combat", description: "Move X dice from the Armour Pool directly to the Damage Pool, bypassing Armour. It can never move more dice than are in the Armour Pool." },
    "DEBUFF": { type: "Effect", description: "The Unit suffers a penalty of X to the named characteristic until the End of the Round. A target number (Armour, Hit) gets X harder to roll; a value (Speed, RoA) goes down by X, minimum 0." },
    "DISPLACEMENT": { type: "Token", description: "A Leading Model may end a move overlapping this Token or model. If it does, the Leading Model's controlling player immediately sets this Token or model in Base-to-Base contact with it, or as close as possible." },
    "DODGE": { type: "Defence", description: "When this Unit is targeted by an attack, reduce by X (minimum 0) the number of dice that Surge or CRITICAL HIT would move from the Armour Pool to the Damage Pool. Apply during the Resolve Surge step." },
    "FLYING": { type: "Unit", description: "Flying Units move point to point ignoring terrain, are never Engaged, cannot Charge or be Charged, never fight in the Combat Phase, and cannot Control or Contest Mission Markers. They ignore Full Cover and never get the High Ground Evade bonus." },
    "HEAL": { type: "Effect", description: "Remove X points of accumulated Damage from the Unit. HEAL cannot return Destroyed models and cannot restore SHIELDED Status." },
    "HIDDEN": { type: "Status", description: "This Unit cannot be selected as the target of a Ranged Attack or any Line of Sight Special Ability unless the acting model is Within 4\". It is immune to IMPACT and may make an Evade Roll against every attack. Detection abilities that target an area still affect it (FAQ v1.3)." },
    "HITS": { type: "Effect", description: "HITS X (Y): the Unit suffers X automatic hits. Put X dice straight into the Armour Pool and go on to Armour Rolls; each that gets through deals Y Damage. These hits never generate Surge." },
    "IMPACT": { type: "Combat", description: "IMPACT (X) Y: immediately after a successful Charge, every model in the Fighting or Supporting Rank rolls X dice (split between targets if it touches several). Each result of Y+ puts 1 die into that Unit's Armour Pool. These hits deal 1 Damage and never generate Surge." },
    "INDIRECT FIRE": { type: "Weapon", description: "Ranged Attacks with this weapon may ignore Line of Sight when selecting a target and resolving Damage; the target must still be Within Range. If the target is not in Line of Sight, it may make an Evade Roll against this attack. If at least one model is visible, there is no Evade Roll (FAQ v1.3)." },
    "INSTANT": { type: "Weapon", description: "Enemy Units cannot declare or resolve Reaction abilities in response to attacks made with this weapon." },
    "LOCKED IN": { type: "Weapon", description: "When making a Ranged Attack with this weapon, add X to its RoA if the TARGET Unit has Stationary Status (FAQ v1.3)." },
    "LONG RANGE": { type: "Weapon", description: "The weapon's maximum Range increases to X\". Models firing beyond the normal Range but Within X\" suffer a -1 Modifier to Hit." },
    "MORPH": { type: "Effect", description: "MORPH (Unit) X: needs enough Available Supply. Set one model of the named Unit in Base-to-Base contact with the active Unit, then remove X models from the active Unit. The new Unit cannot be set Within 1\" of an Enemy and cannot Activate for the rest of the Round. Supply lost this way gives the opponent VPs (FAQ v1.3)." },
    "NON-LETHAL DAMAGE": { type: "Effect", description: "Add X points of Damage to the Unit without removing models, even if Total Damage exceeds a model's HP. Later standard Damage triggers casualty removal using the combined Total Damage. It also removes SHIELDED Status like normal Damage (FAQ v1.3)." },
    "ON CREEP": { type: "Status", description: "A Friendly or Enemy Ground Zerg Unit is ON CREEP while Within 6\" of any Creep Tumor Token or Source of Creep (like the Omega Worm), at any elevation." },
    "PIERCE": { type: "Weapon", description: "PIERCE [Tag] X: when attacking a Unit with that Combat Tag, treat this weapon's Damage characteristic as X." },
    "PINPOINT": { type: "Weapon", description: "Ranged Attacks with this weapon may target Engaged Enemy Units, ignoring the normal restriction. It does not let an Engaged attacker shoot outside its own Engagement (FAQ v1.3)." },
    "PLACE": { type: "Movement", description: "Remove the Leading Model and set it Wholly Within X\" of where it started, then rebuild the Unit in Coherency. PLACE ignores the path, Gap Clearance and elevation, but the final position must be legal and not Within Engagement Range of an Enemy, except during the Assault Phase, when it may set models into Engagement." },
    "PRECISION": { type: "Combat", description: "After rolling to Hit, move up to X failed dice into the Armour Pool. They count as successful hits for all purposes, including Surge." },
    "REPEATABLE": { type: "Ability", description: "This ability ignores the once-per-Round limit and may be used several times per Round and per Activation, if its costs and triggers are met each time. A REPEATABLE Reaction is still limited to one Reaction per Activation (FAQ v1.3)." },
    "RESPAWN": { type: "Effect", description: "Return up to X Destroyed models to this Unit without raising its Current Supply Value. Set them Base-to-Base with existing models and outside Enemy Engagement Range; models that cannot be set legally do not return." },
    "SHIELDED": { type: "Status", description: "Add the Shield value to the first model's HP. SHIELDED ends when Total Damage exceeds the Shield value (Shield 3 is lost at 4 Damage) or when the first model is removed. HEAL can restore the HP but not SHIELDED (FAQ v1.3)." },
    "SIDEARM": { type: "Weapon", description: "May be used in addition to the model's normal weapon during a Ranged Attack or Close Combat Attack. Each SIDEARM is a separate Batch and may select a different eligible target." },
    "SIEGE MODE": { type: "Status", description: "While a Unit has SIEGE MODE it cannot Move, Disengage, Run, Charge or Close Ranks. Its Siege Mode weapon profiles can only be used in SIEGE MODE, and its other weapons cannot be used. Returning to Reserves removes SIEGE MODE." },
    "SPECIALIST": { type: "Army building", description: "A Unit may include only one model equipped with this weapon. Upgrades cannot give the Unit a second one, and it cannot be moved to another model if that model dies (Core Rules Part 9.1.7, FAQ v1.3)." },
    "STATIONARY": { type: "Status", description: "All Units gain Stationary at the Start of the Round. A Unit loses it as soon as any of its models moves, is moved or is PLACED." },
    "STAY IN PLAY": { type: "Token", description: "This Token, Marker or effect is not removed during Cleanup & Refresh. It stays until something specifically removes it." },
    "SUMMON": { type: "Effect", description: "Set the named Unit's Leading Model Base-to-Base with its Parent Unit and the rest In Coherency, not Within 1\" of an Enemy or in the Enemy Zone of Influence, and only if Available Supply allows. It cannot Activate in the Phase it arrives; in later Phases it Activates right after its Parent." },
    "TOUGH": { type: "Defence", description: "When this Unit resolves an Armour Roll, change up to X failed results into successes." }
  };
  ['SCTMG_ZERG', 'SCTMG_TERRAN', 'SCTMG_PROTOSS'].forEach(k => {
    const data = root[k];
    if (!data || !data.KEYWORDS) return;
    Object.entries(GLOSSARY).forEach(([name, entry]) => { data.KEYWORDS[name] = { ...entry }; });
  });
})(window);
