import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment was successful!</h1>
      <p>Your payment request has been submitted successfully.</p>
      <button onClick={goToDashboard} style={styles.button}>Go back to Dashboard</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  heading: {
    fontSize: '2em',
    color: '#28a745',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default PaymentSuccess;
