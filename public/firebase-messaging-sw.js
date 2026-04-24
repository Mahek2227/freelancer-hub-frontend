importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6mN9oxu7W6aiKQdSkIBGQ761m2EQ-hxc",
  authDomain: "freelancer-hub-13d87.firebaseapp.com",
  projectId: "freelancer-hub-13d87",
  storageBucket: "freelancer-hub-13d87.firebasestorage.app",
  messagingSenderId: "478644119226",
  appId: "1:478644119226:web:c40c83d35d90ce87634483"
});   


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});