// Battle cards: ability reference, deliberate Exhaust/Ready, and non-bankable CP/BM/PE payment.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const styles = read('shared-styles.css');
const rules = read('rules-data.js');
assert.match(rules, /Resources generated for one ability \*\*cannot be saved\*\*/);
for (const className of [
  'sc-battle-payment','sc-battle-card-header','sc-battle-card-abilities',
  'sc-battle-card-ability-description','sc-battle-card-action--resource'
]) assert.ok(styles.includes('.' + className), className + ' CSS missing');

const units = ['terran','zerg','protoss'];
const expectedResource = { terran: 'CP', zerg: 'BM', protoss: 'PE' };
const parse = value => Number(String(value || '').match(/^\+(\d+)\s+(CP|BM|PE)$/)?.[1] || 0);
const world = { alert() {} };
for (const file of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js'])
  vm.runInNewContext(read(file), { window: world }, { filename: file });

for (const faction of units) {
  const file = faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html';
  const html = read(file);
  const battleStart = html.indexOf('<!-- ============ BATTLE TAB ============ -->');
  const battleEnd = html.indexOf('<!-- ============ LIBRARY TAB ============ -->', battleStart);
  assert.ok(battleStart > 0 && battleEnd > battleStart, faction + ' battle markup boundaries');
  const battleHtml = html.slice(battleStart,battleEnd);
  for (const binding of [
    'list="{{ battleCards }}"','{{ ab.name }}','{{ ab.description }}','{{ ab.meta }}',
    'onClick="{{ tc.onExpand }}"','onClick="{{ tc.onResource }}"',
    'onClick="{{ tc.onAbility }}"','onClick="{{ tc.onReady }}"',
    'onClick="{{ finishResourcePayment }}"','{{ paymentTotal }} {{ paymentResource }}',
    'onClick="{{ refreshTactical }}"'
  ]) assert.ok(battleHtml.includes(binding), faction + ' missing Battle UI: ' + binding);
  assert.ok(battleHtml.includes('Unused energy is lost'), faction + ' no banking guidance');
  assert.ok(!battleHtml.includes('onClick="{{ tc.onToggle }}"'),
    faction + ' card heading must not silently exhaust on tap');

  const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, faction + ' controller');
  class Stub {
    setState(update,done) {
      this.state = { ...this.state, ...(typeof update === 'function' ? update(this.state) : update) };
      done?.();
    }
  }
  const Controller = new Function('DCLogic','window',script + '\nreturn Component;')(Stub,world);
  const controller = new Controller();
  const D = controller.D();
  assert.equal(controller.state.factionId, D.FACTION_CARDS[0].id,
    faction + ' default faction ID must match the displayed Faction Card');
  controller.save = () => {};
  controller._secEls = {};
  const primary = D.TACTICAL_CARDS.find(t=>!t.unique && parse(t.resource) > 0
    && t.abilities.some(a=>/\b(Active|Reaction)\b/i.test(a.type || '')));
  assert.ok(primary, faction + ' requires a purchasable renewable tactical card to test');
  controller.state = { ...controller.state, ready:true, tab:'battle',
    tactical:[primary.id,primary.id], tacticalTapped:[], factionTappedId:null,
    paymentCards:[], expBattleCards:{}, army:[] };
  const view = () => controller.renderVals();

  let ui = view();
  assert.equal(ui.paymentResource, expectedResource[faction], faction + ' currency');
  assert.equal(ui.paymentTotal, 0, faction + ' starts at zero');
  assert.equal(ui.hasPendingPayment, false);
  assert.equal(ui.battleTactical.length,2, faction + ' duplicate instances');
  assert.equal(ui.battleCards.length,3, faction + ' Faction Card + duplicates');
  assert.equal(ui.battleFaction.name, D.FACTION_CARDS.find(c=>c.id===controller.state.factionId)?.name);
  assert.equal(ui.battleFaction.resource, D.FACTION_CARDS.find(c=>c.id===controller.state.factionId)?.resource);
  assert.equal(ui.battleTactical[0].key, primary.id + '#0');
  assert.equal(ui.battleTactical[1].key, primary.id + '#1');
  assert.equal(ui.battleTactical[0].abilities[0].name,primary.abilities[0].name);
  assert.equal(ui.battleTactical[0].abilities[0].description,primary.abilities[0].description);
  assert.equal(ui.battleTactical[0].expanded,false);

  // Expanding to read rules never exhausts a card or gives resources.
  ui.battleTactical[0].onExpand();
  ui=view();
  assert.equal(ui.battleTactical[0].expanded,true);
  assert.equal(ui.battleTactical[1].expanded,false);
  assert.equal(ui.paymentTotal,0);
  assert.equal(ui.battleTactical[0].tapped,false);

  // One copy can be spent for resources, while another is exhausted for its ability.
  ui.battleTactical[0].onResource();
  ui=view();
  assert.equal(ui.paymentTotal,parse(primary.resource));
  assert.equal(ui.battleTactical[0].tapped,true);
  assert.equal(ui.battleTactical[1].tapped,false);
  assert.equal(ui.anyTapped,true);
  ui.battleTactical[1].onAbility();
  ui=view();
  assert.equal(ui.paymentTotal,parse(primary.resource),
    faction + ' exhausting for an ability must not also generate resources');
  assert.equal(ui.battleTactical[1].tapped,true);

  // The Faction Card is also a legal resource source; it has its own ready state.
  const factionYield=parse(D.FACTION_CARDS.find(c=>c.id===controller.state.factionId)?.resource);
  assert.ok(factionYield>0);
  ui.battleFaction.onResource();
  ui=view();
  assert.equal(ui.paymentTotal,parse(primary.resource)+factionYield);
  assert.equal(ui.battleFaction.tapped,true);
  ui.battleFaction.onResource(); // Exhausting twice may not add output.
  assert.equal(view().paymentTotal,parse(primary.resource)+factionYield);
  assert.equal(ui.battleFaction.abilities[0].name,
    D.FACTION_CARDS.find(c=>c.id===controller.state.factionId)?.abilities[0].name);

  // Undoing one payment source retracts its temporary contribution.
  ui.battleTactical[0].onReady();
  ui=view();
  assert.equal(ui.paymentTotal,factionYield);
  assert.equal(ui.battleTactical[0].tapped,false);
  assert.equal(ui.battleTactical[1].tapped,true);
  ui.finishResourcePayment();
  ui=view();
  assert.equal(ui.paymentTotal,0);
  assert.equal(ui.hasPendingPayment,false);
  assert.equal(ui.battleFaction.tapped,true);
  assert.equal(ui.battleTactical[1].tapped,true);
  assert.equal(ui.battleFaction.onAbility instanceof Function,true);

  // Saving roster preserves exhausted cards, not temporary, unspent energy.
  const saved = controller.snapshotRoster('Payment test');
  assert.equal(saved.factionTappedId,controller.state.factionId);
  assert.ok(!Object.hasOwn(saved,'paymentCards'));
  controller.state.savedRosters=[saved];
  ui=view();
  ui.battleTactical[0].onResource();
  assert.ok(view().paymentTotal>0);
  controller.loadRoster(saved.id);
  assert.equal(view().paymentTotal,0);
  assert.equal(view().battleFaction.tapped,true);

  // Refresh explicitly readies both card categories and discards current payment.
  ui=view();
  ui.refreshTactical();
  assert.equal(view().anyTapped,false);
  assert.equal(view().paymentTotal,0);
  assert.equal(view().battleFaction.tapped,false);
  assert.ok(view().battleTactical.every(t=>!t.tapped));

  // Old saved rosters still load, and changing factions cannot carry over energy.
  controller.state.savedRosters=[{...saved,id:'old',factionTappedId:undefined}];
  controller.loadRoster('old');
  assert.equal(view().battleFaction.tapped,false);
  controller.state.savedRosters=[{...saved,id:'legacy-faction',factionId:'kerrigans-swarm'}];
  if(faction!=='zerg') {
    controller.loadRoster('legacy-faction');
    assert.equal(controller.state.factionId, D.FACTION_CARDS[0].id,
      faction + ' invalid legacy saved faction ID should fall back safely');
  }
  const otherFaction=view().factionCards.find(c=>c.name!==view().battleFaction.name);
  if(otherFaction) {
    view().battleFaction.onResource();
    assert.ok(view().paymentTotal>0);
    otherFaction.onSelect();
    assert.equal(view().paymentTotal,0);
    assert.equal(view().battleFaction.tapped,false);
  }

  // One tactical copy can be removed without orphaning its contribution.
  controller.state={...controller.state,tactical:[primary.id,primary.id],
    tacticalTapped:[], paymentCards:[], factionTappedId:null};
  view().battleTactical[1].onResource();
  assert.equal(view().paymentTotal,parse(primary.resource));
  const cardDefinition=view().tacticalGroups.flatMap(g=>g.cards).find(c=>c.name===primary.name);
  assert.ok(cardDefinition);
  cardDefinition.onRemove({stopPropagation(){}});
  assert.equal(view().paymentTotal,0);
  assert.equal(view().battleTactical.length,1);
  assert.equal(view().battleTactical[0].tapped,false);

  // Cards with no energy output must not accidentally create a resource payment.
  const passive=D.TACTICAL_CARDS.find(t=>!parse(t.resource));
  if(passive){
    controller.state={...controller.state,tactical:[passive.id],tacticalTapped:[],paymentCards:[]};
    const card=view().battleTactical[0];
    assert.equal(card.hasResource,false);
    card.onResource();
    assert.equal(view().paymentTotal,0);
    assert.equal(view().battleTactical[0].tapped,false);
  }

  // Higher-output cards must use their printed value, not assume +1.
  const boosted=D.TACTICAL_CARDS.find(t=>parse(t.resource)>1);
  if(boosted){
    controller.state={...controller.state,tactical:[boosted.id],tacticalTapped:[],paymentCards:[]};
    view().battleTactical[0].onResource();
    assert.equal(view().paymentTotal,parse(boosted.resource));
  }
  console.log(faction + ': battle abilities, card states, faction output, and resource payments passed');
}
console.log('Battle card energy checks passed across all factions');
