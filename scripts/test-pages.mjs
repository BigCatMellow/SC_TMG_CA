import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const base = new URL('../dist-pages/', import.meta.url);
const required = [
  'index.html','support.js','shared-styles.css','model-portraits.js','codex-examples.js',
  'wave3-data.js','terran-data.js','protoss-data.js','zerg-data.js',
  'Rules.dc.html','Missions.dc.html','UnitDetail.dc.html',
  'Terran Army.dc.html','Zerg Army.dc.html','Protoss Army.dc.html',
  'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png',
  'sw.js','vendor/fonts.css','vendor/react.production.min.js','vendor/react-dom.production.min.js',
  'portraits/cutout/index.js'
];
const swSource = await readFile(new URL('../dist-pages/sw.js', import.meta.url),'utf8');
assert.ok(!swSource.includes("const VERSION = 'dev'"),'Service worker version must be stamped at deploy');
assert.match(swSource, /vendor\/react\.production\.min\.js/, 'Offline cache must include React');
assert.match(swSource, /Zerg%20Army\.dc\.html/, 'Offline cache must include faction screens');
for (const path of required)
  assert.ok((await stat(new URL('../dist-pages/' + path, import.meta.url))).size > 0,
    'Missing deployed companion dependency ' + path);
const html = await readFile(new URL('../dist-pages/index.html', import.meta.url),'utf8');
assert.match(html, /<title>StarCraft TMG Companion<\/title>/);
assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
assert.match(html, /<script src="\.\/support\.js"><\/script>/);
const manifest = JSON.parse(await readFile(new URL('../dist-pages/manifest.webmanifest', import.meta.url),'utf8'));
assert.equal(manifest.start_url,'./index.html');
assert.equal(manifest.scope,'./');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.icons.length,2);
for (const size of [192,512]) {
  const png = await readFile(new URL('../dist-pages/icons/icon-' + size + '.png', import.meta.url));
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),size);
  assert.equal(png.readUInt32BE(20),size);
}
for (const faction of ['terran','zerg','protoss']) {
  const file = faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html';
  const html = await readFile(new URL('../dist-pages/' + file, import.meta.url),'utf8');
  assert.match(html, /shared-styles\.css/);
  assert.match(html, /support\.js/);
  assert.match(html, /codex-examples\.js/,file+' shared Codex example data must be referenced');
  assert.match(html, /sc-if/);
}
let imageCount=0;
for(const faction of ['terran','zerg','protoss']) {
  const entries=await readdir(new URL('../dist-pages/portraits/pdf/' + faction + '/', import.meta.url));
  imageCount+=entries.filter(x=>x.endsWith('.jpg')).length;
}
assert.equal(imageCount,22,'Deployment must retain all 22 Wave 1 photographs');
for(const forbidden of ['agent-rules','notebooklm','.git','scripts']) {
  const listing=await readdir(base);
  assert.ok(!listing.includes(forbidden),'Unexpected deployment of '+forbidden);
}
console.log('Pages site validated, 22 miniatures retained and PWA manifest/icons installable');
