const CACHE_NAME = 'fugaq-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/script.js',
  '/company.html',
  '/services.html',
  '/results.html',
  '/news.html',
  '/ir.html',
  '/contact.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});