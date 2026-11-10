// StarCraft TMG Companion — explanatory worked scenarios.
// These are teaching examples, NOT official or exhaustive rule wording.
// See rules-data.js and battle-rules-data.js; source labels below refer to
// the 2026 Core Rules and publisher FAQ v1.1 (25 Sep 2026).
// Keep each example in sync with the cited rule before changing it.
window.SCTMG_CODEX_EXAMPLES = [
  {
    id: 'resource-payment',
    title: 'Paying for an Ability',
    summary: 'Exhaust Ready cards to cover one ability cost; unused resource cannot be saved.',
    plain: 'A card produces CP, BM, or PE only when you exhaust it to pay an ability cost. Each payment is separate.',
    scenario: 'A Zerg ability costs 1 BM. Your Ready Tactical Card can produce +2 BM.',
    steps: [
      'Exhaust that card to pay for the ability.',
      'Spend 1 BM on the ability. The other 1 BM is lost immediately.',
      'Leave the card Exhausted. It cannot pay for a later ability unless a rule readies it.'
    ],
    takeaway: 'The 2 BM never becomes a permanent pool; nothing carries over to the next ability.',
    source: 'Core Rules §10.5.1 · p. 81; companion Abilities & Resources',
    keywords: ['PSIONIC ENERGY'], tags: []
  },
  {
    id: 'ready-exhausted',
    title: 'Ready vs Exhausted Cards',
    summary: 'An Exhausted Faction or Tactical Card cannot provide resources or use its own ability.',
    plain: 'The same card cannot be spent twice. Using it for resources does not also activate its printed ability.',
    scenario: 'You exhaust a Ready Faction Card to help pay for an ability. Later in the Round you want its own printed ability.',
    steps: [
      'The card is already Exhausted from the first payment.',
      'You cannot use that card again while it remains Exhausted.',
      'Cleanup & Refresh readies cards at the prescribed time, unless another rule specifically says otherwise.'
    ],
    takeaway: 'Choose between the card’s resource output and its own ability when you use it.',
    source: 'Core Rules §10.5.1 · p. 81; companion Core Concepts',
    keywords: [], tags: []
  },
  {
    id: 'supply-deployment',
    title: 'Available Supply and Deployment',
    summary: 'Only deploy a Reserve Unit if its Current Supply fits in your remaining Supply.',
    plain: 'Supply used by Units on the battlefield is unavailable for new deployments. Recalculate as models are lost.',
    scenario: 'Your Supply Pool is 7. Friendly Units already deployed use 4 Supply. A Unit in Reserves needs 4 Supply.',
    steps: [
      'Calculate Available Supply: 7 − 4 = 3.',
      'The 4-Supply Reserve Unit cannot Deploy yet, even if it has a legal Entry Edge.',
      'A 3-Supply Reserve Unit could fit, provided its other deployment restrictions are met.'
    ],
    takeaway: 'Check the current Unit composition and Available Supply before starting Deploy.',
    source: 'Core Rules §6.1–6.2 · p. 44; §8.3 · p. 55',
    keywords: [], tags: []
  },
  {
    id: 'leading-coherency',
    title: 'Leading Model and Coherency',
    summary: 'Move the Leading Model, then place the remaining models in legal Coherency.',
    plain: 'Most Unit movement is leader-first. The rest of the Unit is placed after the leader rather than walking each model independently.',
    scenario: 'A three-model Ground Unit makes a normal Move and its Leading Model moves 5 inches.',
    steps: [
      'Move the Leading Model along a legal path, no farther than its Speed.',
      'Place the other two models so each is wholly within 3 inches of the Leading Model.',
      'Check the required Coherency Links and all placement restrictions before finishing.'
    ],
    takeaway: 'A legal leader destination alone does not make the full Unit placement legal.',
    source: 'Core Rules §4.1–4.6 · pp. 33–37',
    keywords: [], tags: []
  },
  {
    id: 'disengage-tactical-mass',
    title: 'Disengage and Tactical Mass',
    summary: 'Every surviving model must escape; greater Current Supply may waive the next-Assault penalty.',
    plain: 'Disengaging is not a free retreat. Models left in Engagement Range are lost. Tactical Mass only changes the follow-up attack restriction.',
    scenario: 'A Unit with Current Supply 5 disengages from enemies whose combined Current Supply is 3.',
    steps: [
      'Move the Leading Model legally, then set the others in Coherency and outside all relevant enemy Engagement Ranges.',
      'Any trailing model that cannot end outside Engagement Range is removed; if the leader cannot escape, the Disengage fails.',
      'Because 5 is greater than 3 when it disengages, Tactical Mass waives the normal restriction on shooting or Charging in the next Assault Phase.'
    ],
    takeaway: 'Tactical Mass does not waive movement or model-placement requirements.',
    source: 'Core Rules §8.4–8.5.5 · pp. 56–59',
    keywords: [], tags: []
  },
  {
    id: 'charge-targets',
    title: 'Declaring a Charge',
    summary: 'A Charge must legally reach every declared enemy target, not just one of them.',
    plain: 'Declare Charge targets before rolling. The Leading Model needs a legal destination within 1 inch of each target.',
    scenario: 'An unengaged Ground Unit with Speed 5 rolls a 2 for Charge Distance. You declared two enemy Ground Units.',
    steps: [
      'The Leading Model may move up to 7 inches along a legal Charge path.',
      'If it can end within 1 inch of only the first target, the Charge fails.',
      'The Unit stays where it was and ends its activation; it cannot partially Charge one target.'
    ],
    takeaway: 'Measure potential reach to all declared targets before committing to a multi-target Charge.',
    source: 'Core Rules §8.7.7 · pp. 65–66',
    keywords: [], tags: []
  },
  {
    id: 'attack-batches',
    title: 'Weapon Batches and Targets',
    summary: 'Resolve one weapon-profile/target Batch fully before declaring the next Batch.',
    plain: 'Several models using the same weapon profile against the same enemy are grouped together for that attack.',
    scenario: 'Two models shoot the same rifle profile at Enemy A. An eligible SIDEARM could then shoot Enemy B.',
    steps: [
      'Combine the rifle attacks against A into their one eligible weapon Batch.',
      'Finish that Batch: Hit, Surge, Armour, any eligible Evade, Damage and casualties.',
      'Only then declare and resolve the separate SIDEARM Batch against its legal target.'
    ],
    takeaway: 'Do not predeclare all later Batch targets before finishing the first Batch.',
    source: 'Core Rules §8.7.3–8.7.5 · pp. 60–64; publisher FAQ v1.1 · p. 4',
    keywords: ['SIDEARM', 'PRECISION', 'CRITICAL HIT'], tags: []
  },
  {
    id: 'armour-evade-surge',
    title: 'Armour, Surge and Evade',
    summary: 'Successful Armour removes eligible hits; Evade is rolled only when a rule permits it.',
    plain: 'Surge can bypass Armour, but it does not automatically bypass an eligible Evade roll.',
    scenario: 'Three ordinary hits reach the Armour Pool. The defender passes one Armour save and has a rule granting Evade.',
    steps: [
      'The successful Armour save removes one hit, leaving two in the Damage Pool.',
      'If Evade is permitted, roll against those remaining hits; one successful Evade would leave one damaging hit.',
      'Any Surge-generated hits that bypass Armour still face Evade if the defender is entitled to that roll.'
    ],
    takeaway: 'Never grant Evade automatically to every defender or every melee target.',
    source: 'Core Rules §8.7.3–8.7.5 · pp. 60–64; publisher FAQ v1.1 · pp. 2–3',
    keywords: ['ANTI-EVADE'], tags: []
  },
  {
    id: 'los-cover',
    title: 'Line of Sight and Cover',
    summary: 'Check top-down base-to-base visibility and the terrain rules before choosing a target.',
    plain: 'Being able to see a miniature’s head is not sufficient. Terrain, Effective Size and elevation determine line of sight and cover.',
    scenario: 'From eye level the attacker seems to see an enemy miniature, but the top-down line between their bases crosses terrain.',
    steps: [
      'Trace the appropriate top-down Line of Sight between model bases.',
      'Apply the terrain’s Effective Size and elevation rules to decide whether that line is blocked or grants Cover.',
      'If Line of Sight is blocked and no ability overrides it, do not make a normal ranged attack at that target.'
    ],
    takeaway: 'Use the diagrams in the rulebook for complicated Full, Direct or High Ground Cover cases.',
    source: 'Core Rules §7.1–7.2.1 · pp. 45–53 (illustrated rules)',
    keywords: ['INDIRECT FIRE'], tags: []
  },
  {
    id: 'mission-marker-control',
    title: 'Contesting a Mission Marker',
    summary: 'Eligible Current Supply determines control; a tie does not flip an owned marker.',
    plain: 'Model count is not the deciding number. A Unit must also meet the marker’s proximity, Line of Sight, elevation and state conditions.',
    scenario: 'Player A already controls a marker. Eligible Units from both players are within 3 inches at the same elevation and have Line of Sight.',
    steps: [
      'Player A has eligible Current Supply 3 and Player B has 3: the marker remains Player A’s.',
      'Later Player B has 4 eligible Supply versus Player A’s 3: Player B takes control.',
      'Exclude Units that do not qualify, such as Flying, Burrowed or out-of-Coherency Units.'
    ],
    takeaway: 'Control is sticky; equal Supply is not enough to capture a marker already controlled.',
    source: 'Core Rules §8.9–8.10 · pp. 69–72',
    keywords: ['FLYING', 'BURROWED'], tags: ['Flying']
  },
  {
    id: 'reaction-timing',
    title: 'Reaction Timing',
    summary: 'Declare a Reaction at the exact event named on the ability.',
    plain: 'A Reaction is not something you can add after seeing the result. Each player normally resolves only one Reaction per Activation.',
    scenario: 'Your Reaction says it can be declared when an opponent declares a Charge.',
    steps: [
      'The opponent declares that Charge: this is the indicated trigger.',
      'Decide whether to use the Reaction now, before play moves beyond its trigger window.',
      'You cannot wait for the Charge roll, see the result, and retroactively declare the same earlier-triggered Reaction.'
    ],
    takeaway: 'Follow the specific card trigger; a later Reaction needs a separate qualifying trigger.',
    source: 'Core Rules §10.1–10.5.2 · pp. 79–81; publisher FAQ v1.1 · pp. 3–5',
    keywords: ['INSTANT'], tags: []
  },
  {
    id: 'pinpoint',
    title: 'PINPOINT and Engaged Targets',
    summary: 'PINPOINT can target an Engaged enemy, but does not free an Engaged attacker to shoot elsewhere.',
    plain: 'The keyword relaxes the restriction on which enemy you can shoot, not the attacker’s own Engagement restriction.',
    scenario: 'An unengaged Terran shooter with PINPOINT sees an enemy Ground Unit engaged with a friendly Unit.',
    steps: [
      'The shooter may target that Engaged enemy if the other normal targeting requirements are satisfied.',
      'If the Terran shooter itself becomes Engaged, it still cannot shoot a separate distant target.',
      'Check the attacker’s Engagement status and the target’s legality independently.'
    ],
    takeaway: 'PINPOINT is not permission to ignore every Engagement rule.',
    source: 'Core Rules p. 88; publisher FAQ v1.1 · p. 4',
    keywords: ['PINPOINT'], tags: []
  },
  {
    id: 'hidden-burrowed',
    title: 'HIDDEN and BURROWED',
    summary: 'BURROWED grants HIDDEN, but also limits objective interaction and certain actions.',
    plain: 'HIDDEN restricts ranged targeting beyond 4 inches. Being BURROWED does not make a Unit eligible to control markers.',
    scenario: 'A BURROWED Zerg Unit is 6 inches from an enemy shooter and stands near a Mission Marker.',
    steps: [
      'Because BURROWED grants HIDDEN, a normal ranged attack from more than 4 inches away cannot target it.',
      'It cannot contest or control the Mission Marker while BURROWED.',
      'If an enemy comes within 4 inches, it may target the Unit only if the other attack rules permit; HIDDEN still grants its specified defenses.'
    ],
    takeaway: 'Distance does not automatically remove HIDDEN; and BURROWED carries separate mission restrictions.',
    source: 'Core Rules Part 11 · p. 82 (BURROWED), Keyword Glossary pp. 82–91',
    keywords: ['HIDDEN', 'BURROWED'], tags: []
  },
  {
    id: 'impact-on-charge',
    title: 'IMPACT After a Successful Charge',
    summary: 'IMPACT adds extra dice after a successful Charge; qualifying rolls become hits in Armour.',
    plain: 'You must complete a successful Charge before resolving IMPACT. Read X as dice per eligible model and Y as the threshold.',
    scenario: 'One eligible model has IMPACT (2) 5+ and completes a successful Charge.',
    steps: [
      'Generate two IMPACT dice for that model.',
      'Suppose you roll 5 and 2. The 5 qualifies; the 2 does not.',
      'Place the one successful automatic hit into the Armour Pool, then follow the remaining resolution rules.'
    ],
    takeaway: 'IMPACT hits do not automatically skip Armour just because they are automatic.',
    source: 'Core Rules Part 11 · pp. 82–91; Core Rules §8.7.7 · pp. 65–66',
    keywords: ['IMPACT'], tags: []
  },
  {
    id: 'shielded-damage',
    title: 'SHIELDED, HEAL and Non-Lethal Damage',
    summary: 'SHIELDED is lost only when assigned Total Damage exceeds Shield value or the first model is removed.',
    plain: 'Damage equal to the Shield value does not remove SHIELDED. HEAL cannot restore SHIELDED after it has been lost.',
    scenario: 'A Protoss Unit has Shield value 2 and its assigned Total Damage reaches 2.',
    steps: [
      'At exactly 2 Total Damage, SHIELDED remains: equal is not greater than.',
      'If assigned Total Damage rises to 3, SHIELDED is lost. NON-LETHAL DAMAGE counts toward that total too.',
      'Later HEAL may remove accumulated Damage but does not restore the lost SHIELDED status.'
    ],
    takeaway: 'Check the strict greater-than threshold, not greater-than-or-equal-to.',
    source: 'Core Rules Part 11 · p. 89; publisher FAQ v1.1 · pp. 2–4',
    keywords: ['SHIELDED', 'HEAL', 'NON-LETHAL DAMAGE'], tags: []
  }
];
