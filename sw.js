/* ═══════════════════════════════
   たからさがし — Service Worker
   キャッシュバージョンを上げるとアップデート適用
   ═══════════════════════════════ */

const CACHE_NAME = 'tks-v6';

// キャッシュするファイル一覧
const PRECACHE = [
  '/',
  '/index.html',
  '/tks-style.css',
  '/tks-render.js',
  '/tks-logic.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Kaisei+Decol:wght@400;700&display=swap',
];

// ── インストール：プリキャッシュ ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Googleフォントは opaque なので個別に try/catch
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(e => console.warn('precache skip:', url, e))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── アクティベート：古いキャッシュ削除 ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── フェッチ：Cache First（APIはネットワーク優先） ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API呼び出し・外部リソース（Gemini等）はキャッシュしない
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('forms.gle')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 静的ファイル：キャッシュ優先、なければネットワーク
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // 正常レスポンスのみキャッシュ
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // オフライン時フォールバック
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── アップデート通知（クライアントへメッセージ送信） ──
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
