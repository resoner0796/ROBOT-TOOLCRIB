importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// --- 1. CONFIGURACIÓN DE FIREBASE (NOTIFICACIONES) ---
firebase.initializeApp({
    apiKey: "AIzaSyDahnSPvBNTYot00JCn5CBjggAYFVGhbjE",
    authDomain: "panel-logistica-simple.firebaseapp.com",
    projectId: "panel-logistica-simple",
    storageBucket: "panel-logistica-simple.firebasestorage.app",
    messagingSenderId: "528779971851",
    appId: "1:528779971851:web:29ed933e7c7fd997a4e60e"
});

const messaging = firebase.messaging();

// Manejador de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Notificación recibida:', payload);
  
  const notificationTitle = payload.notification.title || 'Nueva Notificación';
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icon-192.png', // Usamos tu icono local para que se vea pro
    badge: 'icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: './index.html' } // Para abrir la app al tocar
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- 2. CONFIGURACIÓN PWA (CACHÉ E INSTALACIÓN) ---
const CACHE_NAME = 'tc-bot-ultra-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
    })
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
});

// Estrategia Network First (Ideal para Firebase)
self.addEventListener('fetch', event => {
  // Ignoramos peticiones a Firebase/Google para que no las cachee agresivamente
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
      return; 
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Click en notificación abre la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./index.html')
  );
});
