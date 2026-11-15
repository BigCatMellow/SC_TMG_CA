// Mission scoring suggestions: every mission rule, plus the End round flow in each army screen.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const world = { alert() {}, scrollY: 0, scrollTo() {}, addEventListener() {}, removeEventListener() {} };
for (const f of ['terran-data.js', 'zerg-data.js', 'protoss-data.js', 'wave3-data.js', 'model-portraits.js', 'codex-examples.js', 'missions-data.js', 'mission-scoring.js'])
  vm.runInNewContext(read(f), { window: world }, { filename: f });
const S = world.SCTMG_SCORE, M = world.SCTMG_MISSIONS;
const mission = id => M.MISSIONS.find(m => m.id === id);
const mk = (num, ctrl, extra = {}) => ({ num, ctrl, prevCtrl: ctrl, active: true, activatedRound: null, removed: false, colour: 'neutral', ...extra });
const total = r => [r.youTotal, r.foeTotal];

// Destroyed supply always scores, both ways.
let r = S.suggest({ mission: mission('frontlines'), round: 1, markers: [mk(1, 'you')], enemyDestroyed: 3, ownLost: 2 });
assert.deepEqual(total(r), [3, 2], 'Frontlines R1: only destroyed supply (markers start R2)');
assert.match(r.note, /round 2/);

// Frontlines: 1 per marker, +2 when taken from the opponent this round.
r = S.suggest({ mission: mission('frontlines'), round: 3, markers: [mk(1, 'you'), mk(5, 'you', { prevCtrl: 'them' }), mk(2, 'them'), mk(3, 'neutral')], enemyDestroyed: 3, ownLost: 2 });
assert.deepEqual(total(r), [3 + 1 + 3, 2 + 1]);

// Supply Drop: VP = round activated, then the marker is removed; inactive markers don't score.
r = S.suggest({ mission: mission('supply-drop'), round: 3, markers: [mk(1, 'you', { activatedRound: 2 }), mk(2, 'them', { activatedRound: 3 }), mk(3, 'you', { active: false })], enemyDestroyed: 0, ownLost: 0 });
assert.deepEqual(total(r), [2, 3]);
assert.deepEqual([...r.removed].sort(), [1, 2]);
assert.ok(S.rules(mission('supply-drop')).tracksActivation);
assert.equal(S.rules(mission('supply-drop')).earlyWinLead, 12);

// Hold Position: 1 for neutral/own colour, 2 for opponent colour.
r = S.suggest({ mission: mission('hold-position'), round: 2, markers: [mk(1, 'you', { colour: 'them' }), mk(2, 'you', { colour: 'you' }), mk(3, 'them', { colour: 'you' }), mk(5, 'them')] });
assert.deepEqual(total(r), [2 + 1, 2 + 1]);

// Gather the Resources: 2 per opponent-colour marker; Gather actions add 1 each.
r = S.suggest({ mission: mission('gather-the-resources'), round: 2, markers: [mk(1, 'you', { colour: 'them' }), mk(5, 'you')], gathersYou: 2, gathersFoe: 1 });
assert.deepEqual(total(r), [2 + 2, 1]);

// Divide and Conquer: quarters won + 2 for marker 5, from round 1.
r = S.suggest({ mission: mission('divide-and-conquer'), round: 1, markers: [mk(5, 'them'), mk(1, 'you')], quartersYou: 3, quartersFoe: 1 });
assert.deepEqual(total(r), [3, 1 + 2]);

// Skirmish variants use the same rules.
for (const m of M.MISSIONS) assert.ok(S.rules(m).kind, m.id + ' has a scoring kind');
assert.deepEqual([...S.markerNums(null, 'Skirmish')], [1, 2, 5]);
assert.deepEqual([...S.markerNums(M.MAPS.find(x => x.id === 'gauntlet'), 'Standard')], [1, 2, 3, 4, 5]);

// End round flow inside each army screen.
class Stub { setState(n, cb) { this.state = { ...this.state, ...(typeof n === 'function' ? n(this.state) : n) }; cb?.(); } }
for (const F of ['Zerg', 'Terran', 'Protoss']) {
  const html = read(F + ' Army.dc.html');
  assert.ok(html.includes('<script src="mission-scoring.js"></script>'), F + ' loads the scoring engine');
  assert.ok(!/\{\{[^}]*&&[^}]*\}\}/.test(html), F + ' templates cannot evaluate &&');
  const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const C = new Function('DCLogic', 'window', script + '\nreturn Component;')(Stub, world);
  const c = new C();
  const D = c.D();
  const unit = D.UNITS.find(u => u.tiers.some(t => (t.supply || 0) > 1) && u.role !== 'Other');
  const tierIdx = unit.tiers.findIndex(t => (t.supply || 0) > 1);
  c.state = { ...c.state, ready: true, tab: 'battle', army: [{ key: 'a', unitId: unit.id, tierIdx, upgs: [], modelsLost: 0, deployed: true }],
    missionId: 'frontlines', mapId: 'gauntlet', play: { round: 2, phase: 0, vpYou: 4, vpFoe: 3, markers: { 1: { ctrl: 'them' } }, ownLostAtStart: 0 } };
  c.state.army[0].modelsLost = c.unitStartingModels(unit, tierIdx); // wiped out this round
  const view = () => c.renderVals();
  view().openEndRound();
  assert.equal(view().scoreOn, true, F + ' suggestion shows with a mission');
  assert.equal(view().scoreMarkers.length, 5, F + ' Gauntlet has five markers');
  const lost = c.state.scoreDraft.ownLost;
  assert.equal(lost, unit.tiers[tierIdx].supply, F + ' own losses fill in automatically');
  view().scoreMarkers[0].onTap(); // M1: them -> neutral
  view().scoreMarkers[0].onTap(); // neutral -> you (taken back)
  view().scoreInputs[0].onUp(); view().scoreInputs[0].onUp(); // destroyed 2 enemy supply
  assert.equal(view().scoreMarkers[0].badge, 'Taken');
  assert.equal(view().scoreFinalYou, 4 + 2 + 3, F + ' you: destroyed + taken marker');
  assert.equal(view().scoreFinalFoe, 3 + lost, F + ' enemy: your losses');
  view().scoreYouUp();
  assert.equal(view().scoreFinalYou, 10, F + ' totals can be adjusted by hand');
  view().confirmEndRound();
  assert.equal(c.state.play.round, 3);
  assert.equal(c.state.play.vpYou, 10);
  assert.equal(c.state.play.markers[1].ctrl, 'you', F + ' marker control carries into next round');
  assert.equal(c.state.play.ownLostAtStart, lost, F + ' loss baseline moves forward');
  view().openEndRound();
  assert.equal(c.state.scoreDraft.ownLost, 0, F + ' next round starts with no new losses');
  assert.equal(view().scoreMarkers[0].badge, '', F + ' held marker is not "taken" again');
  console.log(F + ': End round score suggestion passed');
}
// Mission and map data against the printed scenario cards.
assert.equal(S.rules(mission('gather-the-resources-skirmish')).earlyWinLead, 8, 'Gather the Resources (Skirmish) ends on an 8+ lead');
assert.equal(S.rules(mission('gather-the-resources')).earlyWinLead, 10);
for (const [id, supply, per, lead] of [['artefact-hunt', 6, 2, null], ['artefact-hunt-skirmish', 3, 1, null], ['fire-in-the-sky', 5, 3, 10], ['fire-in-the-sky-skirmish', 3, 2, 8]]) {
  const m = mission(id);
  assert.ok(m, id + ' is listed');
  assert.deepEqual([m.supply, m.perRound, m.gameLength, S.rules(m).earlyWinLead], [supply, per, 5, lead], id + ' numbers');
}
const map = id => M.MAPS.find(x => x.id === id);
const zones = z => z.map(r => [r.x, r.y, r.w, r.h].join(',')).join(' ');
assert.equal(zones(map('dirt-side').redZones), '0,0,12,6 0,6,6,6', 'Dirt Side: Red is one L in the top-left corner');
assert.equal(zones(map('dirt-side').blueZones), '24,30,12,6 30,24,6,6', 'Dirt Side: Blue is one L in the bottom-right corner');
for (const id of ['green-valleys', 'power-lines', 'meeting-engagement', 'one-bridge-too-close']) assert.ok(map(id), id + ' map is listed');
assert.equal(M.MAPS.length, 14);
for (const mp of M.MAPS) {
  const skirmish = mp.type === 'Skirmish';
  assert.deepEqual([mp.width, mp.height], skirmish ? [36, 36] : [54, 36], mp.id + ' size');
  assert.equal(mp.markers.map(k => k.num).sort().join(), skirmish ? '1,2,5' : '1,2,3,4,5', mp.id + ' markers');
  assert.equal(mp.markerSetup.length, mp.markers.length, mp.id + ' has a setup line per marker');
  for (const k of mp.markers) assert.ok(k.x > 0 && k.x < mp.width && k.y > 0 && k.y < mp.height, mp.id + ' marker ' + k.num + ' is on the table');
  for (const r of [...mp.redZones, ...mp.blueZones]) assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= mp.width && r.y + r.h <= mp.height, mp.id + ' zone is on the table');
}
console.log('Mission scoring validated');
