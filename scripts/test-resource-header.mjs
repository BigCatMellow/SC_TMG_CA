// Scroll collapse regression: original scoreboard styling plus compact HUD on all factions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const styles = read('shared-styles.css');
assert.match(styles, /\.sc-resource-strip--compact\s*\{\s*height:\s*26px;/);
assert.match(styles, /\.sc-resource-strip\s*\{[\s\S]*?height:\s*50px;/);
assert.match(styles, /prefers-reduced-motion/);
assert.match(styles, /\.sc-slot-strip\s*\{[\s\S]*?height:\s*39px;/);
assert.match(styles, /\.sc-slot-strip--compact\s*\{\s*height:\s*24px;/);
assert.match(styles, /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
assert.match(styles, /\.sc-slot-strip--compact \.sc-slot-role-long\s*\{\s*display:\s*none;/);
assert.match(styles, /\.sc-title-row \.sc-title-faction\s*\{[\s\S]*?text-overflow: ellipsis;/);
for (const [name,value] of Object.entries({
  '--sc-title-pad-top':'2px',
  '--sc-title-pad-bottom':'2px',
  '--sc-title-heading-size':'20px',
  '--sc-title-faction-size':'10px'
})) {
  assert.ok(styles.includes(name + ': ' + value + ';'), name + ' compact heading CSS');
}
assert.match(styles, /\.sc-title-row--compact \.sc-title-kicker\s*\{\s*display: none;/);
assert.match(styles, /\.sc-title-row--compact \.sc-title-faction\s*\{[\s\S]*?text-overflow: ellipsis;/);
assert.match(styles, /\.sc-scoreboard--compact\s*\{/);
for (const [variable, value] of Object.entries({
  '--sc-scoreboard-padding': '5px 12px',
  '--sc-scoreboard-vp-size': '20px',
  '--sc-scoreboard-round-size': '14px',
  '--sc-scoreboard-phase-size': '11px'
})) {
  assert.ok(styles.includes(variable + ': ' + value + ';'), variable + ' compact style missing');
}

// Normalize only the intentional sizing variables, then verify the original
// markup, colors, clip-path, gradient and event wiring are byte-for-byte intact.
const originalScoreboardHashes = { terran: 'b179839f', zerg: '2b6ccd69', protoss: 'f2989468' };
const scoreboardSizingChanges = [
  // The HUD shows the mission (accurate all game) instead of a phase nobody keeps updated.
  ['text-transform:uppercase;color:#8a91a5">{{ hudRoundOf }}</div>',
   'text-transform:uppercase;color:#8a91a5">Phase</div>'],
  ['text-transform:uppercase;color:#c8cede;white-space:nowrap;max-width:132px;overflow:hidden;text-overflow:ellipsis">{{ hudMission }}</div>',
   'text-transform:uppercase;color:{{ phaseColor }};white-space:nowrap">{{ phaseName }}</div>'],
  ['background:#35c76b;box-shadow:0 0 6px #35c76b;',
   'background:{{ phaseColor }};box-shadow:0 0 6px {{ phaseColor }};'],
  ['<div class="{{ scoreboardClass }}" onClick="{{ togglePlay }}" role="button" aria-label="Open round tracker"',
   '<div onClick="{{ togglePlay }}" role="button" aria-label="Open round tracker"'],
  ['margin:0 14px var(--sc-scoreboard-bottom-gap,8px);background:linear-gradient',
   'margin:0 14px 8px;background:linear-gradient'],
  ['justify-content:space-between;gap:var(--sc-scoreboard-card-gap,10px);background:var(--sc-card-bg);padding:var(--sc-scoreboard-padding,12px 16px)',
   'justify-content:space-between;gap:10px;background:var(--sc-card-bg);padding:12px 16px'],
  ['align-items:center;gap:var(--sc-scoreboard-round-gap,6px);flex:0 0 auto',
   'align-items:center;gap:6px;flex:0 0 auto'],
  ["font-family:'Chakra Petch',sans-serif;font-size:var(--sc-scoreboard-round-size,17px)",
   "font-family:'Chakra Petch',sans-serif;font-size:17px"],
  ['align-items:center;gap:var(--sc-scoreboard-vp-gap,10px);flex:1;justify-content:center',
   'align-items:center;gap:10px;flex:1;justify-content:center'],
  ["font-family:'Chakra Petch',sans-serif;font-size:var(--sc-scoreboard-vp-size,32px)",
   "font-family:'Chakra Petch',sans-serif;font-size:32px"],
  ['color:#5b6275;font-size:var(--sc-scoreboard-colon-size,20px)">:</span>',
   'color:#5b6275;font-size:20px">:</span>'],
  ['font-size:var(--sc-scoreboard-phase-label-size,9px);line-height:var(--sc-scoreboard-phase-line-height,1.5);font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8a91a5">Phase</div>',
   'font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8a91a5">Phase</div>'],
  ['font-size:var(--sc-scoreboard-phase-size,13px);line-height:var(--sc-scoreboard-phase-line-height,1.5);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:{{ phaseColor }};white-space:nowrap',
   'font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:{{ phaseColor }};white-space:nowrap']
];
function originalScoreboardHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  return h.toString(16).padStart(8, '0');
}


// Baseline hashes from original title rows on main before this change.
const originalTitleHashes = {"terran":"eca5f626","zerg":"188c1517","protoss":"1ba3c571"};
const titleSizingChanges = [
  // Back goes to the real home (index.html), not the stale Command Center copy.
  ['<a href="index.html" aria-label="Back to command center"', '<a href="Command Center.dc.html" aria-label="Back to command center"'],
  [
    "    <div class=\"{{ titleHeaderClass }}\" style=\"display:flex;align-items:center;gap:var(--sc-title-gap,10px);padding:calc(var(--sc-title-pad-top,10px) + env(safe-area-inset-top)) 14px var(--sc-title-pad-bottom,8px)\">",
    "    <div style=\"display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top)) 14px 8px\">"
  ],
  [
    "<div class=\"sc-title-kicker\" style=\"font-family:Rajdhani,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#8a91a5\">",
    "<div style=\"font-family:Rajdhani,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#8a91a5\">"
  ],
  [
    "<div style=\"display:flex;align-items:baseline;gap:var(--sc-title-name-gap,8px)\">",
    "<div style=\"display:flex;align-items:baseline;gap:8px\">"
  ],
  [
    "<div class=\"sc-title-faction-name\" style=\"font-family:'Chakra Petch',sans-serif;font-size:var(--sc-title-heading-size,24px);",
    "<div style=\"font-family:'Chakra Petch',sans-serif;font-size:24px;"
  ],
  [
    "<div class=\"sc-title-faction\" style=\"font-family:Rajdhani,sans-serif;font-size:var(--sc-title-faction-size,12px);font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:",
    "<div style=\"font-family:Rajdhani,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:"
  ]
];

for (const faction of ['terran', 'zerg', 'protoss']) {
  const html = read(faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html');
  assert.equal((html.match(/class="\{\{ resourceStripClass \}\}"/g) || []).length, 1, faction + ' resource row');
  assert.ok(!html.includes('class="{{ battleSupplyStripClass }}"'), faction + ' Roster shows army totals, not a deployment HUD');
  const resourcePosition = html.indexOf('class="{{ resourceStripClass }}"');
  const slotPosition = html.indexOf('class="{{ slotStripClass }}"');
  const battlePosition = html.indexOf('<!-- ============ BATTLE TAB ============ -->');
  assert.ok(resourcePosition >= 0 && slotPosition > resourcePosition && slotPosition < battlePosition,
    faction + ' army slots must be directly below mineral/gas/supply in the header');
  assert.ok(html.slice(resourcePosition,slotPosition).includes('</div>'), faction + ' resources intact');
  assert.match(html.slice(slotPosition,battlePosition), /<sc-for list="\{\{ roleSlots \}\}" as="sl"/);
  for (const label of ['{{ sl.name }}', '{{ sl.short }}', '{{ sl.used }}', '{{ sl.cap }}',
    'color:{{ sl.fg }}', '{{ sl.accessibilityLabel }}'])
    assert.ok(html.slice(slotPosition,battlePosition).includes(label),
      faction + ' role slot binding missing: ' + label);
  for (const label of ['Minerals', 'Vespene', 'Supply'])
    assert.ok(html.includes('class="sc-resource-label-long">' + label + '</span>'), faction + ' ' + label + ' total');
  for (const label of ['M', 'G', 'SUP'])
    assert.ok(html.includes('aria-hidden="true">' + label + '</span>'), faction + ' ' + label + ' abbreviated total');
  assert.ok(html.includes('{{ mineralsUsed }}') && html.includes('{{ mineralsCap }}'), faction + ' minerals');
  assert.ok(html.includes('{{ gasUsed }}') && html.includes('{{ gasCap }}'), faction + ' gas');
  assert.ok(html.includes('{{ supplyUsed }}'), faction + ' supply');
  assert.ok(html.includes('onClick="{{ togglePlay }}"'), faction + ' round tracker preserved');
  const first = html.indexOf('    <!-- play HUD, scoreboard layout: round left, score center, phase right -->');
  const last = html.indexOf('    <!-- Resource totals: full at the top, one-line summary after scrolling. -->', first);
  assert.ok(first !== -1 && last > first, faction + ' original scoreboard boundaries');
  let scoreboard = html.slice(first, last);
  for (const [changed, original] of scoreboardSizingChanges) {
    assert.ok(scoreboard.includes(changed), faction + ' scoreboard original structure lost: ' + changed);
    scoreboard = scoreboard.split(changed).join(original);
  }
  assert.equal(originalScoreboardHash(scoreboard), originalScoreboardHashes[faction],
    faction + ' scoreboard styling differs from original layout');
  assert.ok(html.includes("scoreboardClass: 'sc-scoreboard sc-scoreboard--compact'"), faction + ' one-row scoreboard, same as Rules and War Room');
  // Only the class and reversible sizing variables may change in the title row.
  assert.equal((html.match(/class="\{\{ titleHeaderClass \}\}"/g) || []).length, 1,
    faction + ' single title header');
  const titleStart = html.indexOf('    <!-- title row -->');
  const titleEnd = html.indexOf('    <!-- play HUD, scoreboard', titleStart);
  assert.ok(titleStart >= 0 && titleEnd > titleStart, faction + ' title region boundaries');
  let title = html.slice(titleStart, titleEnd);
  // The new management button is the sole permitted addition to the original title markup.
  // The roster issues chip is the only other addition, and only shows when there are issues.
  const issueChip = title.match(/      <sc-if value="\{\{ hasRosterWarnings \}\}"[^\n]*?<\/sc-if>\n/);
  assert.ok(issueChip && issueChip[0].includes('onClick="{{ openIssues }}"'), faction + ' roster issues chip in title row');
  title = title.replace(issueChip[0], '');
  // The Share button was added beside Rosters and Search; strip it so the rest of the header still matches.
  const shareButton = title.match(/      <button onClick="\{\{ openShare \}\}"[\s\S]*?<\/button>\n/);
  assert.ok(shareButton, faction + ' header Share button');
  title = title.replace(shareButton[0], '');
  const newButton = title.match(/      <button onClick="\{\{ openRosters \}\}" aria-label="Rosters: save, load and export"[\s\S]*?<\/button>\n/);
  assert.ok(newButton, faction + ' management button beside Search');
  assert.equal((title.match(/onClick="\{\{ openRosters \}\}"/g) || []).length, 1, faction + ' one header management action');
  assert.ok(title.indexOf(newButton[0]) < title.indexOf('onClick="{{ openSearch }}"'),
    faction + ' management icon must appear immediately before Search');
  assert.match(newButton[0], /width:40px;height:40px;/, faction + ' full-size icon hit target');
  assert.match(newButton[0], /clip-path:var\(--sc-corner-8\)/, faction + ' preserves beveled button styling');
  title = title.replace(newButton[0], '');
  const managerStart = html.indexOf('  <!-- ============ SAVED ROSTERS SHEET ============ -->');
  const managerEnd = html.indexOf('  <!-- ============ ROUND TRACKER SHEET ============ -->', managerStart);
  assert.ok(managerStart >= 0 && managerEnd > managerStart, faction + ' management sheet retained');
  const sheet = html.slice(managerStart, managerEnd);
  for (const control of [
    'onClick="{{ exportArmySheet }}"',
    'onClick="{{ saveCurrentAsRoster }}"',
    'onClick="{{ r.onLoad }}"',
    'onClick="{{ r.onExport }}"',
    'onClick="{{ triggerImport }}"'
  ]) assert.ok(sheet.includes(control), faction + ' missing action in management sheet: ' + control);
  assert.ok(sheet.includes('>Army Management</span>') && sheet.includes('>My lists</h2>'), faction + ' management sheet heading');
  assert.ok(sheet.includes('>Saved Rosters</div>'), faction + ' saved roster list preserved');
  for (const action of ['r.onShare', 'r.onRenameStart', 'r.onDuplicate', 'r.onDeleteStart', 'newList', 'listSaveCurrent'])
    assert.ok(sheet.includes('onClick="{{ ' + action + ' }}"'), faction + ' list action ' + action);
  assert.ok(sheet.includes('aria-label="Download roster file"'), faction + ' JSON export accessible');
  assert.ok(sheet.includes('<sc-if value="{{ !rosterEmpty }}"'), faction + ' print export requires nonempty army');

  for (const [compact, original] of titleSizingChanges) {
    assert.ok(title.includes(compact), faction + ' original title property changed: ' + compact);
    title = title.split(compact).join(original);
  }
  assert.equal(originalScoreboardHash(title), originalTitleHashes[faction],
    faction + ' title markup/style diverges from original');
  assert.ok(html.includes('aria-label="Back to command center"'), faction + ' back button');
  assert.ok(html.includes('aria-label="Search everything"'), faction + ' search button');
  assert.ok(html.includes('width:40px;height:40px'), faction + ' original 40px controls');


  const listeners = new Map();
  const world = {
    scrollY: 0, alert() {},
    addEventListener(event, cb, options) { listeners.set(event, { cb, options }); },
    removeEventListener(event, cb) {
      assert.equal(listeners.get(event)?.cb, cb);
      listeners.delete(event);
    }
  };
  for (const path of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js'])
    vm.runInNewContext(read(path), { window: world }, { filename: path });

  const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, faction + ' controller');
  class Stub {
    setState(next, cb) {
      this.state = { ...this.state, ...(typeof next === 'function' ? next(this.state) : next) };
      cb?.();
    }
  }
  const Controller = new Function('DCLogic','window',script + '\nreturn Component;')(Stub,world);
  const controller = new Controller();
  controller.save = () => {};
  controller._secEls = {};
  controller.state = { ...controller.state, ready: true, army: [], tactical: [] };
  const D = controller.D();
  const roles = ['hero','elite','core','support','air'];
  const slots = () => controller.renderVals().roleSlots;
  const firstSlots = slots();
  const factionCard = D.FACTION_CARDS.find(x => x.id === controller.state.factionId) || D.FACTION_CARDS[0];
  // Hero, Elite, Core and Support always show (0/0 included) so the strip keeps its shape; Air only when used.
  // An empty army never shows Air, even when the Faction Card grants an Air slot (no Air units exist yet).
  const shownRoles = roles.filter(r => r !== 'air');
  assert.deepEqual(firstSlots.map(x => x.name.toLowerCase()), shownRoles,
    faction + ' role counts in fixed order, main roles always shown');
  assert.equal(controller.renderVals().slotCols, Math.max(1, shownRoles.length), faction + ' slot strip column count');
  for (const role of shownRoles) {
    const actual = firstSlots.find(x => x.name.toLowerCase() === role);
    assert.equal(actual.used,0,faction + ' empty army ' + role + ' used');
    assert.equal(actual.cap, factionCard.slots?.[role] || 0,
      faction + ' faction card base slot cap for ' + role);
    assert.equal(actual.accessibilityLabel, actual.name + ' slots: 0 of ' + actual.cap + ' used');
  }
  // Tactical cards add role allowances to the selected faction's base limits.
  const grantingCard = D.TACTICAL_CARDS.find(t => Object.values(t.slots || {}).some(v => v > 0));
  if (grantingCard) {
    controller.state.tactical = [grantingCard.id];
    const updated = slots();
    for (const role of roles.filter(r => r !== 'air' && (factionCard.slots?.[r] || 0) + (grantingCard.slots?.[r] || 0) > 0)) {
      assert.equal(updated.find(x => x.name.toLowerCase() === role).cap,
        (factionCard.slots?.[role] || 0) + (grantingCard.slots?.[role] || 0),
        faction + ' tactical bonus for ' + role);
    }
    controller.state.tactical = [];
  }
  // Unit tier supply consumes the correct role; exceeding capacity turns its value red.
  const unit = D.UNITS.find(u => roles.includes(u.role.toLowerCase())
    && u.tiers?.some(t => (t.supply || 0) > 0 && (t.cost || 0) > 0));
  assert.ok(unit, faction + ' purchasable unit with a role and supply');
  const tierIdx = unit.tiers.findIndex(t => (t.supply || 0) > 0 && (t.cost || 0) > 0);
  const role = unit.role.toLowerCase();
  const unitEntry = index => ({
    key:'slot-test-' + index,unitId:unit.id,tierIdx,upgs:[],modelsLost:0,deployed:false
  });
  controller.state.army = [unitEntry(0)];
  assert.equal(slots().find(x => x.name.toLowerCase() === role).used,
    unit.tiers[tierIdx].supply, faction + ' used slots for unit composition');
  const allowance = factionCard.slots?.[role] || 0;
  const extraCopies = Math.floor(allowance / unit.tiers[tierIdx].supply) + 1;
  controller.state.army = Array.from({length:extraCopies},(_,i)=>unitEntry(i));
  const exceeded = slots().find(x => x.name.toLowerCase() === role);
  assert.ok(exceeded.used > exceeded.cap, faction + ' test fixture exceeds capacity');
  assert.equal(exceeded.fg,'#f08a8a', faction + ' excessive role usage is highlighted');
  controller.state.army = [];
  const css = () => controller.renderVals().resourceStripClass;
  const slotCss = () => controller.renderVals().slotStripClass;
  const boardCss = () => controller.renderVals().scoreboardClass;
  const titleCss = () => controller.renderVals().titleHeaderClass;

  assert.equal(css(), 'sc-resource-strip', faction + ' resources start expanded');
  assert.equal(slotCss(), 'sc-slot-strip', faction + ' slots start expanded');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' one-row scoreboard at top');
  assert.equal(titleCss(), 'sc-title-row', faction + ' original title at top');
  for (const tab of ['faction', 'battle', 'library', 'tactics', 'codex']) {
    controller.state.tab = tab;
    const before = controller.state.tab;
    const action = controller.renderVals().openRosters;
    assert.equal(typeof action, 'function', faction + ' management available on ' + tab);
    action();
    assert.equal(controller.renderVals().sheetRosters, true, faction + ' roster manager opens from ' + tab);
    assert.equal(controller.state.tab, before, faction + ' manager must not change active tab');
    controller.renderVals().closeSheet();
    assert.equal(controller.renderVals().sheetRosters, false, faction + ' manager closes on ' + tab);
  }
  controller.componentDidMount();
  assert.equal(listeners.get('scroll')?.options?.passive, true, faction + ' passive scroll listener');

  world.scrollY = 100;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip', faction + ' does not collapse on minor scroll');
  assert.equal(slotCss(), 'sc-slot-strip', faction + ' slots unchanged on minor scroll');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard unchanged on minor scroll');
  assert.equal(titleCss(), 'sc-title-row', faction + ' title unchanged on minor scroll');
  world.scrollY = 145;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' collapses');
  assert.equal(slotCss(), 'sc-slot-strip sc-slot-strip--compact', faction + ' slots collapse');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard collapses');
  assert.equal(titleCss(), 'sc-title-row sc-title-row--compact', faction + ' title collapses');
  world.scrollY = 90;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' hysteresis');
  assert.equal(slotCss(), 'sc-slot-strip sc-slot-strip--compact', faction + ' slot hysteresis');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard hysteresis');
  assert.equal(titleCss(), 'sc-title-row sc-title-row--compact', faction + ' title hysteresis');
  world.scrollY = 64;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip', faction + ' re-expands near top');
  assert.equal(slotCss(), 'sc-slot-strip', faction + ' slots re-expand near top');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard stays one row');
  assert.equal(titleCss(), 'sc-title-row', faction + ' title re-expands near top');

  controller.componentWillUnmount();
  assert.equal(listeners.size, 0, faction + ' cleans up scroll listener');
}
console.log('Army role slots, original HUD styling and synchronized compact headers pass for all factions');
