// PDF Service Worker for caching and offline support
const CACHE_NAME = 'mini-cd-world-pdf-cache-v1';
const CACHE_ASSETS = [
  '/index.html',
  '/pdf-worker.js',
  // Main app assets that are needed for PDF generation
  '/assets/index.js',
  '/assets/index.css'
];

// Install the service worker and cache necessary resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('PDF Service Worker: Caching assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('PDF Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache PDF generation requests and network fallback
self.addEventListener('fetch', event => {
  // Only handle API requests for PDF generation
  if (event.request.url.includes('/pdf/') || 
      event.request.url.endsWith('.pdf')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          // Return cached response if available
          if (response) {
            console.log('PDF Service Worker: Serving cached PDF', event.request.url);
            return response;
          }
          
          // Otherwise fetch from network
          return fetch(event.request).then(networkResponse => {
            // Cache the PDF for future offline use
            if (networkResponse.ok && 
                (networkResponse.headers.get('content-type') || '').includes('application/pdf')) {
              console.log('PDF Service Worker: Caching new PDF', event.request.url);
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(error => {
            console.error('PDF Service Worker: Fetch failed', error);
            // Return a fallback response or error page
            return new Response(
              JSON.stringify({ 
                error: 'No se pudo generar el PDF. Verifica tu conexión a internet.' 
              }),
              { 
                status: 503, 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          });
        });
      })
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_PDF_CACHE') {
    console.log('PDF Service Worker: Clearing PDF cache');
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(requests => {
        requests.forEach(request => {
          if (request.url.includes('/pdf/') || request.url.endsWith('.pdf')) {
            cache.delete(request);
          }
        });
      });
    });
  }
}); 