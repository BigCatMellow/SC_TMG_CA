/* Firefox Console > Game Rules.
   Captures each nested accordion immediately; never needs all sections
   to remain open simultaneously. Tested selectors: Command Center Beta v1.4. */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const root = () => document.querySelector('#rules-container');
  const menu = () => document.querySelector('#rules-section-select');

  if (!root() || !menu()) {
    console.error('Open the Game Rules page first.');
    return;
  }

  const levels = [
    ['.rule-cat-wrapper', '.rule-cat-btn', '.rule-cat-body'],
    ['.rule-sub-wrapper', '.rule-sub-btn', '.rule-sub-body'],
    ['.rule-subsub-wrapper', '.rule-subsub-btn', '.rule-subsub-body']
  ];

  const sections = [...menu().options].map(o => ({
    id: o.value,
    title: o.textContent.trim()
  }));

  function ownText(element, excludeSelector) {
    if (!element) return '';
    const copy = element.cloneNode(true);

    if (excludeSelector) {
      copy.querySelectorAll(excludeSelector).forEach(n => n.remove());
    }

    copy.querySelectorAll('br').forEach(n => n.replaceWith('\n'));
    copy.querySelectorAll('td,th').forEach(n => n.append('\t'));
    copy.querySelectorAll(
      'tr,p,li,div,h1,h2,h3,h4,h5,h6,section,article'
    ).forEach(n => n.append('\n'));

    return (copy.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Resolve again after every click because the site may re-render its DOM.
  async function openPath(indices) {
    for (let attempt = 0; attempt < 8; attempt++) {
      let parent = root();
      let last = null;
      let clicked = false;

      if (!parent) return null;

      for (let depth = 0; depth < indices.length; depth++) {
        const [wrapperSelector, buttonSelector, bodySelector] = levels[depth];
        const wrappers = [...parent.querySelectorAll(wrapperSelector)];
        const wrapper = wrappers[indices[depth]];
        const button = wrapper?.querySelector(':scope > ' + buttonSelector);
        const body = wrapper?.querySelector(':scope > ' + bodySelector);

        if (!wrapper || !button) return null;

        if (!body) {
          button.click();
          clicked = true;
          await sleep(120);
          break;
        }

        last = { wrapper, button, body };
        parent = body;
      }

      if (!clicked) return last;
    }

    return null;
  }

  const output = [];
  const report = [];

  for (const section of sections) {
    const select = menu();
    select.value = section.id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(400);

    const blocks = [];
    const errors = [];

    const intro = root();
    if (!intro) {
      report.push({ section: section.title, categories: 0, chars: 0,
        errors: 'No rules container' });
      continue;
    }

    const general = ownText(intro, levels[0][0]);
    if (general) blocks.push(general);

    async function capture(path) {
      const depth = path.length - 1;
      const current = await openPath(path);
      const location = path.join('.');

      if (!current) {
        errors.push('Could not expand ' + location);
        return;
      }

      const nextLevel = levels[depth + 1];
      const title = current.button.innerText.trim();
      const own = ownText(current.body, nextLevel?.[0]);
      blocks.push('\n' + '#'.repeat(depth + 2) + ' ' + title);
      if (own) blocks.push(own);

      if (nextLevel) {
        const count = current.body.querySelectorAll(nextLevel[0]).length;
        for (let child = 0; child < count; child++) {
          await capture([...path, child]);
        }
      }
    }

    const categoryCount = root().querySelectorAll(levels[0][0]).length;

    for (let i = 0; i < categoryCount; i++) {
      await capture([i]);
    }

    const text = blocks.join('\n\n').trim();
    output.push('='.repeat(70) + '\n' + section.title +
      '\n' + '='.repeat(70) + '\n\n' +
      (text || 'No rules defined.'));

    report.push({
      section: section.title,
      categories: categoryCount,
      chars: text.length,
      errors: errors.join('; ')
    });
    console.log('Captured', section.title, text.length, errors);
  }

  console.table(report);

  const problems = report.filter(r => r.errors);
  if (problems.length) {
    console.warn('Review incomplete sections:', problems);
  }

  const allText = output.join('\n\n\n');
  if (!allText) {
    console.error('Nothing to export.');
    return;
  }

  const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starcraft-complete-rules.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  console.log('Exported', sections.length, 'sections,', allText.length,
    'characters. Compare the audit before relying on completeness.');
})();
