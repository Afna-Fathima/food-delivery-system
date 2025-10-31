import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRestaurantSocket } from '../hooks/useSocket';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import './RestaurantDashboard.css';
import RestaurantProfile from './RestaurantProfile';
import MenuManagement from './MenuManagement';

function RestaurantDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [updating, setUpdating] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });

  // Socket.io integration
  const handleNewOrder = (newOrder) => {
    console.log('New order received in dashboard:', newOrder);
    setNewOrderCount(prev => prev + 1);
    
    // Refresh orders data
    if (restaurant) {
      fetchRestaurantOrders(restaurant._id);
    }
    
    // Show notification
    if (Notification.permission === 'granted') {
      new Notification('🎉 New Order!', {
        body: `New order from ${newOrder.customer} - ₹${newOrder.totalPrice}`,
        icon: '🍽️',
      });
    }
  };

  useRestaurantSocket(restaurant?._id, handleNewOrder);

  useEffect(() => {
    // Wait briefly for localStorage to hydrate auth context
    const timer = setTimeout(() => {
      if (!user || user.role !== 'restaurant') {
        navigate('/login');
      } else {
        setIsAuthChecked(true);
        fetchRestaurantData();
        
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [user, token, navigate]);



  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant data
      const restaurantRes = await axios.get(`${API_BASE_URL}/api/restaurants/my-restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (restaurantRes.data.data && restaurantRes.data.data.length > 0) {
        const rest = restaurantRes.data.data[0];
        setRestaurant(rest);

        // Fetch restaurant orders
        await fetchRestaurantOrders(rest._id);
      } else {
        // No restaurant registered, redirect to registration
        console.log('No restaurant found, redirecting to registration');
        navigate('/register-restaurant');
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      // If error, redirect to registration
      navigate('/register-restaurant');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantOrders = async (restaurantId) => {
    try {
      const ordersRes = await axios.get(
        `${API_BASE_URL}/api/orders/restaurant/${restaurantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedOrders = ordersRes.data.data || [];
      setOrders(fetchedOrders);

      // Calculate stats
      const completed = fetchedOrders.filter(o => o.status === 'delivered').length;
      const pending = fetchedOrders.filter(o => o.status === 'pending').length;
      const revenue = fetchedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({
        totalOrders: fetchedOrders.length,
        totalRevenue: revenue,
        completedOrders: completed,
        pendingOrders: pending,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));

      // Recalculate stats
      if (restaurant) {
        await fetchRestaurantOrders(restaurant._id);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const getOrderStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'confirmed':
        return 'bg-info text-white';
      case 'preparing':
        return 'bg-primary text-white';
      case 'ready':
        return 'bg-secondary text-white';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[currentIndex + 1] || currentStatus;
  };

  if (!user || user.role !== 'restaurant') {
    if (!isAuthChecked) {
      // Still checking auth
      return (
        <div className="container text-center mt-5">
          <div className="spinner-border"></div>
          <p>Loading authentication...</p>
        </div>
      );
    }
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Only restaurant owners can access this page. Please <a href="/login">login as restaurant</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border mb-3"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">🍽️ Restaurant Dashboard</span>
          <div className="d-flex gap-2">
            <span className="text-white me-3">Welcome, {user.name}</span>
            <a href="/logout" className="btn btn-outline-light btn-sm">Logout</a>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        {/* Restaurant Info */}
        {restaurant && (
          <div className="alert alert-info mb-4">
            <h5>{restaurant.name}</h5>
            <p className="mb-1">📍 {restaurant.address?.city} | ⭐ {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)</p>
            <p className="mb-0">📞 {restaurant.phone} | ✉️ {restaurant.email}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card stat-card bg-primary text-white">
              <div className="card-body">
                <h6 className="card-title">Total Orders</h6>
                <h2 className="mb-0">{stats.totalOrders}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card bg-success text-white">
              <div className="card-body">
                <h6 className="card-title">Completed</h6>
                <h2 className="mb-0">{stats.completedOrders}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card bg-warning text-white">
              <div className="card-body">
                <h6 className="card-title">Pending</h6>
                <h2 className="mb-0">{stats.pendingOrders}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card bg-info text-white">
              <div className="card-body">
                <h6 className="card-title">Total Revenue</h6>
                <h2 className="mb-0">₹{stats.totalRevenue.toFixed(0)}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setNewOrderCount(0); }}
            >
              📋 Orders ({stats.totalOrders}) {newOrderCount > 0 && <span className="badge bg-danger ms-2">{newOrderCount}</span>}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              🍴 Menu Items
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
          </li>
        </ul>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">📊 Dashboard Overview</h5>
                </div>
                <div className="card-body">
                  {restaurant && (
                    <div>
                      <h6>Restaurant Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Name:</strong></td>
                            <td>{restaurant.name}</td>
                          </tr>
                          <tr>
                            <td><strong>Description:</strong></td>
                            <td>{restaurant.description}</td>
                          </tr>
                          <tr>
                            <td><strong>Cuisines:</strong></td>
                            <td>{restaurant.cuisine?.join(', ')}</td>
                          </tr>
                          <tr>
                            <td><strong>Rating:</strong></td>
                            <td>⭐ {restaurant.rating.toFixed(1)}</td>
                          </tr>
                          <tr>
                            <td><strong>Delivery Time:</strong></td>
                            <td>{restaurant.deliveryTime} minutes</td>
                          </tr>
                          <tr>
                            <td><strong>Delivery Charge:</strong></td>
                            <td>₹{restaurant.deliveryCharge}</td>
                          </tr>
                          <tr>
                            <td><strong>Minimum Order:</strong></td>
                            <td>₹{restaurant.minimumOrderValue}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-header bg-secondary text-white">
                  <h5 className="mb-0">Quick Stats</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <p className="mb-1"><small>Average Order Value</small></p>
                    <h4>₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}</h4>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1"><small>Completion Rate</small></p>
                    <h4>{stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(0) : 0}%</h4>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1"><small>Total Revenue</small></p>
                    <h4>₹{stats.totalRevenue.toFixed(0)}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Manage Orders</h5>
              <button 
                className="btn btn-sm btn-light"
                onClick={() => fetchRestaurantOrders(restaurant._id)}
              >
                🔄 Refresh
              </button>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <div className="alert alert-info">
                  <h5>No orders yet!</h5>
                  <p>When customers place orders, they will appear here for you to manage.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="align-middle">
                          <td><strong>#{order.orderNumber}</strong></td>
                          <td>{order.user?.name || 'Unknown'}</td>
                          <td><small>{order.user?.phone || 'N/A'}</small></td>
                          <td>
                            <small>
                              {order.items.map((item) => `${item.menuItem?.name || 'Item'} x${item.quantity}`).join(', ')}
                            </small>
                          </td>
                          <td><strong>₹{order.totalPrice.toFixed(2)}</strong></td>
                          <td>
                            <span className={`badge ${getOrderStatusBadgeColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-success"
                              disabled={order.status === 'delivered' || order.status === 'cancelled' || updating === order._id}
                              onClick={() => handleUpdateOrderStatus(order._id, getNextStatus(order.status))}
                              title={`Update to ${getNextStatus(order.status)}`}
                            >
                              {updating === order._id ? '⏳' : '✓'} Update
                            </button>
                          </td>
                          <td><small>{new Date(order.createdAt).toLocaleString()}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && <MenuManagement restaurant={restaurant} token={token} />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">📊 Order Status Distribution</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Pending</span>
                      <strong>{stats.pendingOrders}</strong>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-warning" style={{width: `${stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Completed</span>
                      <strong>{stats.completedOrders}</strong>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-success" style={{width: `${stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">💰 Revenue Summary</h5>
                </div>
                <div className="card-body">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>Total Revenue</td>
                        <td className="text-end"><strong>₹{stats.totalRevenue.toFixed(2)}</strong></td>
                      </tr>
                      <tr>
                        <td>Average Order Value</td>
                        <td className="text-end"><strong>₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Total Orders</td>
                        <td className="text-end"><strong>{stats.totalOrders}</strong></td>
                      </tr>
                      <tr>
                        <td>Completion Rate</td>
                        <td className="text-end"><strong>{stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;
