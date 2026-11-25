// Estrategia 2: CACHE WITH NETWORK FALLBACK (adaptada a StageOne).
const CACHE = 'stageone-base-750';
const CACHE_DINAMICO = 'stageone-dinamico-750';
const CACHE_ESTATICO = 'stageone-estatico-750';
const CACHE_INMUTABLE = 'stageone-inmutable-750';
const BASE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./css/style.css?v=750",
  "./js/account-local.js?v=750",
  "./js/app.js?v=750",
  "./js/artist57.js?v=750",
  "./js/beta594.js?v=750",
  "./js/cloud72.js?v=750",
  "./js/crop.js?v=750",
  "./js/experience.js?v=750",
  "./js/firebase.js?v=750",
  "./js/library.js?v=750",
  "./js/media56.js?v=750",
  "./js/music71.js?v=750",
  "./js/notifications.js?v=750",
  "./js/polish593.js?v=750",
  "./js/social.js?v=750",
  "./js/stories592.js?v=750",
  "./js/studio59.js?v=750",
  "./js/visual591.js?v=750"
];
const ESTATICOS = [
  "./img/aero-wallpaper.jpg",
  "./img/auth-logo.png",
  "./img/avatar-aero-h.jpg",
  "./img/avatar-aero-m.jpg",
  "./img/avatar-aero-o.jpg",
  "./img/avatar-y2k-h.jpg",
  "./img/avatar-y2k-m.jpg",
  "./img/buscar.svg",
  "./img/comment-y2k.svg",
  "./img/cover-aero.svg",
  "./img/cover-dark.svg",
  "./img/cover-silver.svg",
  "./img/dark-wallpaper.jpg",
  "./img/demo.jpg",
  "./img/disc.png",
  "./img/fondo.jpg",
  "./img/guardados.svg",
  "./img/home-planet.svg",
  "./img/home-star.svg",
  "./img/home-wave.svg",
  "./img/icon-180.png",
  "./img/icon-192.png",
  "./img/icon-32.png",
  "./img/icon-512.png",
  "./img/icon-maskable.png",
  "./img/inicio.svg",
  "./img/like-active.svg",
  "./img/like-y2k.svg",
  "./img/login.svg",
  "./img/logo.png",
  "./img/mensajes.svg",
  "./img/music.svg",
  "./img/perfil.jpg",
  "./img/perfil.svg",
  "./img/profile-orbit.svg",
  "./img/save-active.svg",
  "./img/save-y2k.svg",
  "./img/wordmark.png"
];
const scope = new URL(self.registration.scope);
const urls = list => new Set(list.map(x => new URL(x, scope).href));
const baseURLs = urls(BASE), staticURLs = urls(ESTATICOS);
const firebaseSDK = /^https:\/\/www\.gstatic\.com\/firebasejs\/13\.4\.0\/[a-zA-Z0-9._/-]+\.js$/;
const activos = [CACHE,CACHE_DINAMICO,CACHE_ESTATICO,CACHE_INMUTABLE];
self.addEventListener('install', evento => {
  evento.waitUntil(Promise.all([
    caches.open(CACHE).then(c => c.addAll(BASE.map(x => new Request(new URL(x,scope),{cache:'reload'})))),
    caches.open(CACHE_ESTATICO).then(c => c.addAll(ESTATICOS)),
    caches.open(CACHE_INMUTABLE).then(c => Promise.allSettled(["app","auth","firestore","storage"].map(n => c.add(`https://www.gstatic.com/firebasejs/13.4.0/firebase-${n}.js`))))
  ]));
});
self.addEventListener('activate', evento => {
  evento.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('stageone-') && !activos.includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function limpiarCache(nombreCache, numeroItems) {
  const cache = await caches.open(nombreCache);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0,Math.max(0,keys.length-numeroItems)).map(k => cache.delete(k)));
}
async function cacheFirst(req, nombre, limite) {
  const cache = await caches.open(nombre);
  const hit = await cache.match(req);
  if(hit) return hit;
  const res = await fetch(req);
  if(res.ok && res.status===200 && !/no-store|private/i.test(res.headers.get('cache-control')||'')) {
    try { await cache.put(req,res.clone()); if(limite) await limpiarCache(nombre,limite); } catch(e) { console.warn('StageOne cache:',e); }
  }
  return res;
}
self.addEventListener('fetch', evento => {
  const req = evento.request, url = new URL(req.url);
  if(req.method !== 'GET' || req.headers.has('range') || req.headers.has('authorization')) return;
  // Solo SDK público versionado; nunca peticiones de Auth, Firestore o Storage.
  if(firebaseSDK.test(url.href)) {
    evento.respondWith(cacheFirst(req,CACHE_INMUTABLE,40).catch(()=>Response.error())); return;
  }
  if(url.origin!==scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if(req.mode==='navigate' && [scope.pathname, new URL('index.html',scope).pathname].includes(url.pathname)) {
    evento.respondWith(caches.open(CACHE).then(async c => (await c.match(new URL('index.html',scope))) || await fetch(req)).catch(()=>caches.match(new URL('offline.html',scope)))); return;
  }
  const nombre = baseURLs.has(url.href) ? CACHE : staticURLs.has(url.href) ? CACHE_ESTATICO : null;
  if(nombre) { evento.respondWith(cacheFirst(req,nombre).catch(()=>Response.error())); return; }
  // Solo recursos gráficos públicos del propio proyecto, no datos de cuentas.
  if(url.pathname.startsWith(new URL('img/',scope).pathname) && /\.(png|jpe?g|webp|svg|gif)$/i.test(url.pathname)) {
    evento.respondWith(cacheFirst(req,CACHE_DINAMICO,50).catch(()=>Response.error()));
  }
});
