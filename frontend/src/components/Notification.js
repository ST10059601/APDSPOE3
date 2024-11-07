import React, { useState, useEffect } from 'react';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://localhost:3000/payment/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
      setNotifications(data);
      markNotificationsAsRead(); 
    } else {
      setMessage('Failed to load notifications');
    }
  };

  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('https://localhost:3000/payment/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const readNotifications = notifications.filter(notification => notification.read);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Notifications</h1>
      {message && <p>{message}</p>}

      <h2 style={styles.sectionHeading}>Unread Notifications</h2>
      {unreadNotifications.length > 0 ? (
        unreadNotifications.map(notification => (
          <div key={notification._id} style={styles.unreadNotificationCard}>
            <p>{notification.message}</p>
          </div>
        ))
      ) : (
        <p>No unread notifications</p>
      )}

      <h2 style={styles.sectionHeading}>Read Notifications</h2>
      {readNotifications.length > 0 ? (
        readNotifications.map(notification => (
          <div key={notification._id} style={styles.readNotificationCard}>
            <p>{notification.message}</p>
          </div>
        ))
      ) : (
        <p>No read notifications</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  heading: {
    fontSize: '2em',
    color: '#333',
    marginBottom: '20px',
  },
  sectionHeading: {
    fontSize: '1.5em',
    color: '#007bff',
    marginTop: '20px',
  },
  unreadNotificationCard: {
    border: '1px solid #007bff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '5px',
    backgroundColor: '#e9f5ff',
  },
  readNotificationCard: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default Notification;
