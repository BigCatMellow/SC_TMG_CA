// StarCraft TMG — Zerg faction data (extracted from uploads/zerg.html)
window.SCTMG_ZERG = (function () {
const KEYWORDS = {
      'ANTI-EVADE': { type: 'Combat', description: 'The target suffers -X to its Evade Rolls for this attack.' },
      'BUFF': { type: 'Effect', description: 'The Unit gains a bonus of X to the specified Characteristic until End of the Round.' },
      'BURROWED': { type: 'Status', description: "BURROWED grants HIDDEN, treats Size as 0 and Supply as 0 for Disengage, and prevents Mission Marker control. Move, Deploy, Disengage, Run, or Close Ranks removes BURROWED; Hold does not. An Engaged BURROWED Unit must activate in Combat but cannot attack unless it first removes BURROWED through Close Ranks. See PDF p. 82." },
      'CRITICAL HIT': { type: 'Combat', description: 'Move X dice directly from the Armour Pool to the Damage Pool, bypassing armour.' },
      'DEBUFF': { type: 'Effect', description: 'The Unit suffers a penalty of X to the specified Characteristic until End of the Round.' },
      'DISPLACEMENT': { type: 'Movement', description: 'This model/token can be moved through by other models and does not block movement.' },
      'FLYING': { type: 'Status', description: 'Flying units ignore terrain when moving, are never Engaged, cannot Charge or be Charged, and cannot contest or control Mission Markers.' },
      'HEAL': { type: 'Effect', description: 'Remove X points of accumulated Damage from the Unit. HEAL cannot return Destroyed models.' },
      'HIDDEN': { type: 'Status', description: 'Enemies more than 4" away cannot target this unit with ranged attacks or Line of Sight abilities. The unit is immune to IMPACT and gets an Evade Roll against every attack.' },
      'IMPACT': { type: 'Combat', description: 'After a successful Charge, each eligible model generates X extra dice. Rolls of Y or higher become automatic hits placed in the Armour Pool.' },
      'INSTANT': { type: 'Weapon', description: "Enemy Units cannot declare or resolve Reaction abilities in response to attacks made with this weapon." },
      'LONG RANGE': { type: 'Weapon', description: "The weapon's maximum range extends to X inches, but shots beyond the normal listed range suffer a -1 Hit penalty." },
      'ON CREEP': { type: 'Zerg', description: 'A Ground Zerg Unit is ON CREEP while Within 6" of any Creep Tumor Token or Source of Creep (like Omega Worm).' },
      'PLACE': { type: 'Movement', description: "Remove and set a Leading Model Wholly Within X inches, then rebuild the Unit in Coherency. PLACE ignores movement path, Gap Clearance and elevation requirements; the placement must otherwise be legal. Normally do not end within enemy Engagement Range; during Assault a PLACE effect may set models in Engagement. See PDF p. 88." },
      'PRECISION': { type: 'Combat', description: 'After rolling to hit, move up to X missed dice into the Armour Pool. They still need to survive armour.' },
      'RESPAWN': { type: 'Effect', description: "Return up to X Destroyed models without increasing the Unit's Current Supply. Place them Base-to-Base with existing models and outside enemy Engagement Range; models that cannot be placed legally do not return. See PDF p. 89." },
      'SHIELDED': { type: 'Status', description: "Add Shield value to the first model's HP. SHIELDED ends when Total Damage exceeds the Shield value or the first model is removed; HEAL does not restore SHIELDED. See PDF p. 89." },
      'STATIONARY': { type: 'Status', description: 'All units start each round Stationary. The status is lost the moment the unit moves, is moved, or is placed.' },
      'STAY IN PLAY': { type: 'Other', description: 'This token or marker persists through cleanup instead of being removed at the end of the round.' },
      'SUMMON': { type: 'Movement', description: "Set the named Unit in Base-to-Base with its parent with legal Coherency and sufficient Available Supply; do not place it within enemy Engagement Range or Zone of Influence. It cannot activate in the summoning Phase and in later Phases acts immediately after the parent. See PDF p. 90." },
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
      { id: 'kerrigans-swarm', name: "Kerrigan's Swarm", unique: true, resource: '+1 BM', slots: { hero: 1, elite: 2, core: 3 },
        abilities: [
          { phase: 'Any Phase', name: 'Wild Mutation', type: 'Active', description: 'If the active unit is ON CREEP, the Unit gains BUFF Speed (1) and its first Weapon used gains PRECISION (1).' },
          { phase: 'Any Phase', name: 'Zerg Creep', type: 'Passive', description: 'During Army Building, select exactly one Creep Card and add it to their Army List, paying its listed cost (if any).' },
          { phase: 'Movement Phase', name: 'Omega Network', type: 'Active', description: 'If there is no Friendly Omega Worm on the battlefield, place a Friendly Omega Worm Unit anywhere on GROUND LEVEL of the battlefield, more than 10" away from any Enemy model.' }
        ]
      },
      { id: 'zerg-swarm', name: 'Zerg Swarm', unique: true, resource: '+1 BM', slots: { elite: 1, core: 3, support: 1 },
        abilities: [
          { phase: 'Any Phase', name: 'Brood Instinct', type: 'Reaction', description: 'Use before a Friendly Unit makes an Evade Roll. Apply a +1 Modifier to that roll.' },
          { phase: 'Any Phase', name: 'Zerg Creep', type: 'Passive', description: 'During Army Building, select exactly one Creep Card and add it to their Army List, paying its listed cost (if any).' },
          { phase: 'Movement Phase', name: 'Rapid Burrowing', type: 'Active', description: 'Select one Friendly, Unengaged Ground Zerg Unit on the battlefield. That Unit gains the Burrowed Status, even if it has already been Activated this Round.' }
        ]
      }
    ];

    // ============================================================================
    // DATA: Unit Cards
    // ============================================================================
    const ZERG_UNITS = [
      // HERO
      { id: 'kerrigan', name: 'Kerrigan', role: 'Hero', unique: true, tags: ['Biological', 'Psionic', 'Ground'],
        stats: { shield: null, speed: '7', evade: '6+', armour: '5+', hp: 9, size: 2 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 250, models: '1', supply: 1 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
        weapons: [
          { name: 'Energy Blast', phase: 'Assault', range: '8', target: 'All', roa: 5, hit: '3+', surge: 'Light, Armoured', sDie: 'D3', damage: 1, keywords: [] },
          { name: 'Blades', phase: 'Combat', range: 'E', target: 'Ground', roa: 6, hit: '4+', surge: '-', sDie: '-', damage: 2, keywords: ['CRITICAL HIT (2)'] }
        ],
        abilities: [{ phase: 'Any Phase', name: 'Commander', type: 'Passive', description: "Treat this Unit's Supply characteristic as increased by 1 for Controlling and Contesting Mission Markers, completing objectives, and resolving Disengage checks." }],
        phaseAbilities: {
          'Movement Phase': [
            { name: 'Crushing Grip', type: 'Active (1 Biomass)', description: 'Select one Enemy Unit Within 12". That Unit counts as Activated in this Phase.' },
            { name: 'Mutating Carapace', type: 'Active (1 Biomass)', description: 'Select one Enemy Unit Within 18". This Unit is eligible to make an Evade Roll against all attacks made by the selected Enemy Unit, with a +2 Modifier applied to those Evade Rolls.' }
          ],
          'Assault Phase': [
            { name: 'Leaping Strike', type: 'Active (1 Biomass)', description: 'If Unengaged, resolve the PLACE (6) effect.' },
            { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (4) 4+ effect.' }
          ]
        },
        upgrades: {}
      },

      // ELITE
      { id: 'hydralisk', name: 'Hydralisk', role: 'Elite', tags: ['Biological', 'Light', 'Ground'],
        stats: { shield: null, speed: '4/8', evade: '5+', armour: '5+', hp: 4, size: 2 },
        tiers: [{ tier: 'T3', cost: 260, models: '3-4', supply: 3 }, { tier: 'T2', cost: 140, models: '2', supply: 2 }, { tier: 'T1', cost: null, models: '1', supply: 1 }],
        weapons: [
          { name: 'Needle Spines', phase: 'Assault', range: '12', target: 'All', roa: 3, hit: '3+', surge: 'Light, Armoured', sDie: 'D3+1', damage: 2, keywords: [] },
          { name: 'Scythe', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }
        ],
        abilities: [{ phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." }],
        phaseAbilities: {
          'Assault Phase': [{ name: 'Lunge', type: 'Reaction (1 Biomass)', description: 'When another Friendly Unit Within 10" is the target of a Ranged Attack, after the attack is fully resolved, this Unit, if Unengaged, may perform a Move action Directly Towards the attacking Unit.' }]
        },
        upgrades: {
          'Any Phase': [
            { name: 'Ancillary Carapace', cost: '20/40', type: 'Passive', description: 'This Unit gains TOUGH (1) on the first Armour Roll of each Activation.' },
            { name: 'Lurking', cost: '10/20', type: 'Passive', description: 'If this Unit has Stationary Status, it is eligible to make an Evade Roll against the first Ranged Attack targeting it this Round. If this Unit is ON CREEP, it gains +1 Modifier to this Evade Roll.' }
          ],
          'Movement Phase': [{ name: 'Burrow Ambush', cost: '20/40', type: 'Passive', description: "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends." }],
          'Assault Phase': [{ name: 'Grooved Spines', cost: '20/40', type: 'Passive', description: 'This Unit\'s Needle Spines ranged weapon gains LONG RANGE (16").' }]
        }
      },
      { id: 'raptor', name: 'Raptor (Zergling)', role: 'Elite', tags: ['Biological', 'Light', 'Ground'],
        stats: { shield: null, speed: '5/9', evade: '4+', armour: '6+', hp: 1, size: 1 },
        tiers: [{ tier: 'T3', cost: 300, models: '13-18', supply: 2 }, { tier: 'T2', cost: 240, models: '7-12', supply: 1 }, { tier: 'T1', cost: null, models: '1-6', supply: 0 }],
        weapons: [{ name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] }],
        abilities: [
          { phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." },
          { phase: 'Any Phase', name: 'Raptor Strain', type: 'Passive', description: 'This Unit can move through IMPASSABLE TERRAIN of Size 4 or less and change elevation without using ACCESS POINTS.' }
        ],
        phaseAbilities: {
          'Assault Phase': [
            { name: 'Adrenal Overload', type: 'Active (1 Biomass)', description: 'This Unit gains a +1 Modifier to all IMPACT Hit Rolls.' },
            { name: 'Metabolic Boost', type: 'Active (1 Biomass)', description: "When determining Charge Distance for this Unit, roll 2D6 instead of D6 and use the higher result to add to the Unit's Speed characteristic." },
            { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (1) 5+ effect.' }
          ]
        },
        upgrades: {
          'Movement Phase': [{ name: 'Burrow Ambush', cost: '20/30', type: 'Passive', description: "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends." }],
          'Combat Phase': [
            { name: 'Shredding Claws', cost: 20, type: 'Weapon', description: 'Replaces Claws. Surge: Light, Armoured. S.Die: D3.' },
            { name: 'Adrenal Glands', cost: 30, type: 'Passive', description: "This Unit's Claws and Shredding Claws weapons gain PRECISION (2)." }
          ]
        }
      },
      { id: 'kerrigan-raptor', name: "Kerrigan's Raptor (Zergling)", role: 'Elite', unique: true, factionTag: "Kerrigan's Swarm", tags: ['Biological', 'Light', 'Ground'],
        stats: { shield: null, speed: '5/9', evade: '4+', armour: '5+', hp: 2, size: 1 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 250, models: '4-6', supply: 1 }, { tier: 'T1', cost: null, models: '1-3', supply: 0 }],
        weapons: [{ name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '3+', surge: 'Light, Armoured', sDie: 'D6', damage: 1, keywords: ['INSTANT'] }],
        abilities: [
          { phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." },
          { phase: 'Any Phase', name: 'Raptor Strain', type: 'Passive', description: 'This Unit can move through IMPASSABLE TERRAIN of Size 4 or less and change elevation without using ACCESS POINTS.' }
        ],
        phaseAbilities: {
          'Assault Phase': [
            { name: 'Leap', type: 'Active (1 Biomass)', description: 'When determining Charge Distance for this Unit, add 2 to the Charge Distance.' },
            { name: 'Adrenal Overload', type: 'Active (1 Biomass)', description: 'This Unit gains a +1 Modifier to all IMPACT Hit Rolls.' },
            { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (2) 5+ effect.' }
          ]
        },
        upgrades: {}
      },

      // CORE
      { id: 'corpser', name: 'Corpser (Roach)', role: 'Core', tags: ['Armoured', 'Biological', 'Ground'],
        stats: { shield: null, speed: '4/7', evade: '5+', armour: '3+', hp: 4, size: 2 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 250, models: '2-3', supply: 1 }, { tier: 'T1', cost: null, models: '1', supply: 0 }],
        weapons: [
          { name: 'Acid Saliva', phase: 'Assault', range: '8', target: 'Ground', roa: 2, hit: '3+', surge: '-', sDie: '-', damage: 1, keywords: [] },
          { name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 3, hit: '4+', surge: 'Light', sDie: 'D3+1', damage: 1, keywords: [] }
        ],
        abilities: [{ phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." }],
        phaseAbilities: {
          'Assault Phase': [{ name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (2) 5+ effect.' }],
          'Combat Phase': [{ name: 'Corpser Strain', type: 'Passive', description: 'When a model in this Unit is Destroyed, SUMMON (1) Roachling model.' }]
        },
        upgrades: {
          'Movement Phase': [{ name: 'Burrow Ambush', cost: 30, type: 'Passive', description: "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends." }]
        }
      },
      { id: 'roach', name: 'Roach', role: 'Core', tags: ['Armoured', 'Biological', 'Ground'],
        stats: { shield: null, speed: '4/7', evade: '5+', armour: '3+', hp: 4, size: 2 },
        tiers: [{ tier: 'T3', cost: 240, models: '4-6', supply: 2 }, { tier: 'T2', cost: 120, models: '2-3', supply: 1 }, { tier: 'T1', cost: null, models: '1', supply: 0 }],
        weapons: [
          { name: 'Acid Saliva', phase: 'Assault', range: '8', target: 'Ground', roa: 2, hit: '3+', surge: '-', sDie: '-', damage: 1, keywords: [] },
          { name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }
        ],
        abilities: [{ phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." }],
        phaseAbilities: {
          'Movement Phase': [{ name: 'Tunnelling Claws', type: 'Active (1 Biomass)', description: 'If unengaged and if this Unit has the Burrowed status, PLACE (4) this Unit. After the ability is resolved, this Unit loses the Burrowed status.' }],
          'Assault Phase': [{ name: 'Glial Reconstitution', type: 'Active', description: 'HEAL (2) this Unit. Then, DEBUFF Speed (2) this Unit.' }]
        },
        upgrades: {
          'Movement Phase': [{ name: 'Burrow Ambush', cost: '20/40', type: 'Passive', description: "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends." }]
        }
      },
      { id: 'zergling', name: 'Zergling', role: 'Core', tags: ['Biological', 'Light', 'Ground'],
        stats: { shield: null, speed: '5/9', evade: '5+', armour: '6+', hp: 1, size: 1 },
        tiers: [{ tier: 'T3', cost: 180, models: '13-18', supply: 2 }, { tier: 'T2', cost: 90, models: '7-12', supply: 1 }, { tier: 'T1', cost: null, models: '1-6', supply: 0 }],
        weapons: [{ name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }],
        abilities: [{ phase: 'Any Phase', name: 'Squadron', type: 'Passive', description: "This Unit's Horizontal Coherency is 4\"." }],
        phaseAbilities: {
          'Assault Phase': [
            { name: 'Adrenal Overload', type: 'Active (1 Biomass)', description: 'This Unit gains a +1 Modifier to all IMPACT Hit Rolls.' },
            { name: 'Metabolic Boost', type: 'Active (1 Biomass)', description: "When determining Charge Distance for this Unit, roll 2D6 instead of D6 and use the higher result to add to the Unit's Speed characteristic." },
            { name: 'Devastating Charge', type: 'Passive', description: 'Immediately after this Unit completes a successful Charge, resolve the IMPACT (1) 5+ effect.' }
          ]
        },
        upgrades: {
          'Movement Phase': [{ name: 'Burrow Ambush', cost: '15/30', type: 'Passive', description: "When this Unit is nominated to deploy from the Reserves, it may resolve the PLACE (18) effect from the controlling player's Entry Edge. No model may be set Within 10\" of any Enemy model. This Unit's Activation ends." }],
          'Combat Phase': [
            { name: 'Shredding Claws', cost: '10/20', type: 'Weapon', description: 'Replaces Claws. Surge: Light, Armoured. S.Die: D3.' },
            { name: 'Adrenal Glands', cost: '15/30', type: 'Passive', description: "This Unit's Claws and Shredding Claws weapons gain PRECISION (2)." }
          ]
        }
      },

      // SUPPORT
      { id: 'queen', name: 'Queen', role: 'Support', tags: ['Biological', 'Ground'],
        stats: { shield: null, speed: '4/6', evade: '5+', armour: '4+', hp: 6, size: 2 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 170, models: '1', supply: 2 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
        weapons: [
          { name: 'Acid Spines', phase: 'Assault', range: '10', target: 'All', roa: 4, hit: '4+', surge: 'Light', sDie: 'D3', damage: 1, keywords: [] },
          { name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 3, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }
        ],
        abilities: [],
        phaseAbilities: {
          'Movement Phase': [
            { name: 'Spawn Creep Tumor', type: 'Active', description: 'Place a Creep Tumor Token in base-to-base with this Unit. This Creep Tumor Token gains the STAY IN PLAY Keyword.' },
            { name: 'Transfusion', type: 'Active (1 Biomass)', description: 'Select one Friendly Unit Within 10". That Unit gains HEAL (3). This Unit then gains 3 points of Damage.' }
          ],
          'Assault Phase': [{ name: 'Ensnare', type: 'Active (1 Biomass)', description: 'Select one Enemy Unit Within 10". That Unit gains DEBUFF Speed (2).' }],
          'Combat Phase': [{ name: 'Rapid Transfusion', type: 'Active (1 Biomass)', description: 'Select one Friendly Unit Within 10". HEAL (1) that Unit.' }]
        },
        upgrades: {}
      },

      // OTHER
      { id: 'omega-worm', name: 'Omega Worm', role: 'Other', factionTag: "Kerrigan's Swarm", tags: ['Armoured', 'Biological', 'Ground'],
        stats: { shield: null, speed: '-', evade: '-', armour: '5+', hp: 10, size: 3 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 0, models: '1', supply: 0 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
        weapons: [],
        abilities: [
          { phase: 'Any Phase', name: 'Detection', type: 'Passive', description: 'While Enemy Units are Within 6" of this Unit, they lose HIDDEN Status.' },
          { phase: 'Any Phase', name: 'Source of Creep', type: 'Passive', description: 'A Friendly or Enemy Ground Zerg Unit Within 6" of this Unit, counts as being ON CREEP.' },
          { phase: 'Any Phase', name: 'Structure', type: 'Passive', description: 'This Unit cannot be Activated in any Phase and cannot perform actions. Its Current Supply Value is treated as 0, and it can never Control or Contest Mission Markers. This Unit cannot be a target of an ability, unless stated otherwise.' },
          { phase: 'Any Phase', name: 'Omega Network', type: 'Passive', description: "The base of the Omega Worm counts as an Entry Edge. Each Round, Friendly Units with a combined Supply cost of 2 or less may be Deployed via this Entry Edge. If a Friendly Leading model finishes a Move, Disengage, or Run action in base-to-base contact with the Omega Worm, the controlling player may remove that Unit from the battlefield and return it to Reserves." }
        ],
        phaseAbilities: {},
        upgrades: {}
      },
      { id: 'roachling', name: 'Roachling', role: 'Other', tags: ['Biological', 'Light', 'Ground'],
        stats: { shield: null, speed: '4/7', evade: '6+', armour: '6+', hp: 1, size: 1 },
        tiers: [{ tier: 'T3', cost: null, models: '-', supply: 0 }, { tier: 'T2', cost: 0, models: '1-3', supply: 0 }, { tier: 'T1', cost: null, models: '-', supply: 0 }],
        weapons: [{ name: 'Claws', phase: 'Combat', range: 'E', target: 'Ground', roa: 2, hit: '4+', surge: '-', sDie: '-', damage: 1, keywords: [] }],
        abilities: [{ phase: 'Any Phase', name: 'Underdeveloped Claws', type: 'Passive', description: 'This Unit cannot gain Burrowed Status.' }],
        phaseAbilities: {},
        upgrades: {}
      },
    ];

    // ============================================================================
    // DATA: Tactical Cards
    // ============================================================================
    const ZERG_TACTICAL_CARDS = [
      { id: 'accelerating-creep', name: 'Accelerating Creep', unique: true, cost: 0, resource: null, slots: {}, category: 'creep',
        summary: '+1 Speed on creep, creep tokens persist',
        abilities: [
          { phase: 'Any Phase', name: 'Speed on Creep', type: 'Passive', description: 'If the active Friendly Zerg Unit is ON CREEP, increase its Speed characteristic by 1.' },
          { phase: 'Any Phase', name: 'Living Glob of Tissue', type: 'Passive', description: 'Creep Tumor tokens have STAY IN PLAY and DISPLACEMENT.' },
          { phase: 'Any Phase', name: 'Creep Removal', type: 'Passive', description: 'If an Enemy Unit ends a Move, Deploy, Run, Charge or Disengage action Within 1" of a Friendly Creep Tumor token, remove that token from the battlefield.' }
        ]
      },
      { id: 'evolution-chamber', name: 'Evolution Chamber', unique: false, cost: 30, resource: '+1 BM', slots: { core: 1 }, category: 'combat',
        summary: 'Tough (1) on armor rolls, +1 Impact hits',
        abilities: [
          { phase: 'Any Phase', name: 'Carapace', type: 'Reaction', description: 'Use before a Friendly Unit makes an Armour Roll. That Unit gains TOUGH (1) for this roll.' },
          { phase: 'Assault Phase', name: 'Extended Claws', type: 'Active', description: 'The active Unit gains a +1 Modifier to all IMPACT Hit Rolls.' }
        ]
      },
      { id: 'hatchery', name: 'Hatchery', unique: false, cost: 30, resource: '+1 BM', slots: { support: 1 }, category: 'creep',
        summary: 'Burrow units, spread creep',
        abilities: [
          { phase: 'Movement Phase', name: 'Lie in Wait', type: 'Active', description: 'The active, Unengaged Ground Unit gains the Burrowed Status.' },
          { phase: 'Movement Phase', name: 'Creep Spread', type: 'Active', description: 'Place a Creep Tumor token on the battlefield Within 6" (Line of Sight is not required) of either a Friendly Entry Edge or an existing Friendly Creep Tumor token.' }
        ]
      },
      { id: 'hydralisk-den', name: 'Hydralisk Den', unique: false, cost: 35, resource: '+1 BM', slots: { elite: 2 }, category: 'combat',
        summary: 'Ranged attacks gain Precision (1)',
        abilities: [{ phase: 'Assault Phase', name: 'Missile Attacks', type: 'Active', description: "The active Unit's first Ranged Weapon used gains PRECISION (1)." }]
      },
      { id: 'lair', name: 'Lair', unique: true, cost: 35, resource: '+1 BM', slots: { elite: 1, core: 1 }, category: 'combat',
        summary: 'Melee gains Instant, spread creep',
        abilities: [
          { phase: 'Any Phase', name: 'Predation', type: 'Active', description: "The active Unit's Close Combat Weapons gain INSTANT." },
          { phase: 'Movement Phase', name: 'Creep Spread', type: 'Active', description: 'Place a Creep Tumor token on the battlefield Within 6" (Line of Sight is not required) of either a Friendly Entry Edge or an existing Friendly Creep Tumor token.' }
        ]
      },
      { id: 'malignant-creep', name: 'Malignant Creep', unique: true, cost: 10, resource: null, slots: {}, category: 'creep',
        summary: 'Creep persists, +1 Impact on charge from creep',
        abilities: [
          { phase: 'Any Phase', name: 'Living Glob of Tissue', type: 'Passive', description: 'Creep Tumor tokens have STAY IN PLAY and DISPLACEMENT.' },
          { phase: 'Any Phase', name: 'Creep Removal', type: 'Passive', description: 'If an Enemy Unit ends a Move, Deploy, Run, Charge or Disengage action Within 1" of a Friendly Creep Tumor token, remove that token from the battlefield.' },
          { phase: 'Assault Phase', name: 'Malevolent Matriarch', type: 'Passive', description: 'If the active Friendly Zerg Unit declares a Charge action while ON CREEP, it gains +1 Modifier to IMPACT Hit Rolls.' }
        ]
      },
      { id: 'overlord', name: 'Overlord', unique: true, cost: 45, resource: '+1 BM', slots: { hero: 1, elite: 1, core: 1 }, category: 'positioning',
        summary: 'Deep deploy units anywhere, spread creep',
        abilities: [
          { phase: 'Movement Phase', name: 'Ventral Sacs', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield more than 10" away from any Enemy model. At the End of the Round, the controlling player may Deploy one Ground Unit from Reserves in base-to-base contact with this Faction Indicator.' },
          { phase: 'Assault Phase', name: 'Excrete Creep', type: 'Active', description: 'Place a Creep Tumor token on the battlefield Within 6" (Line of Sight is not required) of either a Friendly Entry Edge or an existing Friendly Creep Tumor token.' }
        ]
      },
      { id: 'overseer', name: 'Overseer', unique: true, cost: 25, resource: '+1 BM', slots: { support: 1 }, category: 'positioning',
        summary: 'Reveal hidden enemies, bonus charge distance',
        abilities: [
          { phase: 'Movement Phase', name: 'Oversight Mode', type: 'Active', description: 'Place a Faction Indicator anywhere on the battlefield. While Enemy Units are Within 6" of this Faction Indicator, they lose HIDDEN.' },
          { phase: 'Assault Phase', name: 'Pneumatized Carapace', type: 'Reaction', description: 'Use after a Friendly Unit rolls a D6 for Charge Distance. Roll an additional D6 and use the higher result to calculate the total Charge Distance.' }
        ]
      },
      { id: 'roach-warren', name: 'Roach Warren', unique: false, cost: 25, resource: '+1 BM', slots: { core: 1 }, category: 'positioning',
        summary: 'Unburrow units for surprise attacks',
        abilities: [{ phase: 'Assault Phase', name: 'Nasty Surprise', type: 'Active', description: 'The active Ground Unit loses the Burrowed Status.' }]
      },
      { id: 'spawning-pool', name: 'Spawning Pool', unique: false, cost: 25, resource: '+1 BM', slots: { core: 1 }, category: 'combat',
        summary: 'Melee gains Precision (2)',
        abilities: [{ phase: 'Combat Phase', name: 'Feral Rage', type: 'Active', description: "The active Unit's first Close Combat Weapon used gains PRECISION (2)." }]
      },
      { id: 'spawning-pool-six', name: 'Spawning Pool (Six Pool)', unique: true, cost: 40, resource: '+2 BM', slots: { core: 2 }, category: 'positioning',
        summary: 'Deploy Zerglings from any edge, Precision (2)',
        abilities: [
          { phase: 'Movement Phase', name: 'Timing Push', type: 'Active', description: "The active Zergling Unit Deploys from any table edge that is not a Player's Entry Edge. This action must end more than 10\" away from any Enemy model." },
          { phase: 'Combat Phase', name: 'Feral Rage', type: 'Active', description: "The active Unit's first Close Combat Weapon used gains PRECISION (2)." }
        ]
      },
    ];
  return { KEYWORDS, TAGS, SURGE_TAGS, TYPE_TAGS, ENGAGEMENT_SCALES,
    FACTION_CARDS: ZERG_FACTION_CARDS, UNITS: ZERG_UNITS, TACTICAL_CARDS: ZERG_TACTICAL_CARDS };
})();
