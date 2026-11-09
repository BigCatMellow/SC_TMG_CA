// Validate every cost-table row against the companion's actual data (October 2026 publisher balance).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const load = p => fs.readFileSync(new URL(p, root), 'utf8');
const ref = JSON.parse(load('agent-rules/appendix-2026.json'));
assert.equal(ref.balance_source.published, '2026-10-09');
const window = {};
for (const f of ['terran','zerg','protoss']) vm.runInNewContext(load(f+'-data.js'),{window});
function maximumModels(x){return Number(String(x).match(/\d+(?=\D*$)/)?.[0]||0)}
const missing = [], checks = {units:0,compositions:0,upgrades:0,tactical:0};
for (const faction of ['terran','zerg','protoss']){
 const actual = window['SCTMG_'+faction.toUpperCase()];
 const source = ref.factions[faction];
 for (const [id,row] of Object.entries(source.units)){
  const u = actual.UNITS.find(u=>u.id===id);
  if(!u){missing.push(faction+':'+id);continue}
  checks.units++;
  for (const [models,cost,supply] of row.compositions){
    assert.ok(u.tiers.some(t=>t.cost===cost&&t.supply===supply&&maximumModels(t.models)===models),faction+'/'+id+': '+models+' models / '+cost+' minerals / '+supply+' supply');
    checks.compositions++;
  }
  const upgrades=Object.values(u.upgrades||{}).flat();
  for(const [name,costs] of Object.entries(row.upgrades)){
    const entry=upgrades.find(x=>x.name===name);
    assert.ok(entry,faction+'/'+id+': missing upgrade '+name);
    const expected=costs.join('/');
    assert.equal(String(entry.cost),expected,faction+'/'+id+' '+name);
    checks.upgrades++;
  }
 }
 for(const [id,cost] of Object.entries(source.tactical)){
   const t=actual.TACTICAL_CARDS.find(c=>c.id===id);
   assert.ok(t,faction+' missing Tactical Card '+id);
   assert.equal(t.cost,cost,faction+'/'+id+' tactical cost');
   checks.tactical++;
 }
}
assert.deepEqual(missing,[],'All currently listed Wave 1 faction units should be available');
// Battle tracker model counts and upgrade costs use the same tier selection as the roster.
for(const faction of ['Terran','Zerg','Protoss']){
 const html=load(faction+' Army.dc.html');
 assert.match(html,/usedSlots\[u\.role\.toLowerCase\(\)\] \+= \(u\.tiers\[e\.tierIdx\]\?\.supply \|\| 0\)/);
 assert.match(html,/this\.upgCostNum\(u\.cost, e\.tierIdx\)/);
 assert.match(html,/unit\.role === 'Other'/);
 assert.match(html,/unit\.unique \&\& this\.state\.army\.some/);
}
assert.ok(checks.units>=22 && checks.compositions>=26 && checks.upgrades>=40 && checks.tactical>=31);
console.log('October 2026 source validation passed:',checks);
