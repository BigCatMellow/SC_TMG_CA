// Offline support for the companion. Pages are network-first (fresh when online,
// cached when not); scripts, styles, fonts and images are served from cache and
// refreshed in the background. scripts/prepare-pages.mjs fills PRECACHE and
// VERSION at deploy time, so every deploy installs a fresh cache.
const VERSION = 'dev';
const PRECACHE = ['./', 'index.html'];
const CACHE = 'sctmg-' + VERSION;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache =>
    // One missing file must not block the install.
    Promise.all(PRECACHE.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('sctmg-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

function isPage(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && isPage(request)) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request, { ignoreSearch: true })
      .then(hit => hit || caches.match('index.html'))));
    return;
  }

  // Stale-while-revalidate for assets, including external portrait galleries.
  event.respondWith(caches.open(CACHE).then(cache =>
    cache.match(request, { ignoreSearch: sameOrigin }).then(hit => {
      const update = fetch(request).then(response => {
        if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
        return response;
      }).catch(() => hit);
      return hit || update;
    })
  ));
});
