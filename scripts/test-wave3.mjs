// Regression coverage for the live Wave 3 companion overlay (not NotebookLM data).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const load=p=>fs.readFileSync(new URL(p,root),'utf8');
const w={alert(){}};
for(const f of ['terran','zerg','protoss'])vm.runInNewContext(load(f+'-data.js'),{window:w});
vm.runInNewContext(load('wave3-data.js'),{window:w});
const expected={
 terran:{
  units:{'nova-stealth':[240,1,1],'nova-assault':[260,1,1],'spec-ops-marauder':[230,2,1],raven:[170,1,1]},
  summoned:['holo-decoy','sabotage-drone','auto-turret'],
  faction:'nova-covert-ops',
  tactical:{'vanadium-plating':25}
 },
 zerg:{
  units:{zagara:[250,1,1],defiler:[130,1,1],vileling:[180,18,2],'bile-launcher':[150,1,1]},
  summoned:[],
  faction:'zagaras-swarm',
  tactical:{'defiler-mound':35,'reactive-creep':10}
 },
 protoss:{
  units:{tassadar:[230,1,1],'twilight-templar':[230,2,1],'high-templar':[200,4,2]},
  summoned:[],
  faction:'templar-caste',
  tactical:{'templar-archives':40}
 }
};
const maxModels=unit=>Number(String(unit.models).match(/\d+(?=\D*$)/)?.[0]||0);
let purchasable=0, cards=0;
for(const [f,expectedSet] of Object.entries(expected)){
 const d=w['SCTMG_'+f.toUpperCase()];
 assert.ok(d,'faction dataset '+f);
 const unitIds=d.UNITS.map(x=>x.id);
 const cardIds=d.TACTICAL_CARDS.map(x=>x.id);
 assert.equal(new Set(unitIds).size,unitIds.length,'duplicate unit '+f);
 assert.equal(new Set(cardIds).size,cardIds.length,'duplicate tactical '+f);
 assert.ok(d.FACTION_CARDS.some(x=>x.id===expectedSet.faction),'new faction '+f);
 for(const [id,[cost,models,supply]]of Object.entries(expectedSet.units)){
  const u=d.UNITS.find(x=>x.id===id);
  assert.ok(u,'missing '+f+' unit '+id);
  assert.equal(u.wave,3);
  assert.ok(u.tiers.some(t=>t.cost===cost&&maxModels(t)===models&&t.supply===supply),
   'incorrect current unit cost/supply '+f+'/'+id);
  assert.ok(u.weapons.length && (u.abilities.length+Object.values(u.phaseAbilities).flat().length)>0,
   'incomplete '+f+' unit '+id);
  purchasable++;
 }
 for(const id of expectedSet.summoned){
  const u=d.UNITS.find(x=>x.id===id);
  assert.ok(u && u.summonedOnly && u.role==='Other','summoned-only '+id);
  assert.ok(!u.tiers.some(t=>t.cost>0),'summoned Unit must not be purchasable');
 }
 for(const [id,cost]of Object.entries(expectedSet.tactical)){
  const card=d.TACTICAL_CARDS.find(x=>x.id===id);
  assert.ok(card && card.cost===cost,'tactical cost '+f+'/'+id);
  cards++;
 }
 const html=load(f[0].toUpperCase()+f.slice(1)+' Army.dc.html');
 assert.ok(html.indexOf('src="'+f+'-data.js"')!==-1,'base data import');
 assert.ok(html.indexOf('src="wave3-data.js"')>html.indexOf('src="'+f+'-data.js"'),'overlay after base');
 const script=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,'army component present');
 class Stub {
  setState(up,done){const v=typeof up==='function'?up(this.state):up;this.state={...this.state,...v};done?.();}
 }
 const Controller=new Function('DCLogic','window',script+'\nreturn Component;')(Stub,w);
 const c=new Controller();
 c.save=()=>{};c._secEls={};
 c.state={...c.state,ready:true,army:[],tactical:[],play:{round:1,phase:0,vpYou:0,vpFoe:0}};
 c.state.factionId=expectedSet.faction;
 const view=c.renderVals();
 assert.ok(view.ready!==false,'render '+f);
 for(const [id]of Object.entries(expectedSet.units)){
  assert.ok(c.D().UNITS.some(u=>u.id===id),'controller does not expose '+id);
 }
 if(f==='terran'){
  c.state.army=[{key:'a',unitId:'nova-stealth',tierIdx:1,upgs:[]}];
  c.addUnit(c.D().UNITS.find(u=>u.id==='nova-assault'));
  assert.equal(c.state.army.length,1,'Nova mutually exclusive in add');
  c.state.army.push({key:'b',unitId:'nova-assault',tierIdx:1,upgs:[]});
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('Mutually exclusive')),'saved Nova duplicate warning');
  c.state.army=[{key:'c',unitId:'spec-ops-marauder',tierIdx:1,upgs:[]}];
  c.state.factionId='terran-armed-forces';
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('requires')),'Nova spec ops wrong-faction warning');
 }
 if(f==='zerg'){
  c.state.factionId='zerg-swarm';
  c.state.army=[{key:'v',unitId:'vileling',tierIdx:0,upgs:[]}];
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('requires')),'Vileling wrong-faction warning');
  c.state.factionId='zagaras-swarm';
  c.state.army=[];
  const creep=c.D().TACTICAL_CARDS.find(x=>x.id==='reactive-creep');
  const other=c.D().TACTICAL_CARDS.find(x=>x.id==='malignant-creep');
  let select=c.renderVals().tacticalGroups.flatMap(g=>g.cards);
  const label=creep.name;
  let entry=select.find(x=>x.name===label);
  assert.ok(entry.canAdd,'Reactive Creep selectable for Zagara');
  entry.onAdd({stopPropagation(){}});
  assert.ok(c.state.tactical.includes(creep.id));
  select=c.renderVals().tacticalGroups.flatMap(g=>g.cards);
  entry=select.find(x=>x.name===other.name);
  assert.equal(entry.canAdd,false,'second Creep Card blocked');
  entry.onAdd({stopPropagation(){}});
  assert.equal(c.state.tactical.length,1,'second Creep Card not added');
  c.state.tactical.push(other.id);
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('exactly one Zerg Creep')),
   'saved duplicate Creep warning');
  c.state.tactical=[creep.id];c.state.factionId='zerg-swarm';
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('Card')&&x.includes('requires')),
   'Zagara-only creep wrong-faction warning');
 }
 if(f==='protoss'){
  c.state.factionId='daelaam';
  c.state.army=[{key:'t',unitId:'twilight-templar',tierIdx:1,upgs:[]}];
  assert.ok(c.renderVals().rosterWarnings.some(x=>x.includes('requires')),'Twilight Templar wrong-faction warning');
 }
}
const rules=load('Rules.dc.html');
assert.ok(rules.includes('wave3-data.js'),'rules must load current cards');
assert.ok(purchasable>=11 && cards===4,'expected new Wave 3 catalogue');
console.log('Live Wave 3 companion passed:',purchasable,'purchasable units,',cards,'cards, 3 factions');
