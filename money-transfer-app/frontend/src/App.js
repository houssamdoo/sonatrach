import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// The backend API URL is configured in docker-compose via an Nginx reverse proxy
//const API_URL = 'http://localhost:3000/api';
const API_URL = '/api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      setIsError(true);
      setMessage('Failed to fetch accounts.');
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !amount) {
      setIsError(true);
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/accounts/transfer`, {
        fromAccountId: parseInt(fromAccountId),
        toAccountId: parseInt(toAccountId),
        amount: parseFloat(amount),
      });
      setIsError(false);
      setMessage(response.data.message);
      // Refresh accounts list to show new balances
      fetchAccounts();
    } catch (error) {
      setIsError(true);
      const errorMessage = error.response?.data?.message || 'An error occurred during the transfer.';
      setMessage(errorMessage);
      console.error('Transfer error:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AGB Core Banking TEST STOP-FIRST</h1>
      </header>
      
      <main>
        <div className="accounts-list">
          <h2>Accounts Status</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.owner}</td>
                  <td>${account.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="transfer-form">
          <h2>New Money Transfer</h2>
          <form onSubmit={handleTransfer}>
            <div className="form-group">
              <label>From Account:</label>
              <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required>
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.owner} (ID: {acc.id})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>To Account:</label>
              <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.owner} (ID: {acc.id})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <button type="submit">Transfer</button>
          </form>
          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
