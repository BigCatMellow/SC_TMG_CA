/* Firefox Console > Mission Cards > Official Missions.
   Uses the site's native rendered-card JPG exporter, not screenshot previews. */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  if (!document.querySelector('#tab-official.active') ||
      typeof window.mcDownloadCard !== 'function') {
    console.error('Open Mission Cards > Official Missions first.');
    return;
  }

  const input = document.querySelector('.mc-search-input');
  const format = document.querySelector('.mc-format-select');

  if (input?.value || (format && format.value !== 'All')) {
    console.error('Clear the mission search and select All Formats first.');
    return;
  }

  const buttons = [...document.querySelectorAll(
    '#mc-grid-container button[onclick*="mcDownloadCard"]'
  )];

  const ids = [...new Set(buttons.map(b =>
    b.getAttribute('onclick')?.match(/mcDownloadCard\('([^']+)'\)/)?.[1]
  ).filter(Boolean))];

  console.log('Found', ids.length, 'official mission cards.');
  if (!ids.length) return console.error('No cards found.');
  if (ids.length !== 14) {
    console.warn('Historical baseline was 14; verify the current catalog.');
  }

  const failures = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    try {
      console.log('Requesting image ' + (i + 1) + '/' + ids.length, id);
      await Promise.resolve(window.mcDownloadCard(id));
      await sleep(2500);
    } catch (error) {
      failures.push({ id, error: String(error) });
      console.error('Request failed:', id, error);
    }
  }

  console.log('Requests submitted:', ids.length,
    'JavaScript errors:', failures.length);
  if (failures.length) console.table(failures);
  console.warn('Check Firefox Downloads: a request is not proof that a JPG saved.');
})();
