// What bought upgrades and tactical/faction cards do to a unit's numbers, so the Vs card can
// show them on the stats and weapons instead of leaving them in a list of text.
// Hand-written from the card text (checked against the official card sheets, Nov 2026).
//
// Effect fields:
//   stat:    'speed' | 'armour' | 'evade' | 'hp'      add: +N to a value; better: N steps easier on a target number
//   when:    shown as a condition instead of applied ("on creep", "near a marker")
//   weapons: weapon names the effect changes          keywords: added keywords; set: replaced weapon fields
//   boost:   true when it must be used (Active/Reaction); text: short line for the Boosts strip
//   cost:    resource cost of the boost ("1 BM"), or the card it comes from pays for it
//   needs:   'ground' | 'charge' (has Devastating Charge) — the card only affects matching units
(function (root) {
  const UPGRADES = {
    // ---- Zerg
    'Adrenal Glands': [{ weapons: ['Claws', 'Shredding Claws'], keywords: ['PRECISION (2)'] }],
    'Hydriodic Bile': [{ weapons: ['Acid Saliva'], set: { surge: 'Light', sDie: 'D3+1' } }],
    'Glial Reconstitution': [{ boost: true, cost: '1 BM', stat: 'speed', add: 1, alt: { add: 2, when: 'on creep' },
      text: '+1 Speed this round (+2 on creep)' }],
    'Ancillary Carapace': [{ boost: true, text: 'TOUGH (1) on the first Armour Roll each Activation', passive: true }],
    // ---- Terran
    'Kinetic Foam': [{ stat: 'hp', add: 1 }],
    'Veteran of Tarsonis': [{ stat: 'armour', better: 1, when: 'within 3" of a marker' }],
    'Laser Targeting Systems': [{ weapons: ['Quad K12'], keywords: ['LONG RANGE (16")'] }],
    // ---- Protoss
    'Leg Enhancements': [{ boost: true, cost: '1 PE', text: 'Free 2" Move (does not use its action)' }],
    'Guidance': [{ weapons: ['Glaive Cannon'], keywords: ['ANTI-EVADE (2)'] }]
  };
  // Keyed by tactical/faction card id, then ability name.
  const CARDS = {
    'accelerating-creep': { 'Speed on Creep': [{ stat: 'speed', add: 1, when: 'on creep', needs: 'zerg-ground' }] },
    'evolution-chamber': {
      'Carapace': [{ boost: true, text: 'TOUGH (1) on one Armour Roll' }],
      'Extended Claws': [{ boost: true, text: '+1 to IMPACT rolls this activation', needs: 'charge' }]
    },
    'zerg-swarm': { 'Wild Mutation': [{ boost: true, stat: 'speed', add: 1,
      text: 'Use on creep: +1 Speed this round, first weapon used gains PRECISION (1)' }] }
  };

  const STAT_KEY = { speed: 'SPD', armour: 'ARM', evade: 'EVD', hp: 'HP' };
  const addTo = (v, n) => String(v).split('/').map(x => /^\d+$/.test(x) ? String(+x + n) : x).join('/');
  const better = (v, n) => /^\d\+$/.test(String(v)) ? Math.max(2, parseInt(v, 10) - n) + '+' : v;
  const fits = (fx, unit) => {
    if (fx.needs === 'zerg-ground') return (unit.tags || []).includes('Ground');
    if (fx.needs === 'charge') return [...(unit.abilities || []), ...Object.values(unit.phaseAbilities || {}).flat()].some(a => a.name === 'Devastating Charge');
    return true;
  };

  // unit: data unit; upgs: bought upgrade names; cards: [{ id, key }] in play for that side;
  // active: boost ids switched on this round. Returns stat changes, weapon changes and boosts.
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
      if (fx.boost) boosts.push({ id: s.id, name: s.src, from: s.kind, card: s.card || null, cost: fx.cost || '', text: fx.text, on: on.has(s.id), passive: !!fx.passive });
      if (fx.stat && live) (stats[STAT_KEY[fx.stat]] = stats[STAT_KEY[fx.stat]] || []).push({ fx, src: s.src });
      if (fx.weapons && live) fx.weapons.forEach(w => (weapons[w] = weapons[w] || []).push({ fx, src: s.src }));
    }
    return { stats, weapons, boosts };
  }

  // Apply stat changes to a { k, v } list. Unconditional changes replace the value; each condition
  // ("on creep") gets one combined note, so stacked bonuses add up (FAQ v1.3: flat modifiers stack with BUFF).
  function applyStats(list, fxByStat) {
    return list.map(st => {
      const mods = fxByStat[st.k];
      if (!mods) return st;
      const isTarget = /\+$/.test(String(st.v));
      const step = (v, n) => isTarget ? better(v, n) : addTo(v, n);
      const amt = f => f.better || f.add || 0;
      const base = mods.filter(m => !m.fx.when).reduce((n, m) => n + amt(m.fx), 0);
      const conds = [...new Set(mods.flatMap(m => [m.fx.when, m.fx.alt && m.fx.alt.when]).filter(Boolean))];
      const notes = conds.map(c => step(st.v, mods.reduce((n, m) => n + (m.fx.when === c ? amt(m.fx)
        : m.fx.alt && m.fx.alt.when === c ? amt(m.fx.alt) : m.fx.when ? 0 : amt(m.fx)), 0)) + ' ' + c);
      return { ...st, v: base ? step(st.v, base) : st.v, alt: notes.join(' · '), mod: true, src: [...new Set(mods.map(m => m.src))].join(', ') };
    });
  }

  root.SCTMG_EFFECTS = { UPGRADES, CARDS, forUnit, applyStats };
})(window);
