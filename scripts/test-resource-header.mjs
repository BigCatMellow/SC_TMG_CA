// Scroll collapse regression: one compact resources row across all faction screens.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const styles = read('shared-styles.css');
assert.match(styles, /\.sc-resource-strip--compact\s*\{\s*height:\s*26px;/);
assert.match(styles, /\.sc-resource-strip\s*\{[\s\S]*?height:\s*50px;/);
assert.match(styles, /prefers-reduced-motion/);

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

  assert.equal(css(), 'sc-resource-strip', faction + ' starts expanded');
  controller.componentDidMount();
  assert.equal(listeners.get('scroll')?.options?.passive, true, faction + ' passive scroll listener');

  world.scrollY = 100;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip', faction + ' does not collapse on minor scroll');
  world.scrollY = 145;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' collapses');
  world.scrollY = 90;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip sc-resource-strip--compact', faction + ' hysteresis');
  world.scrollY = 64;
  listeners.get('scroll').cb();
  assert.equal(css(), 'sc-resource-strip', faction + ' re-expands near top');

  controller.componentWillUnmount();
  assert.equal(listeners.size, 0, faction + ' cleans up scroll listener');
}
console.log('Responsive resource header checks passed for Terran, Zerg and Protoss');
