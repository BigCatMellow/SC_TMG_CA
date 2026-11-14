// Upgrade and card effects shown on the Vs unit card (unit-effects.js).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const load = p => fs.readFileSync(new URL(p, root), 'utf8');
const w = { alert() {} };
for (const f of ['terran', 'zerg', 'protoss']) vm.runInNewContext(load(f + '-data.js'), { window: w });
vm.runInNewContext(load('wave3-data.js'), { window: w });
vm.runInNewContext(load('unit-effects.js'), { window: w });
const E = w.SCTMG_EFFECTS, F = [w.SCTMG_ZERG, w.SCTMG_TERRAN, w.SCTMG_PROTOSS];

// Every non-weapon upgrade has an effect or a reminder, so none is missed in game.
const upgrades = new Set(F.flatMap(D => D.UNITS.flatMap(u => Object.values(u.upgrades || {}).flat())).filter(x => x.type !== 'Weapon').map(x => x.name));
assert.deepEqual([...upgrades].filter(n => !E.UPGRADES[n]), [], 'upgrades with no effect');
// Every card bonus names a real card ability.
const abil = new Set(F.flatMap(D => [...D.FACTION_CARDS, ...D.TACTICAL_CARDS].flatMap(c => (c.abilities || []).map(a => c.id + '|' + a.name))));
for (const [id, m] of Object.entries(E.CARDS)) for (const a of Object.keys(m)) assert.ok(abil.has(id + '|' + a), 'unknown card ability ' + id + '|' + a);

const unit = (D, name) => D.UNITS.find(u => u.name === name);
const stat = (u, fx, k) => E.applyStats([{ k, v: k === 'SPD' ? u.stats.speed : k === 'ARM' ? u.stats.armour : k === 'EVD' ? u.stats.evade : String(u.stats[k.toLowerCase()]) }], fx.stats)[0];

// Glial (on) + Accelerating Creep stack: 4/7 -> 5/8, on creep 7/10.
const roach = unit(w.SCTMG_ZERG, 'Roach');
let fx = E.forUnit(roach, ['Glial Reconstitution'], [{ id: 'accelerating-creep', key: 'accelerating-creep' }], ['u:Glial Reconstitution:0']);
assert.deepEqual([stat(roach, fx, 'SPD').v, stat(roach, fx, 'SPD').alt], ['5/8', '7/10 on creep']);
fx = E.forUnit(roach, ['Glial Reconstitution'], [{ id: 'accelerating-creep', key: 'accelerating-creep' }], []);
assert.deepEqual([stat(roach, fx, 'SPD').v, stat(roach, fx, 'SPD').alt], ['4/7', '5/8 on creep']);

// Kinetic Foam +1 HP; Veteran of Tarsonis is a note, not applied.
const mara = unit(w.SCTMG_TERRAN, 'Marauder');
fx = E.forUnit(mara, ['Kinetic Foam', 'Veteran of Tarsonis'], [], []);
assert.equal(stat(mara, fx, 'HP').v, String(mara.stats.hp + 1));
assert.equal(stat(mara, fx, 'ARM').v, mara.stats.armour);
assert.match(stat(mara, fx, 'ARM').alt, /marker/);

// A conditional weapon bonus is a note only; a plain one adds the keyword.
const marine = unit(w.SCTMG_TERRAN, 'Marine');
fx = E.forUnit(marine, ['Slugthrower'], [], []);
const c14 = marine.weapons.find(x => x.name === 'C-14 Rifle');
let wp = E.applyWeapon(c14, E.forWeapon(fx.weapons, c14));
assert.ok(!wp.keywords.includes('ANTI-EVADE (1)') && /within 8/.test(wp.notes[0]));
const hydra = unit(w.SCTMG_ZERG, 'Hydralisk'), ns = hydra.weapons.find(x => x.name === 'Needle Spines');
wp = E.applyWeapon(ns, E.forWeapon(E.forUnit(hydra, ['Grooved Spines'], [], []).weapons, ns));
assert.ok(wp.keywords.includes('LONG RANGE (16")'));

// Card bonuses only reach matching units, and change weapons when switched on.
const zealot = unit(w.SCTMG_PROTOSS, 'Zealot');
fx = E.forUnit(zealot, [], [{ id: 'forge', key: 'forge' }, { id: 'gateway', key: 'gateway' }], []);
assert.deepEqual([...fx.boosts.map(b => b.name)].sort(), ['Ground Armor', 'Quick Strikes']);
const adept = unit(w.SCTMG_PROTOSS, 'Adept'), gc = adept.weapons.find(x => x.name === 'Glaive Cannon');
fx = E.forUnit(adept, ['Resonating Glaives'], [], ['u:Resonating Glaives:0']);
assert.equal(E.applyWeapon(gc, E.forWeapon(fx.weapons, gc)).roa, String(+gc.roa + 1));
// Guidance raises the Glaive Cannon's ANTI-EVADE (1) to (2) instead of listing both.
const gcK = E.applyWeapon(gc, E.forWeapon(E.forUnit(adept, ['Guidance'], [], []).weapons, gc)).keywords;
assert.ok(gcK.includes('ANTI-EVADE (2)') && !gcK.includes('ANTI-EVADE (1)'));

// BUFF Speed doesn't stack (FAQ v1.3): Glial + Wild Mutation on, plus flat Accelerating Creep, is 5/8 and 7/10 on creep.
fx = E.forUnit(roach, ['Glial Reconstitution'], [{ id: 'kerrigans-swarm', key: 'faction' }, { id: 'accelerating-creep', key: 'accelerating-creep' }],
  ['u:Glial Reconstitution:0', 'c:faction:Wild Mutation:0']);
assert.deepEqual([stat(roach, fx, 'SPD').v, stat(roach, fx, 'SPD').alt], ['5/8', '7/10 on creep']);

// "First weapon used" bonuses are a note, not applied to every weapon.
const goliath = unit(w.SCTMG_TERRAN, 'Goliath');
fx = E.forUnit(goliath, [], [{ id: 'armory', key: 'armory' }], ['c:armory:Vehicle Weapons:0']);
for (const gw of goliath.weapons.filter(x => x.range !== 'E')) {
  const out = E.applyWeapon(gw, E.forWeapon(fx.weapons, gw));
  assert.ok(!out.keywords.includes('CRITICAL HIT (1)') && /first weapon used/.test(out.notes.join(' ')));
}

// Units that can't move or burrow aren't offered move or burrow bonuses.
const bile = unit(w.SCTMG_ZERG, 'Bile Launcher');
if (bile) {
  fx = E.forUnit(bile, [], [{ id: 'zerg-swarm', key: 'z' }, { id: 'evolution-chamber', key: 'e' }, { id: 'hatchery', key: 'h' }, { id: 'overseer', key: 'o' }], []);
  const names = fx.boosts.map(b => b.name);
  for (const n of ['Rapid Burrowing', 'Lie in Wait', 'Extended Claws', 'Pneumatized Carapace']) assert.ok(!names.includes(n), n + ' offered to Bile Launcher');
}

// Siege Mode lasts past End round; other bonuses don't.
assert.ok(E.kept('u:Mode Transformation:0') && !E.kept('u:Glial Reconstitution:0'));

// Weapon swaps say what they lose.
const immortal = unit(w.SCTMG_PROTOSS, 'Immortal');
const lpd = Object.values(immortal.upgrades).flat().find(x => x.name === 'Left Phase Disruptor');
assert.match(E.summary(lpd, immortal), /Dmg 2 → 1.*loses/);
console.log('effects ok');
