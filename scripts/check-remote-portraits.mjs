// Checks that every remote miniature photo still loads the way the live site
// requests it (with the GitHub Pages page as Referer). Needs internet, so it runs
// in its own scheduled workflow rather than in the offline test suite.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const w = {}; w.window = w;
vm.runInNewContext(readFileSync(new URL('../model-portraits.js', import.meta.url), 'utf8'), w);
const referer = 'https://bigcatmellow.github.io/SC_TMG_CA/';
const entries = [];
for (const [faction, units] of Object.entries(w.SCTMG_MODEL_PORTRAITS.factions)) {
  for (const [id, p] of Object.entries(units)) {
    for (const key of ['src', 'viewSrc']) {
      if (typeof p[key] === 'string' && /^https?:/.test(p[key])) entries.push({ faction, id, key, url: p[key] });
    }
  }
}
let failed = 0;
for (const e of entries) {
  let status = 'error', type = '';
  try {
    const res = await fetch(e.url, { headers: { Referer: referer, 'User-Agent': 'Mozilla/5.0 (portrait link check)' }, redirect: 'follow' });
    status = res.status; type = res.headers.get('content-type') || '';
    await res.arrayBuffer();
  } catch (err) { status = 'error: ' + err.message; }
  const ok = status === 200 && /^image\//.test(type);
  if (!ok) failed++;
  console.log((ok ? 'ok  ' : 'FAIL') + '  ' + e.faction + '/' + e.id + ' (' + e.key + ')  ' + status + ' ' + type);
}
console.log('\n' + (entries.length - failed) + ' / ' + entries.length + ' remote portraits load.');
if (failed) {
  console.log('Broken photos fall back to local art in the app, but the source map in model-portraits.js should be updated.');
  process.exit(1);
}
