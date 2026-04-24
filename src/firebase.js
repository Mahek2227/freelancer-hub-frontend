import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebaseConfig";

// 🔥 GENERATE TOKEN
export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Permission denied");
      return null;
    }
    
    const messaging = getMessaging(app);
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);
    return token;
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

// 🔥 FOREGROUND LISTENER
export const onMessageListener = () => {
  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("Notification received:", payload);

    
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
      });
    }
  });
};