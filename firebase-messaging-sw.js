importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// --- 1. CONFIGURACIÓN DE FIREBASE ---
firebase.initializeApp({
    apiKey: "AIzaSyDahnSPvBNTYot00JCn5CBjggAYFVGhbjE",
    authDomain: "panel-logistica-simple.firebaseapp.com",
    projectId: "panel-logistica-simple",
    storageBucket: "panel-logistica-simple.firebasestorage.app",
    messagingSenderId: "528779971851",
    appId: "1:528779971851:web:29ed933e7c7fd997a4e60e"
});

const messaging = firebase.messaging();

// Notificaciones en Segundo Plano
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM-SW] Notificación:', payload);
  const notificationTitle = payload.notification.title || 'TC Bot';
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: './index.html' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- 2. LÓGICA PWA (CACHÉ) ---
const CACHE_NAME = 'tc-bot-v5-final';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Actualizar de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Ignorar peticiones de Firebase/Google para evitar errores de CORS/Database
  if (event.request.url.includes('firestore') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('fcm')) {
      return; 
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Al tocar la notificación, abre la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('./index.html'));
});