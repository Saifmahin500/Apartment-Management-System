import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../services/api";
import { Dropdown } from "react-bootstrap";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => n.status === "Unread").length;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" className="position-relative">
        {/* <Bell size={22} /> */}
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: "320px" }}>
        <Dropdown.Header>Notifications</Dropdown.Header>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Dropdown.Item
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={n.status === "Unread" ? "fw-bold" : ""}
            >
              <div>{n.title}</div>
              <small className="text-muted">{n.message}</small>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item className="text-muted">
            No new notifications
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
