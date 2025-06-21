const CACHE_NAME = 'mp3-player-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page for HTML requests
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Message handler for caching MP3 files
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_MP3') {
    const { url, filename } = event.data;
    
    caches.open(CACHE_NAME).then((cache) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            cache.put(url, response.clone());
            // Notify the client that caching is complete
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: 'MP3_CACHED',
                  filename: filename,
                  url: url
                });
              });
            });
          }
        })
        .catch((error) => {
          console.error('Failed to cache MP3:', error);
        });
    });
  }
});
