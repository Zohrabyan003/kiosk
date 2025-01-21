import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Shop() {

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [counts, setCounts] = useState({})
  const [cart, setCart] = useState([]);
  const [disabled, setDisabled] = useState(true)
  const [message, setMessage] = useState(null)
  const [tip, setTip] = useState('')
  const url = "http://localhost:3002/"

  useEffect(() => {
    axios.get(url + "categories").then((res) => {
      setCategories(res.data)
    })
  }, [])
  useEffect(() => {
    if (cart.length == 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [cart])
  useEffect(() => {
    const main = []
    axios.get(url + "products").then((res) => {
      const data = res.data
      const initialCounts = {};
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].products.length; j++) {
          main.push(data[i].products[j])
          initialCounts[data[i].products[j].id] = 1;
        }
      }
      setCounts(initialCounts);
      setProducts(main)

    })
  }, [categories])


  const increaseCount = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: prevCounts[id] + 1,
    }));
  };

  const decreaseCount = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max(prevCounts[id] - 1, 1),
    }));
  };


  const addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    const count = counts[id];
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, count: item.count + count } : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, count }]);
    }
  };
  const deleteFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };


  const orderProducts = async () => {
    try {
      const response = await axios.post(url + "orders", {
        cart: cart,
        date: new Date().toISOString(),
      });
      setMessage({
        error: false,
        message: "Order placed successfully",
      });
      setCart([]);
      const orderId = response.data.id;

    } catch (error) {
      setMessage({
        error: true,
        message: "Failed to place order",
      });
    }

    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };
  const saveTip = async () => {
    try {
      const response = await axios.post(url + "tips", {
        tip_amount: tip,
        date: new Date().toISOString(),
      });

      if (response.status === 200) {
        setMessage({
          error: false,
          message: "Tip added successfully",
        });
      }
      setTip('')
    } catch (error) {
      setMessage({
        error: true,
        message: "Failed to add tip",
      });
    }
  };
  return (
    <div className=''>
      <div className="products">
        <table className='table'>
          <thead className='table-info'>
            <tr>
              <th scope="col">categorie</th>
              <th scope="col">name</th>
              <th scope="col">price</th>
              <th scope="col">Count</th>
              <th scope="col">Add to cart</th>
            </tr>
          </thead>
          <tbody className='table-light'>
            {
              products.map((product) => {
                return (
                  <tr>
                    <th>{product.categorie}</th>
                    <th>{product.name}</th>
                    <th>{product.price}֏</th>
                    <th style={{
                      display: "flex",
                      gap: '10px',
                      alignItems: "center"
                    }}>
                      <button className='btn btn-primary' onClick={() => decreaseCount(product.id)}>-</button>
                      <p style={{
                        margin: 0,
                      }}>{counts[product.id]}</p>
                      <button className='btn btn-primary' onClick={() => increaseCount(product.id)}>+</button>
                    </th>
                    <th>
                      <button className='btn btn-primary' onClick={() => addToCart(product.id)}>Add to cart</button>
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </div>
      <div id="cart">
        <div className="cart">
          <table className='table' style={{
            margin: 0
          }}>
            <thead className='table-success'>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            {cart.length === 0 ? (
              <tbody className='table-danger'>
                <tr>
                  <th>Cart is empty</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            ) : (
              <tbody className='table-secondary'>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.count}</td>
                    <td>{item.price * item.count}</td>
                    <td>
                      <button className='btn btn-danger' onClick={() => deleteFromCart(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}

          </table>
          <div style={{
            width: "100%"
          }}>
            <button style={{
              width: '50%'
            }} className='btn btn-warning' onClick={() => {
              setCart([])
            }} disabled={disabled}>Clear Cart</button>
            <button style={{
              width: '50%'
            }} className='btn btn-success' onClick={() => orderProducts()} disabled={disabled}>Order</button>
          </div>
          <div className='tip'>
            <input type="number" className='form-control bg-secondary' placeholder='Թեյավճար' value={tip} onChange={(e) => {
              setTip(e.target.value)
            }} />
            <button onClick={() => {
              if (tip > 0) {
                saveTip();
              }
            }} className='btn btn-success'>Set Tip</button>
          </div>
          {message && (
            <div style={{ color: message.error ? "red" : "green" }}>
              {message.message}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Shop