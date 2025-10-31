import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function Orders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      'out-for-delivery': 'info',
      delivered: 'success',
      cancelled: 'danger',
    };
    return statusColors[status] || 'secondary';
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please <a href="/login">login</a> to view your orders
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders yet.{' '}
          <a href="/" className="alert-link">
            Start ordering now
          </a>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{order.restaurant?.name}</h6>
                      <small className="text-muted">{order.orderNumber}</small>
                    </div>
                    <span className={`badge bg-${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>Items:</h6>
                    <ul className="list-unstyled small">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.menuItem?.name || 'Item'} x {item.quantity} - ₹
                          {item.price}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr />

                  <div className="row text-center">
                    <div className="col-4">
                      <small className="text-muted">Subtotal</small>
                      <p className="mb-0">₹{order.subtotal}</p>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Delivery</small>
                      <p className="mb-0">₹{order.deliveryCharge}</p>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Total</small>
                      <p className="mb-0 fw-bold text-primary">
                        ₹{order.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <small className="text-muted">
                    Ordered on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}{' '}
                    at{' '}
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      timeStyle: 'short',
                    })}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
