/* Firefox console: save the currently rendered Command Center HTML.
   This is a DOM snapshot, NOT the full underlying dataset. */
(() => {
  const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starcraft-page-inspection.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  console.log('Saved HTML snapshot:', html.length, 'characters.');
  console.warn('Inspect before sharing; page state and asset URLs may be included.');
})();
