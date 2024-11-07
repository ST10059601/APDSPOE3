import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentRequest() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ZAR');
  const [provider, setProvider] = useState('SWIFT');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to submit a payment request.');
      return;
    }
    const paymentData = {
      amount: parseFloat(amount),
      currency,
      provider,
      recipientAccount,
      swiftCode
    };
    try {
      const response = await fetch('https://localhost:3000/payment/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/payment-success');
      } else {
        setMessage(data.message || 'Failed to submit payment request.');
      }
    } catch (error) {
      console.error('Error submitting payment request:', error);
      setMessage('An error occurred while submitting your request.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Submit a Payment Request</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={styles.input}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} style={styles.input}>
            <option value="SWIFT">SWIFT</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Recipient Account</label>
          <input
            type="text"
            placeholder="Enter recipient account number"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>SWIFT Code</label>
          <input
            type="text"
            placeholder="Enter SWIFT code"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Submit Payment Request</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    textAlign: 'center',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',  // Darker shadow
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2.2em',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    flex: '0 0 150px',
    textAlign: 'left',
    fontSize: '1.1em',
    marginRight: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default PaymentRequest;
