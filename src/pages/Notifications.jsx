import { useEffect, useState } from "react";
import api from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
  api.put("/notifications/mark-read");
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className="border p-3 mb-2 rounded">
            <p className="font-semibold">{n.title}</p>
            <p>{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;