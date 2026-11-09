// StarCraft TMG — Terran faction data (extracted from uploads/terran.html)
window.SCTMG_TERRAN = (function () {
const KEYWORDS = {
  'ANTI-EVADE': { type: 'Combat', description: 'The target suffers -X to its Evade Rolls for this attack.' },
  'BUFF': { type: 'Effect', description: 'The Unit gains a bonus of X to the specified Characteristic until End of the Round.' },
  'BULKY': { type: 'Weapon', description: 'This weapon cannot be used in the same Activation as another weapon with the BULKY keyword.' },
  'BURST FIRE': { type: 'Weapon', description: 'When the target is Within X inches, the weapon gains +Y Rate of Attack.' },
  'CRITICAL HIT': { type: 'Combat', description: 'Move X dice directly from the Armour Pool to the Damage Pool, bypassing armour.' },
  'DEBUFF': { type: 'Effect', description: 'The Unit suffers a penalty of X to the specified Characteristic until End of the Round.' },
  'DISPLACEMENT': { type: 'Movement', description: 'This model/token can be moved through by other models and does not block movement.' },
  'FLYING': { type: 'Status', description: 'Flying units ignore terrain when moving, are never Engaged, cannot Charge or be Charged, and cannot contest or control Mission Markers.' },
  'HEAL': { type: 'Effect', description: 'Remove X points of accumulated Damage from the Unit. HEAL cannot return Destroyed models.' },
  'HIDDEN': { type: 'Status', description: 'Enemies more than 4" away cannot target this unit with ranged attacks or Line of Sight abilities. The unit is immune to IMPACT and gets an Evade Roll against every attack.' },
  'IMPACT': { type: 'Combat', description: 'After a successful Charge, each eligible model generates X extra dice. Rolls of Y or higher become automatic hits placed in the Armour Pool.' },
  'INDIRECT FIRE': { type: 'Weapon', description: 'This weapon ignores Line of Sight requirements. The target still benefits from Cover.' },
  'INSTANT': { type: 'Weapon', description: "Enemy Units cannot declare or resolve Reaction abilities in response to attacks made with this weapon." },
  'LOCKED IN': { type: 'Weapon', description: 'This weapon can only target enemies Within X inches of the aimed point.' },
  'LONG RANGE': { type: 'Weapon', description: 'The weapon\'s maximum range extends to X inches, but shots beyond the normal listed range suffer a -1 Hit penalty.' },
  'NON-LETHAL DAMAGE': { type: 'Effect', description: "Add X points of Damage to the Unit without removing models, even if Total Damage exceeds a model's HP. Subsequent standard Damage triggers casualty removal using combined Total Damage." },
  'PIERCE': { type: 'Combat', description: "When attacking a Unit with the specified Combat Tag, treat this weapon's Damage characteristic as X." },
  'PINPOINT': { type: 'Weapon', description: 'This weapon can target individual models within a unit rather than the unit as a whole.' },
  'PLACE': { type: 'Movement', description: 'Remove the Leading Model and set it Wholly Within X inches of its starting point. PLACE ignores normal pathing, gap clearance, terrain restrictions, and elevation requirements, then the unit is rebuilt in Coherency.' },
  'PRECISION': { type: 'Combat', description: 'After rolling to hit, move up to X missed dice into the Armour Pool. They still need to survive armour.' },
  'SIDEARM': { type: 'Weapon', description: 'This weapon can be fired in addition to one other non-SIDEARM weapon in the same Activation.' },
  'SPECIALIST': { type: 'Weapon', description: 'Only one model in the unit may use this weapon per Activation.' },
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
    // DATA: Engagement Scales
    // ============================================================================
    const ENGAGEMENT_SCALES = [
      { id: 'skirmish', name: 'Skirmish', minerals: 1000, gas: 100, table: '36" x 36"' },
      { id: 'standard', name: 'Standard', minerals: 2000, gas: 200, table: '36" x 54"' },
      { id: 'grand', name: 'Grand', minerals: 9999, gas: 999, table: '36" x 72"' },
    ];

    // ============================================================================
    // DATA: Faction Cards
    // ============================================================================
    const ZERG_FACTION_CARDS = [
  { id: 'raynors-raiders', name: "Raynor's Raiders", unique: true, resource: '+1 CP', slots: { hero: 1, core: 3, support: 1 },
    abilities: [
      { phase: 'Movement Phase', name: 'Rapid Reinforcements', type: 'Active', description: 'Place a Friendly Point Defence Drone Unit anywhere on the battlefield, more than 1" away from any Enemy model. Remove this Unit at the End of the Round.' },
      { phase: 'Movement Phase', name: 'Ready for Pickup?', type: 'Active', description: 'Once per Game. The active Unit resolves the PLACE (12) effect. Models placed by this effect cannot be set up Within the Engagement Range of any Enemy Unit. This resolves instead of performing a standard action.' }
    ]
  },
  { id: 'terran-armed-forces', name: 'Terran Armed Forces', unique: true, resource: '+1 CP', slots: { elite: 1, core: 3, support: 1 },
    abilities: [
      { phase: 'Movement Phase', name: 'Tactical Retreat', type: 'Active', description: 'The active Unit ignores the Disengage penalty for the remainder of the Round.' },
      { phase: 'Movement Phase', name: 'Terran Tenacity', type: 'Active', description: 'Once per Game. Immediately claim the First Player Marker. No other player may claim the First Player Marker for the remainder of this Phase.' }
    ]
  }
];

    // ============================================================================
    // DATA: Unit Cards
    // ============================================================================
    const ZERG_UNITS = [
  // HERO
  { id: 'jim-raynor', name: 'Jim Raynor', role: 'Hero', unique: true, tags: ['Biological', 'Ground'],
    stats: { shield: null, speed: '7', evade: '5+', armour: '4+', hp: 8, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 230, models: '1', supply: 1 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [
      { name: 'Commando Rifle', phase: 'Assault', range: '18', target: 'All', roa: 3, hit: '3+', surge: 'Armoured', sDie: 'D3', damage: 1, keywords: ['BULKY', 'PIERCE Armoured (3)'] },
      { name: 'C-14 Rifle', phase: 'Assault', range: '12', target: 'All', roa: 6, hit: '3+', surge: 'Light', sDie: 'D3+1', damage: 1, keywords: ['BURST FIRE 8" (3)'], replaces: 'Commando Rifle' },
      { name: '"Justice" Revolver', phase: 'Assault', range: '6', target: 'Ground', roa: 2, hit: '3+', surge: '-', sDie: '-', damage: 2, keywords: ['ANTI-EVADE (2)', 'SIDEARM', 'PINPOINT'] },
      { name: 'Bayonet', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] }
    ],
    abilities: [
      { phase: 'Any Phase', name: 'Commander', type: 'Passive', description: "Treat this Unit's Supply characteristic as increased by 1 for Controlling and Contesting Mission Markers, completing objectives, and resolving Disengage checks." },
      { phase: 'Any Phase', name: 'Freedom Fighters', type: 'Passive', description: 'The Supply Value of all Friendly Units Within 8" of this Unit cannot be reduced below 1 for Contesting Mission Markers and completing objectives.' }
    ],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Orders', type: 'Active (X Command Point)', description: 'REPEATABLE. Select another Friendly Biological Unit Within 8", spend CP and apply one of the following effects: 1 CP: That Unit\'s first used weapon gains the CRITICAL HIT (2). 1 CP: That Unit ignores the Disengage penalty for the remainder of the Round. 2 CP: Remove the Activation Marker from that Unit.' }]
    },
    upgrades: {}
  },

  // ELITE
  { id: 'goliath', name: 'Goliath', role: 'Elite', tags: ['Armoured', 'Mechanical', 'Ground'],
    stats: { shield: null, speed: '7', evade: '-', armour: '4+', hp: 10, size: 3 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 190, models: '1', supply: 2 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [
      { name: 'Autocannon', phase: 'Assault', range: '12', target: 'Ground', roa: 9, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: ['LONG RANGE (18")'] },
      { name: 'Underbelly Machine Gun', phase: 'Assault', range: '8', target: 'Ground', roa: 6, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: ['PINPOINT', 'SIDEARM'] },
      { name: 'Hellfire Missiles', phase: 'Assault', range: '16', target: 'Flying', roa: 6, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: ['ANTI-EVADE (1)', 'SIDEARM'] },
      { name: 'Stomp', phase: 'Combat', range: 'E', target: 'Ground', roa: 4, hit: '5+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Target Lock', type: 'Active (1 Command Point)', description: 'Select one Enemy Unit Within 12". Whenever a Friendly Goliath Unit targets that enemy with an Autocannon, that weapon gains Surge Type: Light, Armoured, and S Dice: D3+1.' }],
      'Assault Phase': [
        { name: 'Indomitable', type: 'Passive', description: 'While Engaged, this Unit may target and be targeted by Unengaged Enemy Units. In both cases, the defending Unit gains an Evade Roll against those attacks.' },
        { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 3+ effect.' }
      ]
    },
    upgrades: {
      'Any Phase': [{ name: 'Ares-Class Targeting System', cost: 20, type: 'Passive', description: "This Unit's Autocannon and Underbelly Machine Gun weapons gain PRECISION (1)." }],
      'Assault Phase': [
        { name: 'Scatter Missiles', cost: 30, type: 'Weapon', description: 'Replaces Hellfire Missiles. RNG 18, TGT Ground, RoA 6, Hit 5+, Surge Light, S.Die D3, Dmg 1. Keywords: INDIRECT FIRE, LOCKED IN (6), LONG RANGE (24"), SIDEARM.', modifies: { weapon: 'Hellfire Missiles' } },
        { name: 'Haywire Missiles', cost: 40, type: 'Weapon', description: 'Replaces Hellfire Missiles. RNG 12, TGT Ground, RoA 3, Hit 3+, Surge Armoured, S.Die D3, Dmg 1. Keywords: PIERCE Armoured (3), SIDEARM.', modifies: { weapon: 'Hellfire Missiles' } }
      ]
    }
  },

  // CORE
  { id: 'marauder', name: 'Marauder', role: 'Core', tags: ['Armoured', 'Biological', 'Ground'],
    stats: { shield: null, speed: '4/7', evade: '6+', armour: '4+', hp: 5, size: 2 },
    tiers: [{ tier: 'T3', cost: 280, models: '3-4', supply: 2 }, { tier: 'T2', cost: 150, models: '2', supply: 1 }, { tier: 'T1', cost: null, models: '1', supply: 0 }],
    weapons: [
      { name: 'Quad K12', phase: 'Assault', range: '12', target: 'Ground', roa: 3, hit: '3+', surge: 'Armoured', sDie: 'D3', damage: 1, keywords: ['PIERCE Armoured (2)'] },
      { name: 'Strike', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Stimpack', type: 'Active (1 Command Point)', description: 'This Unit suffers NON-LETHAL DAMAGE (2). This Unit gains BUFF Speed (3). Additionally, its Quad K12 and all Close Combat Weapons gain PRECISION (2).' }],
      'Assault Phase': [{ name: 'Concussive Shells', type: 'Reaction (1 Command Point)', description: 'When an Enemy declares a Charge against a Friendly Unit Within 8", that Enemy gains DEBUFF Speed (2).' }]
    },
    upgrades: {
      'Any Phase': [
        { name: 'Veteran of Tarsonis', cost: '20/40', type: 'Passive', description: "While this Unit is Within 3\" of a Mission Marker, its Armour characteristic is increased by 1." },
        { name: 'Kinetic Foam', cost: '20/40', type: 'Passive', description: "Increase this Unit's Hit Points characteristic by 1." }
      ],
      'Assault Phase': [{ name: 'Laser Targeting Systems', cost: '20/40', type: 'Passive', description: 'This Unit\'s Quad K12 weapon gains LONG RANGE (16").' }]
    }
  },
  { id: 'marine', name: 'Marine', role: 'Core', tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: null, speed: '4/7', evade: '5+', armour: '5+', hp: 2, size: 2 },
    tiers: [{ tier: 'T3', cost: 210, models: '7-9', supply: 2 }, { tier: 'T2', cost: 160, models: '4-6', supply: 1 }, { tier: 'T1', cost: null, models: '1-3', supply: 0 }],
    weapons: [
      { name: 'C-14 Rifle', phase: 'Assault', range: '12', target: 'All', roa: 2, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] },
      { name: 'Strike', phase: 'Combat', range: 'E', target: 'Ground', roa: 1, hit: '5+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [],
    phaseAbilities: {
      'Movement Phase': [{ name: 'Stimpack', type: 'Active (1 Command Point)', description: 'This Unit suffers NON-LETHAL DAMAGE (2). This Unit gains BUFF Speed (3). Additionally, its C-14 Rifle and all Close Combat Weapons gain PRECISION (3).' }]
    },
    upgrades: {
      'Movement Phase': [{ name: 'Combat Shield', cost: '20/30', type: 'Active (1 Command Point)', description: 'This Unit is always eligible to make an Evade Roll against any Close Combat Attack targeting it and any Damage from an Enemy Special Ability.' }],
      'Assault Phase': [
        { name: 'AGG-12', cost: 10, type: 'Weapon', description: 'Replaces C-14 Rifle. RNG 12, TGT Ground, RoA 2, Hit 3+, Surge Armoured, S.Die D3, Dmg 1. Keywords: LONG RANGE (18"), SPECIALIST.', modifies: { weapon: 'C-14 Rifle' } },
        { name: 'Rocket Launcher', cost: 40, type: 'Weapon', description: 'Additional weapon. RNG 12, TGT Ground, RoA 4, Hit 3+, Dmg 1. Keywords: INDIRECT FIRE, LONG RANGE (18"), SIDEARM, SPECIALIST.' },
        { name: 'Slugthrower', cost: '10/20', type: 'Passive', description: 'When this Unit makes a Ranged Attack with a C-14 Rifle and the target is Within 8", that weapon gains ANTI-EVADE (1).' },
        { name: 'Grenades - Frag', cost: 10, type: 'Passive', description: "When this Unit makes a Ranged Attack with a C-14 Rifle and the target is Within 8\", that weapon's S Dice is replaced by D6." }
      ],
      'Combat Phase': [{ name: 'Bayonet', cost: '20/30', type: 'Weapon', description: 'Replaces Strike. RNG E, TGT Ground, RoA 2, Hit 5+, Dmg 1.', modifies: { weapon: 'Strike' } }]
    }
  },
  { id: 'raynors-raider', name: "Raynor's Raider (Marine)", role: 'Core', factionTag: "Raynor's Raiders", tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: null, speed: '4/7', evade: '5+', armour: '5+', hp: 2, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 230, models: '1-6', supply: 1 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [
      { name: 'C-14 Rifle', phase: 'Assault', range: '12', target: 'All', roa: 2, hit: '3+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] },
      { name: 'Bayonet', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '5+', surge: '-', sDie: '-', damage: 1, keywords: [] }
    ],
    abilities: [],
    phaseAbilities: {
      'Movement Phase': [
        { name: 'Stimpack', type: 'Active (1 Command Point)', description: 'This Unit suffers NON-LETHAL DAMAGE (2). This Unit gains BUFF Speed (3). Additionally, its C-14 Rifle and all Close Combat Weapons gain PRECISION (3).' },
        { name: 'Raiders Roll!', type: 'Passive', description: 'When this Unit is nominated to deploy from Reserves, it may resolve its Stimpack ability with the CP cost reduced by 1 (to a minimum of 0).' },
        { name: 'Rapid Reinforcements', type: 'Passive', description: "When this Unit is nominated to deploy from Reserves, it may resolve the PLACE (10) effect from another Friendly Unit. No model may be set Within 8\" of any Enemy model. This Unit's Activation ends." }
      ],
      'Assault Phase': [
        { name: 'Slugthrower', type: 'Passive', description: 'When this Unit makes a Ranged Attack with a C-14 Rifle and the target is Within 8", that weapon gains ANTI-EVADE (1).' },
        { name: 'Grenades - Frag', type: 'Passive', description: "When this Unit makes a Ranged Attack with a C-14 Rifle and the target is Within 8\", that weapon's S Dice is replaced by D6." }
      ]
    },
    upgrades: {}
  },

  // SUPPORT
  { id: 'medic', name: 'Medic', role: 'Support', tags: ['Biological', 'Light', 'Ground'],
    stats: { shield: null, speed: '4/7', evade: '5+', armour: '5+', hp: 2, size: 2 },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 110, models: '2-3', supply: 1 }, { tier: 'T1', cost: null, models: '1', supply: 0 }],
    weapons: [{ name: 'Strike', phase: 'Combat', range: 'E', target: 'Ground', roa: 1, hit: '5+', surge: '-', sDie: '-', damage: 1, keywords: [] }],
    abilities: [
      { phase: 'Any Phase', name: 'Life Support', type: 'Reaction (1 Command Point)', description: 'Use when another Friendly Biological Unit suffers Damage Within 4". Reduce the Total Damage before allocation by 1 for each model in this Unit that is Within 4" of the damaged Unit.' },
      { phase: 'Any Phase', name: 'Restoration', type: 'Reaction (1 Command Point)', description: 'Use when a Friendly Unit Within 4" receives a DEBUFF. Remove all DEBUFFS from it.' }
    ],
    phaseAbilities: {
      'Movement Phase': [
        { name: 'Medpack', type: 'Active (1 Command Point)', description: 'Select another Friendly Biological Unit Within 4". Resolve the HEAL (X) effect for the targeted Unit, where X is the number of models in this Unit that are Within 4" of the target Unit.' },
        { name: 'Optical Flare', type: 'Active (2 Command Point)', description: 'Select one Enemy Unit Within 12". Until the End of the Round, apply DEBUFF Range (4) to that Unit\'s Ranged Weapons. That Unit cannot benefit from LONG RANGE.' }
      ]
    },
    upgrades: {
      'Any Phase': [
        { name: 'Advanced Medic Facilities', cost: 60, type: 'Passive', description: "This Unit's Supply Value counts as 0 when calculating the Supply Pool." },
        { name: 'A-13 Flash Grenade Launcher', cost: 20, type: 'Passive', description: 'Increase the Optical Flare special ability\'s Range to 16".' },
        { name: 'Stabilizer Medpacks', cost: 30, type: 'Passive', description: 'When this Unit resolves a Life Support or Medpack ability, treat it as having 1 additional model Within Range for calculating that ability\'s effects.' }
      ]
    }
  },

  // OTHER
  { id: 'point-defense-drone', name: 'Point Defense Drone', role: 'Other', factionTag: "Raynor's Raiders", tags: ['Armoured', 'Mechanical', 'Flying'],
    stats: { shield: null, speed: '-', evade: '6+', armour: '6+', hp: 3, size: null },
    tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 0, models: '1', supply: 0 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
    weapons: [],
    abilities: [
      { phase: 'Any Phase', name: 'Point Defense Laser', type: 'Passive', description: 'When another Friendly Unit Within 4" is targeted by a Ranged Attack without the INSTANT keyword, remove up to 2 dice from the Attack Pool. Then remove this Unit from the battlefield.' },
      { phase: 'Any Phase', name: 'Gliding', type: 'Passive', description: 'This model has DISPLACEMENT.' },
      { phase: 'Any Phase', name: 'Structure', type: 'Passive', description: 'This Unit cannot be Activated in any Phase and cannot perform actions. Its Current Supply Value is treated as 0, and it can never Control or Contest Mission Markers. This Unit cannot be a target of an ability, unless stated otherwise.' }
    ],
    phaseAbilities: {},
    upgrades: {}
  },
];

    // ============================================================================
    // DATA: Tactical Cards
    // ============================================================================
    const ZERG_TACTICAL_CARDS = [
  { id: 'academy', name: 'Academy', unique: true, cost: 35, resource: '+1 CP', slots: { support: 2 },
    abilities: [{ phase: 'Any Phase', name: 'Advanced Training', type: 'Reaction', description: 'Once per Round, when a Friendly Support Unit activates a Special Ability that costs CP, resolve that ability with its CP cost reduced by 1 (to a minimum of 0). Do not Exhaust this card.' }]
  },
  { id: 'armory', name: 'Armory', unique: false, cost: 30, resource: '+1 CP', slots: { elite: 1 },
    abilities: [
      { phase: 'Any Phase', name: 'Vehicle Plating', type: 'Reaction', description: 'Use before a Friendly Mechanical Unit makes an Armour Roll. That Unit gains TOUGH (1) for this roll.' },
      { phase: 'Assault Phase', name: 'Vehicle Weapons', type: 'Active', description: "The active Mechanical Unit's first Ranged Weapon used gains CRITICAL HIT (1)." }
    ]
  },
  { id: 'barracks', name: 'Barracks', unique: false, cost: 25, resource: '+1 CP', slots: { core: 1 },
    abilities: [{ phase: 'Movement Phase', name: 'Go! Go! Go!', type: 'Active', description: 'The active Biological Unit performs a 2" Move action. This does not count towards its action limit.' }]
  },
  { id: 'barracks-proxy', name: 'Barracks (Proxy)', unique: true, cost: 40, resource: '+2 CP', slots: { core: 2 },
    abilities: [
      { phase: 'Movement Phase', name: 'Go! Go! Go!', type: 'Active', description: 'The active Biological Unit performs a 2" Move action. This does not count towards its action limit.' },
      { phase: 'Movement Phase', name: 'Armed and Ready', type: 'Active', description: "The active Biological Unit Deploys from any table edge that is not a player's Entry Edge. No model may be placed Within 10\" of any Enemy model. This ability cannot be used if another Friendly Biological Unit has already been Deployed this Round." }
    ]
  },
  { id: 'barracks-tech-lab', name: 'Barracks (Tech Lab)', unique: true, cost: 45, resource: '+2 CP', slots: { elite: 1, core: 1 },
    abilities: [
      { phase: 'Movement Phase', name: 'Go! Go! Go!', type: 'Active', description: 'The active Biological Unit performs a 2" Move action. This does not count towards its action limit.' },
      { phase: 'Assault Phase', name: "Let's Have a Blast!", type: 'Active', description: "The active Biological Unit's first Ranged Weapon used gains ANTI-EVADE (1)." }
    ]
  },
  { id: 'dropship', name: 'Dropship', unique: true, cost: 40, resource: '+1 CP', slots: { core: 1, support: 1 },
    abilities: [
      { phase: 'Movement Phase', name: 'Strap in!', type: 'Active', description: 'The active, Unengaged Ground Unit is placed in Reserves instead of performing an action.' },
      { phase: 'Movement Phase', name: 'Ready For Dust-off', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield more than 10" away from any Enemy model. At the End of the Round, the controlling player may Deploy one Ground Unit from Reserves in base-to-base contact with this Faction Indicator.' }
    ]
  },
  { id: 'engineering-bay', name: 'Engineering Bay', unique: false, cost: 30, resource: '+1 CP', slots: { core: 1 },
    abilities: [
      { phase: 'Any Phase', name: 'Infantry Armor', type: 'Reaction', description: 'Use before a Friendly Biological Unit makes an Armour Roll. That Unit gains TOUGH (1) for this roll.' },
      { phase: 'Assault Phase', name: 'Infantry Weapons', type: 'Active', description: "The active Biological Unit's first Ranged Weapon used gains CRITICAL HIT (1)." }
    ]
  },
  { id: 'factory', name: 'Factory', unique: false, cost: 35, resource: '+1 CP', slots: { elite: 2 },
    abilities: [{ phase: 'Movement Phase', name: 'Field Repair', type: 'Active', description: 'The active Mechanical Unit resolves the HEAL (2) effect.' }]
  },
  { id: 'orbital-command', name: 'Orbital Command', unique: true, cost: 25, resource: '+1 CP', slots: { core: 1 },
    abilities: [
      { phase: 'Movement Phase', name: 'ComSat Station', type: 'Active', description: "Select one table edge that is not a player's Entry Edge. Until the End of the Round, Enemy Units cannot Deploy from that edge." },
      { phase: 'Movement Phase', name: 'Scanner Sweep', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield. While Enemy Units are Within 6" of this Faction Indicator, they lose HIDDEN.' }
    ]
  },
  { id: 'supply-depot', name: 'Supply Depot', unique: true, cost: 40, resource: '+1 CP', slots: { hero: 1, elite: 1, core: 1 },
    abilities: [{ phase: 'Movement Phase', name: 'Additional Supply Depots', type: 'Active', description: "The active Unit's Supply Value is improved by 1 for Controlling and Contesting Mission Markers and completing objectives." }]
  },
];
  return { KEYWORDS, TAGS, SURGE_TAGS, TYPE_TAGS, ENGAGEMENT_SCALES,
    FACTION_CARDS: ZERG_FACTION_CARDS, UNITS: ZERG_UNITS, TACTICAL_CARDS: ZERG_TACTICAL_CARDS };
})();
