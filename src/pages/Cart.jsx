import React, { useEffect, useState } from "react";
import API from "../api/axios"; // your axios instance
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);

  // Fetch cart items on mount
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/cart/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, qty) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/api/cart/item/${itemId}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <div className="cart-container">Your cart is empty....</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item._id} className="cart-item">
          <img src={item.product.image} alt={item.product.name} />
          <div className="cart-details">
            <h3>{item.product.name}</h3>
            <p>Price: ₹{item.price}</p>
            <p>Type: {item.availabilityType}</p>
            <div className="quantity">
              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity > 1 ? item.quantity - 1 : 1)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => removeItem(item._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        Total: ₹
        {cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </div>
    </div>
  );
}

export default Cart;