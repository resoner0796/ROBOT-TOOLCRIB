importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuración (LA MISMA DE TU INDEX)
firebase.initializeApp({
    apiKey: "AIzaSyDahnSPvBNTYot00JCn5CBjggAYFVGhbjE",
    authDomain: "panel-logistica-simple.firebaseapp.com",
    projectId: "panel-logistica-simple",
    storageBucket: "panel-logistica-simple.firebasestorage.app",
    messagingSenderId: "528779971851",
    appId: "1:528779971851:web:29ed933e7c7fd997a4e60e"
});

const messaging = firebase.messaging();

// Esto maneja la notificación cuando la app está en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación recibida:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041883.png' // Icono genérico de caja
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
