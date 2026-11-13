// VS mode: both armies on one scoreboard. Checks the page wiring and the shared game state.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const html = read('Vs.dc.html');
for (const f of ['terran-data.js', 'zerg-data.js', 'protoss-data.js', 'wave3-data.js', 'model-portraits.js', 'missions-data.js', 'mission-scoring.js'])
  assert.ok(html.includes('<script src="' + f + '"></script>'), 'VS loads ' + f);
assert.ok(html.indexOf('<script src="./resume.js"></script>') < html.indexOf('<script src="./support.js"></script>'), 'VS resumes like other pages');
assert.ok(!/\{\{[^}]*(&&|\|\||\?)[^}]*\}\}/.test(html), 'no expressions in template holes');
// VS must read each army from the key its page saves to (Terran and Protoss are still on v1).
for (const [f, key] of [['Zerg', 'sctmg_zerg_v5'], ['Terran', 'sctmg_terran_v1'], ['Protoss', 'sctmg_protoss_v1']]) {
  assert.ok(read(f + ' Army.dc.html').includes("localStorage.setItem('" + key + "'"), f + ' saves to ' + key);
  assert.ok(html.includes(f.toLowerCase() + ": '" + key + "'"), 'VS reads ' + f + ' from ' + key);
}
for (const F of ['Zerg', 'Terran', 'Protoss']) {
  const a = read(F + ' Army.dc.html');
  assert.ok(a.includes("{ id: 'vs', label: 'VS' }") && a.includes("window.location.href = 'Vs.dc.html?f="), F + ' has a VS tab in the bottom bar');
  assert.ok(a.includes('rounds: {}, foeLostAtStart: 0'), F + ' reset clears the VS scoreline');
}

// Run the controller against fake storage.
const script = html.slice(html.indexOf('data-dc-script data-props="{}">') + 'data-dc-script data-props="{}">'.length, html.lastIndexOf('</script>'));
const store = new Map();
const world = { localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)) } };
world.window = world;
for (const f of ['terran-data.js', 'zerg-data.js', 'protoss-data.js', 'wave3-data.js', 'model-portraits.js', 'missions-data.js', 'mission-scoring.js'])
  vm.runInNewContext(read(f), world);
class Stub { constructor() { this.props = {}; } setState(n, cb) { this.state = { ...this.state, ...(typeof n === 'function' ? n(this.state) : n) }; cb && cb(); } }
const Component = vm.runInNewContext(script + '\nComponent', { DCLogic: Stub, window: world, localStorage: world.localStorage, Math, JSON, Object, Array, Number, String, Date, setInterval, clearInterval, setTimeout, clearTimeout });
const c = new Component();
store.set('sctmg_last_faction', 'zerg');
store.set('sctmg_zerg_v5', JSON.stringify({ army: [{ key: 'z1', unitId: 'zergling', tierIdx: 0, modelsLost: 0, deployed: true }], tactical: ['evolution-chamber'], tacticalTapped: ['evolution-chamber#0'], factionTappedId: null, battleSupplyAvailable: 6, factionId: 'kerrigans-swarm' }));
store.set('sctmg_play', JSON.stringify({ round: 1, vpYou: 0, vpFoe: 0, missionId: 'supply-drop', markers: { 1: { ctrl: 'you', active: true, activatedRound: 1 } } }));
c.state = { ...c.state, ready: true, yourFaction: 'zerg', yours: JSON.parse(store.get('sctmg_zerg_v5')),
  opp: { faction: 'terran', factionId: null, army: [{ key: 'o1', unitId: 'marine', tierIdx: 0, modelsLost: 0, deployed: true }], tactical: [], tapped: [] },
  play: JSON.parse(store.get('sctmg_play')) };
let v = c.renderVals();
assert.equal(v.vpYou, 0);
assert.ok(v.opp.units.length === 1 && v.you.units.length === 1, 'both sides listed');
// Kill marines: their lost supply feeds your score.
v.opp.units[0].pips[0].tap();
for (let i = 0; i < 6; i++) c.renderVals().opp.units[0].lose();
assert.equal(c.state.opp.army[0].modelsLost, 7, 'casualties tracked on the opponent');
assert.equal(JSON.parse(store.get('sctmg_opp_v1')).army[0].modelsLost, 7, 'opponent saved');
// Using a card ability exhausts the card and remembers which ability, for this round.
c.renderVals().you.cards[0].open();
v = c.renderVals();
assert.equal(v.sheetCard, true, 'card sheet opens');
const abName = v.cardInfo.abilities[0].name;
v.cardInfo.abilities[0].use();
v = c.renderVals();
assert.equal(v.you.cards[0].spent, true, 'Use exhausts the card');
assert.equal(v.you.cards[0].state, 'Used: ' + abName, 'card remembers the ability used');
assert.equal(v.cardInfo.abilities[0].isUsed, true, 'sheet marks the used ability');
assert.equal(JSON.parse(store.get('sctmg_play')).cardUsed.you.faction, abName, 'kept with the game');
c.setState({ sheet: null });
c.renderVals().openEndRound();
v = c.renderVals();
assert.equal(v.sheetEnd, true);
assert.ok(v.endYou.some(l => /M1/.test(l.label)), 'held active marker scores');
assert.ok(v.endYou.some(l => /Enemy supply destroyed/.test(l.label)), 'enemy supply lost is counted automatically');
v.applyEnd();
const play = JSON.parse(store.get('sctmg_play'));
assert.equal(play.round, 2, 'round advances');
assert.ok(play.vpYou > 0 && play.rounds['1'].you === play.vpYou, 'scoreline records the round');
assert.deepEqual(JSON.parse(store.get('sctmg_zerg_v5')).tacticalTapped, [], 'your cards are readied');
assert.deepEqual(play.cardUsed, {}, 'used abilities clear at the end of the round');
assert.equal(JSON.parse(store.get('sctmg_zerg_v5')).battleSupplyAvailable, 8, 'your pool follows the mission');
// Your casualties made in VS land in your army save.
c.renderVals().you.units[0].lose();
assert.equal(JSON.parse(store.get('sctmg_zerg_v5')).army[0].modelsLost, 1, 'your casualties write back to your army');
// Supply pool: a reserve unit that does not fit cannot be deployed.
c.state = { ...c.state, yours: { ...c.state.yours, battleSupplyAvailable: 0, army: [{ key: 'z9', unitId: 'zergling', tierIdx: 1, modelsLost: 0, deployed: false }] } };
let row = c.renderVals().you.units[0];
assert.ok(row.deployOff && /Needs/.test(row.status), 'reserve unit over the pool is blocked');
row.toggleDeploy();
assert.equal(c.state.yours.army[0].deployed, false, 'blocked unit stays in reserve');
// Scout: a unique unit can be added once.
c.state = { ...c.state, view: 'scout', opp: { faction: 'terran', factionId: null, army: [], tactical: [], tapped: [] } };
let raynor = () => c.renderVals().scoutUnits.find(u => u.name === 'Jim Raynor');
raynor().tiers.find(t => !t.off).add();
assert.ok(raynor().tiers.every(t => t.off), 'unique unit locked after one copy');
assert.equal(c.state.opp.army.length, 1);
// Scoreline: manual VP during a round counts toward that round, and the line adds up to the total.
c.state = { ...c.state, view: 'board', play: { round: 2, vpYou: 7, vpFoe: 2, rounds: { 1: { you: 4, foe: 2 }, 3: { you: 9, foe: 9 } } } };
const line = c.renderVals().rounds;
assert.equal(line[0].you, 4); assert.equal(line[1].you, 3, 'current round shows points so far'); assert.equal(line[2].you, '–', 'later rounds are not shown');
// Every row has one stepper: HP for single-model units with health, models for squads.
c.state = { ...c.state, yours: { ...c.state.yours, battleSupplyAvailable: 9, army: [{ key: 'h1', unitId: 'kerrigan', tierIdx: 1, modelsLost: 0, deployed: true }, { key: 'h2', unitId: 'zergling', tierIdx: 1, modelsLost: 0, deployed: true }] } };
let rows = c.renderVals().you.units;
assert.equal(rows.find(r => r.name === 'Kerrigan').stepLabel, 'HP'); assert.equal(rows.find(r => r.name === 'Kerrigan').showPips, false);
assert.equal(rows.find(r => r.name === 'Zergling').stepLabel, 'Models');
rows.find(r => r.name === 'Kerrigan').stepDown();
assert.equal(c.state.yours.army[0].dmg, 1, 'HP − deals 1 damage');
// Squads with multi-HP models share one damage pool (rules 8.7.4): one model goes each time it reaches its HP.
c.state = { ...c.state, yours: { ...c.state.yours, army: [{ key: 'r1', unitId: 'roach', tierIdx: 1, modelsLost: 0, deployed: true }] } };
let roach = () => c.renderVals().you.units[0];
assert.equal(roach().stepLabel, 'HP', 'multi-HP squads step HP');
assert.equal(roach().hpSegs.length, 3, 'one segment per model');
for (let i = 0; i < 5; i++) roach().stepDown();
assert.deepEqual([c.state.yours.army[0].modelsLost, c.state.yours.army[0].dmg], [1, 1], '5 damage on 4 HP Roaches: one removed, 1 left on the marker');
assert.equal(roach().hpText, '7 / 12 HP');
roach().stepUp(); roach().stepUp();
assert.deepEqual([c.state.yours.army[0].modelsLost, c.state.yours.army[0].dmg], [0, 3], 'stepping back restores the model as a correction');
// VS has the army tab bar; other tabs open your army page on that tab.
const tabs = c.renderVals().navTabs;
assert.equal(tabs.map(t => t.label).join(','), 'Brood,Library,Tactics,Roster,VS,Codex');
assert.equal(tabs.find(t => t.label === 'VS').current, 'page');
// New game: shows game over at the early-win lead; two taps reset both sides (armies kept); Undo restores.
c.state = { ...c.state, view: 'board', newArmed: false, play: { round: 4, vpYou: 4, vpFoe: 12, missionId: 'supply-drop', rounds: {} },
  yours: { ...c.state.yours, army: [{ key: 'n1', unitId: 'zergling', tierIdx: 1, modelsLost: 3, deployed: true }], tacticalTapped: ['x#0'] },
  opp: { faction: 'terran', army: [{ key: 'n2', unitId: 'marine', tierIdx: 0, modelsLost: 2, deployed: true }], tactical: [], tapped: ['faction'] } };
const winAt = world.SCTMG_SCORE.rules(world.SCTMG_MISSIONS.MISSIONS.find(m => m.id === 'supply-drop')).earlyWinLead;
if (winAt && winAt <= 8) assert.equal(c.renderVals().gameOver, true, 'game over at the early-win lead');
c.renderVals().newGame();
assert.equal(c.state.newArmed, true, 'first tap only arms');
c.renderVals().newGame();
assert.equal(c.state.play.vpFoe, 0); assert.equal(c.state.play.round, 1);
assert.equal(c.state.yours.army[0].modelsLost, 0); assert.equal(c.state.opp.army[0].modelsLost, 0);
assert.equal(c.state.yours.army.length, 1, 'your army list is kept'); assert.deepEqual(c.state.opp.tapped.length, 0);
c.renderVals().undo();
assert.equal(c.state.play.vpFoe, 12, 'undo restores the game'); assert.equal(c.state.opp.army[0].modelsLost, 2);
// Supply warning: when the next model lost would drop Supply, that model turns amber and Supply warns.
c.state = { ...c.state, view: 'board', sheet: null, yours: { ...c.state.yours, army: [
  { key: 's1', unitId: 'zergling', tierIdx: 0, modelsLost: 5, deployed: true },
  { key: 's2', unitId: 'roach', tierIdx: 0, modelsLost: 1, dmg: 0, deployed: true }] } };
let sv = c.renderVals().you.units;
const zl = sv.find(u => u.key === 's1'), ro = sv.find(u => u.key === 's2');
assert.deepEqual(zl.pips.map((p, i) => /--risk/.test(p.cls) ? i : -1).filter(i => i >= 0), [12], 'Zergling at 13 models: the 13th is at risk');
assert.match(zl.supCls, /--risk/); assert.match(zl.supTitle, /drops to 1/);
assert.ok(!ro.hpSegs.some(s => /--risk/.test(s.cls)) && !/--risk/.test(ro.supCls), 'Roach at 5 models: no warning yet');
c.state = { ...c.state, yours: { ...c.state.yours, army: [{ key: 's2', unitId: 'roach', tierIdx: 0, modelsLost: 2, dmg: 1, deployed: true }] } };
assert.deepEqual(c.renderVals().you.units[0].hpSegs.map((s, i) => /--risk/.test(s.cls) ? i : -1).filter(i => i >= 0), [3], 'Roach at 4 models: the 4th is at risk');
console.log('VS mode checks passed.');
