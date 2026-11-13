// Battle tab regression: Tactical summary + modal, inline Troops, per-faction state.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const styles=read('shared-styles.css');
for(const cls of [
 '.sc-battle-overview','.sc-battle-overview-card--tactical',
 '.sc-battle-troops','.sc-deploy-switch','.sc-model-stepper','.sc-battle-panel-overlay',
 '.sc-battle-panel-dialog','.sc-battle-panel-scroll','.sc-battle-panel-close'
]) assert.ok(styles.includes(cls),'missing summary/modal CSS '+cls);
assert.match(styles,/\.sc-battle-overview\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s,
  'Battle summary cards should stack full-width');
assert.match(styles,/max-height:\s*calc\(100dvh/,'sheets fit usable phone viewport');
assert.match(styles,/\.sc-battle-overview-card\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*\.9fr\)\s+minmax\(0,\s*1\.1fr\)/s,
  'Battle cards have an embedded right-hand preview');
assert.match(styles,/\.sc-battle-preview-row--exhausted\s*\{\s*opacity:\s*\.38;/,
  'Unavailable tactical cards must fade rather than disappear');
assert.match(styles,/\.sc-battle-supply-strip--compact\s*\{\s*min-height:\s*44px;/,
  'Compact deployment supply stays at least 44px tall');
assert.match(styles,/\.sc-battle-supply-strip\s*\{[^}]*min-height:\s*56px;/s,
  'Normal deployment supply uses a legible 56px bar');
for (const selector of ['.sc-battle-supply-stat-label', '.sc-battle-supply-stat-number',
  '.sc-battle-supply-heading', '.sc-battle-supply-free--over'])
  assert.ok(styles.includes(selector),'Supply HUD CSS missing: '+selector);
assert.match(styles,/overflow-y:\s*auto/,'long roster and card lists can scroll inside sheet');
assert.match(styles,/overscroll-behavior:\s*contain/,'modal scrolling stays inside sheet');
const world={alert(){},scrollY:0,scrollTo(){},addEventListener(){},removeEventListener(){}};
for(const file of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js','codex-examples.js','missions-data.js','plain-english.js'])
 vm.runInNewContext(read(file),{window:world},{filename:file});
for(const faction of ['terran','zerg','protoss']){
 const file=faction[0].toUpperCase()+faction.slice(1)+' Army.dc.html';
 const html=read(file);
 const start=html.indexOf('<!-- ============ BATTLE TAB ============ -->');
 const end=html.indexOf('<!-- ============ LIBRARY TAB ============ -->',start);
 assert.ok(start>=0&&end>start,file+' Battle section boundaries');
 const battle=html.slice(start,end);
 // The Battle tab is now Roster: army management only. Game tracking lives in VS.
 const header=html.slice(html.indexOf('<!-- play HUD, scoreboard layout'),html.indexOf('<!-- ============ BATTLE TAB ============ -->'));
 assert.ok(!header.includes('battleSupplyStripClass'),file+' no deployment strip on Roster');
 assert.ok(header.includes('class="{{ resourceStripClass }}"')&&header.includes('class="{{ slotStripClass }}"'),file+' Roster shows army totals and slots');
 for(const gone of ['openMission','openEndRound','openBattleTactical','sheetBattleTactical','cc.onTap','ca.onUse','u.toggleDeploy','u.stepDown','u.stepUp','u.pips','u.hpSegs'])
   assert.ok(!battle.includes('{{ '+gone+' }}'),file+' Roster has no game control '+gone);
 // Cards: faction card and picks, abilities readable inline.
 for(const token of ['list="{{ cardChips }}"','list="{{ cc.abilities }}"','onClick="{{ ca.onToggle }}"','class="{{ cc.rowCls }}"','{{ rosterCardsNote }}'])
   assert.ok(battle.includes(token),file+' roster cards missing '+token);
 const troops=battle.slice(battle.indexOf('<section class="sc-battle-troops"'));
 assert.ok(troops.length>0,file+' units are inline on the Roster tab');
 for(const token of ['list="{{ battleGroups }}"','class="{{ u.rowCls }}"','class="sc-bu-row"','list="{{ u.tags }}"','class="sc-vs-sup"','class="sc-bu-list"','{{ u.rosterLine }}',
   'list="{{ u.play.weapons }}"','list="{{ u.play.abilities }}"','list="{{ u.play.stats }}"','onClick="{{ pa.onOpen }}"'])
   assert.ok(troops.includes(token),file+' roster unit rows missing '+token);
 for(const action of ['u.onChangeTier','u.onRemove','u.onToggle','gotoLibrary'])
   assert.ok(troops.includes('onClick="{{ '+action+' }}"'),file+' missing roster control '+action);
 assert.equal((troops.match(/onClick="\{\{ u\.onChangeTier \}\}"/g)||[]).length,1,file+' tier control exactly once');
 // Editing is always on: open a unit to change tier, upgrades or remove it. No Edit Army mode.
 assert.ok(!troops.includes('{{ editArmy }}')&&!troops.includes('toggleArmyEdit'),file+' no Edit Army mode on Roster');
 assert.ok(troops.indexOf('class="sc-ro-edit"')>troops.indexOf('<sc-if value="{{ u.expanded }}"'),file+' edit controls sit in the opened unit');
 assert.ok(!troops.includes('{{ u.cost }}'),file+' mineral cost is not shown on roster rows');
 // Roster problems are one line at the top; the issue sheet lists each fix.
 assert.ok(battle.includes('class="sc-roster-line"')&&battle.includes('onClick="{{ openIssues }}"'),file+' one-line roster alert');
 assert.ok(html.includes('list="{{ rosterIssues }}"')&&html.includes('onClick="{{ issue.onFix }}"'),file+' issue sheet lists each fix');
 assert.ok(!/\{\{[^}]*&&[^}]*\}\}/.test(html),file+' templates cannot evaluate &&');
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
 assert.equal(view().tacticalPreview.length,1,'Faction Card should appear in tactical preview');
 assert.equal(view().tacticalPreview[0].name,view().battleFaction.name);
 assert.equal(view().tacticalPreview[0].ready,1);
 assert.equal(view().tacticalPreview[0].total,1);
 assert.equal(view().battleTroopsEmpty,true);
 assert.equal(view().troopPreview.length,0);
 assert.equal(view().battleSupplyUsed,0);
 assert.equal(view().battleSupplyRemaining,view().battleSupplyAvailable);
 assert.match(view().battleSupplyAria,/Deployment supply:/);
 assert.equal(view().battleSupplyStripClass,'sc-battle-supply-strip');
 c.state.resourcesCompact=true;
 assert.equal(view().battleSupplyStripClass,'sc-battle-supply-strip sc-battle-supply-strip--compact');
 c.state.resourcesCompact=false;
 // Available even for an empty army; no energy/actions should disappear.
 view().openBattleTactical();
 assert.equal(view().sheetBattleTactical,true);
 assert.equal(view().sheetBattleTroops,false);
 view().battleFaction.onResource();
 assert.equal(view().battleCardsReady,0);
 assert.equal(view().battleCardsExhausted,1);
 assert.equal(view().tacticalPreview[0].ready,0);
 assert.match(view().tacticalPreview[0].className,/--exhausted$/,
   'Exhausted card must dim on Battle overview');
 assert.ok(view().paymentTotal>0,'Resource payment updates dashboard without closing modal');
 view().finishResourcePayment();
 assert.equal(view().paymentTotal,0,'Pending resources are not banked');
 assert.equal(view().battleCardsExhausted,1,'Payment does not Ready card');
 view().refreshTactical();
 assert.equal(view().battleCardsReady,1);
 assert.equal(view().battleCardsExhausted,0);
 assert.equal(view().tacticalPreview[0].ready,1);
 assert.doesNotMatch(view().tacticalPreview[0].className,/--exhausted/);
 // Same tactical card selected twice should have one line with correct ready count.
 const duplicateCard=c.D().TACTICAL_CARDS.find(t=>!t.unique && t.resource);
 assert.ok(duplicateCard,faction+' nonunique tactical card available');
 c.state.tactical=[duplicateCard.id,duplicateCard.id];
 assert.equal(view().battleCardsTotal,3);
 assert.equal(view().tacticalPreview.length,2);
 let aggregate=view().tacticalPreview.find(t=>t.name===duplicateCard.name);
 assert.equal(aggregate.total,2);
 assert.equal(aggregate.ready,2);
 view().battleTactical[0].onResource();
 aggregate=view().tacticalPreview.find(t=>t.name===duplicateCard.name);
 assert.equal(aggregate.ready,1);
 assert.equal(aggregate.total,2);
 view().battleTactical[1].onResource();
 aggregate=view().tacticalPreview.find(t=>t.name===duplicateCard.name);
 assert.equal(aggregate.ready,0);
 assert.match(aggregate.className,/--exhausted$/);
 // Roster cards show the army slots they give; copies add up, the faction card is the base.
 const slotCard=c.D().TACTICAL_CARDS.find(t=>!t.unique && Object.values(t.slots||{}).some(v=>v>0));
 if(slotCard){
   c.state.tactical=[slotCard.id,slotCard.id];
   const sc=view().cardChips.find(x=>x.name===slotCard.name);
   const [k,v]=Object.entries(slotCard.slots).find(([,v])=>v>0);
   assert.ok(sc.slotPills.some(p=>p.text==='+'+(v*2)+' '+k[0].toUpperCase()+k.slice(1)),faction+' tactical slots shown, doubled for two copies');
   assert.ok(view().cardChips[0].slotPills.every(p=>!p.text.startsWith('+')),faction+' faction card shows its base slots');
 }
 view().refreshTactical();
 c.state.tactical=[];
 view().closeBattlePanel();
 assert.equal(view().sheetBattleTactical,false);
 // Jumping to Troops closes the Tactical panel and stays on Battle.
 view().openBattleTactical();
 view().openBattleTroops();
 assert.equal(view().sheetBattleTactical,false);
 view().openPool();
 assert.equal(view().sheetPool,true);
 view().closeSheet();
 assert.equal(view().sheetPool,false);
 assert.equal(view().sheetBattleTroops,false);
 assert.equal(c.state.tab,'battle');
 // Card actions only show when they apply.
 const fv=view().battleFaction;
 assert.equal(fv.showResource,fv.hasResource,'Pay action only for cards that produce resource');
 assert.equal(fv.showPassive,!fv.hasResource&&!fv.canUseAbility);
 view().battleFaction.onAbility();
 const tappedView=view().battleFaction;
 assert.equal(tappedView.showResource||tappedView.showAbility||tappedView.showPassive,false,
   'Exhausted cards only offer Ready');
 view().refreshTactical();
 // Card chips: tap a ready card to spend it, tap again to ready it.
 const chip0=()=>view().cardChips[0];
 assert.equal(chip0().name,view().battleFaction.name);
 if (view().battleFaction.hasResource) {
   chip0().onTap();
   assert.equal(view().battleFaction.tapped,true,'Chip spends a ready card');
   assert.ok(view().paymentTotal>0,'Spent resource counts toward the payment');
   chip0().onTap();
   assert.equal(view().battleFaction.tapped,false,'Chip readies a spent card');
 }
 view().finishResourcePayment();
 // Abilities are visible with a summary; one tap opens the full text in place, one tap on Use exhausts the card.
 const fcard=c.D().FACTION_CARDS.find(x=>x.id===c.state.factionId);
 const expectedAbilities=fcard.abilities.filter(a=>!/^\s*during army building\b/i.test(a.description||''));
 assert.deepEqual([...chip0().abilities.map(a=>a.name)],[...expectedAbilities.map(a=>a.name)],'army-building passives hidden in play');
 for(const a of chip0().abilities) assert.ok(a.summary,'every ability has a one-line summary');
 const usableIdx=expectedAbilities.findIndex(a=>/\b(Active|Reaction)\b/i.test(a.type||'')&&!/do not exhaust this card/i.test(a.description||''));
 chip0().abilities[0].onToggle();
 assert.equal(chip0().abilities[0].open,true,'tap shows the full text in place');
 assert.equal(view().sheetKeyword,false,'no pop-up needed to read an ability');
 chip0().abilities[0].onToggle();
 if(usableIdx>=0){
   assert.equal(chip0().abilities[usableIdx].usable,true);
   chip0().abilities[usableIdx].onUse();
   assert.equal(view().battleFaction.tapped,true,'Use exhausts the card in one tap');
   assert.equal(chip0().abilities[usableIdx].usable,false,'no Use on an exhausted card');
   chip0().onTap();
   assert.equal(view().battleFaction.tapped,false,'Ready brings it back');
 }
 // Regression: tier-2 Zerglings have twelve models, not one roster-card.
 if (faction==='zerg') {
   const zergling=c.D().UNITS.find(u=>u.id==='zergling');
   assert.ok(zergling,'The Zergling fixture exists');
   const t2=zergling.tiers.findIndex(t=>t.tier==='T2');
   assert.ok(t2>=0,'The T2 Zergling tier exists');
   assert.equal(c.unitStartingModels(zergling,t2),12);
   c.state.army=[{key:'zergling-check',unitId:zergling.id,tierIdx:t2,
     upgs:[],modelsLost:0,deployed:false}];
   assert.equal(view().troopPreview[0].name,'Zergling');
   assert.equal(view().troopPreview[0].modelsRemaining,12);
   c.setModelsLost('zergling-check',1);
   assert.equal(view().troopPreview[0].modelsRemaining,11);
   c.state.army=[];
 }
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
 assert.equal(view().troopPreview.length,1);
 assert.equal(view().troopPreview[0].name,unit.name);
 assert.equal(view().troopPreview[0].count,1);
 assert.equal(view().troopPreview[0].modelsRemaining,original,
   'Troop preview shows individual miniatures for a roster entry');
 assert.equal(view().troopPreview[0].onTable,0);
 assert.match(view().troopPreview[0].className,/--reserve$/);
 // Same unit name is summarized into one row with a visible count.
 c.state.army=[...c.state.army,{
   key:'battle-summary-copy',unitId:unit.id,tierIdx,upgs:[],
   modelsLost:0,deployed:false
 }];
 assert.equal(view().troopPreview.length,1);
 assert.equal(view().troopPreview[0].count,2);
 assert.equal(view().troopPreview[0].modelsRemaining,original*2,
   'Two identical units add their miniature counts, not two roster entries');
 assert.equal(view().troopPreview[0].onTable,0);
 // Restore the single-unit fixture used by the remainder of the old tests.
 c.state.army=c.state.army.filter(e=>e.key==='battle-summary-test');
 const ev={stopPropagation(){}};
 assert.equal(troop().inReserve,true);
 assert.equal(troop().atFull,true,'Restore is disabled at full strength');
 c.state.battleSupplyAvailable=0;
 assert.equal(troop().deployDisabled,troop().supply>0,'Cannot deploy without free supply');
 c.state.battleSupplyAvailable=20;
 troop().onSetReserve(ev);
 assert.equal(view().battleTroopsOnTable,0,'Reserve on a reserve unit is a no-op');
 troop().onSetDeployed(ev);
 assert.equal(view().battleTroopsOnTable,1,'Deployment summary updates');
 troop().onSetDeployed(ev);
 assert.equal(view().battleTroopsOnTable,1,'Deployed on a deployed unit is a no-op');
 assert.equal(view().troopPreview[0].onTable,1);
 assert.match(view().troopPreview[0].className,/--deployed$/);
 assert.equal(view().battleSupplyUsed,troop().supply);
 assert.equal(view().battleSupplyRemaining,
   Math.max(0,view().battleSupplyAvailable-view().battleSupplyUsed));
 const prevPool=view().battleSupplyAvailable;
 view().battleSupplyUp();
 assert.equal(view().battleSupplyAvailable,prevPool+1,
   'Deployment supply adjustment should update header readout');
 assert.equal(view().battleSupplyRemaining,
   Math.max(0,prevPool+1-view().battleSupplyUsed));
 troop().onLossDown(ev);
 assert.equal(view().battleModelsRemaining,original-1,'Casualty summary updates');
 assert.equal(view().troopPreview[0].modelsRemaining,original-1,
   'Troop preview decreases automatically when a miniature is lost');
 assert.equal(view().battleTroopsTotal,1);
 assert.ok(saves>0,'Combat changes remain saved');
 // Editing remains safe by default; opening and closing sheet resets edit state.
 assert.equal(view().editArmy,false);
 view().toggleArmyEdit();
 assert.equal(view().editArmy,true);
 troop().onChangeTier(ev);
 assert.equal(c.state.sheet.type,'tier','Tier editor opens from Troops');
 assert.equal(c.state.sheet.entryKey,'battle-summary-test');
 view().closeSheet();
 assert.equal(c.state.sheet,null);
 assert.equal(c.state.tab,'battle','Closing tier picker returns to Battle');
 view().tabs.find(t=>t.label==='Codex').onSelect();
 assert.equal(view().editArmy,false,'Leaving Battle exits destructive edit mode');
 c.state.tab='battle';
 view().toggleArmyEdit();
 troop().onRemove(ev);
 assert.equal(view().battleTroopsTotal,0);
 assert.equal(view().battleEmpty,true);
 assert.equal(view().battleTroopsEmpty,true);
 assert.equal(view().troopPreview.length,0);
 assert.equal(view().battleEmpty,true,'Empty-state library link remains accessible');
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
  // Mission drives the supply pool; End round bundles the once-a-round updates.
 const mission=world.SCTMG_MISSIONS.MISSIONS.find(m=>m.id==='supply-drop');
 c.state.missionId=mission.id; c.state.play={round:1,phase:2,vpYou:0,vpFoe:0}; c.state.sheet=null;
 assert.equal(view().hudMission,mission.name,'Header shows the mission, not a phase');
 assert.equal(view().poolSuggestion,mission.supply,'Round 1 pool comes from the mission');
 view().usePoolSuggestion();
 assert.equal(c.state.battleSupplyAvailable,mission.supply);
 if (view().battleFaction.hasResource) view().battleFaction.onResource();
 view().openEndRound();
 assert.equal(view().sheetEndRound,true);
 view().confirmEndRound();
 assert.equal(c.state.play.round,2,'End round advances the round');
 assert.equal(c.state.play.phase,0,'End round resets the phase');
 assert.equal(c.state.factionTappedId,null,'End round readies exhausted cards');
 assert.equal(c.state.battleSupplyAvailable,mission.supply+mission.perRound,'End round raises the pool');
 c.state.play={...c.state.play,round:mission.gameLength};
 const before={...c.state.play};
 view().confirmEndRound();
 assert.equal(c.state.play.round,before.round,'Final round does not advance past the mission length');
 c.state.missionId=null; c.state.play={round:1,phase:0,vpYou:0,vpFoe:0};
 // Units are grouped by where they are, not by role.
 const groups=view().battleGroups.map(g=>g.role);
 assert.ok(groups.every(g=>['On table','Reserves','Destroyed'].includes(g)),'Battle groups are table state: '+groups);
 // ---- playtest fixes ----
 // Round tracker: no Round +; End round goes through the real flow.
 assert.ok(!html.includes('onClick="{{ roundUp }}"'),faction+' tracker has no Round + shortcut');
 assert.ok(html.includes('onClick="{{ trackerEndRound }}"'),faction+' tracker ends the round properly');
 view().trackerEndRound();
 assert.equal(view().sheetEndRound,true,'Tracker End round opens the End round sheet');
 view().closeSheet();
 // Duplicate tactical cards are one row.
 const DD=c.D();
 const multi=DD.TACTICAL_CARDS.find(t=>!t.unique&&t.category!=='creep'&&(!t.factionTag||t.factionTag===(DD.FACTION_CARDS.find(f=>f.id===c.state.factionId)||DD.FACTION_CARDS[0]).name));
 if(multi){
   const keep=c.state.tactical; c.state.tactical=[multi.id,multi.id];
   const rows=view().cardChips.filter(r=>r.name===multi.name);
   assert.equal(rows.length,1,'two copies of '+multi.name+' show as one row');
   assert.match(rows[0].count,/\u00d72/);
   c.state.tactical=keep;
 }
 // Locked choices say why.
 const lib=view().libraryGroups.flatMap(g=>g.entries);
 for(const en of lib) if(!en.recruitable && !en.inArmy) assert.ok(en.lockReason||en.addTitle,faction+' '+en.name+' locked without a reason');
 const tagged=DD.UNITS.find(u=>u.factionTag&&u.factionTag!==(DD.FACTION_CARDS.find(f=>f.id===c.state.factionId)||DD.FACTION_CARDS[0]).name&&u.tiers.some(t=>t.cost>0));
 if(tagged){ const en=lib.find(x=>x.name===tagged.name); assert.equal(en.lockReason,'Requires '+tagged.factionTag); }
 // Search finds abilities.
 const anyAbility=DD.UNITS.flatMap(u=>u.abilities||[]).find(a=>a.name&&a.name.length>4);
 c.state.searchQ=anyAbility.name.slice(0,6);
 assert.ok(view().searchGroups.some(g=>/Abilities/.test(g.name)),faction+' search finds abilities like '+anyAbility.name);
 c.state.searchQ='';
 // Upgrades can be bought from Roster (open the unit) and cost minerals.
 const upUnit=DD.UNITS.find(u=>Object.keys(u.upgrades||{}).length&&u.tiers.some(t=>t.cost>0)&&!u.factionTag);
 if(upUnit){
   const tierIdx=upUnit.tiers.findIndex(t=>t.cost>0);
   c.state.army=[{key:'kup',unitId:upUnit.id,tierIdx,upgs:[],modelsLost:0,deployed:false}];
   const before=view().mineralsUsed;
   const card=view().battleGroups.flatMap(g=>g.entries).find(u=>u.key==='kup');
   assert.ok(card.hasUpgrades,'Battle card lists upgrades');
   const paid=card.upgrades.find(x=>parseInt(x.cost,10)>0);
   if(paid){ paid.onToggle({stopPropagation(){}});
     assert.equal(view().mineralsUsed,before+parseInt(paid.cost,10),'Buying an upgrade spends its tier cost'); }
   c.state.army=[];
 }
 // Phone back closes the top overlay: sheet first (back to the ability it came from), then the panel.
 c.state.battlePanel='tactical'; c.state.sheet={type:'keyword',title:'K',returnTo:{type:'keyword',title:'A'}};
 c.closeTopOverlay(); assert.equal(c.state.sheet.title,'A','back returns to the ability sheet');
 c.closeTopOverlay(); assert.equal(c.state.sheet,null);
 c.closeTopOverlay(); assert.equal(c.state.battlePanel,null,'then closes the card panel');
 // Floating section tab: every long list marks its sections; the tab opens a jump menu.
 for(const token of ['data-sec="{{ grp.role }}"','data-sec="{{ grp.secLabel }}"','data-sec="Cards"','onClick="{{ toggleSecMenu }}"','onClick="{{ si.onJump }}"'])
   assert.ok(html.includes(token),faction+' section tab missing '+token);
 // ---- playtest fixes 2 ----
 {
   const DD2=c.D();
   const big=DD2.UNITS.find(u=>u.tiers.some(t=>t.cost>0&&String(t.models)==='1')&&!u.factionTag&&Number(u.stats&&u.stats.hp)>1);
   if(big){
     const ti=big.tiers.findIndex(t=>t.cost>0&&String(t.models)==='1');
     c.state.army=[{key:'kd',unitId:big.id,tierIdx:ti,upgs:[],modelsLost:0,deployed:false}];
     let card=view().battleGroups.flatMap(g=>g.entries).find(u=>u.key==='kd');
     assert.ok(card.tracksDamage,big.name+' tracks damage');
     const pool=card.dmgPool;
     for(let i=0;i<pool;i++) view().battleGroups.flatMap(g=>g.entries).find(u=>u.key==='kd').onDmgUp({stopPropagation(){}});
     assert.equal(c.state.army[0].modelsLost,1,'filling the damage pool removes a model');
     assert.equal(c.state.army[0].dmg,0);
     // Undo a removal
     card=view().battleGroups.flatMap(g=>g.entries).find(u=>u.key==='kd');
     card.onRemove({stopPropagation(){}});
     assert.equal(c.state.army.length,0);
     assert.equal(view().undoOn,true);
     view().undoRemove();
     assert.equal(c.state.army.length,1,'Undo restores the unit');
     assert.equal(c.state.army[0].modelsLost,1,'Undo keeps its battle state');
     clearTimeout(c._undoTimer);
     // Changing tier resets casualties
     c.changeTier('kd',ti);
     assert.equal(c.state.army[0].modelsLost,0,'tier change resets casualties');
     c.state.army=[];
   }
 }
 console.log(faction+': Tactical summary + modal, inline Troops, payment, deploy and troop editing passed');
}
console.log('Battle tab validated across all factions');
