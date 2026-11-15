// Print the app's data for one faction in the same order a card reads, to compare side by side
// with the card sheet (or its extracted text).
//   node scripts/card-audit/show-app.mjs zerg units            every unit
//   node scripts/card-audit/show-app.mjs zerg units roach queen
//   node scripts/card-audit/show-app.mjs protoss cards         faction and tactical cards
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../../', import.meta.url);
const window = {};
for (const f of ['terran-data.js', 'zerg-data.js', 'protoss-data.js', 'wave3-data.js'])
  vm.runInNewContext(fs.readFileSync(new URL(f, root), 'utf8'), { window, document: { addEventListener() {} } });
const [faction, what, ...ids] = process.argv.slice(2);
const D = window['SCTMG_' + String(faction || '').toUpperCase()];
if (!D || !['units', 'cards'].includes(what)) {
  console.log('usage: node scripts/card-audit/show-app.mjs <terran|zerg|protoss> <units|cards> [ids…]');
  process.exit(1);
}
const slots = s => Object.entries(s || {}).map(([k, v]) => v + '× ' + k).join(', ');
if (what === 'cards') {
  for (const c of [...D.FACTION_CARDS.map(c => ({ ...c, faction: true })), ...D.TACTICAL_CARDS]) {
    if (ids.length && !ids.includes(c.id)) continue;
    console.log(`\n## ${c.name}${c.faction ? ' [faction card]' : ''}${c.unique ? ' UNIQUE' : ''} | ${c.resource || '-'} | slots: ${slots(c.slots) || '-'} | gas ${c.cost ?? '-'}${c.factionTag ? ' | needs ' + c.factionTag : ''}`);
    for (const a of c.abilities || []) console.log(`  - ${a.name} [${a.phase}] ${a.type}${a.cost ? ' ' + a.cost : ''}: ${a.description}`);
  }
} else {
  for (const u of D.UNITS) {
    if (ids.length && !ids.includes(u.id)) continue;
    const s = u.stats || {};
    console.log(`\n## ${u.name} (${u.id}) ${u.role}${u.unique ? ' UNIQUE' : ''}${u.factionTag ? ' | needs ' + u.factionTag : ''}`);
    console.log(`  SPD ${s.speed} · ARM ${s.armour} · EVD ${s.evade} · HP ${s.hp}${s.shield ? ' · SHD ' + s.shield : ''} · SIZE ${s.size} | models→supply ${u.tiers.map(t => t.models + '→' + t.supply).join('  ')}`);
    console.log(`  tags: ${(u.tags || []).join(', ')}`);
    for (const w of u.weapons || []) console.log(`  W [${w.phase}] ${w.name}: RNG ${w.range} ${w.target} RoA ${w.roa} Hit ${w.hit} Surge ${w.surge} ${w.sDie} Dmg ${w.damage} | ${(w.keywords || []).join(', ') || '-'}${w.replaces ? ' (replaces ' + w.replaces + ')' : ''}`);
    for (const a of u.abilities || []) console.log(`  A [${a.phase || 'Any'}] ${a.name} {${a.type}}: ${a.description}`);
    for (const [ph, list] of Object.entries(u.phaseAbilities || {})) for (const a of list) console.log(`  A [${ph}] ${a.name} {${a.type}}: ${a.description}`);
    for (const [ph, list] of Object.entries(u.upgrades || {})) for (const a of list) console.log(`  U [${ph}] ${a.name} {${a.type}} (${a.cost}m): ${a.description}`);
  }
}
