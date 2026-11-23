/* Service worker Tool Master: menyimpan aplikasi di perangkat agar bisa dibuka tanpa internet.
   Naikkan angka VERSI setiap kali index.html diperbarui, supaya pengguna mendapat versi terbaru. */
const VERSI = 'tool-master-v19n';
const FILES = ['./', './index.html', './manifest.webmanifest', './favicon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Utamakan versi terbaru dari internet; jika offline, pakai salinan tersimpan. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(VERSI).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
