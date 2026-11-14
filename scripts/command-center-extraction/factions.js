/* Firefox Console > Factions & Cards.
   Collect each faction/card/phase individually; saves a plain-text archive. */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const root = () => document.querySelector('#fac-main-content');
  const factions = ['zerg', 'terran', 'protoss'];
  const categories = ['faction_cards', 'unit_cards', 'tactical_cards'];

  if (!root() || typeof window.switchFaction !== 'function') {
    console.error('Open Factions & Cards first.');
    return;
  }

  const category = id => [...root().querySelectorAll('.fac-category-wrapper')]
    .find(w => w.querySelector('.fac-category-btn')
      ?.getAttribute('onclick')?.includes("'" + id + "'"));

  const card = id => [...root().querySelectorAll('.fac-item-wrapper')]
    .find(w => w.querySelector('.fac-item-btn')
      ?.getAttribute('onclick')?.includes("'" + id + "'"));

  const cardId = button =>
    button.getAttribute('onclick')?.match(/toggleItem\('([^']+)'\)/)?.[1];

  async function openCategory(id) {
    let w = category(id);
    if (!w) return false;
    if (!w.querySelector('.fac-category-body')) {
      w.querySelector('.fac-category-btn').click();
      await sleep(150);
    }
    return !!category(id)?.querySelector('.fac-category-body');
  }

  async function openCard(id) {
    let w = card(id);
    if (!w) return false;
    if (!w.querySelector('.fac-item-body')) {
      w.querySelector('.fac-item-btn').click();
      await sleep(150);
    }
    return !!card(id)?.querySelector('.fac-item-body');
  }

  async function expandPhases(id) {
    const phaseClicks = [...(card(id)?.querySelectorAll(
      '.fac-item-body .fac-phase-btn'
    ) || [])].map(b => b.getAttribute('onclick')).filter(Boolean);

    for (const onclick of phaseClicks) {
      const current = card(id)?.querySelector('.fac-item-body');
      if (!current) return;
      const b = [...current.querySelectorAll('.fac-phase-btn')]
        .find(x => x.getAttribute('onclick') === onclick);
      if (!b) continue;
      const wrapper = b.closest('.fac-phase-wrapper');
      if (!wrapper?.querySelector('.fac-phase-body')) {
        b.click();
        await sleep(100);
      }
    }
  }

  const output = [];
  const audit = [];

  for (const faction of factions) {
    await Promise.resolve(window.switchFaction(faction));
    await sleep(600);

    if (typeof window.facSearch === 'function') {
      window.facSearch('');
      await sleep(150);
    }

    if (!document.querySelector('.fac-tab-btn.' + faction + '.active')) {
      audit.push({ faction, category: 'all', expected: 0, captured: 0,
        failure: 'Faction did not switch' });
      continue;
    }

    output.push('\n' + '='.repeat(70) +
      '\nFACTION: ' + faction.toUpperCase() +
      '\n' + '='.repeat(70));

    for (const categoryId of categories) {
      if (!await openCategory(categoryId)) {
        audit.push({ faction, category: categoryId,
          expected: 0, captured: 0, failure: 'Missing category' });
        continue;
      }

      const w = category(categoryId);
      const heading = w.querySelector('.fac-category-btn').innerText.trim();
      const ids = [...w.querySelectorAll('.fac-item-btn')]
        .map(cardId).filter(Boolean);

      const expected = Number(heading.match(/\((\d+)\)/)?.[1] ?? ids.length);
      let captured = 0;
      const failedIds = [];
      output.push('\n\n### ' + heading + '\n');

      for (const id of ids) {
        if (!await openCard(id)) {
          failedIds.push(id + ': could not open');
          continue;
        }

        await expandPhases(id);
        const w = card(id);
        const body = w?.querySelector('.fac-item-body');
        const title = w?.querySelector('.fac-item-btn')?.innerText.trim();

        if (!body || !body.innerText.trim()) {
          failedIds.push(id + ': empty body');
          continue;
        }

        const images = [...body.querySelectorAll('img')]
          .map(img => img.currentSrc || img.src).filter(Boolean);

        output.push('\n' + '-'.repeat(60) +
          '\nCARD: ' + title + '\nID: ' + id +
          '\n' + '-'.repeat(60) +
          '\n' + body.innerText.trim() +
          (images.length ? '\n\nIMAGE URLS:\n' + images.join('\n') : '') +
          '\n');

        captured++;

        // Close the current card ONLY after saving it.
        const latest = card(id);
        if (latest?.querySelector('.fac-item-body')) {
          latest.querySelector('.fac-item-btn').click();
          await sleep(65);
        }
      }

      audit.push({ faction, category: categoryId,
        expected, captured, failure: failedIds.join('; ') });
      console.log(faction, categoryId, captured + '/' + expected);
      if (failedIds.length) console.warn('Missing cards', failedIds);
    }
  }

  console.table(audit);
  const incomplete = audit.filter(x => x.expected !== x.captured ||
    x.failure);
  if (incomplete.length) console.warn('Incomplete extraction:', incomplete);

  const text = output.join('\n');
  if (!text.trim()) return console.error('Nothing collected.');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starcraft-all-factions-and-cards.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  console.log('Exported', text.length, 'characters. Audit totals above.');
})();
