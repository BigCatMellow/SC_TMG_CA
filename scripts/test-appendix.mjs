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
vm.runInNewContext(load('model-portraits.js'), {window});
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
// Three Wave 2 unit/card profiles must agree with publisher cost+card exports.
const wave2 = [
  ['terran','siege-tank',220,2,'factory-tech-lab',40],
  ['zerg','ravager',160,1,'cocoon',30],
  ['protoss','immortal',280,2,'robotics-facility',35]
];
for(const [f,id,cost,supply,card,gas] of wave2){
 const d=window['SCTMG_'+f.toUpperCase()];
 const u=d.UNITS.find(u=>u.id===id);
 const t=d.TACTICAL_CARDS.find(t=>t.id===card);
 assert.ok(u && t,f+' Wave 2 content');
 assert.equal(u.wave,2);
 assert.ok(u.tiers.some(x=>x.cost===cost&&x.supply===supply));
 assert.equal(t.cost,gas);
 assert.ok(u.weapons.length>=2 && (u.abilities.length + Object.values(u.phaseAbilities).flat().length)>=2);
}
// Battle tracker model counts and upgrade costs use the same tier selection as the roster.
for(const faction of ['Terran','Zerg','Protoss']){
 const html=load(faction+' Army.dc.html');
 assert.match(html,/usedSlots\[u\.role\.toLowerCase\(\)\] \+= \(u\.tiers\[e\.tierIdx\]\?\.supply \|\| 0\)/);
 assert.match(html,/this\.upgCostNum\(u\.cost, e\.tierIdx\)/);
 assert.match(html,/unit\.role === 'Other'/);
 assert.match(html,/unit\.unique \&\& this\.state\.army\.some/);
}
assert.ok(checks.units>=25 && checks.compositions>=30 && checks.upgrades>=50 && checks.tactical>=34);
// Instantiate all three Army components without DOM to test copies, timing state and legality.
for(const faction of ['terran','zerg','protoss']){
 const pretty=faction[0].toUpperCase()+faction.slice(1);
 const html=load(pretty+' Army.dc.html');
 const inline=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
 assert.ok(inline,pretty+' screen has an inline controller');
 class DCLogic {
   setState(update,done){
     const next=typeof update==='function'?update(this.state):update;
     this.state={...this.state,...next};
     if(done)done();
   }
 }
 const Component=new Function('DCLogic','window',inline[1]+'\nreturn Component;')(DCLogic,window);
 const obj=new Component();
 obj.save=()=>{};obj._secEls={};
 const d=window['SCTMG_'+faction.toUpperCase()];
 const nonunique=d.TACTICAL_CARDS.find(x=>!x.unique);
 const unique=d.TACTICAL_CARDS.find(x=>x.unique);
 obj.state={...obj.state,ready:true,tab:'tactics',army:[],tactical:[nonunique.id,nonunique.id],tacticalTapped:[nonunique.id+'#1'],savedRosters:[],play:{round:1,phase:0,vpYou:0,vpFoe:0}};
 const ui=obj.renderVals();
 const cards=ui.battleTactical.filter(x=>x.id===nonunique.id);
 assert.equal(cards.length,2,pretty+' supports duplicate nonunique Tactical Cards');
 assert.equal(cards[0].tapped,false);
 assert.equal(cards[1].tapped,true);
 const selected=ui.tacticalGroups.flatMap(x=>x.cards);
 const entry=selected.find(x=>x.name===nonunique.name);
 assert.equal(entry.count,2);
 entry.onRemove({stopPropagation(){}});
 assert.equal(obj.state.tactical.length,1);
 assert.equal(obj.state.tacticalTapped.length,0);
 entry.onAdd({stopPropagation(){}});
 assert.equal(obj.state.tactical.length,2);
 const one=selected.find(x=>x.name===unique.name);
 one.onAdd({stopPropagation(){}});
 one.onAdd({stopPropagation(){}});
 assert.equal(obj.state.tactical.filter(x=>x===unique.id).length,1);
}

// Verify current loadout changes the visible weapon rows rather than only a checkbox.
const expectedWeapons = [
 ['terran','goliath',['Scatter Missiles'],['Scatter Missiles'],['Hellfire Missiles']],
 ['terran','marine',['AGG-12','Rocket Launcher'],['C-14 Rifle','AGG-12','Rocket Launcher'],[]],
 ['terran','jim-raynor',['C-14 Rifle'],['C-14 Rifle'],['Commando Rifle']],
 ['zerg','raptor',['Shredding Claws'],['Shredding Claws'],['Claws']],
 ['protoss','immortal',['Right Phase Disruptor'],['Right Phase Disruptor','Left Photon Disruptor'],['Right Photon Disruptor']],
 ['protoss','adept',['Glaive Strike','Guidance'],['Glaive Strike'],['Strike']]
];
const controllers={};
for(const f of ['terran','zerg','protoss']){
 const html=load(f[0].toUpperCase()+f.slice(1)+' Army.dc.html');
 const script=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script);
 class Stub {setState(up,cb){const v=typeof up==='function'?up(this.state):up;this.state={...this.state,...v};if(cb)cb();}}
 const Component=new Function('DCLogic','window',script+'\nreturn Component;')(Stub,window);
 const obj=new Component();obj.save=()=>{};
 obj.state={...obj.state,ready:true,army:[],tactical:[],play:{round:1,phase:0,vpYou:0,vpFoe:0}};
 controllers[f]=obj;
}
for(const [f,id,selected,shown,hidden] of expectedWeapons){
 const c=controllers[f],unit=c.D().UNITS.find(u=>u.id===id);
 assert.ok(unit);
 const weapons=c.buildDetail(unit,{unitId:id,key:'test',tierIdx:1,upgs:selected}).weapons.map(w=>w.name);
 for(const name of shown)assert.ok(weapons.includes(name),f+'/'+id+' missing '+name);
 for(const name of hidden)assert.ok(!weapons.includes(name),f+'/'+id+' did not replace '+name);
}
const terran=controllers.terran;
terran.state.army=[{key:'g',unitId:'goliath',tierIdx:1,upgs:['Scatter Missiles']}];
terran.toggleUpgrade('g','Haywire Missiles');
assert.deepEqual(terran.state.army[0].upgs,['Haywire Missiles'],'mutually exclusive replacements');
assert.equal(terran.upgCostNum('20/40',0),40,'large composition uses higher upgrade price');
assert.equal(terran.upgCostNum('20/40',1),20,'small composition uses lower upgrade price');

console.log('October 2026 source validation passed:',checks);
