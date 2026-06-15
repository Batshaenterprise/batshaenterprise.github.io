const CACHE_NAME = 'batshas-static-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './compliance.html',
  './learners.html',
  './projects.html',
  './contact.html',
  './login.html',
  './register.html',
  './profile.html',
  './css/main.css',
  './js/main.js',
  './js/learners/auth.js',
  './js/learners/profile.js',
  './js/learners/validators.js',
  './js/data/storage.js',
  './assets/img/icon.png',
  './assets/img/logo.png',
  './assets/img/home-skills-community-owned.png',
  './assets/img/about-community-development-owned.png',
  './assets/img/learners-young-training.png',
  './assets/img/contact-enquiry.png',
  './assets/img/services-vocational.png',
  './assets/img/services-entrepreneurship.png',
  './assets/img/services-digital-literacy.png',
  './assets/img/services-community.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
