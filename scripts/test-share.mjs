// Army share codes: round trip for every faction, unknown entries are skipped, bad codes fail clearly.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const load = p => fs.readFileSync(new URL(p, root), 'utf8');
const ctx = { location: { href: 'https://example.org/SC_TMG_CA/Zerg%20Army.dc.html?x=1#y' }, btoa, atob, TextEncoder, TextDecoder };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['terran-data.js', 'zerg-data.js', 'protoss-data.js', 'wave3-data.js', 'share-code.js']) vm.runInContext(load(f), ctx);
const S = ctx.SCTMG_SHARE;

for (const [faction, key] of [['zerg', 'SCTMG_ZERG'], ['terran', 'SCTMG_TERRAN'], ['protoss', 'SCTMG_PROTOSS']]) {
  const D = ctx[key];
  const army = D.UNITS.filter(u => u.tiers.some(t => t.cost > 0)).slice(0, 6).map(u => {
    const tierIdx = u.tiers.findIndex(t => t.cost > 0);
    const ups = Object.values(u.upgrades || {}).flat().slice(0, 2).map(x => x.name);
    return { unitId: u.id, tierIdx, upgs: ups };
  });
  const src = { army, factionId: D.FACTION_CARDS.at(-1).id, tactical: D.TACTICAL_CARDS.slice(0, 3).map(c => c.id) };
  const code = S.encode(faction, src);
  assert.match(code, /^[A-Za-z0-9_-]+$/, faction + ' code is URL safe');
  assert.ok(code.length < 600, faction + ' code stays short enough for a QR code');
  const back = S.decode(S.link(code));
  assert.equal(back.faction, faction);
  assert.equal(back.factionId, src.factionId);
  assert.equal(JSON.stringify(back.army), JSON.stringify(army), faction + ' units, tiers and upgrades survive');
  assert.equal(back.tactical.join(), src.tactical.join(), faction + ' tactical cards survive');
  assert.equal(back.skipped.length, 0);
}
assert.equal(S.link('ABC'), 'https://example.org/SC_TMG_CA/Vs.dc.html#army=ABC');

// Unknown units and cards are skipped, not fatal.
const odd = Buffer.from(JSON.stringify([1, 'z', 'nope', [['roach', 1], ['not-a-unit', 0]], ['lair', 'not-a-card']])).toString('base64url');
const d = S.decode(odd);
assert.equal(d.army.length, 1); assert.equal(d.skipped.join(), 'not-a-unit,not-a-card');
assert.equal(d.factionId, ctx.SCTMG_ZERG.FACTION_CARDS[0].id, 'unknown faction card falls back');
assert.throws(() => S.decode('!!!'), /could not be read/);
assert.throws(() => S.decode(Buffer.from('[9,"z","",[],[]]').toString('base64url')), /different version/);
console.log('Share code checks passed.');
