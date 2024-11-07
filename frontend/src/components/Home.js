import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const handlePaymentRequest = () => {
    navigate('/payment-request');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch('https://localhost:3000/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={styles.container}>
      {/* Logout button */}
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

      {/* Welcome Heading */}
      <h1 style={styles.heading}>Welcome to the Payment Portal!</h1>

      {/* Tiles Container */}
      <div style={styles.tilesContainer}>
        {/* Payment Request Tile */}
        <div style={styles.tile}>
          <h2 style={styles.tileHeading}>Submit Payment Request</h2>
          <p style={styles.description}>
            Click here to submit a payment request using SWIFT or other supported providers. Make secure and seamless international payments.
          </p>
          <button onClick={handlePaymentRequest} style={styles.button}>
            Submit a Payment Request
          </button>
        </div>

        {/* Notifications Tile */}
        <div style={styles.tile}>
          <h2 style={styles.tileHeading}>View Notifications</h2>
          <p style={styles.description}>
            Click here to view your recent notifications regarding payment status updates.
          </p>
          <button onClick={handleNotifications} style={styles.button}>
            View Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column', // Align heading at top
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content at top
    padding: '20px',
    backgroundColor: '#f0f0f5',
  },
  heading: {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center', // Center heading text
  },
  tilesContainer: {
    display: 'flex', // Arrange tiles side by side
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20px', // Space between heading and tiles
  },
  tile: {
    maxWidth: '400px',
    width: '100%',
    margin: '0 10px', // Horizontal spacing between tiles
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  tileHeading: {
    fontSize: '1.8em',
    color: '#007bff',
    marginBottom: '15px',
  },
  description: {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Home;
