// Verify Roster tab consolidation without losing army setup or editing functions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const worlds = {};
for(const faction of ['terran','zerg','protoss']){
  const screen = faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html';
  const html = read(screen);
  const factionAt=html.indexOf('<!-- ============ BROOD (FACTION) TAB ============ -->');
  const codexAt=html.indexOf('<!-- ============ CODEX TAB ============ -->',factionAt);
  const battleAt=html.indexOf('<!-- ============ BATTLE TAB ============ -->');
  const libraryAt=html.indexOf('<!-- ============ LIBRARY TAB ============ -->',battleAt);
  const navAt=html.indexOf('<!-- ============ BOTTOM TAB BAR ============ -->');
  assert.ok(factionAt>=0&&codexAt>factionAt&&battleAt>=0&&libraryAt>battleAt&&navAt>codexAt);
  const setup=html.slice(factionAt,codexAt);
  const battle=html.slice(battleAt,libraryAt);
  const nav=html.slice(navAt,html.indexOf('<!-- ============ KEYWORD / TAG SHEET ============ -->',navAt));
  assert.ok(!html.includes('<!-- ============ ROSTER TAB ============ -->'),faction+' retired Roster view');
  assert.ok(!html.includes('tabIsRoster')&&!html.includes('tb.isRoster'),faction+' no hidden Roster tab');
  assert.ok(setup.includes('Battle Size')&&setup.includes('list="{{ scales }}"'),
    faction+' engagement size selector on first faction tab');
  assert.equal((html.match(/list="\{\{ scales \}\}"/g)||[]).length,1,
    faction+' exactly one engagement size selector');
  const opened=/<sc-if value="\{\{ u.expanded \}\}"[\s\S]*?<button onClick="\{\{ u.onChangeTier \}\}"[\s\S]*?<button onClick="\{\{ u.onRemove \}\}"/;
  assert.match(battle,opened,faction+' tier/removal controls are in the opened unit, no Edit Army mode');
  assert.ok(!battle.includes('onClick="{{ u.stepDown }}"')&&!battle.includes('onClick="{{ u.toggleDeploy }}"'),faction+' game tracking lives in VS, not Roster');
  assert.ok(battle.includes('list="{{ cardChips }}"'),faction+' Roster lists the cards');
  assert.ok(battle.includes('Add units from the Library'),faction+' empty state has correct navigation');
  assert.ok(!nav.includes('tb.isRoster'),faction+' Roster icon removed');
  for(const action of ['openRosters','exportArmySheet','saveCurrentAsRoster','triggerImport']){
    assert.ok(html.includes('onClick="{{ '+action+' }}"'),faction+' '+action+' accessible');
  }
  for(const file of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js']){
    if(!worlds[faction])worlds[faction]={alert(){},scrollY:0,scrollTo(){},addEventListener(){},removeEventListener(){}};
    vm.runInNewContext(read(file),{window:worlds[faction]},{filename:file});
  }
  const world=worlds[faction];
  const script=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,faction+' controller source');
  class Stub{
    setState(next,cb){
      this.state={...this.state,...(typeof next==='function'?next(this.state):next)};
      cb?.();
    }
  }
  const Controller=new Function('DCLogic','window',script+'\nreturn Component;')(Stub,world);
  const controller=new Controller();
  let saves=0;
  controller.save=()=>{saves++;};
  controller._secEls={};
  controller.state={...controller.state,ready:true};
  const view=()=>controller.renderVals();
  assert.equal(controller.state.tab,'faction',faction+' default opens first tab');
  assert.equal(controller.state.scaleId,'standard',faction+' existing default size');
  assert.deepEqual(view().tabs.map(t=>t.label),
    [faction==='terran'?'Command':faction==='protoss'?'Nexus':'Brood',
      'Library','Tactics','Roster','VS','Codex'],faction+' six navigation tabs (VS opens the scoreboard)');
  const D=controller.D();
  const engagementScales=D.ENGAGEMENT_SCALES;
  assert.equal(view().scales.length,3,faction+' all engagement sizes available');
  for(const id of ['skirmish','standard','grand']){
    const selected=view().scales.find(x=>x.name.toLowerCase()===id);
    assert.ok(selected,faction+' can choose '+id);
    selected.onSelect();
    assert.equal(controller.state.scaleId,id,faction+' selected engagement size');
    const data=engagementScales.find(x=>x.id===id);
    assert.ok(data,faction+' data source for '+id);
    assert.equal(view().mineralsCap,id==='grand'?'∞':data.minerals);
    assert.equal(view().gasCap,id==='grand'?'∞':data.gas);
  }
  assert.ok(saves>=3,faction+' size selection saves existing roster');
  // Add an army entry, then edit it through the same card used for battle tracking.
  const unit=D.UNITS.find(u=>u.role!=='Other'&&u.tiers?.some(t=>t.cost>0));
  assert.ok(unit,faction+' recruitable unit available');
  const tierIdx=unit.tiers.findIndex(t=>t.cost>0);
  controller.state.army=[{key:'unified-army-test',unitId:unit.id,tierIdx,upgs:[],
    modelsLost:0,deployed:false}];
  controller.state.tab='battle';
  const battleUnit=()=>view().battleGroups.flatMap(g=>g.entries).find(x=>x.key==='unified-army-test');
  assert.ok(battleUnit(),faction+' existing unit appears in Battle');
  assert.equal(view().editArmy,false,faction+' editing disabled by default');
  assert.equal(view().editArmyLabel,'Edit Army');
  view().toggleArmyEdit();
  assert.equal(view().editArmy,true,faction+' explicit edit mode');
  assert.equal(view().editArmyLabel,'Done Editing');
  const ev={stopPropagation(){}};
  battleUnit().onChangeTier(ev);
  assert.equal(controller.state.sheet?.type,'tier',faction+' tier editor reachable');
  assert.equal(controller.state.sheet?.mode,'change',faction+' change not add');
  assert.equal(controller.state.sheet?.entryKey,'unified-army-test');
  controller.state.sheet=null;
  if(unit.tiers.filter(t=>t.cost>0).length>1){
    const second=unit.tiers.findIndex((t,i)=>i!==tierIdx&&t.cost>0);
    controller.changeTier('unified-army-test',second);
    assert.equal(controller.state.army[0].tierIdx,second,
      faction+' changes tier through existing method');
  }
  // Read-only battle controls, roster manager, and saved armies remain usable.
  assert.equal(typeof battleUnit().onLossDown,'function');
  assert.equal(typeof battleUnit().onToggleDeployed,'function');
  view().openRosters();
  assert.equal(view().sheetRosters,true,faction+' saved roster manager accessible');
  assert.equal(typeof view().exportArmySheet,'function',faction+' print/export accessible');
  controller.state.sheet=null;
  battleUnit().onRemove(ev);
  assert.equal(controller.state.army.length,0,faction+' remove unit from Battle');
  assert.equal(view().battleEmpty,true);
  // Moving to another tab exits editing and never exposes a non-existent Roster tab.
  view().tabs.find(t=>t.label==='Library').onSelect();
  assert.equal(controller.state.tab,'library');
  assert.equal(controller.state.editArmy,false);
  assert.ok(view().tabs.every(t=>t.id!=='roster'));
  // Library Quick build: tap a tier to add; upgrades toggle on the army rows.
  assert.ok(html.includes('list="{{ quickTiles }}"')&&html.includes('list="{{ quickRows }}"')&&html.includes('list="{{ r.upgrades }}"'),faction+' quick build template');
  view().setLibQuick();
  assert.equal(view().libQuick,true,faction+' quick view on');
  for(const q of view().quickTiles){const ls=q.tiers.map(t=>t.label);assert.equal(ls.join(),[...ls].sort().join(),faction+' '+q.name+' tiers low to high');}
  const tileQ=view().quickTiles.find(q=>q.tiers.some(t=>!t.off));
  tileQ.tiers.find(t=>!t.off).add();
  assert.equal(controller.state.army.length,1,faction+' quick tier adds a unit');
  view().quickTiles.find(q=>q.count).onCard(); assert.equal(view().qbInfoOpen,true,faction+' model opens its info sheet');
  assert.ok(view().qbInfo.detail.stats.length>0,faction+' info sheet has stats'); view().closeQbInfo();
  const nBefore=controller.state.army.length; view().quickTiles.find(q=>q.count).onMinus();
  assert.equal(controller.state.army.length,nBefore-1,faction+' −1 removes one'); tileQ.tiers.find(t=>!t.off).add();
  view().openQbSheet(); assert.equal(view().qbSheet,true,faction+' your army opens as a sheet');
  const rowQ=view().quickRows[0];
  if(rowQ.hasUpgrades){
    rowQ.onUpg(); assert.equal(view().quickRows[0].open,true,faction+' upgrades open on the row');
    view().quickRows[0].upgrades[0].onToggle(ev);
    assert.equal(controller.state.army[0].upgs.length,1,faction+' quick upgrade toggles');
  }
  controller.state.army=[]; view().setLibCards();
  console.log(faction+': first-tab engagement sizes, Battle editing and existing management passed');
}
console.log('Roster tab consolidation checks passed for all factions');
