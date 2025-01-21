import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cashbox() {
  const user = sessionStorage.getItem('user');
  const admin = sessionStorage.getItem('admin');
  const navigate = useNavigate();

  const url = "http://localhost:3002/cashbox";

  const [selectedDate, setSelectedDate] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user || !admin) {
      navigate('/');
    }

    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    loadCashboxAmount(today);
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadCashboxAmount(newDate);
  };

  const handleInputChange = (e) => {
    setCashAmount(e.target.value);
  };

  const loadCashboxAmount = async (date) => {
    try {
      const res = await axios.get(`${url}?date=${date}`);
      setCashAmount(res.data[0].amount  || '');
    } catch (error) {
      setCashAmount('');
      console.error("Error fetching cashbox data:", error);
    }
  };

  const saveCashboxMoney = async () => {
    if (!cashAmount || isNaN(cashAmount)) {
      setMessage('Please enter a valid amount');
      return;
    }
  
    try {
      const res = await axios.get(`${url}?date=${selectedDate}`);
      console.log(res.data.length);
      console.log(selectedDate);
      
      if (res.data.length > 0) {
        await axios.put(`${url}/${res.data[0].id}`, {
          date: selectedDate,
          amount: Number(cashAmount),
        });
        setMessage(`Cashbox for ${selectedDate} updated successfully`);
      } else {
        await axios.post(url, {
          date: selectedDate,
          amount: Number(cashAmount),
        });
        setMessage(`Cashbox for ${selectedDate} saved successfully`);
      }
  
      loadCashboxAmount(selectedDate);
    } catch (error) {
      setMessage('Failed to save cashbox money');
      console.error("Error saving cashbox data:", error);
    }
  
    setTimeout(() => setMessage(null), 3000);
  };
  
  
  

  return (
    <div>
      <h2>Դրամարկղ</h2>

      <label>Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />

      <label>Enter Cashbox Money:</label>
      <input
        type="number"
        value={cashAmount}
        onChange={handleInputChange}
        placeholder="Enter cash amount"
      />
      <button onClick={saveCashboxMoney}>Save</button>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <h3>Դրամարկղ {selectedDate}: {cashAmount ? `${cashAmount}֏` : 'No data'}</h3>
    </div>
  );
}

export default Cashbox;
