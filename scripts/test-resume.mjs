// Reopening the app should land where you left off, not on the home menu.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const pages = ['index.html', 'Missions.dc.html', 'Rules.dc.html', 'Zerg Army.dc.html', 'Terran Army.dc.html', 'Protoss Army.dc.html'];
for (const p of pages) {
  const html = read(p);
  assert.ok(html.indexOf('<script src="./resume.js"></script>') > -1 &&
    html.indexOf('<script src="./resume.js"></script>') < html.indexOf('<script src="./support.js"></script>'), p + ' loads resume.js first');
  if (p !== 'index.html') assert.ok(html.includes('<a href="index.html" aria-label="Back to command center"'), p + ' back goes to the real home');
}
for (const f of ['zerg', 'terran', 'protoss']) {
  const html = read(f[0].toUpperCase() + f.slice(1) + ' Army.dc.html');
  assert.ok(html.includes("localStorage.setItem('sctmg_" + f + "_tab', st.tab)"), f + ' remembers open tab');
  assert.ok(html.includes("localStorage.getItem('sctmg_" + f + "_tab')"), f + ' restores open tab');
}

// Simulate launches.
const src = read('resume.js');
function launch(path, local, session = new Map()) {
  const store = m => ({ getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) });
  let replaced = null;
  const win = { scrollY: 0, innerHeight: 800, addEventListener() {}, scrollTo() {} };
  vm.runInNewContext(src, {
    location: { pathname: '/SC_TMG_CA/' + encodeURI(path), replace: u => { replaced = decodeURIComponent(u); } },
    localStorage: store(local), sessionStorage: store(session), window: win, history: {},
    document: { addEventListener() {}, documentElement: { scrollHeight: 0 } }, setTimeout() {}
  });
  return { replaced, session };
}
const local = new Map();
assert.equal(launch('index.html', local).replaced, null, 'first launch stays home');
launch('Zerg Army.dc.html', local);
assert.equal(local.get('sctmg_last_page'), 'Zerg Army.dc.html');
assert.equal(launch('index.html', local).replaced, 'Zerg Army.dc.html', 'cold launch resumes last screen');
const s = new Map([['sctmg_session', '1']]);
assert.equal(launch('index.html', local, s).replaced, null, 'tapping Home inside the app stays home');
assert.equal(local.get('sctmg_last_page'), 'index.html');
assert.equal(launch('index.html', local).replaced, null, 'left on home, reopens on home');
launch('Command Center.dc.html', local);
assert.equal(local.get('sctmg_last_page'), 'index.html', 'old home page counts as home');
console.log('Resume checks passed.');
