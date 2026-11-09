// StarCraft TMG — Protoss faction data (extracted from uploads/protoss.html)
window.SCTMG_PROTOSS = (function () {
const KEYWORDS = {
  'ANTI-EVADE': { type: 'Combat', description: 'The target suffers -X to its Evade Rolls for this attack.' },
  'BUFF': { type: 'Effect', description: 'The Unit gains a bonus of X to the specified Characteristic until End of the Round.' },
  'CRITICAL HIT': { type: 'Combat', description: 'Move X dice directly from the Armour Pool to the Damage Pool, bypassing armour.' },
  'DEBUFF': { type: 'Effect', description: 'The Unit suffers a penalty of X to the specified Characteristic until End of the Round.' },
  'DISPLACEMENT': { type: 'Movement', description: 'This model/token can be moved through by other models and does not block movement.' },
  'DODGE': { type: 'Combat', description: 'When making Armour Rolls, remove up to X dice from the Armour Pool before rolling.' },
  'FLYING': { type: 'Status', description: 'Flying units ignore terrain when moving, are never Engaged, cannot Charge or be Charged, and cannot contest or control Mission Markers.' },
  'HEAL': { type: 'Effect', description: 'Remove X points of accumulated Damage from the Unit. HEAL cannot return Destroyed models.' },
  'HIDDEN': { type: 'Status', description: 'Enemies more than 4" away cannot target this unit with ranged attacks or Line of Sight abilities. The unit is immune to IMPACT and gets an Evade Roll against every attack.' },
  'HITS': { type: 'Effect', description: 'The target immediately suffers X automatic hits with Damage Y, bypassing the Attack Pool and going straight to Armour Rolls.' },
  'IMPACT': { type: 'Combat', description: 'After a successful Charge, each eligible model generates X extra dice. Rolls of Y or higher become automatic hits placed in the Armour Pool.' },
  'INSTANT': { type: 'Weapon', description: "Enemy Units cannot declare or resolve Reaction abilities in response to attacks made with this weapon." },
  'PIERCE': { type: 'Combat', description: "When attacking a Unit with the specified Combat Tag, treat this weapon's Damage characteristic as X." },
  'PLACE': { type: 'Movement', description: "Remove and set a Leading Model Wholly Within X inches, then rebuild the Unit in Coherency. PLACE ignores movement path, Gap Clearance and elevation requirements; the placement must otherwise be legal. Normally do not end within enemy Engagement Range; during Assault a PLACE effect may set models in Engagement. See PDF p. 88." },
  'PRECISION': { type: 'Combat', description: 'After rolling to hit, move up to X missed dice into the Armour Pool. They still need to survive armour.' },
  'PSIONIC ENERGY': { type: 'Protoss', description: "Protoss uses PE to pay ability costs. Ready Faction and Tactical Cards can generate PE when Exhausted." },
  'SHIELDED': { type: 'Status', description: "Add Shield value to the first model's HP. SHIELDED ends when Total Damage exceeds the Shield value or the first model is removed; HEAL does not restore SHIELDED. See PDF p. 89." },
  'STATIONARY': { type: 'Status', description: 'All units start each round Stationary. The status is lost the moment the unit moves, is moved, or is placed.' },
  'TOUGH': { type: 'Combat', description: 'When making Armour Rolls, convert up to X failed results into successes.' },
};


    const TAGS = {
      'Armoured': { type: 'Combat Tag', description: 'Used for targeting and surge interactions. Weapons with Surge Type: Armoured deal bonus damage that bypasses armour when attacking this unit.' },
      'Biological': { type: 'Combat Tag', description: 'Used for targeting and surge interactions. Weapons with Surge Type: Biological deal bonus damage that bypasses armour when attacking this unit.' },
      'Flying': { type: 'Combat Tag', description: 'Flying units are never Engaged and cannot Engage. They cannot Charge or be Charged. They ignore terrain and Gap Clearance during movement. They do not participate in the Combat Phase. They cannot Contest or Control Mission Markers. They never benefit from High Ground Cover. Must end movement at least 1" from enemy Flying units.' },
      'Ground': { type: 'Combat Tag', description: 'Ground units can Engage other Ground units when Within 1". Weapons with Target: Ground can only hit units with this tag. Ground units participate in the Combat Phase when Engaged.' },
      'Light': { type: 'Combat Tag', description: 'Used for targeting and surge interactions. Weapons with Surge Type: Light deal bonus damage that bypasses armour when attacking this unit.' },
      'Mechanical': { type: 'Combat Tag', description: 'Used for targeting and surge interactions. Weapons with Surge Type: Mechanical deal bonus damage that bypasses armour when attacking this unit.' },
      'Psionic': { type: 'Special Tag', description: 'This unit has psychic abilities. Used as a marker for ability targeting - certain abilities specifically affect or reference Psionic units. Does not affect Surge damage.' },
      'Unique': { type: 'Special Tag', description: 'Only one of this unit may be included in your army list.' },
    };

    const SURGE_TAGS = ['Armoured', 'Biological', 'Light', 'Mechanical'];
    const TYPE_TAGS = ['Ground', 'Flying'];

    // ============================================================================
    // DATA: Faction Cards
    // ============================================================================
    const ZERG_FACTION_CARDS = [
  { id: 'daelaam', name: 'Daelaam', unique: true, resource: '+1 PE', slots: { elite: 1, core: 3, support: 1 },
    abilities: [
      { phase: 'Any Phase', name: "Dae'Uhl", type: 'Reaction', description: 'When a Friendly Unit receives Damage, reduce the Total Damage by 2 (to a minimum of 1).' },
      { phase: 'Movement Phase', name: 'Mass Recall', type: 'Active', description: 'Once per Game. Place a Faction Indicator anywhere on the battlefield. All Friendly Protoss Units Within 6" of this Faction Indicator are removed from the battlefield and placed in Reserves.' }
    ]
  },
  { id: 'khalai', name: 'Khalai', unique: true, resource: '+1 PE', slots: { hero: 1, elite: 2, core: 3 },
    abilities: [
      { phase: 'Movement Phase', name: 'Pylon Warp-In', type: 'Active', description: 'If there is no Friendly Pylon on the battlefield, place a Friendly Pylon Unit anywhere on the GROUND LEVEL of the battlefield more than 10" away from any Enemy model. This Round, the Pylon is not eligible to use its Special Abilities (excluding Structure).' },
      { phase: 'Movement Phase', name: 'Bound by the Khala', type: 'Active', description: "At the end of the active Unit's Activation, select one other Friendly Unit eligible to Activate in the current Phase. Immediately Activate that Unit." }
    ]
  }
];

    // ============================================================================
    // DATA: Unit Cards
    // ============================================================================
    const ZERG_UNITS = [
  // HERO
  { id: 'artanis', name: 'Artanis', role: 'Hero', unique: true, tags: ['Biological', 'Psionic', 'Ground'],
    stats: { shield: 4, speed: '7', evade: '5+', armour: '4+', hp: 8, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 250, models: '1', supply: 1 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [
      { name: 'Twilight Blades Strike', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '2+', surge: 'Armoured', sDie: 'D3', damage: 3, keywords: [] },
      { name: 'Twilight Blades Sweep', phase: 'Combat', range: 'E', target: 'Ground', roa: 6, hit: '2+', surge: 'Light', sDie: 'D3+1', damage: 1, keywords: [] }
    ],
    abilities: [{ phase: 'Any Phase', name: 'Commander', type: 'Passive', description: "Treat this Unit's Supply characteristic as increased by 1 for Controlling and Contesting Mission Markers, completing objectives, and resolving Disengage checks." }],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Phase Prism', type: 'Passive', description: "When Artanis is nominated to deploy from Reserves, it may resolve the PLACE (0) effect from another Friendly Unit. That Friendly Unit is removed from the battlefield and returned to Reserves. Artanis' Activation ends." }],
      'Assault Phase': [
        { name: "Hierarch's Stand", type: 'Reaction (1 Psionic Energy)', description: 'When another Friendly Unit Within 8" is declared as the target of a Ranged Attack and this Unit is a valid target, redirect the attack to this Unit. This Unit is eligible to make an Evade Roll against the redirected attack. This Special Ability remains active until the End of the current Activation.' },
        { name: 'Lightning Dash', type: 'Reaction (1 Psionic Energy)', description: 'After this Unit resolves a successful Charge action, it may declare a second Charge action against a different Enemy Unit, ignoring the restriction on Charging while Engaged. The Devastating Charge ability does not trigger a second time.' },
        { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (6) 4+ effect.' }
      ]
    },
    upgrades: {}
  },

  // ELITE
  { id: 'praetor-guard', name: 'Praetor Guard (Zealot)', role: 'Elite', unique: true, factionTag: 'Khalai', tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: 3, speed: '4/7', evade: '5+', armour: '5+', hp: 4, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 280, models: '2-3', supply: 2 }, { tier: 'T1', cost: null, models: '1', supply: 1 }],
    weapons: [{ name: 'Psi Blades', phase: 'Combat', range: 'E', target: 'Ground', roa: 4, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] }],
    abilities: [{ phase: 'Any Phase', name: 'Shield Overcharge', type: 'Passive', description: 'This Unit gains TOUGH (2) on the first Armour Roll each Round.' }],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Leg Enhancements', type: 'Active (1 Psionic Energy)', description: "This Unit performs a 2\" Move action. This does not count towards its action limit." }],
      'Assault Phase': [
        { name: 'Charge', type: 'Active (1 Psionic Energy)', description: "When determining Charge Distance for this Unit, roll 2D6 instead of D6 and use the higher result to add to the Unit's Speed characteristic." },
        { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (3) 4+ effect.' }
      ],
      'Combat Phase': [
        { name: 'Titan Killers', type: 'Passive', description: "When this Unit makes a Close Combat Attack, and the target is Size 3 or larger, the weapon's Damage characteristic is treated as 2." },
        { name: 'Precognition', type: 'Passive', description: 'This Unit is eligible to make an Evade roll against all attacks targeting it.' }
      ]
    },
    upgrades: {}
  },
  { id: 'stalker', name: 'Stalker', role: 'Elite', tags: ['Armoured', 'Mechanical', 'Ground'],
    stats: { shield: 3, speed: '4/8', evade: '6+', armour: '4+', hp: 6, size: 3 },
    tiers: [{ tier: 'T3', cost: 270, models: '2', supply: 2 }, { tier: 'T2', cost: 170, models: '1', supply: 1 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [
      { name: 'Particle Disruptors', phase: 'Assault', range: '12', target: 'All', roa: 4, hit: '3+', surge: 'Armoured', sDie: 'D3', damage: 2, keywords: [] },
      { name: 'Stomp', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '5+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [{ phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." }],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Blink', type: 'Active (1 Psionic Energy)', description: 'Resolve the PLACE (6) effect. Models set by this effect cannot be set up Within the Engagement Range of any Enemy Unit.' }]
    },
    upgrades: {
      'Any Phase': [{ name: 'Path of Shadows', cost: '20/40', type: 'Active (1 Psionic Energy)', description: 'This Unit gains HIDDEN Status until it performs another action.' }],
      'Assault Phase': [{ name: 'Fury of the Nerazim', cost: '20/30', type: 'Passive', description: 'When this Unit attacks an Enemy Unit that has already been Activated during this Phase, its Particle Disruptors gain INSTANT for that attack.' }]
    }
  },

  // CORE
  { id: 'adept', name: 'Adept', role: 'Core', tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: 2, speed: '5/8', evade: '5+', armour: '5+', hp: 3, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 150, models: '3-4', supply: 1 }, { tier: 'T1', cost: null, models: '1-2', supply: 0 }],
    weapons: [
      { name: 'Glaive Cannon', phase: 'Assault', range: '8', target: 'All', roa: 2, hit: '3+', surge: 'Light', sDie: 'D3+1', damage: 1, keywords: ['ANTI-EVADE (1)'] },
      { name: 'Strike', phase: 'Combat', range: 'E', target: 'Ground', roa: 1, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [{ phase: 'Any Phase', name: 'Psionic Presence', type: 'Passive', description: "All Weapons of Friendly Units targeting an Enemy Unit Within 4\" of this Unit's Shade token gain PRECISION (1)." }],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Psionic Transfer', type: 'Active (1 Psionic Energy)', description: 'Set a Shade token Wholly Within 12" of any model in this Unit. At the End of the Round, the controlling player may set all models of this Unit in Coherency, treating the Shade token as the Leading Model. The Shade token has DISPLACEMENT.' }]
    },
    upgrades: {
      'Assault Phase': [
        { name: 'Resonating Glaives', cost: 20, type: 'Active (1 Psionic Energy)', description: "This Unit's Glaive Cannon gains BUFF RoA (1)." },
        { name: 'Guidance', cost: 10, type: 'Passive', description: "This Unit's Glaive Cannon Ranged weapon gains ANTI-EVADE (2).", modifies: { weapon: 'Glaive Cannon', changes: { keywords: ['ANTI-EVADE (2)'] } } }
      ],
      'Combat Phase': [{ name: 'Glaive Strike', cost: 20, type: 'Weapon', description: 'Replaces Strike. RNG E, TGT Ground, RoA 1, Hit 4+, Surge Light, S.Die D3, Dmg 1. Keywords: PIERCE Light (2).', modifies: { weapon: 'Strike' } }]
    }
  },
  { id: 'zealot', name: 'Zealot', role: 'Core', tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: 3, speed: '4/7', evade: '5+', armour: '5+', hp: 4, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 160, models: '2-3', supply: 2 }, { tier: 'T1', cost: null, models: '1', supply: 1 }],
    weapons: [{ name: 'Psi Blades', phase: 'Combat', range: 'E', target: 'Ground', roa: 4, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] }],
    abilities: [],
    phaseAbilities: {
      'Assault Phase': [
        { name: 'Charge', type: 'Active (1 Psionic Energy)', description: "When determining Charge Distance for this Unit, roll 2D6 instead of D6 and use the higher result to add to the Unit's Speed characteristic." },
        { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (3) 4+ effect.' }
      ]
    },
    upgrades: {
      'Any Phase': [{ name: 'My Life for Aiur', cost: 10, type: 'Passive', description: 'When this Unit resolves IMPACT, each eligible model generates 1 additional IMPACT die.' }],
      'Movement Phase': [{ name: 'Leg Enhancements', cost: 20, type: 'Active (1 Psionic Energy)', description: "This Unit performs a 2\" Move action. This does not count towards its action limit." }],
      'Assault Phase': [{ name: 'Zealous Round', cost: 10, type: 'Reaction (0 Psionic Energy)', description: 'When this Unit is not Activated and receives Damage, the controlling player may count this Unit as Activated in this Phase (flip its Activation Marker) to reduce the Total Damage by 2.' }],
      'Combat Phase': [{ name: 'We Stand as One', cost: 20, type: 'Passive', description: "When this Unit makes a Close Combat Attack, if the target is Engaged with at least 1 other Friendly Unit, this Unit's Close Combat Weapon gains PRECISION (2)." }]
    }
  },

  // SUPPORT
  { id: 'sentry', name: 'Sentry', role: 'Support', tags: ['Light', 'Mechanical', 'Psionic', 'Ground'],
    stats: { shield: 2, speed: '4/7', evade: '6+', armour: '5+', hp: 4, size: 1 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 130, models: '2', supply: 1 }, { tier: 'T1', cost: null, models: '1', supply: 0 }],
    weapons: [
      { name: 'Disruption Beam', phase: 'Assault', range: '8', target: 'All', roa: 2, hit: '2+', surge: '-', sDie: '-', damage: 1, keywords: ['INSTANT'] },
      { name: 'Beam', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '3+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [{ phase: 'Any Phase', name: 'Restoration', type: 'Reaction (1 Psionic Energy)', description: 'Use when a Friendly Unit Within 4" receives a DEBUFF. Remove all DEBUFFS from it.' }],
    phaseAbilities: {
      'Movement Phase': [
        { name: 'Force Field', type: 'Active (1 Psionic Energy)', description: 'Set a Force Field token Within 8" in an unoccupied space. Units of Size 2 or lower cannot move across Force Fields. Models of Size 3 or more can move over it, and it\'s then removed.' },
        { name: 'Guardian Shield', type: 'Active (1 Psionic Energy)', description: 'All Ranged Attacks targeting a Friendly Unit Within 4" (Line of Sight is not required) are made with 1 fewer die in the Attack Pool.' }
      ]
    },
    upgrades: {
      'Movement Phase': [{ name: 'Solid-Field Projectors', cost: 20, type: 'Active (1 Psionic Energy)', description: 'Set a Force Field token Within 8" in an unoccupied space. Units of Size 2 or lower cannot move across Force Fields. Models of Size 3 or more can move over it, and it\'s then removed.' }],
      'Assault Phase': [{ name: 'Hallucination', cost: 30, type: 'Reaction (0 Psionic Energy)', description: 'When an Enemy Unit declares a Ranged Attack against a Friendly Unit Within 4", the targeted Friendly Unit is eligible to make an Evade Roll against that attack.' }]
    }
  },

  // OTHER
  { id: 'pylon', name: 'Pylon', role: 'Other', factionTag: 'Khalai', tags: ['Armoured', 'Ground'],
    stats: { shield: 2, speed: '-', evade: '-', armour: '5+', hp: 8, size: 3 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 0, models: '1', supply: 0 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [],
    abilities: [
      { phase: 'Any Phase', name: 'Structure', type: 'Passive', description: 'This Unit cannot be Activated in any Phase and cannot perform actions. Its Current Supply Value is treated as 0, and it can never Control or Contest Mission Markers. This Unit cannot be a target of an ability, unless stated otherwise.' },
      { phase: 'Any Phase', name: 'Khalai Ingenuity', type: 'Passive', description: "Once per Round, when a Friendly Unit Within 4\" of this Pylon uses a Special Ability that costs Psionic Energy, that ability's PE cost is reduced by 1." }
    ],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Warp Conduit', type: 'Passive', description: "Once per Round, the controlling player may deploy a Ground Unit from Reserves using this Pylon base as the Entry Edge. This Unit's Activation ends." }]
    },
    upgrades: {}
  },
];

    // ============================================================================
    // DATA: Tactical Cards
    // ============================================================================
    const ZERG_TACTICAL_CARDS = [
  { id: 'forge', name: 'Forge', unique: false, cost: 30, resource: '+1 PE', slots: { elite: 1 }, category: 'combat',
    abilities: [
      { phase: 'Any Phase', name: 'Ground Armor', type: 'Reaction', description: 'Use before a Friendly Ground Unit makes an Armour Roll. That Unit gains TOUGH (1) for this roll.' },
      { phase: 'Assault Phase', name: 'Ground Weapons', type: 'Active', description: "The active Ground Unit's first Ranged Weapon used gains CRITICAL HIT (1)." }
    ]
  },
  { id: 'gate-chronoboosted', name: 'Gate Chronoboosted', unique: true, cost: 35, resource: '+1 PE', slots: { elite: 1, core: 1 }, category: 'combat',
    abilities: [
      { phase: 'Movement Phase', name: 'Zealous Charge', type: 'Active', description: 'The active Unit gains BUFF Speed (2).' },
      { phase: 'Combat Phase', name: 'Quick Strikes', type: 'Active', description: "The active Unit's first Close Combat Weapon used gains PRECISION (2)." }
    ]
  },
  { id: 'gateway', name: 'Gateway', unique: false, cost: 25, resource: '+1 PE', slots: { core: 1 }, category: 'combat',
    abilities: [{ phase: 'Combat Phase', name: 'Quick Strikes', type: 'Active', description: "The active Unit's first Close Combat Weapon used gains PRECISION (2)." }]
  },
  { id: 'nexus', name: 'Nexus', unique: true, cost: 35, resource: '+1 PE', slots: { core: 2 }, category: 'positioning',
    abilities: [
      { phase: 'Any Phase', name: 'Ancient Pride', type: 'Active', description: "The active Unit's first Weapon used gains INSTANT." },
      { phase: 'Movement Phase', name: 'Strategic Recall', type: 'Active', description: 'The active, Unengaged Ground Unit is placed in Reserves instead of performing an action.' }
    ]
  },
  { id: 'observer', name: 'Observer', unique: true, cost: 25, resource: '+1 PE', slots: { support: 1 }, category: 'positioning',
    abilities: [
      { phase: 'Movement Phase', name: 'Surveillance', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield. While Enemy Units are Within 6" of this Faction Indicator, they lose HIDDEN.' },
      { phase: 'Assault Phase', name: 'Gravitic Boosters', type: 'Reaction', description: 'Use after a Friendly Unit rolls a D6 for Charge Distance. Add 1 to the Charge Distance for this Unit.' }
    ]
  },
  { id: 'overcharged-nexus', name: 'Overcharged Nexus', unique: true, cost: 35, resource: '+1 PE', slots: { elite: 1, core: 1 }, category: 'positioning',
    abilities: [
      { phase: 'Any Phase', name: 'Photon Overcharge', type: 'Reaction', description: 'Use when an Enemy Unit enters the battlefield from Reserves via a location other than its own Entry Edge. That Unit immediately suffers HITS 3 (1).' },
      { phase: 'Movement Phase', name: 'Strategic Recall', type: 'Active', description: 'The active, Unengaged Ground Unit is placed in Reserves instead of performing an action.' }
    ]
  },
  { id: 'power-field', name: 'Power Field', unique: true, cost: 40, resource: '+1 PE', slots: { hero: 1, elite: 1, core: 1 }, category: 'defense',
    abilities: [{ phase: 'Any Phase', name: 'Guardian Shell', type: 'Reaction', description: 'Use before a Friendly Ground Unit makes an Armour Roll. That Unit gains DODGE (2) for this roll.' }]
  },
  { id: 'twilight-council', name: 'Twilight Council', unique: true, cost: 45, resource: '+1 PE', slots: { elite: 1, support: 1 }, category: 'positioning',
    abilities: [
      { phase: 'Any Phase', name: 'Veil of Shadows', type: 'Reaction', description: 'Use after a Friendly Unit resolves a PLACE effect. That Unit immediately resolves the HEAL (2) effect.' },
      { phase: 'Assault Phase', name: 'Weapons of the Firstborn', type: 'Active', description: "The active Ground Unit's first Ranged Weapon used gains BUFF Range (4)." }
    ]
  },
  { id: 'warp-gate', name: 'Warp Gate', unique: true, cost: 40, resource: '+1 PE', slots: { core: 2 }, category: 'positioning',
    abilities: [
      { phase: 'Movement Phase', name: 'Warp In', type: 'Active', description: "The active Ground Unit Deploys from any table edge that is not a player's Entry Edge. This deployment must end more than 10\" away from any Enemy model. The controlling player cannot use this ability if another Friendly Ground Unit has already Deployed this Round." },
      { phase: 'Combat Phase', name: 'Quick Strikes', type: 'Active', description: "The active Unit's first Close Combat Weapon used gains PRECISION (2)." }
    ]
  },
  { id: 'warp-prism', name: 'Warp Prism', unique: true, cost: 35, resource: '+1 PE', slots: { core: 2 }, category: 'positioning',
    abilities: [
      { phase: 'Movement Phase', name: 'Phase', type: 'Active', description: 'The active Unit resolves the PLACE (3) effect.' },
      { phase: 'Movement Phase', name: 'Warp Conduit', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield more than 10" away from any Enemy model. At the End of the Round, the controlling player may Deploy one Ground Unit from Reserves in base-to-base contact with this Faction Indicator.' }
    ]
  },
];

    const ENGAGEMENT_SCALES = [
      { id: 'skirmish', name: 'Skirmish', minerals: 1000, gas: 100, table: '36" x 36"' },
      { id: 'standard', name: 'Standard', minerals: 2000, gas: 200, table: '36" x 54"' },
      { id: 'grand', name: 'Grand', minerals: 9999, gas: 999, table: '36" x 72"' },
    ];
  return { KEYWORDS, TAGS, SURGE_TAGS, TYPE_TAGS, ENGAGEMENT_SCALES,
    FACTION_CARDS: ZERG_FACTION_CARDS, UNITS: ZERG_UNITS, TACTICAL_CARDS: ZERG_TACTICAL_CARDS };
})();
