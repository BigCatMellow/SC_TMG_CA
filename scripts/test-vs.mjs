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
for (const F of ['Zerg', 'Terran', 'Protoss']) {
  const a = read(F + ' Army.dc.html');
  assert.ok(a.includes('<a href="Vs.dc.html" class="sc-play-vs"'), F + ' Battle tab has the VS button');
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
const Component = vm.runInNewContext(script + '\nComponent', { DCLogic: Stub, window: world, localStorage: world.localStorage, Math, JSON, Object, Array, Number, String, Date, setInterval, clearInterval });
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
assert.equal(JSON.parse(store.get('sctmg_zerg_v5')).battleSupplyAvailable, 8, 'your pool follows the mission');
// Your casualties made in VS land in your army save.
c.renderVals().you.units[0].lose();
assert.equal(JSON.parse(store.get('sctmg_zerg_v5')).army[0].modelsLost, 1, 'your casualties write back to your army');
console.log('VS mode checks passed.');
