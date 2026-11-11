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
 const inline=battle.slice(0,battle.indexOf('    <sc-if value="{{ sheetBattleTactical }}"'));
 const tactical=battle.slice(battle.indexOf('    <sc-if value="{{ sheetBattleTactical }}"'),
   battle.indexOf('<section class="sc-battle-troops"'));
 const troops=battle.slice(battle.indexOf('<section class="sc-battle-troops"'));
 assert.ok(troops.length>0,file+' Troops are inline on the Battle tab');
 assert.ok(!battle.includes('sheetBattleTroops'),file+' Troops no longer hide in a sheet');
 assert.equal((inline.match(/class="sc-battle-overview-card sc-battle-overview-card--/g)||[]).length,0,
   file+' no summary card: cards are tap-to-spend chips');
 for(const token of ['list="{{ cardChips }}"','onClick="{{ cc.onTap }}"','onClick="{{ openBattleTactical }}"',
   'onClick="{{ openMission }}"','onClick="{{ openEndRound }}"'])
   assert.ok(inline.includes(token),file+' play strip missing '+token);
 // Card abilities are readable straight from the Battle tab: one tap opens the text.
 for(const token of ['list="{{ cc.abilities }}"','onClick="{{ ca.onOpen }}"','class="{{ cc.rowCls }}"'])
   assert.ok(inline.includes(token),file+' inline card abilities missing '+token);
 assert.ok(html.includes('onClick="{{ sheetAction }}"'),file+' ability sheet can use the card');
 assert.ok(!/<div class="sc-model-stepper">\s*<div class="sc-model-stepper">/.test(html),file+' stepper markup nested once');
 // One supply recorder: the header strip opens the pool sheet; no second stepper inline.
 assert.ok(!inline.includes('{{ battleSupplyDown }}'),file+' supply pool is adjusted in one place only');
 const poolSheet=html.slice(html.indexOf('<sc-if value="{{ sheetPool }}"'),html.indexOf('<!-- ============ MISSION SHEET ============ -->'));
 for(const token of ['onClick="{{ battleSupplyDown }}"','onClick="{{ battleSupplyUp }}"','onClick="{{ usePoolSuggestion }}"'])
   assert.ok(poolSheet.includes(token),file+' pool sheet missing '+token);
 assert.equal((html.match(/\{\{ battleSupplyDown \}\}/g)||[]).length,1,file+' exactly one pool stepper');
 const header=html.slice(html.indexOf('<!-- play HUD, scoreboard layout'),
   html.indexOf('<!-- ============ BATTLE TAB ============ -->'));
 const scoreboard=header.indexOf('class="{{ scoreboardClass }}"');
 const supplyStrip=header.indexOf('class="{{ battleSupplyStripClass }}"');
 const resources=header.indexOf('class="{{ resourceStripClass }}"');
 assert.ok(scoreboard>=0 && supplyStrip>scoreboard && resources>supplyStrip,
   file+' supply readout must sit between scoreboard and build resources');
 assert.ok(header.slice(scoreboard,supplyStrip).includes('</div></div>'),
   file+' original scoreboard remains intact');
 assert.ok(header.includes('<sc-if value="{{ tabIsBattle }}"'),
   file+' supply strip should only appear in Battle');
 for(const binding of ['battleSupplyUsed','battleSupplyAvailable','battleSupplyRemaining',
   'battleSupplyFreeClass','battleSupplyAria','openPool']){
   assert.ok(header.includes('{{ '+binding+' }}') || header.includes('onClick="{{ '+binding+' }}"'),
     file+' Battle-only supply row missing '+binding);
 }
 for(const token of ['list="{{ u.play.weapons }}"','list="{{ u.play.abilities }}"','list="{{ u.play.stats }}"','onClick="{{ pa.onOpen }}"'])
   assert.ok(troops.includes(token),file+' unit play view missing '+token);
 for(const token of ['class="{{ u.cardClass }}"','<div class="sc-lib-card-bg"></div>','class="sc-lib-head"','list="{{ u.tags }}"','class="sc-unit-sup"','class="sc-lib-list"'])
   assert.ok(troops.includes(token),file+' battle cards should match Library cards: '+token);
 assert.ok(!troops.includes('{{ u.cost }}'),file+' mineral cost is not shown on battle cards');
 for(const sheet of ['sheetMission','sheetEndRound']) assert.ok(html.includes('{{ '+sheet+' }}'),file+' missing '+sheet);
 // Roster problems are one line on the Battle tab; the issue sheet lists each fix.
 assert.ok(inline.includes('class="sc-roster-line"')&&inline.includes('onClick="{{ openIssues }}"'),file+' one-line roster alert');
 assert.ok(html.includes('list="{{ rosterIssues }}"')&&html.includes('onClick="{{ issue.onFix }}"'),file+' issue sheet lists each fix');
 assert.ok(!inline.includes('Fits ·')&&!html.includes("'Fits · needs '"),file+' no "Fits" line when a unit fits');
 for (const label of ['Deployment','Supply','Used','Pool','Free'])
   assert.ok(header.includes('>'+label+'</span>'),
     file+' supply HUD missing clearly labeled '+label+' field');
 assert.ok(battle.indexOf('sc-battle-overview-card--tactical')<battle.indexOf('<section class="sc-battle-troops"'),
   file+' Tactical summary must appear above Troops');
 for(const binding of ['openBattleTactical','battleCardsReady','battleCardsTotal',
   'paymentTotal','paymentResource'])
   assert.ok(inline.includes('{{ '+binding+' }}')||inline.includes('onClick="{{ '+binding+' }}"'),
     file+' missing summary binding '+binding);
 assert.ok(!inline.includes('list="{{ battleCards }}"'),file+' tactical cards should only be in modal');
 assert.ok(troops.includes('list="{{ battleGroups }}"'),file+' unit cards are inline in Troops');
 assert.ok(!tactical.includes('list="{{ battleGroups }}"'),file+' unit cards are not in the Tactical modal');
 assert.ok(tactical.includes('list="{{ battleCards }}"'),file+' tactical details preserved');
 for(const action of ['tc.onResource','tc.onAbility','tc.onReady','tc.onExpand',
   'refreshTactical','finishResourcePayment'])
   assert.ok(tactical.includes('onClick="{{ '+action+' }}"'),
     file+' missing tactical action '+action);
 for(const action of ['toggleArmyEdit','u.onChangeTier',
   'u.onRemove','u.onSetReserve','u.onSetDeployed','u.onLossDown','u.onLossUp','u.onToggle','gotoLibrary'])
   assert.ok(troops.includes('onClick="{{ '+action+' }}"'),file+' missing troop control '+action);
 assert.equal((troops.match(/onClick="\{\{ u\.onChangeTier \}\}"/g)||[]).length,1,
   file+' tier control exactly once');
 assert.ok(troops.indexOf('<sc-if value="{{ editArmy }}"') <
   troops.indexOf('class="sc-play-body"'),
   file+' change tier and remove should be directly accessible in Edit Army mode');
 assert.ok(tactical.includes('role="dialog" aria-modal="true"'),file+' Tactical accessible modal');
 assert.ok(tactical.includes('onClick="{{ closeBattlePanel }}"'),file+' Tactical close control');
 for(const flag of ['tc.showResource','tc.showAbility','tc.showPassive'])
   assert.ok(tactical.includes('{{ '+flag+' }}'),file+' card actions use precomputed '+flag);
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
   assert.match(chip0().cls,/--spent/);
   chip0().onTap();
   assert.equal(view().battleFaction.tapped,false,'Chip readies a spent card');
 }
 view().finishResourcePayment();
 // One tap on an ability name opens its text; usable abilities offer the exhaust action there.
 const fcard=c.D().FACTION_CARDS.find(x=>x.id===c.state.factionId);
 const expectedAbilities=fcard.abilities.filter(a=>!/^\s*during army building\b/i.test(a.description||''));
 assert.deepEqual([...chip0().abilities.map(a=>a.name)],[...expectedAbilities.map(a=>a.name)],'army-building passives hidden in play');
 const usableIdx=expectedAbilities.findIndex(a=>/\b(Active|Reaction)\b/i.test(a.type||'')&&!/do not exhaust this card/i.test(a.description||''));
 if(usableIdx>=0){
   chip0().abilities[usableIdx].onOpen();
   assert.equal(view().sheetKeyword,true);
   assert.equal(view().sheetBody,expectedAbilities[usableIdx].description);
   assert.match(view().sheetActionLabel,/use ability/);
   assert.ok(view().sheetHasSegs,'ability text has tappable keywords');
   const kw=view().sheetSegs.find(sg=>sg.kw);
   if(kw){ kw.onOpen({stopPropagation(){}}); assert.equal(view().sheetCloseLabel,'Back'); view().closeSheet();
     assert.equal(view().sheetBody,expectedAbilities[usableIdx].description,'Back returns to the ability'); }
   view().sheetAction();
   assert.equal(view().sheetKeyword,false);
   assert.equal(view().battleFaction.tapped,true,'Using the ability exhausts the card');
   chip0().onTap();
   assert.equal(view().battleFaction.tapped,false);
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
 // Upgrades can be bought from Battle › Edit Army and cost minerals.
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
