import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function Checkout() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: user?.phone || '',
    paymentMethod: 'credit-card',
    notes: '',
  });

  // Try to recover restaurantId from URL or first item
  useEffect(() => {
    if (cartItems.length > 0) {
      // Check if items already have restaurantId
      if (cartItems[0].restaurantId) {
        setDisplayItems(cartItems);
      } else {
        // Try to get restaurantId from localStorage or URL
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurantId') || localStorage.getItem('lastRestaurantId');
        
        if (restaurantId) {
          // Add restaurantId to items
          const itemsWithRestaurant = cartItems.map(item => ({
            ...item,
            restaurantId: restaurantId
          }));
          setDisplayItems(itemsWithRestaurant);
        } else {
          setDisplayItems(cartItems);
        }
      }
    }
  }, [cartItems]);

  const calculateTotal = () => {
    return displayItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateTotal();
  const deliveryCharge = 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryCharge + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (displayItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Validate all fields are filled
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      alert('Please fill in all delivery address fields');
      return;
    }

    // Check if restaurant ID exists
    if (!displayItems[0].restaurantId) {
      alert('Error: Restaurant information missing. Please go back and add items from a restaurant.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        restaurant: displayItems[0].restaurantId,
        items: displayItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      console.log('Sending order payload:', orderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      alert('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.data._id}`);
    } catch (error) {
      console.error('Order error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (displayItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Your cart is empty.{' '}
          <a href="/" className="alert-link">
            Continue shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              Delivery Address
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="card mb-4">
                  <div className="card-header bg-primary text-white">
                    Payment Method
                  </div>
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="card">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="upi"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="cash">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Special Instructions</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for the restaurant..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card sticky-top">
            <div className="card-header bg-primary text-white">Order Summary</div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="text-muted">Items:</h6>
                {displayItems.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between mb-2">
                    <small>{item.name} x{item.quantity}</small>
                    <small>₹{(item.price * item.quantity).toFixed(2)}</small>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery:</span>
                <strong>₹{deliveryCharge}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax (5%):</span>
                <strong>₹{tax}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary fs-5">₹{total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
