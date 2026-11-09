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
  assert.ok(html.includes('<sc-if value="{{ !tabIsBattle }}"'), faction + ' battle HUD stays separate');
  for (const label of ['Minerals', 'Vespene', 'Supply'])
    assert.ok(html.includes('class="sc-resource-label-long">' + label + '</span>'), faction + ' ' + label + ' total');
  for (const label of ['M', 'G', 'S'])
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
  assert.ok(html.includes('scoreboardClass: st.resourcesCompact ?'), faction + ' scroll state binding');
  // Only the class and reversible sizing variables may change in the title row.
  assert.equal((html.match(/class="\{\{ titleHeaderClass \}\}"/g) || []).length, 1,
    faction + ' single title header');
  const titleStart = html.indexOf('    <!-- title row -->');
  const titleEnd = html.indexOf('    <!-- play HUD, scoreboard', titleStart);
  assert.ok(titleStart >= 0 && titleEnd > titleStart, faction + ' title region boundaries');
  let title = html.slice(titleStart, titleEnd);
  // The new management button is the sole permitted addition to the original title markup.
  const newButton = title.match(/      <button onClick="\{\{ openRosters \}\}" aria-label="Army management"[\s\S]*?<\/button>\n/);
  assert.ok(newButton, faction + ' management button beside Search');
  assert.equal((title.match(/aria-label="Army management"/g) || []).length, 1, faction + ' one header management action');
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
  assert.ok(sheet.includes('>Army Management</div>'), faction + ' management sheet heading');
  assert.ok(sheet.includes('>Saved Rosters</div>'), faction + ' saved roster list preserved');
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
  const css = () => controller.renderVals().resourceStripClass;
  const boardCss = () => controller.renderVals().scoreboardClass;
  const titleCss = () => controller.renderVals().titleHeaderClass;

  assert.equal(css(), 'sc-resource-strip', faction + ' resources start expanded');
  assert.equal(boardCss(), 'sc-scoreboard', faction + ' original scoreboard at top');
  assert.equal(titleCss(), 'sc-title-row', faction + ' original title at top');
  for (const tab of ['roster', 'battle', 'library', 'tactics']) {
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
  assert.equal(boardCss(), 'sc-scoreboard', faction + ' scoreboard unchanged on minor scroll');
  assert.equal(titleCss(), 'sc-title-row', faction + ' title unchanged on minor scroll');
  world.scrollY = 145;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' collapses');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard collapses');
  assert.equal(titleCss(), 'sc-title-row sc-title-row--compact', faction + ' title collapses');
  world.scrollY = 90;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' hysteresis');
  assert.equal(boardCss(), 'sc-scoreboard sc-scoreboard--compact', faction + ' scoreboard hysteresis');
  assert.equal(titleCss(), 'sc-title-row sc-title-row--compact', faction + ' title hysteresis');
  world.scrollY = 64;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip', faction + ' re-expands near top');
  assert.equal(boardCss(), 'sc-scoreboard', faction + ' scoreboard re-expands near top');
  assert.equal(titleCss(), 'sc-title-row', faction + ' title re-expands near top');

  controller.componentWillUnmount();
  assert.equal(listeners.size, 0, faction + ' cleans up scroll listener');
}
console.log('Original title and scoreboard styles preserved; synchronized compact headers pass for all factions');
