// What bought upgrades and tactical/faction cards do to a unit, so the Vs card shows them on the
// stats and weapons, or as a bonus to use, instead of leaving them in a list of text.
// Hand-written from the card text (checked against the official card sheets and FAQ v1.3, Nov 2026).
//
// Effect fields:
//   stat:    'speed' | 'armour' | 'evade' | 'hp' | 'size'   add: +N   better: N steps easier on a target number   set: new value
//   alt:     { add|better, when } a second, conditional value   when: a condition shown as a note instead of applied
//   weapons: weapon names, or 'ranged' | 'melee' | 'all'
//            keywords: added keywords   set: replaced weapon fields   add: { roa, range } increases   first: only the first one used
//   boost:   true for an Active/Reaction that must be used (it gets a Use button); text: short line for the bonus list
//   remind:  true for a passive with no number to change (shown as "Always on"); text: short reminder
//   cost:    what using it costs ("1 BM"); a card's bonus exhausts the card instead
//   needs:   which units a card helps: 'ground' | 'biological' | 'mechanical' | 'mech-ground' | 'charge' | 'ranged' | 'melee'
(function (root) {
  const UPGRADES = {
    // ---- Zerg
    'Adrenal Glands': [{ weapons: ['Claws', 'Shredding Claws'], keywords: ['PRECISION (2)'] }],
    'Hydriodic Bile': [{ weapons: ['Acid Saliva'], set: { surge: 'Light', sDie: 'D3+1' } }],
    'Grooved Spines': [{ weapons: ['Needle Spines'], keywords: ['LONG RANGE (16")'] }],
    'Glial Reconstitution': [{ boost: true, buff: true, cost: '1 BM', stat: 'speed', add: 1, alt: { add: 2, when: 'on creep' },
      text: '+1 Speed this round (+2 on creep)' }],
    'Creep Speed': [{ stat: 'speed', add: 2, when: 'on creep' }],
    'Ancillary Carapace': [{ remind: true, text: 'TOUGH (1) on the first Armour Roll each Activation' }],
    'Lurking': [{ remind: true, text: 'If Stationary: can Evade the first Ranged Attack each round (+1 on creep)' }],
    'Burrow Ambush': [{ remind: true, text: 'Deploying from Reserves: PLACE (18) from your Entry Edge, not within 10" of enemies. Activation ends' }],
    'Tunneling Claws': [{ remind: true, text: 'While Burrowed: can Move and Run without losing Burrowed, and move through bases' }],
    'Bloated Bile Ducts': [{ remind: true, text: 'Corrosive Bile area of effect is 2"' }],
    'Potent Bile': [{ remind: true, text: 'Corrosive Bile hits: target suffers DEBUFF Armour (1) before its Armour Roll' }],
    'Domineering Presence': [{ boost: true, cost: '1 BM', text: 'Another friendly unit within 6": +1 Supply for markers and objectives' }],
    'Plague': [{ boost: true, cost: '1-3 BM', text: 'Plague template within 10": NON-LETHAL DAMAGE, removes HIDDEN' }],
    'Broodmother': [{ boost: true, cost: '1 BM', text: 'All friendly units: Size 1 +1 IMPACT, Size 2 weapons CRITICAL HIT (1), or Size 3+ TOUGH (1). Not the same pick as last round' }],
    // ---- Terran
    'Kinetic Foam': [{ stat: 'hp', add: 1 }],
    'Veteran of Tarsonis': [{ stat: 'armour', better: 1, when: 'within 3" of a marker' }],
    'Laser Targeting Systems': [{ weapons: ['Quad K12'], keywords: ['LONG RANGE (16")'] }],
    'Ares-Class Targeting System': [{ weapons: ['Autocannon', 'Underbelly Machine Gun'], keywords: ['PRECISION (1)'] }],
    'Grenades - Frag': [{ weapons: ['C-14 Rifle'], set: { sDie: 'D6' }, when: 'vs targets within 8"' }],
    'Slugthrower': [{ weapons: ['C-14 Rifle'], keywords: ['ANTI-EVADE (1)'], when: 'vs targets within 8"' }],
    'Combat Shield': [{ boost: true, cost: '1 CP', text: 'Can always Evade Close Combat Attacks and Special Ability damage' }],
    'Mode Transformation': [{ boost: true, keep: true, cost: '1 CP', stat: 'size', set: '3', text: 'Siege Mode: Size counts as 3' }],
    'Shaped Blast': [{ boost: true, cost: '0 CP', text: 'Once per game in Siege Mode: weapon gains PINPOINT and LOCKED IN (4)' }],
    'Smart Shells': [{ boost: true, cost: '0 CP', text: 'Once per game in Siege Mode: weapon gains INDIRECT FIRE and LONG RANGE (24")' }],
    'Seeker Missile': [{ boost: true, cost: '1 CP', text: 'Mark an enemy within 12": end of Assault, HITS 4 (2) if Stationary or within 8"' }],
    'Coordinated Strike': [{ boost: true, cost: '0 CP', text: 'Shock Cannon can fire from a friendly unengaged unit\'s model (enemy within 8")' }],
    'A-13 Flash Grenade Launcher': [{ remind: true, text: 'Optical Flare range is 16"' }],
    'Explosive Shrapnel Shells': [{ remind: true, text: 'Its Auto-Turret\'s Gauss Cannon: Surge Light, S.Die D3+1' }],
    'Internal Tech Module': [{ remind: true, text: 'Can deploy from any non-Entry table edge, not within 8" of enemies' }],
    'Stabilizer Medpacks': [{ remind: true, text: 'Life Support and Medpack count 1 extra model in range' }],
    'Corvid Reactor': [{ remind: true, text: 'First Special Ability costs 1 CP less if it targets the closest enemy' }],
    'Advanced Medic Facilities': [{ remind: true, text: 'Supply counts as 0 for the Supply Pool' }],
    // ---- Protoss
    'Guidance': [{ weapons: ['Glaive Cannon'], keywords: ['ANTI-EVADE (2)'] }],
    'Resonating Glaives': [{ boost: true, cost: '1 PE', weapons: ['Glaive Cannon'], add: { roa: 1 }, text: 'Glaive Cannon +1 RoA' }],
    'Leg Enhancements': [{ boost: true, move: true, cost: '1 PE', text: 'Free 2" Move (does not use its action)' }],
    'Shield Overcharge': [{ boost: true, cost: '1 PE', text: 'Reaction: if Shielded, TOUGH (2) on this Armour Roll' }],
    'Path of Shadows': [{ boost: true, cost: '1 PE', text: 'Gains HIDDEN until it performs another action' }],
    'Zealous Round': [{ boost: true, cost: '0 PE', text: 'When damaged before it activates: count as Activated to take 2 less damage' }],
    'Farsight': [{ boost: true, cost: '1 PE', text: 'A friendly unit within 12" can Evade any attack until end of round' }],
    'Hallucination': [{ boost: true, cost: '0 PE', text: 'Reaction: a friendly unit within 4" being shot can Evade that attack' }],
    'Solid-Field Projectors': [{ boost: true, cost: '1 PE', text: 'Force Field within 8": Size 2 or lower can\'t cross it' }],
    'Psionic Storm': [{ boost: true, cost: '2 PE', text: 'Storm token within 10": hits at the end of each phase' }],
    'For the Ancients': [{ weapons: 'ranged', keywords: ['PRECISION (1)'], when: 'vs targets over 8" away' }],
    'Fury Unyielding': [{ weapons: 'ranged', keywords: ['CRITICAL HIT (1)'], when: 'when it and the target are within 3" of a marker' }],
    'Fury of the Nerazim': [{ weapons: ['Particle Disruptors'], keywords: ['INSTANT'], when: 'vs units already Activated this phase' }],
    'We Stand as One': [{ weapons: 'melee', keywords: ['PRECISION (2)'], when: 'if the target is Engaged with another friendly unit' }],
    'My Life for Aiur': [{ remind: true, text: 'IMPACT: each eligible model rolls 1 extra die' }]
  };

  // Keyed by tactical/faction card id, then ability name. Only bonuses that land on one of your units.
  const first = (weapons, keywords, extra) => ({ boost: true, weapons, keywords, first: true, ...extra });
  const CARDS = {
    // ---- Zerg
    'kerrigans-swarm': { 'Wild Mutation': [{ boost: true, buff: true, stat: 'speed', add: 1, weapons: 'all', keywords: ['PRECISION (1)'], first: true,
      text: 'On creep: +1 Speed, first weapon used gains PRECISION (1)' }] },
    'zerg-swarm': {
      'Brood Instinct': [{ boost: true, needs: 'evade', stat: 'evade', better: 1, text: 'Reaction: +1 to this Evade Roll' }],
      'Rapid Burrowing': [{ boost: true, needs: 'burrow', text: 'Gains Burrowed, even if already Activated' }] },
    'zagaras-swarm': {
      'Instinctive Reaction': [{ boost: true, text: 'Reaction: can Evade this Close Combat Attack' }],
      'Scourge Queen': [first('melee', ['INSTANT', 'PRECISION (4)'], { first: false, needs: 'melee', text: 'If it outnumbers the engaged enemies: melee weapons gain INSTANT and PRECISION (4)' })] },
    'accelerating-creep': { 'Speed on Creep': [{ stat: 'speed', add: 1, when: 'on creep' }] },
    'reactive-creep': { 'Reactive Tissue': [{ remind: true, text: 'On creep: DODGE (1) against all attacks' }] },
    'malignant-creep': { 'Malevolent Matriarch': [{ remind: true, needs: 'charge', text: 'Charging on creep: +1 to IMPACT Hit Rolls' }] },
    'evolution-chamber': {
      'Carapace': [{ boost: true, text: 'Reaction: TOUGH (1) on this Armour Roll' }],
      'Extended Claws': [{ boost: true, needs: 'charge', text: '+1 to IMPACT Hit Rolls this activation' }] },
    'hydralisk-den': { 'Missile Attacks': [first('ranged', ['PRECISION (1)'], { needs: 'ranged' })] },
    'lair': { 'Predation': [{ boost: true, needs: 'melee', weapons: 'melee', keywords: ['INSTANT'] }] },
    'spawning-pool': { 'Feral Rage': [first('melee', ['PRECISION (2)'], { needs: 'melee' })] },
    'spawning-pool-six': { 'Feral Rage': [first('melee', ['PRECISION (2)'], { needs: 'melee' })] },
    'hatchery': { 'Lie in Wait': [{ boost: true, needs: 'burrow', text: 'Gains Burrowed' }] },
    'overseer': { 'Pneumatized Carapace': [{ boost: true, move: true, text: 'Reaction: roll another D6 for Charge Distance, use the higher' }] },
    'roach-warren': { 'Nasty Surprise': [{ boost: true, needs: 'ground', text: 'Loses Burrowed' }] },
    // ---- Terran
    'nova-covert-ops': { 'Mark for Death': [first('all', ['CRITICAL HIT (1)', 'PRECISION (1)'], { when: 'vs the marked enemy unit',
      text: 'Mark an enemy: friendly attacks on it gain CRITICAL HIT (1) and PRECISION (1) on the first weapon used' })] },
    'terran-armed-forces': { 'Tactical Retreat': [{ boost: true, text: 'Ignores the Disengage penalty this round' }] },
    'armory': {
      'Vehicle Plating': [{ boost: true, needs: 'mechanical', text: 'Reaction: TOUGH (1) on this Armour Roll' }],
      'Vehicle Weapons': [first('ranged', ['CRITICAL HIT (1)'], { needs: 'mechanical' })] },
    'barracks': { 'Go! Go! Go!': [{ boost: true, move: true, needs: 'biological', text: 'Free 2" Move (does not use its action)' }] },
    'barracks-proxy': { 'Go! Go! Go!': [{ boost: true, move: true, needs: 'biological', text: 'Free 2" Move (does not use its action)' }] },
    'barracks-tech-lab': {
      'Go! Go! Go!': [{ boost: true, move: true, needs: 'biological', text: 'Free 2" Move (does not use its action)' }],
      "Let's Have a Blast!": [first('ranged', ['ANTI-EVADE (1)'], { needs: 'biological' })] },
    'engineering-bay': {
      'Infantry Armor': [{ boost: true, needs: 'biological', text: 'Reaction: TOUGH (1) on this Armour Roll' }],
      'Infantry Weapons': [first('ranged', ['CRITICAL HIT (1)'], { needs: 'biological' })] },
    'factory': { 'Field Repair': [{ boost: true, needs: 'mechanical', text: 'HEAL (2)' }] },
    'factory-tech-lab': {
      'Field Repair': [{ boost: true, needs: 'mechanical', text: 'HEAL (2)' }],
      "Pound 'Em Flat!": [first('ranged', ['PRECISION (2)'], { needs: 'mechanical', text: 'If Stationary: first ranged weapon used gains PRECISION (2)' })] },
    'supply-depot': { 'Additional Supply Depots': [{ boost: true, text: '+1 Supply for markers and objectives' }] },
    'vanadium-plating': { 'Crystalline Alloy': [{ boost: true, needs: 'mechanical', text: 'Reaction: DODGE (2) on this Armour Roll' }] },
    // ---- Protoss
    'daelaam': { "Dae'Uhl": [{ boost: true, text: 'Reaction: take 2 less damage (minimum 1)' }] },
    'nerazim': {
      'Might of the Nerazim': [{ boost: true, buff: true, stat: 'speed', add: 2, weapons: 'all', keywords: ['CRITICAL HIT (2)'], first: true,
        text: 'When it loses HIDDEN: +2 Speed, first weapon used gains CRITICAL HIT (2)' }],
      'Darkness Descends': [{ boost: true, needs: 'biological', text: 'Gains HIDDEN until end of round' }] },
    'forge': {
      'Ground Armor': [{ boost: true, needs: 'ground', text: 'Reaction: TOUGH (1) on this Armour Roll' }],
      'Ground Weapons': [first('ranged', ['CRITICAL HIT (1)'], { needs: 'ground' })] },
    'gate-chronoboosted': {
      'Zealous Charge': [{ boost: true, buff: true, stat: 'speed', add: 2, text: '+2 Speed this round' }],
      'Quick Strikes': [first('melee', ['PRECISION (2)'], { needs: 'melee' })] },
    'gateway': { 'Quick Strikes': [first('melee', ['PRECISION (2)'], { needs: 'melee' })] },
    'warp-gate': { 'Quick Strikes': [first('melee', ['PRECISION (2)'], { needs: 'melee' })] },
    'nexus': { 'Ancient Pride': [first('all', ['INSTANT'])] },
    'observer': { 'Gravitic Boosters': [{ boost: true, move: true, text: 'Reaction: +1 to Charge Distance' }] },
    'power-field': { 'Guardian Shell': [{ boost: true, needs: 'ground', text: 'Reaction: DODGE (2) on this Armour Roll' }] },
    'twilight-council': {
      'Veil of Shadows': [{ boost: true, text: 'Reaction after a PLACE effect: HEAL (2)' }],
      'Weapons of the Firstborn': [first('ranged', [], { needs: 'ground', add: { range: 4 } })] },
    'warp-prism': { 'Phase': [{ boost: true, text: 'PLACE (3)' }] },
    'robotics-facility': { 'Plasma Shields': [{ boost: true, needs: 'mech-ground', text: 'Reaction if Shielded: TOUGH (1) and DODGE (1) on this Armour Roll' }] },
    'void-seeker': { "Anakh Su'n": [{ boost: true, text: 'Gains HIDDEN until it performs another action' }] }
  };

  const STAT_KEY = { speed: 'SPD', armour: 'ARM', evade: 'EVD', hp: 'HP', size: 'SIZE' };
  const addTo = (v, n) => String(v).split('/').map(x => /^\d+$/.test(x) ? String(+x + n) : x).join('/');
  const better = (v, n) => /^\d\+$/.test(String(v)) ? Math.max(2, parseInt(v, 10) - n) + '+' : v;
  const isMelee = w => w.range === 'E' || w.phase === 'Combat';
  const allAbilities = unit => [...(unit.abilities || []), ...Object.values(unit.phaseAbilities || {}).flat()];
  const text = unit => allAbilities(unit).map(a => a.name + ' ' + (a.description || '')).join(' ');
  const fits = (fx, unit) => {
    const tags = unit.tags || [], st = unit.stats || {};
    // Units that can't move (Speed "-") get no speed, move or charge bonuses.
    if ((fx.stat === 'speed' || fx.move || fx.needs === 'charge') && (st.speed === '-' || st.speed === undefined)) return false;
    // A bonus for ranged or melee weapons only reaches units that carry one.
    if (fx.weapons === 'ranged' && !(unit.weapons || []).some(w => !isMelee(w))) return false;
    if (fx.weapons === 'melee' && !(unit.weapons || []).some(isMelee)) return false;
    switch (fx.needs) {
      case 'ground': return tags.includes('Ground');
      case 'biological': return tags.includes('Biological');
      case 'mechanical': return tags.includes('Mechanical');
      case 'mech-ground': return tags.includes('Mechanical') && tags.includes('Ground');
      case 'charge': return /Devastating Charge|resolve (the )?IMPACT/i.test(text(unit));
      case 'burrow': return tags.includes('Ground') && !/cannot gain the BURROWED/i.test(text(unit));
      case 'evade': return /^\d\+$/.test(String(st.evade));
      case 'ranged': return (unit.weapons || []).some(w => !isMelee(w));
      case 'melee': return (unit.weapons || []).some(isMelee);
      default: return true;
    }
  };

  // Short text for a bonus that only changes weapons, from its keywords.
  const autoText = fx => {
    const what = fx.weapons === 'ranged' ? 'ranged weapon' : fx.weapons === 'melee' ? 'melee weapon' : 'weapon';
    const gains = [...(fx.keywords || []), ...Object.entries(fx.add || {}).map(([k, n]) => '+' + n + (k === 'roa' ? ' RoA' : '" Range'))].join(' and ');
    return (fx.first ? 'First ' + what + ' used' : (fx.weapons === 'melee' ? 'Melee weapons' : 'Weapons')) + ' gain' + (fx.first ? 's ' : ' ') + gains;
  };

  // unit: data unit; upgs: bought upgrade names; cards: [{ id, key, name }] in play for that side;
  // active: bonus ids switched on this round. Returns stat changes, weapon changes (keyed by weapon
  // name or '*ranged' / '*melee' / '*all') and the bonus list.
  function forUnit(unit, upgs, cards, active) {
    const on = new Set(active || []);
    const sources = [];
    (upgs || []).forEach(name => (UPGRADES[name] || []).forEach((fx, i) => sources.push({ fx, src: name, kind: 'Upgrade', id: 'u:' + name + ':' + i })));
    (cards || []).forEach(c => Object.entries(CARDS[c.id] || {}).forEach(([ability, list]) => list.forEach((fx, i) =>
      sources.push({ fx, src: ability, card: c, kind: c.name, id: 'c:' + c.key + ':' + ability + ':' + i }))));
    const stats = {}, weapons = {}, boosts = [];
    for (const s of sources) {
      const fx = s.fx;
      if (!fits(fx, unit)) continue;
      const live = !fx.boost || on.has(s.id);
      if (fx.boost || fx.remind) boosts.push({ id: s.id, name: s.src, from: s.kind, card: s.card || null, cost: fx.cost || '',
        text: fx.text || autoText(fx), on: on.has(s.id), passive: !!fx.remind, changes: !!(fx.stat || fx.weapons) });
      if (fx.stat && live) (stats[STAT_KEY[fx.stat]] = stats[STAT_KEY[fx.stat]] || []).push({ fx, src: s.src });
      if (fx.weapons && live) {
        const keys = Array.isArray(fx.weapons) ? fx.weapons : ['*' + fx.weapons];
        keys.forEach(w => (weapons[w] = weapons[w] || []).push({ fx, src: s.src }));
      }
    }
    return { stats, weapons, boosts };
  }

  // The changes that apply to one fielded weapon.
  function forWeapon(fxWeapons, w) {
    return [...(fxWeapons[w.name] || []), ...(fxWeapons['*all'] || []), ...(fxWeapons[isMelee(w) ? '*melee' : '*ranged'] || [])];
  }

  // Apply a weapon's changes. Conditional ones ("vs targets within 8\"") only add a note.
  function applyWeapon(w, mods) {
    const out = { ...w, keywords: [...(w.keywords || [])], notes: [], changed: [] };
    for (const m of mods) {
      const fx = m.fx, parts = [...(fx.keywords || [])];
      Object.entries(fx.set || {}).forEach(([k, v]) => parts.push((k === 'sDie' ? 'S.Die ' : 'Surge ') + v));
      Object.entries(fx.add || {}).forEach(([k, n]) => parts.push('+' + n + (k === 'roa' ? ' RoA' : '" Range')));
      out.notes.push(m.src + ': ' + parts.join(', ') + (fx.when ? ' ' + fx.when : '') + (fx.first ? ' (first weapon used)' : ''));
      if (fx.when || fx.first) continue; // conditional, or only the one weapon the player picks
      // A keyword it already has with a number is replaced (ANTI-EVADE (1) becomes ANTI-EVADE (2)).
      (fx.keywords || []).forEach(k => {
        const base = k.replace(/\s*\(.*\)$/, ''), i = out.keywords.findIndex(x => x.replace(/\s*\(.*\)$/, '') === base);
        const num = s => parseFloat((/\((\d+)/.exec(s) || [])[1]) || 0;
        if (i < 0) out.keywords.push(k); else if (num(k) > num(out.keywords[i])) out.keywords[i] = k;
      });
      Object.entries(fx.set || {}).forEach(([k, v]) => { out[k] = v; out.changed.push(k); });
      Object.entries(fx.add || {}).forEach(([k, n]) => { out[k] = addTo(out[k], n); out.changed.push(k); });
    }
    return out;
  }

  // Apply stat changes to a { k, v } list. Unconditional changes replace the value; each condition
  // ("on creep") gets one combined note, so stacked bonuses add up (FAQ v1.3: flat modifiers stack with BUFF).
  function applyStats(list, fxByStat) {
    return list.map(st => {
      const mods = fxByStat[st.k];
      if (!mods) return st;
      const setTo = mods.filter(m => m.fx.set !== undefined && !m.fx.when).map(m => m.fx.set).pop();
      const start = setTo !== undefined ? setTo : st.v;
      const isTarget = /\+$/.test(String(start));
      const step = (v, n) => n ? (isTarget ? better(v, n) : addTo(v, n)) : v;
      const amt = f => f.better || f.add || 0;
      // Amount from each change under a condition (null = unconditional). Flat modifiers add up;
      // BUFFs to the same stat don't stack, so only the biggest counts (FAQ v1.3).
      const total = c => {
        let flat = 0, buff = 0;
        mods.forEach(m => {
          const f = m.fx, n = f.when ? (f.when === c ? amt(f) : 0) : f.alt && f.alt.when === c ? amt(f.alt) : amt(f);
          if (f.buff) buff = Math.max(buff, n); else flat += n;
        });
        return flat + buff;
      };
      const base = total(null);
      const conds = [...new Set(mods.flatMap(m => [m.fx.when, m.fx.alt && m.fx.alt.when]).filter(Boolean))];
      const notes = conds.map(c => step(start, total(c)) + ' ' + c);
      const v = step(start, base);
      if (v === st.v && !notes.length) return st; // nothing changed (e.g. +1 Evade on a unit that can't Evade)
      return { ...st, v, alt: notes.join(' · '), mod: true, src: [...new Set(mods.map(m => m.src))].join(', ') };
    });
  }

  // One short line saying what an upgrade does, for the Roster and Library upgrade pickers.
  const STAT_NAME = { speed: 'Speed', armour: 'Armour', evade: 'Evade', hp: 'HP', size: 'Size' };
  const FIELD = [['range', v => v === 'E' ? 'Melee' : 'Range ' + v + '"'], ['target', v => 'Targets ' + v], ['roa', v => 'RoA ' + v],
    ['hit', v => 'Hit ' + v], ['surge', v => 'Surge ' + v], ['sDie', v => 'S.Die ' + v], ['damage', v => 'Dmg ' + v]];
  const plainVal = (k, v) => k === 'range' ? (v === 'E' ? 'Melee' : v + '"') : String(v);
  function summary(upg, unit) {
    if (upg.type === 'Weapon') {
      const wp = upg.weaponProfile || {}, skip = k => k === 'SPECIALIST' || k === 'SIDEARM';
      const kw = (wp.keywords || []).filter(k => !skip(k));
      const one = (wp.keywords || []).includes('SPECIALIST') ? ' (one model)' : '';
      const old = upg.modifies && upg.modifies.weapon && ((unit && unit.weapons) || []).find(w => w.name === upg.modifies.weapon);
      if (!wp.name) return String(upg.description || '').replace(/\.\s+/, ': ').replace(/\.$/, '');
      if (old) {
        // Old -> new for every value that changes, plus keywords gained and lost.
        const diff = FIELD.filter(([k]) => wp[k] !== undefined && String(wp[k]) !== String(old[k]))
          .map(([k, f]) => old[k] !== undefined && old[k] !== '-' ? f(plainVal(k, old[k])).replace(/"$/, '') + ' → ' + plainVal(k, wp[k]) : f(wp[k]));
        const gained = kw.filter(k => !(old.keywords || []).includes(k));
        const lost = (old.keywords || []).filter(k => !skip(k) && !kw.includes(k));
        const what = [...diff, ...gained, ...(lost.length ? ['loses ' + lost.join(', ')] : [])].join(', ');
        return 'Replaces ' + old.name + one + (what ? ': ' + what : '');
      }
      return (upg.modifies && upg.modifies.weapon ? 'Replaces ' + upg.modifies.weapon : 'Adds ' + wp.name) + one + ': ' +
        FIELD.filter(([k]) => wp[k] !== undefined && wp[k] !== '-').map(([k, f]) => f(wp[k])).concat(kw).join(', ');
    }
    const how = /^Reaction/.test(upg.type) ? 'Reaction' : /^Active/.test(upg.type) ? 'Use' : '';
    return (UPGRADES[upg.name] || []).map(fx => {
      if (fx.text) return (how ? how + (fx.cost ? ' (' + fx.cost + ')' : '') + ': ' : '') + (how ? fx.text.replace(/^Reaction:\s*/, '').replace(/^./, c => c.toUpperCase()) : fx.text);
      const when = fx.when ? ' ' + fx.when : '';
      if (fx.stat) return (fx.set !== undefined ? STAT_NAME[fx.stat] + ' ' + fx.set : '+' + (fx.add || fx.better) + ' ' + STAT_NAME[fx.stat]) + when;
      if (fx.weapons) {
        const who = Array.isArray(fx.weapons) ? fx.weapons.join(' and ') : fx.weapons === 'melee' ? 'Melee weapons' : fx.weapons === 'ranged' ? 'Ranged weapons' : 'Weapons';
        const parts = [...(fx.keywords || []), ...Object.entries(fx.set || {}).map(([k, v]) => (k === 'sDie' ? 'S.Die ' : 'Surge ') + v)];
        return who + ': ' + parts.join(', ') + when;
      }
      return '';
    }).filter(Boolean).join('; ');
  }

  // Bonuses that last past End round (a status such as Siege Mode).
  function kept(id) {
    const m = /^u:(.*):(\d+)$/.exec(id);
    return !!(m && UPGRADES[m[1]] && UPGRADES[m[1]][+m[2]] && UPGRADES[m[1]][+m[2]].keep);
  }

  root.SCTMG_EFFECTS = { UPGRADES, CARDS, forUnit, forWeapon, applyWeapon, applyStats, summary, kept };
})(window);
