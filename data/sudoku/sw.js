var CACHE = 'sudoku-v2';

// Must cache for the game to work offline at all.
var CORE = [
	'./',
	'index.html',
	'sudoku.css',
	'sudoku.js',
	'manifest.webmanifest'
];

// Nice to have offline (site chrome, icons); cached best-effort.
var EXTRA = [
	'icon-192.png',
	'icon-512.png',
	'/global.css',
	'/images/banner.jpg',
	'/images/favicon.png'
];

self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(CACHE).then(function (cache) {
			return cache.addAll(CORE).then(function () {
				return Promise.all(EXTRA.map(function (url) {
					return cache.add(url).catch(function () { /* optional asset, ignore */ });
				}));
			});
		}).then(function () { return self.skipWaiting(); })
	);
});

self.addEventListener('activate', function (e) {
	e.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(keys.map(function (k) {
				if (k !== CACHE) return caches.delete(k);
			}));
		}).then(function () { return self.clients.claim(); })
	);
});

self.addEventListener('fetch', function (e) {
	if (e.request.method !== 'GET') return;
	e.respondWith(
		caches.match(e.request).then(function (hit) {
			return hit || fetch(e.request).catch(function () {
				// last resort for navigations while offline
				if (e.request.mode === 'navigate') return caches.match('./');
			});
		})
	);
});
