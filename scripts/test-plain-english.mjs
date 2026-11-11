// Plain-English summaries must point at real abilities and stay short.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const w = {}; w.window = w;
for (const f of ['zerg-data.js', 'terran-data.js', 'protoss-data.js', 'wave3-data.js', 'plain-english.js']) vm.runInNewContext(read(f), w);
const names = new Set();
for (const D of [w.SCTMG_ZERG, w.SCTMG_TERRAN, w.SCTMG_PROTOSS]) {
  for (const c of [...D.FACTION_CARDS, ...D.TACTICAL_CARDS]) (c.abilities || []).forEach(a => names.add(a.name));
  for (const u of D.UNITS) {
    (u.abilities || []).forEach(a => names.add(a.name));
    Object.values(u.phaseAbilities || {}).forEach(list => list.forEach(a => names.add(a.name)));
  }
}
const plain = w.SCTMG_PLAIN;
assert.ok(Object.keys(plain).length >= 40, 'at least 40 summaries');
for (const [name, text] of Object.entries(plain)) {
  assert.ok(names.has(name), 'summary for unknown ability: ' + name);
  assert.ok(text.length > 20 && text.length <= 240, name + ' summary should be one or two short sentences');
}
for (const F of ['Zerg', 'Terran', 'Protoss']) {
  const html = read(F + ' Army.dc.html');
  assert.ok(html.includes('<script src="plain-english.js"></script>'), F + ' loads summaries');
  assert.ok(html.includes('{{ sheetPlain }}') && html.includes('list="{{ sheetSegs }}"'), F + ' ability sheet shows summary and tappable keywords');
}
console.log('Plain-English summaries: ' + Object.keys(plain).length + ' checked.');
