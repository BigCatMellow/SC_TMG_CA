// Keyword glossary checks against the 2026 Core Rules (Part 11).
// Every weapon keyword a unit uses must have a definition in its faction's glossary,
// and definitions that were once wrong stay matched to the rulebook.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const load = p => fs.readFileSync(new URL(p, root), 'utf8');
const window = {};
for (const f of ['terran', 'zerg', 'protoss']) vm.runInNewContext(load(f + '-data.js'), { window });
vm.runInNewContext(load('wave3-data.js'), { window });

const base = kw => String(kw).toUpperCase().replace(/\s*\(.*$/, '').replace(/\s+\d.*$/, '')
  .replace(/ (ARMOURED|LIGHT|MASSIVE|BIOLOGICAL|MECHANICAL|PSIONIC)$/, '').replace(/\s+\d+"?$/, '').trim();
for (const key of ['SCTMG_TERRAN', 'SCTMG_ZERG', 'SCTMG_PROTOSS']) {
  const D = window[key], names = Object.keys(D.KEYWORDS);
  for (const u of D.UNITS) for (const w of u.weapons || []) for (const kw of w.keywords || []) {
    const b = base(kw);
    assert.ok(names.some(n => b === n || b.startsWith(n)), `${key} ${u.name} ${w.name}: "${kw}" has no glossary entry`);
  }
  const K = D.KEYWORDS;
  if (K.BULKY) assert.match(K.BULKY.description, /Ranged Attack while the Unit is Engaged/, key + ' BULKY (Part 11)');
  if (K.DODGE) assert.match(K.DODGE.description, /Surge or CRITICAL HIT/, key + ' DODGE (Part 11)');
  if (K.SPECIALIST) assert.match(K.SPECIALIST.description, /only one model equipped/, key + ' SPECIALIST (Part 11)');
  if (K['INDIRECT FIRE']) assert.match(K['INDIRECT FIRE'].description, /Evade Roll/, key + ' INDIRECT FIRE (Part 11)');
  if (K.PRECISION) assert.match(K.PRECISION.description, /including Surge/, key + ' PRECISION (Part 11)');
}
console.log('Keyword glossary checks passed.');
