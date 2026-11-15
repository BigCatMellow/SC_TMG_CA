// StarCraft TMG — Missions + deployment maps (extracted from uploads/missions.html)
window.SCTMG_MISSIONS = (function () {
const MISSIONS = [
  // Standard Missions
  {
    id: 'supply-drop',
    name: 'Supply Drop',
    type: 'Standard',
    supply: 6,
    perRound: 2,
    gameLength: 5,
    parameters: [
      'All Mission Markers are Deactivated.',
      'Start of the Round (1-4): Randomly determine one Deactivated Mission Marker (1-4) and flip it to its Activated side.',
      'Start of Round 5: Mission Marker 5 is automatically Activated.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the first Round: For each activated Controlled Mission Marker, gain VPs equal to the Game Round number in which that Mission Marker was Activated and remove it.'
    ],
    special: 'The game ends immediately if a Player leads by 12+ VPs.'
  },
  {
    id: 'supply-drop-skirmish',
    name: 'Supply Drop (Skirmish)',
    type: 'Skirmish',
    supply: 4,
    perRound: 1,
    gameLength: 4,
    parameters: [
      'All Mission Markers are Deactivated.',
      'Start of the Round (2-4): Randomly determine one Deactivated Mission Marker (1,2,5) and flip it to its Activated side.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: For each activated Controlled Mission Marker, gain VPs equal to the Game Round number in which that Mission Marker was Activated and remove it.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.'
  },
  {
    id: 'divide-and-conquer',
    name: 'Divide and Conquer',
    type: 'Standard',
    supply: 8,
    perRound: 2,
    gameLength: 4,
    parameters: [
      'All Mission Markers are Activated.',
      'Split the battlefield into four Quarters as shown on the Deployment Card.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the First Round: Calculate the Total Current Supply in each battlefield Quarter.',
      'Gain 1 VP for each Quarter where your Total Current Supply is higher than the Opponent\'s.',
      'Only Units Wholly Within a Quarter contribute their Supply to this check.',
      'If a Unit controls a Mission Marker, that Unit is worth 1 extra Supply for controlling Quarters.',
      'Gain 2 VP for Controlling Mission Marker 5.'
    ],
    special: 'The game ends immediately if a Player leads by 10+ VPs.'
  },
  {
    id: 'divide-and-conquer-skirmish',
    name: 'Divide and Conquer (Skirmish)',
    type: 'Skirmish',
    supply: 4,
    perRound: 1,
    gameLength: 4,
    parameters: [
      'All Mission Markers are Activated.',
      'Split the battlefield into four Quarters as shown on the Deployment Card.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the First Round: Calculate the Total Current Supply in each battlefield Quarter.',
      'Gain 1 VP for each Quarter where your Total Current Supply is higher than the Opponent\'s.',
      'Only Units Wholly Within a Quarter contribute their Supply to this check.',
      'If a Unit controls a Mission Marker, that Unit is worth 1 extra Supply for controlling Quarters.',
      'Gain 2 VP for Controlling Mission Marker 5.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.'
  },
  {
    id: 'frontlines',
    name: 'Frontlines',
    type: 'Standard',
    supply: 6,
    perRound: 2,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 1 VP for each Controlled Mission Marker.',
      'Gain an additional 2 VPs for a Marker if you gained Control of it from the Opponent this Round.'
    ],
    special: 'The game ends immediately if a Player leads by 10+ VPs.'
  },
  {
    id: 'frontlines-skirmish',
    name: 'Frontlines (Skirmish)',
    type: 'Skirmish',
    supply: 3,
    perRound: 1,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 1 VP for each Controlled Mission Marker.',
      'Gain an additional 2 VPs for a Marker if you gained Control of it from the Opponent this Round.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.'
  },
  {
    id: 'gather-the-resources',
    name: 'Gather the Resources',
    type: 'Standard',
    supply: 6,
    perRound: 2,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 2 VPs for each Controlled Mission Marker associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 10+ VPs.',
    additionalRules: [
      {
        phase: 'Assault Phase',
        name: 'Gather Action',
        description: 'If an Unengaged Unit is Within 3" of a Controlled Neutral Mission Marker or associated with the Opponent, this unit may perform the Gather Action instead of a standard action. Gain 1 VP.'
      }
    ]
  },
  {
    id: 'gather-the-resources-skirmish',
    name: 'Gather the Resources (Skirmish)',
    type: 'Skirmish',
    supply: 3,
    perRound: 1,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 2 VPs for each Controlled Mission Marker associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.',
    additionalRules: [
      {
        phase: 'Assault Phase',
        name: 'Gather Action',
        description: 'If an Unengaged Unit is Within 3" of a Controlled Neutral Mission Marker or associated with the Opponent, this unit may perform the Gather Action instead of a standard action. Gain 1 VP.'
      }
    ]
  },
  {
    id: 'hold-position',
    name: 'Hold Position',
    type: 'Standard',
    supply: 6,
    perRound: 2,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 1 VP for each Controlled Mission Marker that is Neutral or associated with your colour.',
      'Gain 2 VPs for each Controlled Mission Marker associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 10+ VPs.'
  },
  {
    id: 'hold-position-skirmish',
    name: 'Hold Position (Skirmish)',
    type: 'Skirmish',
    supply: 3,
    perRound: 1,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain 1 VP for each Controlled Mission Marker that is Neutral or associated with your colour.',
      'Gain 2 VPs for each Controlled Mission Marker associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.'
  },
  {
    id: 'artefact-hunt',
    name: 'Artefact Hunt',
    type: 'Standard',
    supply: 6,
    perRound: 2,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'End of Round 5: Gain 4 VPs for each Friendly Unit that has CLAIMED a Mission Marker and is Wholly Within the Friendly Zone of Influence.',
      'End of Round 5: Gain 2 VPs for each Mission Marker associated with your colour that is not currently CLAIMED by an Enemy Unit.'
    ],
    special: 'None. Play all 5 Rounds.',
    additionalRules: [
      {
        phase: 'Scoring Phase',
        name: 'Claim',
        description: 'From the Start of the Second Round, a Unit Within 3" of a Controlled Mission Marker that is Neutral or associated with the Opponent colour may CLAIM it: place the Mission Marker on its Unit Card. A Unit may CLAIM only one Mission Marker at a time. Flying and BURROWED Units may CLAIM, and a carried Mission Marker cannot be moved with teleport abilities such as Psionic Transfer or Deep Tunnel (FAQ v1.3).'
      },
      {
        phase: 'Any Phase',
        name: 'Drop',
        description: 'A Unit carrying a Mission Marker must DROP it if its Current Supply Value is reduced, before it resolves a PLACE effect, if it is Engaged with Enemies that have a greater combined Current Supply Value, or if it is Destroyed, removed from the battlefield or returned to Reserves. The Opponent places the dropped Mission Marker Within 2" of the Unit or of its last model removed.'
      }
    ]
  },
  {
    id: 'artefact-hunt-skirmish',
    name: 'Artefact Hunt (Skirmish)',
    type: 'Skirmish',
    supply: 3,
    perRound: 1,
    gameLength: 5,
    parameters: ['All Mission Markers are Activated.'],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'End of Round 5: Gain 3 VPs for each Friendly Unit that has CLAIMED a Mission Marker and is Wholly Within the Friendly Zone of Influence.',
      'End of Round 5: Gain 1 VP for each Mission Marker associated with your colour that is not currently CLAIMED by an Enemy Unit.'
    ],
    special: 'None. Play all 5 Rounds.',
    additionalRules: [
      {
        phase: 'Scoring Phase',
        name: 'Claim',
        description: 'From the Start of the Second Round, a Unit Within 3" of a Controlled Mission Marker that is Neutral or associated with the Opponent colour may CLAIM it: place the Mission Marker on its Unit Card. A Unit may CLAIM only one Mission Marker at a time. Flying and BURROWED Units may CLAIM, and a carried Mission Marker cannot be moved with teleport abilities such as Psionic Transfer or Deep Tunnel (FAQ v1.3).'
      },
      {
        phase: 'Any Phase',
        name: 'Drop',
        description: 'A Unit carrying a Mission Marker must DROP it if its Current Supply Value is reduced, before it resolves a PLACE effect, if it is Engaged with Enemies that have a greater combined Current Supply Value, or if it is Destroyed, removed from the battlefield or returned to Reserves. The Opponent places the dropped Mission Marker Within 2" of the Unit or of its last model removed.'
      }
    ]
  },
  {
    id: 'fire-in-the-sky',
    name: 'Fire in the Sky',
    type: 'Standard',
    supply: 5,
    perRound: 3,
    gameLength: 5,
    parameters: [
      'All Mission Markers are Activated.',
      'During battlefield setup, place a D6 next to each Mission Marker to track its Sabotage Level. Each Mission Marker starts at Sabotage Level 1.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain VPs equal to the Sabotage Level (1 to 3) of each Controlled Mission Marker that is Neutral or associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 10+ VPs.',
    additionalRules: [
      {
        phase: 'Assault Phase',
        name: 'Sabotage Action',
        description: 'If an Unengaged Unit is Within 3" of a Controlled Mission Marker, this unit may perform the Sabotage Action instead of a standard action: decrease or increase that Mission Marker\'s Sabotage Level by 1 (minimum 1, maximum 3).'
      }
    ]
  },
  {
    id: 'fire-in-the-sky-skirmish',
    name: 'Fire in the Sky (Skirmish)',
    type: 'Skirmish',
    supply: 3,
    perRound: 2,
    gameLength: 5,
    parameters: [
      'All Mission Markers are Activated.',
      'During battlefield setup, place a D6 next to each Mission Marker to track its Sabotage Level. Each Mission Marker starts at Sabotage Level 1.'
    ],
    scoring: [
      'Score VPs equal to Enemy Supply destroyed this Round.',
      'From the Start of the Second Round: Gain VPs equal to the Sabotage Level (1 to 3) of each Controlled Mission Marker that is Neutral or associated with the Opponent colour.'
    ],
    special: 'The game ends immediately if a Player leads by 8+ VPs.',
    additionalRules: [
      {
        phase: 'Assault Phase',
        name: 'Sabotage Action',
        description: 'If an Unengaged Unit is Within 3" of a Controlled Mission Marker, this unit may perform the Sabotage Action instead of a standard action: decrease or increase that Mission Marker\'s Sabotage Level by 1 (minimum 1, maximum 3).'
      }
    ]
  }
];
    const MAPS = [
  // 36x36 Skirmish Maps
  {
    id: 'char-plains',
    name: 'Char Plains',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    blueZones: [{ x: 18, y: 0, w: 18, h: 6 }],
    redZones: [{ x: 18, y: 30, w: 18, h: 6 }],
    markers: [
      { num: 1, x: 6, y: 30 },   // game (6,6) → SVG y=36-6=30
      { num: 2, x: 6, y: 6 },    // game (6,30) → SVG y=36-30=6
      { num: 5, x: 24, y: 18 }   // game (24,18) → SVG y=36-18=18
    ],
    blueSetup: {
      title: 'Top-Right Strip',
      instructions: [
        'Start at the top-right corner of the board.',
        'Measure 18" left along the top edge.',
        'Then measure 6" downward into the battlefield.',
        'Deploy anywhere inside that 18" × 6" rectangle.'
      ]
    },
    redSetup: {
      title: 'Bottom-Right Strip',
      instructions: [
        'Start at the bottom-right corner of the board.',
        'Measure 18" left along the bottom edge.',
        'Then measure 6" upward into the battlefield.',
        'Deploy anywhere inside that 18" × 6" rectangle.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '6" from left edge, 6" from bottom edge' },
      { num: 2, desc: '6" from left edge, 30" from bottom edge' },
      { num: 5, desc: '24" from left edge, 18" from bottom edge' }
    ],
    notes: 'Both players start on the right side of the board, one high and one low. The two outer markers are on the left side, and the center marker is shifted right.'
  },
  {
    id: 'abandoned-camp',
    name: 'Abandoned Camp',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    blueZones: [{ x: 0, y: 0, w: 36, h: 6 }],
    redZones: [{ x: 0, y: 30, w: 36, h: 6 }],
    markers: [
      { num: 1, x: 6, y: 18 },
      { num: 5, x: 18, y: 18 },
      { num: 2, x: 30, y: 18 }
    ],
    blueSetup: {
      title: 'Full Top Edge Strip',
      instructions: [
        'Start at the top-left corner.',
        'Measure 36" across the full top edge.',
        'Then measure 6" downward into the battlefield.',
        'Deploy anywhere inside that 36" × 6" strip.'
      ]
    },
    redSetup: {
      title: 'Full Bottom Edge Strip',
      instructions: [
        'Start at the bottom-left corner.',
        'Measure 36" across the full bottom edge.',
        'Then measure 6" upward into the battlefield.',
        'Deploy anywhere inside that 36" × 6" strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '6" from left edge, 18" from bottom edge' },
      { num: 5, desc: '18" from left edge, 18" from bottom edge' },
      { num: 2, desc: '30" from left edge, 18" from bottom edge' }
    ],
    notes: 'Simple top-versus-bottom layout with all three markers in a straight line across the center.'
  },
  {
    id: 'agria-valley',
    name: 'Agria Valley',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 12, h: 6 }, { x: 0, y: 6, w: 6, h: 6 }],
    blueZones: [{ x: 24, y: 30, w: 12, h: 6 }, { x: 30, y: 24, w: 6, h: 6 }],
    markers: [
      { num: 1, x: 6, y: 30 },
      { num: 5, x: 18, y: 18 },
      { num: 2, x: 30, y: 6 }
    ],
    blueSetup: {
      title: 'Bottom-Right L-Shape',
      instructions: [
        'Bottom Strip: Start at the bottom-right corner. Measure 12" left along the bottom edge, then 6" upward.',
        'Right Strip: From the right edge, measure the section from 6" to 12" up from the bottom. Then measure 6" inward from the right edge.',
        'Deploy anywhere inside either rectangle.'
      ]
    },
    redSetup: {
      title: 'Top-Left L-Shape',
      instructions: [
        'Top Strip: Start at the top-left corner. Measure 12" right along the top edge, then 6" downward.',
        'Left Strip: From the left edge, measure the section from 24" to 30" up from the bottom. Then measure 6" inward from the left edge.',
        'Deploy anywhere inside either rectangle.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '6" from left edge, 6" from bottom edge' },
      { num: 5, desc: '18" from left edge, 18" from bottom edge' },
      { num: 2, desc: '30" from left edge, 30" from bottom edge' }
    ],
    notes: 'Diagonal corner deployment: Red in the top-left, Blue in the bottom-right, with markers running diagonally across the board.'
  },
  {
    id: 'dirt-side',
    name: 'Dirt Side',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 12, h: 6 }, { x: 0, y: 6, w: 6, h: 6 }],
    blueZones: [{ x: 24, y: 30, w: 12, h: 6 }, { x: 30, y: 24, w: 6, h: 6 }],
    markers: [
      { num: 1, x: 6, y: 18 },
      { num: 5, x: 18, y: 18 },
      { num: 2, x: 30, y: 18 }
    ],
    blueSetup: {
      title: 'Bottom-Right L-Shape',
      instructions: [
        'Bottom strip: start at the bottom-right corner, measure 12" left, then 6" up.',
        'Right strip: from the bottom-right corner, measure 12" up the right edge, then 6" inward.',
        'Deploy anywhere inside the L-shaped zone.'
      ]
    },
    redSetup: {
      title: 'Top-Left L-Shape',
      instructions: [
        'Top strip: start at the top-left corner, measure 12" right, then 6" down.',
        'Left strip: from the top-left corner, measure 12" down the left edge, then 6" inward.',
        'Deploy anywhere inside the L-shaped zone.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '6" from left edge, 18" from bottom edge' },
      { num: 5, desc: '18" from left edge, 18" from bottom edge' },
      { num: 2, desc: '30" from left edge, 18" from bottom edge' }
    ],
    notes: 'Opposite-corner L-shaped deployment: Red top-left, Blue bottom-right. The markers run straight across the center line.'
  },
  {
    id: 'frontier',
    name: 'Frontier',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    redZones: [{ x: 12, y: 0, w: 12, h: 6 }, { x: 12, y: 30, w: 12, h: 6 }],
    blueZones: [{ x: 0, y: 12, w: 6, h: 12 }, { x: 30, y: 12, w: 6, h: 12 }],
    markers: [
      { num: 1, x: 6, y: 30 },
      { num: 5, x: 18, y: 18 },
      { num: 2, x: 30, y: 6 }
    ],
    blueSetup: {
      title: 'Left & Right Center Strips',
      instructions: [
        'Left-Center Strip: Along the left edge, measure from 12" to 24" up from bottom. Then measure 6" inward. (6" × 12")',
        'Right-Center Strip: Along the right edge, measure from 12" to 24" up from bottom. Then measure 6" inward. (6" × 12")',
        'Deploy anywhere inside either strip.'
      ]
    },
    redSetup: {
      title: 'Top & Bottom Center Strips',
      instructions: [
        'Top-Center Strip: Along the top edge, measure from 12" to 24" from left. Then measure 6" downward. (12" × 6")',
        'Bottom-Center Strip: Along the bottom edge, measure from 12" to 24" from left. Then measure 6" upward. (12" × 6")',
        'Deploy anywhere inside either strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '6" from left edge, 6" from bottom edge' },
      { num: 5, desc: '18" from left edge, 18" from bottom edge' },
      { num: 2, desc: '30" from left edge, 30" from bottom edge' }
    ],
    notes: 'Cross-pattern deployment. Red controls top and bottom center. Blue controls left and right center. The markers run diagonally.'
  },
  {
    id: 'green-valleys',
    name: 'Green Valleys',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 6, h: 6 }, { x: 30, y: 12, w: 6, h: 12 }],
    blueZones: [{ x: 0, y: 12, w: 6, h: 12 }, { x: 30, y: 30, w: 6, h: 6 }],
    markers: [
      { num: 2, x: 24, y: 6 },
      { num: 5, x: 18, y: 18 },
      { num: 1, x: 12, y: 30 }
    ],
    blueSetup: {
      title: 'Left-Middle Box & Bottom-Right Corner',
      instructions: [
        'Left box: on the left edge, mark the middle 12" (12" to 24" from the bottom), then measure 6" inward.',
        'Corner box: a 6" × 6" square in the bottom-right corner.',
        'Deploy anywhere inside either zone.'
      ]
    },
    redSetup: {
      title: 'Right-Middle Box & Top-Left Corner',
      instructions: [
        'Right box: on the right edge, mark the middle 12" (12" to 24" from the bottom), then measure 6" inward.',
        'Corner box: a 6" × 6" square in the top-left corner.',
        'Deploy anywhere inside either zone.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from left edge, 6" from bottom edge' },
      { num: 2, desc: '12" from right edge, 6" from top edge' },
      { num: 5, desc: '18" from left edge, 18" from bottom edge' }
    ],
    notes: 'Wave 2 map. Each player gets a side box and a small far corner, so both armies start split across the board.'
  },
  {
    id: 'power-lines',
    name: 'Power Lines',
    size: '36" × 36"',
    type: 'Skirmish',
    width: 36,
    height: 36,
    blueZones: [{ x: 0, y: 0, w: 18, h: 6 }, { x: 0, y: 6, w: 6, h: 30 }],
    redZones: [{ x: 18, y: 0, w: 18, h: 6 }, { x: 30, y: 6, w: 6, h: 30 }],
    markers: [
      { num: 2, x: 12, y: 15 },
      { num: 1, x: 24, y: 15 },
      { num: 5, x: 18, y: 30 }
    ],
    blueSetup: {
      title: 'Left Edge & Top-Left Strip',
      instructions: [
        'Left strip: the full left edge, 6" deep.',
        'Top strip: from the top-left corner, measure 18" right along the top edge, then 6" down.',
        'Deploy anywhere inside the combined zone.'
      ]
    },
    redSetup: {
      title: 'Right Edge & Top-Right Strip',
      instructions: [
        'Right strip: the full right edge, 6" deep.',
        'Top strip: from the top-right corner, measure 18" left along the top edge, then 6" down.',
        'Deploy anywhere inside the combined zone.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from right edge, 15" from top edge' },
      { num: 2, desc: '12" from left edge, 15" from top edge' },
      { num: 5, desc: '18" from left edge, 6" from bottom edge' }
    ],
    notes: 'Wave 3 map. The zones wrap the top and sides and meet at the top center. The center marker sits near the bottom edge.'
  },
  // 54x36 Standard Maps
  {
    id: 'gauntlet',
    name: 'Gauntlet',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 54, h: 6 }],
    blueZones: [{ x: 0, y: 30, w: 54, h: 6 }],
    markers: [
      { num: 1, x: 12, y: 12 },
      { num: 3, x: 36, y: 12 },
      { num: 4, x: 18, y: 24 },
      { num: 2, x: 42, y: 24 },
      { num: 5, x: 27, y: 18 }
    ],
    blueSetup: {
      title: 'Full Bottom Edge Strip',
      instructions: [
        'Start at the bottom-left corner.',
        'Measure 54" across the full bottom edge.',
        'Then measure 6" upward into the battlefield.',
        'Deploy anywhere inside that 54" × 6" strip.'
      ]
    },
    redSetup: {
      title: 'Full Top Edge Strip',
      instructions: [
        'Start at the top-left corner.',
        'Measure 54" across the full top edge.',
        'Then measure 6" downward into the battlefield.',
        'Deploy anywhere inside that 54" × 6" strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from left edge, 24" from bottom edge' },
      { num: 2, desc: '42" from left edge, 12" from bottom edge' },
      { num: 3, desc: '36" from left edge, 24" from bottom edge' },
      { num: 4, desc: '18" from left edge, 12" from bottom edge' },
      { num: 5, desc: '27" from left edge, 18" from bottom edge' }
    ],
    notes: 'Straight top-versus-bottom deployment. One player starts along the full top edge, the other along the full bottom edge, with one central marker and four flanking markers.'
  },
  {
    id: 'typhoon',
    name: 'Typhoon',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    redZones: [{ x: 30, y: 0, w: 24, h: 6 }, { x: 48, y: 6, w: 6, h: 12 }],
    blueZones: [{ x: 0, y: 30, w: 24, h: 6 }, { x: 0, y: 18, w: 6, h: 12 }],
    markers: [
      { num: 2, x: 6, y: 6 },
      { num: 1, x: 18, y: 12 },
      { num: 5, x: 27, y: 18 },
      { num: 4, x: 36, y: 24 },
      { num: 3, x: 48, y: 30 }
    ],
    blueSetup: {
      title: 'Bottom-Left L-Shape',
      instructions: [
        'Bottom Strip: Start at the bottom-left corner. Measure 24" right along the bottom edge, then 6" upward. This creates a 24" wide × 6" deep strip.',
        'Left Strip: From the left edge, measure a vertical section from 6" to 18" up from the bottom. Then measure 6" rightward into the battlefield. This creates a 6" wide × 12" tall strip.',
        'Blue may deploy in either rectangle; together they form the L-shape.'
      ]
    },
    redSetup: {
      title: 'Top-Right L-Shape',
      instructions: [
        'Top Strip: Start at the top-right corner. Measure 24" left along the top edge, then 6" downward. This creates a 24" wide × 6" deep strip.',
        'Right Strip: From the right edge, measure a vertical section from 18" to 30" up from the bottom. Then measure 6" leftward into the battlefield. This creates a 6" wide × 12" tall strip.',
        'Red may deploy in either rectangle; together they form the L-shape.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '18" from left edge, 24" from bottom edge' },
      { num: 2, desc: '6" from left edge, 30" from bottom edge' },
      { num: 3, desc: '48" from left edge, 6" from bottom edge' },
      { num: 4, desc: '36" from left edge, 12" from bottom edge' },
      { num: 5, desc: '27" from left edge, 18" from bottom edge' }
    ],
    notes: 'Diagonal corner-to-corner L-shape deployment. Blue starts bottom-left, Red starts top-right, and the markers run diagonally across the table.'
  },
  {
    id: 'acropolis',
    name: 'Acropolis',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 18, h: 6 }, { x: 36, y: 30, w: 18, h: 6 }],
    blueZones: [{ x: 36, y: 0, w: 18, h: 6 }, { x: 0, y: 30, w: 18, h: 6 }],
    markers: [
      { num: 1, x: 12, y: 12 },
      { num: 2, x: 42, y: 12 },
      { num: 4, x: 12, y: 24 },
      { num: 3, x: 42, y: 24 },
      { num: 5, x: 27, y: 18 }
    ],
    blueSetup: {
      title: 'Top-Right & Bottom-Left Strips',
      instructions: [
        'Top-Right Strip: Start at top-right corner. Measure 18" left along the top edge, then 6" downward. (18" × 6")',
        'Bottom-Left Strip: Start at bottom-left corner. Measure 18" right along the bottom edge, then 6" upward. (18" × 6")',
        'Deploy anywhere inside either strip.'
      ]
    },
    redSetup: {
      title: 'Top-Left & Bottom-Right Strips',
      instructions: [
        'Top-Left Strip: Start at top-left corner. Measure 18" right along the top edge, then 6" downward. (18" × 6")',
        'Bottom-Right Strip: Start at bottom-right corner. Measure 18" left along the bottom edge, then 6" upward. (18" × 6")',
        'Deploy anywhere inside either strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from left edge, 24" from bottom edge' },
      { num: 2, desc: '42" from left edge, 24" from bottom edge' },
      { num: 3, desc: '42" from left edge, 12" from bottom edge' },
      { num: 4, desc: '12" from left edge, 12" from bottom edge' },
      { num: 5, desc: '27" from left edge, 18" from bottom edge' }
    ],
    notes: 'Split-opposites setup. Each player gets two opposite corners of the board, and the markers form a box around the center.'
  },
  {
    id: 'proving-grounds',
    name: 'Proving Grounds',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    redZones: [{ x: 0, y: 0, w: 6, h: 36 }, { x: 48, y: 0, w: 6, h: 36 }],
    blueZones: [{ x: 18, y: 0, w: 18, h: 6 }],
    markers: [
      { num: 1, x: 12, y: 12 },
      { num: 5, x: 27, y: 12 },
      { num: 3, x: 42, y: 12 },
      { num: 4, x: 18, y: 24 },
      { num: 2, x: 36, y: 24 }
    ],
    blueSetup: {
      title: 'Top-Center Strip',
      instructions: [
        'Along the top edge, measure from 18" to 36" from the left edge.',
        'Then measure 6" downward into the battlefield.',
        'Deploy anywhere inside that 18" × 6" strip centered along the top edge.'
      ]
    },
    redSetup: {
      title: 'Full Left & Right Side Strips',
      instructions: [
        'Left Strip: Start at bottom-left corner. Measure 36" up the full left edge, then 6" inward. (6" × 36")',
        'Right Strip: Start at bottom-right corner. Measure 36" up the full right edge, then 6" inward. (6" × 36")',
        'Deploy anywhere inside either strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from left edge, 24" from bottom edge' },
      { num: 2, desc: '36" from left edge, 12" from bottom edge' },
      { num: 3, desc: '42" from left edge, 24" from bottom edge' },
      { num: 4, desc: '18" from left edge, 12" from bottom edge' },
      { num: 5, desc: '27" from left edge, 24" from bottom edge' }
    ],
    notes: 'Blue starts in the top-center lane. Red starts on both outer side edges. The upper half has three markers, the lower half has two.'
  },
  {
    id: 'breach',
    name: 'Breach',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    blueZones: [{ x: 0, y: 0, w: 6, h: 36 }],
    redZones: [{ x: 48, y: 0, w: 6, h: 36 }],
    markers: [
      { num: 1, x: 18, y: 6 },
      { num: 2, x: 36, y: 6 },
      { num: 5, x: 27, y: 18 },
      { num: 4, x: 18, y: 30 },
      { num: 3, x: 36, y: 30 }
    ],
    blueSetup: {
      title: 'Full Left Edge Strip',
      instructions: [
        'Start at the bottom-left corner.',
        'Measure 36" up along the full left edge.',
        'Then measure 6" inward from the left edge.',
        'Deploy anywhere inside that 6" × 36" strip.'
      ]
    },
    redSetup: {
      title: 'Full Right Edge Strip',
      instructions: [
        'Start at the bottom-right corner.',
        'Measure 36" up along the full right edge.',
        'Then measure 6" inward from the right edge.',
        'Deploy anywhere inside that 6" × 36" strip.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '18" from left edge, 30" from bottom edge' },
      { num: 2, desc: '36" from left edge, 30" from bottom edge' },
      { num: 3, desc: '36" from left edge, 6" from bottom edge' },
      { num: 4, desc: '18" from left edge, 6" from bottom edge' },
      { num: 5, desc: '27" from left edge, 18" from bottom edge' }
    ],
    notes: 'Pure left-edge versus right-edge deployment. Both players start in long vertical side strips with markers forming a box around the center.'
  },
  {
    id: 'meeting-engagement',
    name: 'Meeting Engagement',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    blueZones: [{ x: 18, y: 0, w: 18, h: 6 }, { x: 0, y: 12, w: 6, h: 12 }],
    redZones: [{ x: 18, y: 30, w: 18, h: 6 }, { x: 48, y: 12, w: 6, h: 12 }],
    markers: [
      { num: 1, x: 12, y: 12 },
      { num: 3, x: 42, y: 12 },
      { num: 5, x: 27, y: 18 },
      { num: 4, x: 12, y: 24 },
      { num: 2, x: 42, y: 24 }
    ],
    blueSetup: {
      title: 'Top-Center Strip & Left-Middle Box',
      instructions: [
        'Top strip: the middle 18" of the top edge (18" in from each corner), 6" deep.',
        'Left box: the middle 12" of the left edge (12" in from each corner), 6" deep.',
        'Deploy anywhere inside either zone.'
      ]
    },
    redSetup: {
      title: 'Bottom-Center Strip & Right-Middle Box',
      instructions: [
        'Bottom strip: the middle 18" of the bottom edge (18" in from each corner), 6" deep.',
        'Right box: the middle 12" of the right edge (12" in from each corner), 6" deep.',
        'Deploy anywhere inside either zone.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '12" from left edge, 12" from top edge' },
      { num: 2, desc: '12" from right edge, 12" from bottom edge' },
      { num: 3, desc: '12" from right edge, 12" from top edge' },
      { num: 4, desc: '12" from left edge, 12" from bottom edge' },
      { num: 5, desc: '27" from left edge, 18" from bottom edge' }
    ],
    notes: 'Wave 2 map. Each player holds one long edge strip and one short edge box, so the armies meet at an angle around the center.'
  },
  {
    id: 'one-bridge-too-close',
    name: 'One Bridge Too Close',
    size: '54" × 36"',
    type: 'Standard',
    width: 54,
    height: 36,
    blueZones: [{ x: 0, y: 0, w: 27, h: 6 }, { x: 0, y: 6, w: 6, h: 30 }],
    redZones: [{ x: 27, y: 0, w: 27, h: 6 }, { x: 48, y: 6, w: 6, h: 30 }],
    markers: [
      { num: 2, x: 18, y: 15 },
      { num: 1, x: 36, y: 15 },
      { num: 4, x: 12, y: 30 },
      { num: 5, x: 27, y: 30 },
      { num: 3, x: 42, y: 30 }
    ],
    blueSetup: {
      title: 'Left Edge & Top-Left Strip',
      instructions: [
        'Left strip: the full left edge, 6" deep.',
        'Top strip: from the top-left corner, measure 27" right along the top edge, then 6" down.',
        'Deploy anywhere inside the combined zone.'
      ]
    },
    redSetup: {
      title: 'Right Edge & Top-Right Strip',
      instructions: [
        'Right strip: the full right edge, 6" deep.',
        'Top strip: from the top-right corner, measure 27" left along the top edge, then 6" down.',
        'Deploy anywhere inside the combined zone.'
      ]
    },
    markerSetup: [
      { num: 1, desc: '18" from right edge, 15" from top edge' },
      { num: 2, desc: '18" from left edge, 15" from top edge' },
      { num: 3, desc: '12" from right edge, 6" from bottom edge' },
      { num: 4, desc: '12" from left edge, 6" from bottom edge' },
      { num: 5, desc: '27" from left edge, 6" from bottom edge' }
    ],
    notes: 'Wave 3 map. The zones wrap the top and sides and meet at the top center, with three markers in a row along the bottom edge.'
  }
];
  return { MISSIONS, MAPS };
})();
