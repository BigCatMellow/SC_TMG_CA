// Regression checks for the PDF-grounded battle reference and retained faction data.
// Run from project root: npm run test:rules
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const w = {};
for (const p of ['terran-data.js','zerg-data.js','protoss-data.js','rules-data.js','battle-rules-data.js']) {
  vm.runInNewContext(read(p), { window: w }, { filename: p });
}
assert.equal(w.SCTMG_BATTLE_RULES.sections.length, 18);
const r = w.SCTMG_BATTLE_RULES.sections;
assert.equal(new Set(r.map(s => s.id)).size, r.length);
assert.equal(r.filter(s => s.scope === 'core').length, 15);
for (const f of ['terran','zerg','protoss']) {
  assert.equal(r.filter(s => s.scope === f).length, 1);
  assert.ok(w['SCTMG_' + f.toUpperCase()].UNITS.length > 0, f + ' units load');
}
for (const s of r) {
  assert.ok(s.sourceLabel && s.groups.length, s.id + ' has PDF citations and groups');
  assert.ok(s.groups.every(g => g.items.length && g.items.every(it => it.t.length > 5)), s.id + ' has text');
}
const terran = w.SCTMG_TERRAN.KEYWORDS;
const zerg = w.SCTMG_ZERG.KEYWORDS;
const protoss = w.SCTMG_PROTOSS.KEYWORDS;
for(const dict of [terran,protoss]) assert.match(dict.PIERCE.description, /Damage characteristic as X/);
for(const dict of [terran,zerg,protoss]) assert.match(dict.INSTANT.description, /cannot declare or resolve Reaction/);
assert.match(terran['NON-LETHAL DAMAGE'].description, /Subsequent standard Damage/);
assert.match(protoss['PSIONIC ENERGY'].description, /PE to pay ability costs/);
const rawProtoss = read('protoss-data.js');
assert.doesNotMatch(rawProtoss, /\bEN\b/);
assert.match(rawProtoss, /\bPE\b/);

const html = read('Rules.dc.html');
assert.match(html,/battle-rules-data\.js/);
assert.match(html,/factionTabs/);
assert.match(html,/sourceLabel/);
const inline = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
assert.ok(inline, 'DC script exists');
const DCLogic = class { setState(next){ this.state = {...this.state,...next}; } };
const Component = new Function('DCLogic','window',inline[1]+'\nreturn Component;')(DCLogic,w);
const c = new Component();
c._secEls = {};
c.state = {ready:true,scope:'core',exp:{},q:'',sheet:null,play:{round:1,phase:0,vpYou:0,vpFoe:0}};
for (const scope of ['core','terran','zerg','protoss']) {
  c.state.scope = scope;
  const rendered = c.renderVals();
  assert.equal(rendered.sections.length, scope === 'core' ? 15 : 16);
  assert.equal(rendered.factionTabs.filter(t=>t.active).length,1);
  assert.ok(rendered.sourceBanner.length > 30);
}
c.state.scope = 'protoss';
c.state.q = 'shield';
assert.ok(c.renderVals().sections.some(s=>s.name === 'Protoss Field Reference'));
console.log('Battle rules and faction source checks passed');
