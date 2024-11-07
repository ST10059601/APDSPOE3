import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:3000/employee/payments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data || []);
      } else {
        console.error('Failed to fetch payments');
      }
    };

    fetchPayments();
  }, []);

  const handleVerify = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:3000/employee/payments/verify/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPayments(payments.filter((payment) => payment._id !== paymentId));
        setMessage('Payment verified successfully.');
      } else {
        setMessage('Failed to verify payment.');
      }
    } catch (error) {
      setMessage('Error during payment verification.');
    }
  };

  const handleReject = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:3000/employee/payments/reject/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPayments(payments.filter((payment) => payment._id !== paymentId));
        setMessage('Payment rejected successfully.');
      } else {
        setMessage('Failed to reject payment.');
      }
    } catch (error) {
      setMessage('Error during payment rejection.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Employer Dashboard</h1>
        <button onClick={() => navigate('/login')} style={styles.logoutButton}>Logout</button>
      </div>
      <div style={styles.tableContainer}>
        {message && <p style={styles.message}>{message}</p>}
        {payments.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Currency</th>
                <th style={styles.th}>Provider</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td style={styles.td}>{payment.username}</td>
                  <td style={styles.td}>{payment.amount}</td>
                  <td style={styles.td}>{payment.currency}</td>
                  <td style={styles.td}>{payment.provider}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleVerify(payment._id)} style={styles.buttonVerify}>
                      Verify
                    </button>
                    <button onClick={() => handleReject(payment._id)} style={styles.buttonReject}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noPaymentsMessage}>No pending payments to verify</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    width: '100%',
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f0f0f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    textAlign: 'left',
    fontSize: '2em',
    color: '#333',
  },
  logoutButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  },
  message: {
    marginBottom: '10px',
    color: '#333',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  buttonVerify: {
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '5px',
  },
  buttonReject: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  noPaymentsMessage: {
    color: '#666',
    fontStyle: 'italic',
  },
};

export default EmployeeDashboard;
