// Check one stationary model image per card, source metadata and error fallbacks.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const world = { alert(){} };
for (const file of ['terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js','model-portraits.js']) {
  vm.runInNewContext(read(file), {window: world}, {filename: file});
}
const config = world.SCTMG_MODEL_PORTRAITS;
const pdfSource = JSON.parse(read('portraits/pdf/source-manifest.json'));
const photoHashes = new Map(pdfSource.units.map(x => [x.faction + '/' + x.unit_id, x]));
assert.equal(photoHashes.size, 22);
let localPhotoCount = 0;
assert.ok(config && config.version === 1);
assert.deepEqual(Object.keys(config.factions).sort(), ['protoss','terran','zerg']);
// Units with no painted-miniature photo show no art (renders/concept art are not used).
const expectedUnmapped = [];
const unmapped = [];
const stats = {};
const controllers = {};
for (const faction of ['terran','zerg','protoss']) {
  const file = faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html';
  const html = read(file);
  assert.ok(html.includes('src="model-portraits.js"'),file+' gallery load missing');
  assert.ok(html.indexOf('src="model-portraits.js"') > html.indexOf('src="wave3-data.js"'));
  // The retired Roster view no longer duplicates model art; Battle and Library each show one.
  // Battle rows show one image: the cutout, else the photo.
  assert.equal((html.match(/<img src="\{\{ u\.img \}\}" onError="\{\{ u\.onImgError \}\}"/g)||[]).length, 1, file+' Battle row image');
  assert.equal((html.match(/<img (?:loading="lazy" )?src="\{\{ en\.portrait \}\}" onError="\{\{ en\.onPortraitError \}\}"/g)||[]).length, 1, file+' Library portrait');
  assert.equal((html.match(/background-image:\{\{ (?:en|u)\.portraitBg \}\}/g)||[]).length, 0, file+' old layered backgrounds');
  const component = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(component, file+' controller missing');
  class Stub { setState(update, done) {
    const next=typeof update==='function'?update(this.state):update;
    this.state={...this.state,...next};done?.();
  }}
  const Controller = new Function('DCLogic','window',component+'\nreturn Component;')(Stub,world);
  const controller = new Controller();
  controllers[faction] = controller;
  const d = world['SCTMG_'+faction.toUpperCase()];
  const ids = d.UNITS.map(u=>u.id);
  assert.equal(ids.length,new Set(ids).size,'duplicate Unit IDs');
  for(const id of Object.keys(config.factions[faction])) {
    assert.ok(ids.includes(id),faction+' image maps to non-existent Unit: '+id);
  }
  stats[faction]={total:d.UNITS.length,covered:0,remote:0,local:0,variants:0};
  for(const unit of d.UNITS) {
    const entry=config.factions[faction][unit.id];
    const picture=controller.portrait(unit);
    if(entry) {
      assert.ok(['exact-miniature','shared-sculpt'].includes(entry.kind),unit.id+' provenance required');
      assert.ok(entry.src || entry.fallbackId,unit.id+' must define a photo or fallback');
      if(entry.src) {
        if(entry.src.startsWith('https://')) stats[faction].remote++;
        else if(entry.src.startsWith('portraits/promo/')) {
          // Publisher promo photo supplied by hand: must exist and say where it came from.
          assert.ok(fs.existsSync(new URL('../' + entry.src, import.meta.url)),unit.id+' promo photo missing');
          assert.ok(entry.promo,unit.id+' promo photo needs a provenance note');
          stats[faction].local++;
        }
        else {
          assert.ok(entry.src.startsWith('portraits/pdf/'),unit.id+' unrecognized local image');
          stats[faction].local++;
          localPhotoCount++;
          const photo = photoHashes.get(faction + '/' + unit.id);
          assert.ok(photo,unit.id+' not present in PDF image source manifest');
          assert.equal(entry.src, 'portraits/pdf/' + photo.file,unit.id+' wrong image path');
          assert.equal(entry.sourcePdfPage, photo.pdf_page,unit.id+' wrong page citation');
          const file = new URL('../' + entry.src, import.meta.url);
          assert.ok(fs.existsSync(file),unit.id+' extracted PDF JPEG missing');
          const digest = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
          assert.equal(digest,photo.sha256,unit.id+' PDF JPEG checksum mismatch');
        }
        if(!entry.promo) assert.ok(entry.source?.startsWith('https://'),unit.id+' missing publisher source link');
        assert.ok(picture.portraitBg.includes(entry.src),unit.id+' image is not displayed');
      }
      if(entry.fallbackId) {
        stats[faction].variants++;
        assert.ok(ids.includes(entry.fallbackId),unit.id+' fallback is not an actual unit');
      }
    }
    if(picture.portrait) {
      stats[faction].covered++;
      assert.ok(picture.portraitBg.startsWith("url('"),unit.id+' CSS image missing');
      assert.ok(picture.portraitSize && picture.portraitPos,unit.id+' layout metadata missing');
      assert.equal([...picture.portraitBg.matchAll(/url\('([^']+)'\)/g)].length, 1,
        unit.id+' must render exactly one visible miniature');
      assert.match(picture.portraitImgStyle, /position:absolute;/,unit.id+' image not anchored');
      assert.match(picture.portraitImgStyle, /top:-?\d+px;/,unit.id+' image has no fixed top');
      assert.match(picture.portraitImgStyle, /height:\d+px;/,unit.id+' artwork has no fixed height');
      assert.equal(picture.portraitImgStyle,controller.portrait(unit).portraitImgStyle,
        unit.id+' image placement must not depend on card expansion');
      assert.equal(typeof picture.onPortraitError,'function',unit.id+' image fallback handler absent');
      // Every pre-existing or variant local portrait must still exist in the repository.
      const paths=[...picture.portraitBg.matchAll(/url\('([^']+)'\)/g)].map(x=>x[1]);
      for(const path of paths.filter(x=>!x.startsWith('https://'))) {
        assert.ok(fs.existsSync(new URL('../'+path, import.meta.url)),unit.id+' lost local fallback: '+path);
      }
    } else {
      unmapped.push(faction+'/'+unit.id);
    }
  }
}
// Simulate one element failing through all available sources: image changes in place.
const raynor = controllers.terran.portrait({ id: 'jim-raynor' });
const img = { src: raynor.portrait, dataset: {}, style: { cssText: raynor.portraitImgStyle, display: '' } };
raynor.onPortraitError({ currentTarget: img });
assert.equal(img.src, config.factions.terran['jim-raynor'].fallbackSrc);
raynor.onPortraitError({ currentTarget: img });
assert.equal(img.src, 'portraits/terran/jim-raynor.png');
raynor.onPortraitError({ currentTarget: img });
assert.equal(img.style.display, 'none','exhausted sources must not render a broken icon');
const raptor = controllers.zerg.portrait({ id: 'raptor' });
assert.equal(raptor.portrait,'portraits/pdf/zerg/raptor.jpg');
const raptorImage = { src: raptor.portrait, dataset: {}, style: { cssText: raptor.portraitImgStyle, display: '' } };
raptor.onPortraitError({ currentTarget: raptorImage });
assert.equal(raptorImage.src,'portraits/zerg/zergling.png','related sculpt is error-only fallback');
assert.deepEqual(unmapped.sort(),expectedUnmapped,'unexpected missing model photos');
// Only miniature photos: no game renders, card art or concept art anywhere in the army screens.
const conceptArt=['uploads/','portraits/terran-tactics/','portraits/zerg/corpser.png','portraits/zerg/queen.png',
  'portraits/protoss/praetor-guard.png','portraits/protoss/zealot.png','portraits/protoss/pylon.png',
  'portraits/terran/point-defense-drone.png','portraits/terran/raynors-raider.png'];
for (const faction of ['terran','zerg','protoss']) {
  const html = read(faction[0].toUpperCase() + faction.slice(1) + ' Army.dc.html');
  for (const path of conceptArt) assert.ok(!html.includes(path), faction + ' still uses concept/render art: ' + path);
}
assert.equal(Object.values(stats).reduce((n,x)=>n+x.total,0),45,'check audit when adding units');
assert.equal(Object.values(stats).reduce((n,x)=>n+x.covered,0),45);
assert.equal(localPhotoCount,22,'all 22 original PDF miniatures must be displayed');
assert.equal(pdfSource.pdf_sha256,'27639c562e6db9777dd9ba984d0c9f9b581841ec30166848e021f893cd00ea54');
const terranHtml=read('Terran Army.dc.html');
const queenHtml=read('Zerg Army.dc.html');
assert.ok(terranHtml.includes('portraits/terran/jim-raynor.png'),'Jim Raynor photo fallback retained');
assert.ok(queenHtml.includes('portraits/zerg/kerrigan.png'),'Kerrigan photo fallback retained');
console.log('Model portraits:',JSON.stringify(stats),'missing:',unmapped);
