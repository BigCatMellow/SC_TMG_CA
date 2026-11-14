/* Firefox Console > Deployment Maps > Official Deployments.
   Downloads each original Firebase image and produces ONE ZIP containing JPGs. */
(async () => {
  if (!document.querySelector('#dmtab-official.active')) {
    console.error('Open Deployment Maps > Official Deployments first.');
    return;
  }

  const input = document.querySelector('.dm-search-input');
  const format = document.querySelector('.dm-format-select');
  if (input?.value || (format && format.value !== 'All')) {
    console.error('Clear the map search and select All Formats first.');
    return;
  }

  const maps = [...document.querySelectorAll(
    '#dm-grid-container .dm-card-entry'
  )].map(card => ({
    name: card.querySelector(
      '.dm-card-actions div[style*="font-size:14px"]'
    )?.textContent.trim(),
    url: card.querySelector('img.dm-img-scale')?.src
  })).filter(m => m.name && m.url);

  console.log('Map images found:', maps.length);
  if (!maps.length) return console.error('No map images found.');
  if (maps.length !== 13) {
    console.warn('Historical baseline was 13 maps; verify the current catalog.');
  }

  if (!window.JSZip) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const zip = new JSZip();
  const failures = [];
  const usedNames = new Set();

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];

    try {
      console.log('Fetching ' + (i + 1) + '/' + maps.length, map.name);
      const response = await fetch(map.url);
      if (!response.ok) throw new Error('HTTP ' + response.status);

      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('Response was not an image: ' + blob.type);
      }

      let stem = map.name.replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_|_$/g, '');
      if (!stem) stem = 'deployment_' + (i + 1);
      let filename = stem + '.jpg';
      let number = 2;

      while (usedNames.has(filename)) {
        filename = stem + '_' + number++ + '.jpg';
      }

      usedNames.add(filename);
      zip.file(filename, blob);

    } catch (error) {
      failures.push({ map: map.name, error: String(error) });
      console.error('Failed:', map.name, error);
    }
  }

  if (failures.length) {
    console.table(failures);
    return console.error('No ZIP created: some map downloads failed.');
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob', compression: 'STORE'
  });

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starcraft-deployment-maps.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);

  console.log('ZIP created:', maps.length, 'JPGs,',
    zipBlob.size, 'bytes. Open the ZIP to view individual maps.');
})();
