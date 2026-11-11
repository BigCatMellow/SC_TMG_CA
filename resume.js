/* Resume where you left off.
 * A cold launch (new tab or the installed app being reopened) lands on index.html.
 * If the last screen used was another page, jump straight back to it, then restore
 * that page's scroll position. Navigating Home inside the app never redirects. */
(function () {
  var LAST = 'sctmg_last_page', SESSION = 'sctmg_session', RESUME = 'sctmg_resuming';
  var page;
  try { page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html'); } catch (e) { return; }
  var isHome = page === 'index.html' || page === 'Command Center.dc.html';
  var scrollKey = 'sctmg_scroll:' + page;
  try {
    var fresh = !sessionStorage.getItem(SESSION);
    sessionStorage.setItem(SESSION, '1');
    if (isHome && fresh) {
      var last = localStorage.getItem(LAST);
      if (last && last !== 'index.html' && /^[A-Za-z ]+\.dc\.html$/.test(last)) {
        sessionStorage.setItem(RESUME, '1');
        location.replace(encodeURI(last));
        return;
      }
    }
    localStorage.setItem(LAST, isHome ? 'index.html' : page);
    var resuming = fresh || sessionStorage.getItem(RESUME) === '1';
    sessionStorage.removeItem(RESUME);
  } catch (e) { return; }

  function saveScroll() {
    try { localStorage.setItem(scrollKey, String(Math.round(window.scrollY || 0))); } catch (e) {}
  }
  window.addEventListener('pagehide', saveScroll);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') saveScroll(); });

  if (!resuming || isHome) return;
  var y = 0;
  try { y = parseInt(localStorage.getItem(scrollKey) || '0', 10) || 0; } catch (e) {}
  if (y <= 0) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Pages render after their data loads, so wait until there is enough height to scroll to.
  var tries = 0;
  (function attempt() {
    var room = document.documentElement.scrollHeight - window.innerHeight;
    if (room >= y || tries++ > 60) { window.scrollTo(0, Math.min(y, Math.max(0, room))); return; }
    setTimeout(attempt, 50);
  })();
})();
