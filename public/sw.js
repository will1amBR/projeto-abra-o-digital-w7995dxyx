/* Service Worker do Projeto Abraço (PWA)
 *
 * Estratégias:
 * - App shell (index.html) e assets estáticos (_app assets, /icons, fontes): cache-first
 *   — funcionam offline após a primeira visita.
 * - Chamadas ao backend/API (PocketBase: /api/, arquivos /api/files): network-first,
 *   sem dado velho nas telas operacionais (bingo, caixa, portaria).
 * - Navegações (document): network-first com fallback para cache e, por fim,
 *   /offline.html quando a página não está em cache.
 */

const VERSION = 'abaco-v1'
const SHELL_CACHE = `${VERSION}-shell`
const ASSETS_CACHE = `${VERSION}-assets`
const API_CACHE = `${VERSION}-api`
const OFFLINE_URL = '/offline.html'

// Assets pré-cacheados na instalação (app shell mínimo).
const PRECACHE_URLS = ['/', OFFLINE_URL, '/manifest.webmanifest', '/icons/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico|webmanifest)$/.test(url.pathname)
  )
}

function isApiRequest(url) {
  // PocketBase: rotas /api/ e arquivos servidos via /api/files/...
  return url.pathname.startsWith('/api/')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Só intercepta requisições do próprio app.
  if (url.origin !== self.location.origin) return

  // Navegação (document): network-first → cache → offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))),
    )
    return
  }

  // API/backend: network-first (nunca dado velho).
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(API_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match(request)),
    )
    return
  }

  // Assets estáticos: cache-first (offline após a primeira visita).
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(ASSETS_CACHE).then((cache) => cache.put(request, copy))
            }
            return response
          }),
      ),
    )
  }
})
