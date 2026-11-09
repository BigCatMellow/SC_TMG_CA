// Wave 3 add-on data: official Sep 2026 publisher cards + Oct 2026 points.
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
            "name": "Ghost Visor",
            "type": "Passive",
            "description": "Enemy units within 6 inches lose HIDDEN."
          },
          {
            "phase": "Any Phase",
            "name": "Tactical Stealth Suit",
            "type": "Passive",
            "description": "After this unit completes an action, gain HIDDEN."
          },
          {
            "phase": "Any Phase",
            "name": "Battle Preparation",
            "type": "Passive",
            "description": "An army cannot include both Nova modes."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Super Stimpack",
              "type": "Active (1 CP)",
              "description": "Gain BUFF Speed (2); weapons gain PRECISION (2)."
            },
            {
              "phase": "Movement Phase",
              "name": "Holo Decoy",
              "type": "Active (1 CP)",
              "description": "Summon a Holo Decoy; it may immediately Move."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Operational Efficiency",
              "type": "Passive",
              "description": "A C-20A attack that destroys or lowers Enemy Supply can ready one Exhausted non-Unique Tactical Card."
            },
            {
              "phase": "Assault Phase",
              "name": "Head Shot",
              "type": "Reaction (1 CP)",
              "description": "Once per game, while Unengaged and Stationary, C-20A Damage becomes 3 and gains CONCENTRATED FIRE (1)."
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
            "name": "Ghost Visor",
            "type": "Passive",
            "description": "Enemy Units within 6 inches lose HIDDEN."
          },
          {
            "phase": "Any Phase",
            "name": "Battle Preparation",
            "type": "Passive",
            "description": "Only one Nova mode can be recruited."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Super Stimpack",
              "type": "Active (1 CP)",
              "description": "Gain BUFF Speed (2) and PRECISION (2) on all weapons."
            },
            {
              "phase": "Movement Phase",
              "name": "Holo Decoy",
              "type": "Active (1 CP)",
              "description": "Summon a Holo Decoy; it can immediately Move."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Phase Reactor Suit",
              "type": "Active (1 CP)",
              "description": "If Unengaged, resolve PLACE (6)."
            },
            {
              "phase": "Assault Phase",
              "name": "Devastating Charge",
              "type": "Passive",
              "description": "After successful Charge, resolve IMPACT (4) 4+."
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
            "description": "Gain HIDDEN until this unit performs another action."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Commando Stimpack",
              "type": "Active (1 CP)",
              "description": "Gain BUFF Speed (3). Quad K12 and Close Combat weapons gain PRECISION (2)."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Suppression Shells",
              "type": "Reaction (1 CP)",
              "description": "When an Enemy charges a Friendly Unit within 8 inches, that enemy gains DEBUFF Speed (3)."
            },
            {
              "phase": "Assault Phase",
              "name": "Magrail Munitions",
              "type": "Passive",
              "description": "First Quad K12 attack this game gains PIERCE Armoured (3)."
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
            "description": "Enemy Units within 6 inches lose HIDDEN."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Deploy Auto-Turret",
              "type": "Active (1 CP)",
              "description": "Place a friendly Auto-Turret within 6 inches and outside enemy Engagement Range."
            },
            {
              "phase": "Movement Phase",
              "name": "Anti-Armour Missile",
              "type": "Active (1 CP)",
              "description": "Enemy Unit within 12 inches receives DEBUFF Armour (1)."
            }
          ]
        },
        "upgrades": {
          "Any Phase": [
            {
              "phase": "Any Phase",
              "name": "Corvid Reactor",
              "type": "Passive",
              "description": "First special ability can cost 1 less CP if it targets the closest enemy."
            }
          ],
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Internal Tech Module",
              "type": "Passive",
              "description": "May deploy from a non-Entry table edge more than 8 inches from enemies."
            },
            {
              "phase": "Movement Phase",
              "name": "Seeker Missile",
              "type": "Active (1 CP)",
              "description": "Mark an Enemy within 12 inches; at End of Assault, resolve HITS 4 (2) if stationary or within 8 inches. Engaged target may Evade."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Explosive Shrapnel Shells",
              "type": "Passive",
              "description": "Auto-Turret Gauss Cannon gains Surge Light and S.Die D3+1."
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
            "description": "Remove at end of Round."
          },
          {
            "phase": "Any Phase",
            "name": "Decoy",
            "type": "Passive",
            "description": "Cannot Charge or be Engaged; cannot control markers."
          },
          {
            "phase": "Any Phase",
            "name": "Surprise!",
            "type": "Passive",
            "description": "At End of Round may be placed in Coherency with Nova."
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
            "description": "Does not activate or control markers; Supply is zero."
          },
          {
            "phase": "Assault Phase",
            "name": "Have a Nice Day",
            "type": "Passive",
            "description": "At End of Assault, Units within 3 inches take HITS 5 (1); Structures take an additional HITS 5 (1)."
          }
        ],
        "phaseAbilities": {},
        "upgrades": {},
        "wave": 3,
        "summonedOnly": true
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
            "description": "Remove at end of Round."
          },
          {
            "phase": "Any Phase",
            "name": "Structure",
            "type": "Passive",
            "description": "Does not activate or control markers."
          },
          {
            "phase": "Assault Phase",
            "name": "Overwatch",
            "type": "Reaction (0 CP)",
            "description": "When an Enemy Unit within 8 inches ends its Activation, attack it."
          }
        ],
        "phaseAbilities": {},
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
            "description": "Place a Sabotage Drone within 12 inches of a friendly Unit, more than 1 inch from enemies; remove it at End of Round."
          },
          {
            "phase": "Movement Phase",
            "name": "Mark for Death",
            "type": "Active",
            "description": "Mark an Enemy; the first Friendly weapon used against it gains CRITICAL HIT (1) and PRECISION (1)."
          }
        ]
      }
    ],
    "tactical": [
      {
        "id": "vanadium-plating",
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
            "description": "Before a Friendly Mechanical Unit's Armour Roll, grant DODGE (2) for this roll."
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
            "description": "Supply counts as one higher for markers, objectives and Disengage."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Force Wall",
              "type": "Active (1 PE)",
              "description": "Set two Force Walls within 8 inches; Size 2 or lower cannot cross, while larger models remove a wall when crossing."
            },
            {
              "phase": "Movement Phase",
              "name": "Khala's Gift",
              "type": "Active (0 PE)",
              "description": "Another Friendly Biological Unit within 12 inches pays one less PE for its next Special Ability this Round."
            },
            {
              "phase": "Movement Phase",
              "name": "Executor's Will",
              "type": "Active (1 PE)",
              "description": "Mark two enemies with Faction Indicators; when conditions trigger next Assault Phase, activate two Friendly Units consecutively."
            }
          ],
          "Assault Phase": [
            {
              "phase": "Assault Phase",
              "name": "Telekinetic Push",
              "type": "Active (1 PE)",
              "description": "Move each Friendly Force Wall up to 6 inches."
            },
            {
              "phase": "Assault Phase",
              "name": "Psi Lightning",
              "type": "Active (0 PE)",
              "description": "Deal one Damage to Units within 2 inches of Friendly Force Walls."
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
            "description": "When another Friendly Unit within 8 inches loses Supply, Ready an Exhausted non-Unique Tactical Card."
          }
        ],
        "phaseAbilities": {
          "Movement Phase": [
            {
              "phase": "Movement Phase",
              "name": "Warp-In",
              "type": "Active (1 PE)",
              "description": "Resolve PLACE (6)."
            },
            {
              "phase": "Movement Phase",
              "name": "Feedback",
              "type": "Active (1 PE)",
              "description": "After a marked Enemy Mechanical/Psionic Unit within 8 inches uses a unit ability this Round, deal NON-LETHAL DAMAGE (3)."
            },
            {
              "phase": "Movement Phase",
              "name": "Psionic Gale",
              "type": "Active (2 PE)",
              "description": "Place a Psionic Storm token within 10 inches and LoS; resolve phase-end template effects."
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
            "description": "At Supply 2, first special ability each Round costs one less PE and Psionic Storm rolls gain +1."
          },
          {
            "phase": "Movement Phase",
            "name": "Feedback",
            "type": "Active (1 PE)",
            "description": "Mark an Enemy Mechanical or Psionic Unit within 8 inches; after it uses an Active/Reaction unit ability this Round, deal NON-LETHAL DAMAGE (3)."
          }
        ],
        "phaseAbilities": {},
        "upgrades": {},
        "wave": 3,
        "cardSource": "https://starcraft-tmg.com/files/downloads/StarCraft-Protoss-P2P-W3-Card-Sheets-A4_EN.pdf",
        "cardNote": "The publisher shows optional Psionic Storm and Farsight abilities but the Oct 2026 cost table has no pricing; they are not auto-purchasable."
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
            "description": "Once per game, Ready up to two exhausted Tactical Cards."
          },
          {
            "phase": "Any Phase",
            "name": "Khassar de Templari",
            "type": "Active",
            "description": "Instead of acting, a previously Activated Friendly Biological Unit acts again, then takes NON-LETHAL DAMAGE (3)."
          }
        ]
      }
    ],
    "tactical": [
      {
        "id": "templar-archives",
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
            "description": "Once per Round, a Friendly Support Unit's PE-costing ability costs one less, minimum zero; do not Exhaust this card."
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
