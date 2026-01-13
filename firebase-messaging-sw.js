importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDahnSPvBNTYot00JCn5CBjggAYFVGhbjE",
    authDomain: "panel-logistica-simple.firebaseapp.com",
    projectId: "panel-logistica-simple",
    storageBucket: "panel-logistica-simple.firebasestorage.app",
    messagingSenderId: "528779971851",
    appId: "1:528779971851:web:29ed933e7c7fd997a4e60e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041883.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
