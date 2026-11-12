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
  assert.ok(a.includes("{ id: 'vs', label: 'VS' }") && a.includes("window.location.href = 'Vs.dc.html'"), F + ' has a VS tab in the bottom bar');
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
console.log('VS mode checks passed.');
