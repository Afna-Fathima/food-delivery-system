import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const tax = subtotal > 0 ? parseFloat((subtotal * 0.05).toFixed(2)) : 0;
  const total = subtotal + deliveryCharge + tax;

  if (!user) {
    return (
      <div className="container mt-5 mb-5">
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Please login to access your cart</strong>
          <p className="mb-3">Sign in to add items and place orders</p>
          <button 
            className="btn btn-warning"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-1">🛒 Your Cart</h1>
          <p className="text-muted">{cartItems.length} item(s) in cart</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card border-0 bg-light">
          <div className="card-body text-center py-5">
            <h3 className="mb-3">🛍️ Your cart is empty</h3>
            <p className="text-muted mb-4">Add some delicious food to get started!</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light border-bottom">
                        <tr>
                          <th className="ps-3">Item Details</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item._id} className="align-middle">
                            <td className="ps-3">
                              <strong>{item.name}</strong>
                              <br />
                              <small className="text-muted">{item.description}</small>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">₹{item.price}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity === 1}
                                >
                                  −
                                </button>
                                <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeFromCart(item._id)}
                              >
                                🗑️ Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 sticky-lg-top" style={{ top: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title mb-3 fw-bold">📋 Order Summary</h5>
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal:</span>
                    <strong>₹{subtotal.toFixed(2)}</strong>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery Fee:</span>
                    <strong>₹{deliveryCharge}</strong>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax (5%):</span>
                    <strong>₹{tax.toFixed(2)}</strong>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-5">Total Amount:</span>
                    <span className="fw-bold fs-5 text-primary">₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-success btn-lg w-100 mb-2 fw-bold"
                    onClick={() => navigate('/checkout')}
                  >
                    ✓ Proceed to Checkout
                  </button>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    🗑️ Clear Cart
                  </button>
                </div>
              </div>

              {showClearConfirm && (
                <div className="card bg-danger-light mt-3">
                  <div className="card-body">
                    <p className="mb-3">Are you sure you want to clear your cart?</p>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          clearCart();
                          setShowClearConfirm(false);
                        }}
                      >
                        Yes, Clear Cart
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowClearConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
