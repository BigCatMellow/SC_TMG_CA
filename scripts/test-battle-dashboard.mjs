// Two-card Battle dashboard regression: summaries, modal controls, per-faction state.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const styles=read('shared-styles.css');
for(const cls of [
 '.sc-battle-overview','.sc-battle-overview-card--tactical',
 '.sc-battle-overview-card--troops','.sc-battle-panel-overlay',
 '.sc-battle-panel-dialog','.sc-battle-panel-scroll','.sc-battle-panel-close'
]) assert.ok(styles.includes(cls),'missing summary/modal CSS '+cls);
assert.match(styles,/max-height:\s*calc\(100dvh/,'sheets fit usable phone viewport');
assert.match(styles,/overflow-y:\s*auto/,'long roster and card lists can scroll inside sheet');
assert.match(styles,/overscroll-behavior:\s*contain/,'modal scrolling stays inside sheet');
const world={alert(){},scrollY:0,scrollTo(){},addEventListener(){},removeEventListener(){}};
for(const file of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js','codex-examples.js'])
 vm.runInNewContext(read(file),{window:world},{filename:file});
for(const faction of ['terran','zerg','protoss']){
 const file=faction[0].toUpperCase()+faction.slice(1)+' Army.dc.html';
 const html=read(file);
 const start=html.indexOf('<!-- ============ BATTLE TAB ============ -->');
 const end=html.indexOf('<!-- ============ LIBRARY TAB ============ -->',start);
 assert.ok(start>=0&&end>start,file+' Battle section boundaries');
 const battle=html.slice(start,end);
 const inline=battle.slice(0,battle.indexOf('    <sc-if value="{{ sheetBattleTactical }}"'));
 const tactical=battle.slice(battle.indexOf('    <sc-if value="{{ sheetBattleTactical }}"'),
   battle.indexOf('    <sc-if value="{{ sheetBattleTroops }}"'));
 const troops=battle.slice(battle.indexOf('    <sc-if value="{{ sheetBattleTroops }}"'));
 assert.equal((inline.match(/class="sc-battle-overview-card sc-battle-overview-card--/g)||[]).length,2,
   file+' only two summary cards');
 for(const binding of ['openBattleTactical','openBattleTroops','battleCardsReady','battleCardsTotal',
   'battleCardsExhausted','paymentTotal','paymentResource','battleTroopsOnTable','battleTroopsTotal',
   'battleModelsRemaining','battleModelsTotal','battleSupplyRemaining'])
   assert.ok(inline.includes('{{ '+binding+' }}')||inline.includes('onClick="{{ '+binding+' }}"'),
     file+' missing summary binding '+binding);
 assert.ok(!inline.includes('list="{{ battleCards }}"'),file+' tactical cards should only be in modal');
 assert.ok(!inline.includes('list="{{ battleGroups }}"'),file+' unit cards should only be in modal');
 assert.ok(!inline.includes('onClick="{{ battleSupplyDown }}"'),file+' no inline supply controls');
 assert.ok(tactical.includes('list="{{ battleCards }}"'),file+' tactical details preserved');
 for(const action of ['tc.onResource','tc.onAbility','tc.onReady','tc.onExpand',
   'refreshTactical','finishResourcePayment'])
   assert.ok(tactical.includes('onClick="{{ '+action+' }}"'),
     file+' missing tactical action '+action);
 for(const action of ['battleSupplyDown','battleSupplyUp','toggleArmyEdit','u.onChangeTier',
   'u.onRemove','u.onToggleDeployed','u.onLossDown','u.onLossUp','u.onToggle','gotoLibrary'])
   assert.ok(troops.includes('onClick="{{ '+action+' }}"'),file+' missing troop control '+action);
 assert.equal((troops.match(/onClick="\{\{ u\.onChangeTier \}\}"/g)||[]).length,1,
   file+' tier control exactly once');
 assert.ok(troops.indexOf('<sc-if value="{{ editArmy }}"') <
   troops.indexOf('<sc-if value="{{ u.expanded }}"'),
   file+' change tier and remove should be directly accessible in Edit Army mode');
 for(const [section,label] of [[tactical,'Tactical'],[troops,'Troops']]){
   assert.ok(section.includes('role="dialog" aria-modal="true"'),
     file+' '+label+' accessible modal');
   assert.ok(section.includes('onClick="{{ closeBattlePanel }}"'),
     file+' '+label+' close control');
 }
 const script=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,file+' controller not found');
 class Stub{
   setState(next,callback){
     this.state={...this.state,...(typeof next==='function'?next(this.state):next)};
     callback?.();
   }
 }
 const Controller=new Function('DCLogic','window',script+'\nreturn Component;')(Stub,world);
 const c=new Controller();
 c._secEls={};
 let saves=0;
 c.save=()=>{saves++;};
 c.state={...c.state,ready:true,tab:'battle'};
 const view=()=>c.renderVals();
 assert.equal(c.state.battlePanel,null);
 assert.equal(view().sheetBattleTactical,false);
 assert.equal(view().sheetBattleTroops,false);
 assert.equal(view().battleTroopsTotal,0);
 assert.equal(view().battleTroopsOnTable,0);
 assert.equal(view().battleModelsRemaining,0);
 assert.equal(view().battleModelsTotal,0);
 assert.equal(view().battleCardsTotal,1,'Selected faction card exists when no units bought');
 assert.equal(view().battleCardsReady,1);
 assert.equal(view().battleCardsExhausted,0);
 assert.equal(view().paymentTotal,0);
 // Available even for an empty army; no energy/actions should disappear.
 view().openBattleTactical();
 assert.equal(view().sheetBattleTactical,true);
 assert.equal(view().sheetBattleTroops,false);
 view().battleFaction.onResource();
 assert.equal(view().battleCardsReady,0);
 assert.equal(view().battleCardsExhausted,1);
 assert.ok(view().paymentTotal>0,'Resource payment updates dashboard without closing modal');
 view().finishResourcePayment();
 assert.equal(view().paymentTotal,0,'Pending resources are not banked');
 assert.equal(view().battleCardsExhausted,1,'Payment does not Ready card');
 view().refreshTactical();
 assert.equal(view().battleCardsReady,1);
 assert.equal(view().battleCardsExhausted,0);
 view().closeBattlePanel();
 assert.equal(view().sheetBattleTactical,false);
 // Switching between panels opens exactly one.
 view().openBattleTactical();
 view().openBattleTroops();
 assert.equal(view().sheetBattleTactical,false);
 assert.equal(view().sheetBattleTroops,true);
 // Troops summary tracks the SAME model state used by existing battle cards.
 const D=c.D();
 const unit=D.UNITS.find(u=>u.role!=='Other'&&u.tiers?.some(t=>t.cost>0));
 assert.ok(unit);
 const tierIdx=unit.tiers.findIndex(t=>t.cost>0);
 c.state.army=[{key:'battle-summary-test',unitId:unit.id,tierIdx,upgs:[],modelsLost:0,deployed:false}];
 const troop=()=>view().battleGroups.flatMap(g=>g.entries)[0];
 const original=view().battleModelsTotal;
 assert.ok(original>0);
 assert.equal(view().battleTroopsTotal,1);
 assert.equal(view().battleTroopsOnTable,0);
 assert.equal(view().battleModelsRemaining,original);
 const ev={stopPropagation(){}};
 troop().onToggleDeployed(ev);
 assert.equal(view().battleTroopsOnTable,1,'Deployment summary updates');
 troop().onLossDown(ev);
 assert.equal(view().battleModelsRemaining,original-1,'Casualty summary updates');
 assert.equal(view().battleTroopsTotal,1);
 assert.ok(saves>0,'Combat changes remain saved');
 // Editing remains safe by default; opening and closing sheet resets edit state.
 assert.equal(view().editArmy,false);
 view().toggleArmyEdit();
 assert.equal(view().editArmy,true);
 troop().onChangeTier(ev);
 assert.equal(c.state.sheet.type,'tier','Tier editor is layered above Troops sheet');
 assert.equal(c.state.sheet.entryKey,'battle-summary-test');
 assert.equal(view().sheetBattleTroops,true,'Tier picker should not dismiss parent sheet');
 view().closeSheet();
 assert.equal(c.state.sheet,null);
 assert.equal(view().sheetBattleTroops,true,'Closing tier picker returns to Troops');
 view().closeBattlePanel();
 assert.equal(view().editArmy,false,'Closing Troops exits destructive edit mode');
 assert.equal(view().sheetBattleTroops,false);
 view().openBattleTroops();
 assert.equal(view().editArmy,false,'Reopening Troops should not leave Edit Army on');
 view().toggleArmyEdit();
 troop().onRemove(ev);
 assert.equal(view().battleTroopsTotal,0);
 assert.equal(view().battleEmpty,true);
 assert.equal(view().sheetBattleTroops,true,'Empty-state library link remains accessible');
 view().gotoLibrary();
 assert.equal(c.state.tab,'library');
 assert.equal(view().sheetBattleTroops,false);
 assert.equal(c.state.editArmy,false);
 // Tab navigation cannot leave a stale modal on another screen.
 c.state.tab='battle';
 view().openBattleTactical();
 view().tabs.find(t=>t.label==='Codex').onSelect();
 assert.equal(view().sheetBattleTactical,false);
 assert.equal(c.state.battlePanel,null);
 assert.equal(c.state.tab,'codex');
 console.log(faction+': summary totals, both sheets, nested tier, energy and troop editing passed');
}
console.log('Two-card Battle dashboard validated across all factions');
