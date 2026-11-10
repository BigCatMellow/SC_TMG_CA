// Codex explanations are teaching aids, never alternative or overriding rules.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const world = { alert() {}, scrollY: 0, scrollTo() {}, addEventListener() {}, removeEventListener() {} };
for (const name of [
  'terran-data.js','zerg-data.js','protoss-data.js','wave3-data.js',
  'model-portraits.js','battle-rules-data.js','codex-examples.js'
]) vm.runInNewContext(read(name), { window: world }, { filename: name });

const entries = world.SCTMG_CODEX_EXAMPLES;
assert.ok(Array.isArray(entries),'Missing Codex examples data');
assert.equal(entries.length, 15,'Curate 15 useful and sourced worked examples');
assert.equal(new Set(entries.map(e=>e.id)).size, entries.length,'Every example requires a stable unique ID');
const sourceRefs = new Set(world.SCTMG_BATTLE_RULES.sections.map(e=>e.sourceLabel));
assert.ok(sourceRefs.size>=10,'Rule section references should be available');
const knownKeywords=new Set(['terran','zerg','protoss'].flatMap(f=>
  Object.keys(world['SCTMG_'+f.toUpperCase()].KEYWORDS).map(k=>k.toUpperCase())));
const knownTags=new Set(['terran','zerg','protoss'].flatMap(f=>
  Object.keys(world['SCTMG_'+f.toUpperCase()].TAGS).map(k=>k.toUpperCase())));
for(const e of entries){
  assert.match(e.id,/^[a-z][a-z0-9-]+$/,'Stable example ID: '+e.id);
  for(const field of ['title','summary','plain','scenario','takeaway','source']){
    assert.ok(typeof e[field]==='string'&&e[field].trim().length>=12,
      e.id+' missing '+field);
  }
  assert.ok(Array.isArray(e.steps) && e.steps.length>=2 && e.steps.length<=5,
    e.id+' needs a short step-by-step example');
  assert.ok(e.steps.every(s=>typeof s==='string'&&s.length>=20),e.id+' incomplete steps');
  assert.match(e.source,/Core Rules|FAQ/i,e.id+' requires a named primary-rule reference');
  assert.ok(/§|p\./.test(e.source),e.id+' requires a precise source locator');
  for(const word of e.keywords || [])
    assert.ok(knownKeywords.has(word.toUpperCase()),e.id+' unknown keyword '+word);
  for(const tag of e.tags || [])
    assert.ok(knownTags.has(tag.toUpperCase()),e.id+' unknown tag '+tag);
  assert.ok(!/https?:\/\/.*?example/i.test(e.source),'Do not invent source links');
}
const css = read('shared-styles.css');
for(const selector of [
  '.sc-codex-example-link','.sc-example-overlay','.sc-example-dialog',
  '.sc-example-steps','.sc-example-close','.sc-example-disclaimer'
]) assert.ok(css.includes(selector),'Shared example CSS absent: '+selector);
assert.match(css,/max-height:\s*calc\(100dvh/,
  'Example modal must scroll in short phone viewports');
const expectedSource = [
  'Core Rules','FAQ','source','Official'
];
for(const faction of ['terran','zerg','protoss']){
  const name = faction[0].toUpperCase()+faction.slice(1)+' Army.dc.html';
  const html = read(name);
  assert.ok(html.includes('<script src="codex-examples.js"></script>'),
    name+' must load shared example data');
  const codex=html.slice(html.indexOf('<!-- ============ CODEX TAB'),
    html.indexOf('<!-- ============ BOTTOM TAB BAR'));
  assert.ok(codex.includes('list="{{ codexGroups }}"'),name+' glossary layout retained');
  assert.ok(codex.includes('onClick="{{ kw.onExample }}"'),name+' Codex example links');
  assert.ok(codex.includes('<sc-if value="{{ kw.hasExample }}"'),name+' optional example link');
  assert.ok(html.includes('<!-- ============ WORKED RULE EXAMPLE SHEET ============ -->'),
    name+' example modal');
  const modal=html.slice(html.indexOf('<!-- ============ WORKED RULE EXAMPLE SHEET'),
    html.indexOf('<!-- ============ TIER PICKER SHEET'));
  for(const binding of [
    'sheetExample','exampleTitle','exampleSummary','examplePlain','exampleScenario',
    'exampleSteps','exampleTakeaway','exampleSource','exampleCloseLabel',
    'closeExample','aria-modal="true"'
  ]) assert.ok(modal.includes(binding),name+' modal missing '+binding);
  assert.ok(modal.includes('Printed rules, specific card wording and official FAQ take precedence'),
    name+' must defer to authoritative rulebook');
  assert.ok(html.includes('onClick="{{ openSheetExample }}"'),
    name+' nested keyword sheet example link');
  const src=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(src,name+' controller absent');
  class Stub{
    setState(next,cb){
      this.state={...this.state,...(typeof next==='function'?next(this.state):next)};
      cb?.();
    }
  }
  const Controller = new Function('DCLogic','window',src+'\nreturn Component;')(Stub,world);
  const c = new Controller();
  c._secEls={};
  c.state={...c.state, ready:true, tab:'codex'};
  const view=()=>c.renderVals();
  const groups=view().codexGroups;
  assert.deepEqual(groups.map(g=>g.name),['Worked Rules','Keywords','Tags'],
    name+' Codex groups preserve glossary and add worked rules');
  assert.equal(groups[0].entries.length,15,name+' all examples listed');
  const pay=groups[0].entries.find(e=>e.name==='Paying for an Ability');
  assert.ok(pay && pay.hasExample && typeof pay.onExample==='function');
  pay.onExample();
  assert.equal(view().sheetExample,true,name+' open worked example from Codex');
  assert.equal(view().sheetTitle,'',name+' worked example must not open keyword sheet');
  assert.equal(view().exampleTitle,'Paying for an Ability');
  assert.equal(view().exampleSteps.length,3);
  assert.equal(view().exampleSource,entries[0].source);
  assert.equal(view().exampleCloseLabel,'Close');
  view().closeExample();
  assert.equal(view().sheetExample,false);
  assert.equal(view().sheetKeyword,false);

  // Rules list must filter on title, search terms and the plain-English summary.
  c.state.codexQ='disengage';
  assert.ok(view().codexGroups.find(g=>g.name==='Worked Rules').entries
    .some(e=>e.name==='Disengage and Tactical Mass'),name+' searchable rule examples');
  c.state.codexQ='';

  // Existing keyword sheets remain authoritative and link to the example.
  c.openKeyword('IMPACT');
  assert.equal(view().sheetKeyword,true);
  assert.equal(view().sheetHasExample,true);
  assert.match(view().sheetBody,/Charge/);
  view().openSheetExample();
  assert.equal(view().sheetExample,true);
  assert.equal(view().exampleTitle,'IMPACT After a Successful Charge');
  assert.equal(view().exampleCloseLabel,'Back to definition');
  view().closeExample();
  assert.equal(view().sheetKeyword,true,name+' back to prior keyword definition');
  assert.equal(view().sheetTitle,'IMPACT');
  view().closeSheet();
  assert.equal(view().sheetKeyword,false);
  c.openKeyword('TOUGH');
  assert.equal(view().sheetKeyword,true);
  assert.equal(view().sheetHasExample,false,name+' optional link absent on non-example keyword');
  view().closeSheet();
  // Unit-detail keyword links use the same openKeyword controller path.
  const hidden = c.exampleForGlossary('HIDDEN','keyword');
  assert.equal(hidden.id,'hidden-burrowed');
  const shield = c.exampleForGlossary('SHIELDED','keyword');
  if(world['SCTMG_'+faction.toUpperCase()].KEYWORDS.SHIELDED)
    assert.equal(shield.id,'shielded-damage');
  const tags=view().codexGroups.find(g=>g.name==='Tags').entries;
  const flying=tags.find(e=>e.name.toUpperCase()==='FLYING');
  assert.ok(flying && flying.hasExample,name+' Flying glossary example');
  flying.onExample();
  assert.equal(view().exampleTitle,'Contesting a Mission Marker');
  view().closeExample();

  // Search results for a keyword return to the shared keyword sheet with example access.
  c.state.searchQ='impact';
  const found=view().searchGroups.flatMap(g=>g.hits).find(hit=>hit.kind==='Keyword'&&hit.title==='IMPACT');
  assert.ok(found,name+' IMPACT search result');
  c.state.searchOpen=true;
  found.onOpen();
  assert.equal(view().searchOpen,false);
  assert.equal(view().sheetKeyword,true);
  assert.equal(view().sheetHasExample,true);
  view().closeSheet();
  console.log(faction+': 15 Codex entries, keyword links, search and modal return path passed');
}
console.log('All Codex worked example checks passed');
