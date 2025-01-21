import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Admin() {
  const orderUrl = "http://localhost:3002/orders";
  const tipsUrl = "http://localhost:3002/tips";
  const cashboxUrl = "http://localhost:3002/cashbox";

  const [soldProducts, setSoldProducts] = useState([]);
  const [tips, setTips] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [totalMoney, setTotalMoney] = useState(0);
  const [cashboxAmount, setCashboxAmount] = useState(0);
  const [totalTips, setTotalTips] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFilterDate(today);

    fetchOrders(today);
    fetchTips(today);
    fetchCashbox(today);
  }, []);

  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
    fetchOrders(event.target.value);
    fetchTips(event.target.value);
    fetchCashbox(event.target.value);
  };

  const fetchOrders = async (date) => {
    try {
      const res = await axios.get(orderUrl);
      const filteredOrders = res.data.filter(item => item.date.startsWith(date));
      setSoldProducts(filteredOrders);

      const total = filteredOrders.reduce((sum, item) => {
        return sum + item.cart.reduce((cartSum, it) => cartSum + it.count * it.price, 0);
      }, 0);
      setTotalMoney(total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchTips = async (date) => {
    try {
      const res = await axios.get(tipsUrl);
      const filteredTips = res.data.filter(tip => tip.date.startsWith(date));
      setTips(filteredTips);

      const totalTipsSum = filteredTips.reduce((sum, tip) => sum + Number(tip.tip_amount), 0);
      setTotalTips(totalTipsSum);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  const fetchCashbox = async (date) => {
    try {
      const res = await axios.get(`${cashboxUrl}?date=${date}`);
      
      setCashboxAmount(res.data[0].amount || 0);
    } catch (error) {
      setCashboxAmount(0);
      console.error("Error fetching cashbox amount:", error);
    }
  };
  
  

  return (
    <div>
      <input
        type="date"
        value={filterDate}
        onChange={handleDateChange}
        placeholder="Select a date"
      />

      <table className='table' style={{ width: "100%" }}>
        <thead className='table-dark'>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>price</th>
            <th>categorie</th>
            <th>count</th>
            <th>total price</th>
            <th>Sale Date</th>
          </tr>
        </thead>
        <tbody>
          {soldProducts.map((item, index) =>
            item.cart.map((it) => (
              <tr key={it.id || index}>
                <th>{index + 1}</th>
                <th>{it.name}</th>
                <th>{it.price}֏</th>
                <th>{it.categorie}</th>
                <th>{it.count}</th>
                <th>{it.count * it.price}֏</th>
                <th>{new Date(item.date).toLocaleString()}</th>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h4>Ընդհանուր Վաճառք {filterDate}: {totalMoney}֏</h4>
      <h4>Դրամարկղ: {cashboxAmount}֏</h4>
      <h4>Ընդհանուր (Վաճառք + Դրամարկղ): {totalMoney + cashboxAmount}֏</h4>

      <h3>Թեյավճարներ {filterDate}</h3>
      <ul>
        {tips.length > 0 ? (
          tips.map((tip) => (
            <li key={tip.id}>
              {tip.date.split('T')[0]} - {tip.tip_amount}֏
            </li>
          ))
        ) : (
          <p>Թեյավճարներ չկան</p>
        )}
      </ul>

      <h4>Ընդհանուր Թեյավճարներ: {totalTips}֏</h4>
    </div>
  );
}

export default Admin;
