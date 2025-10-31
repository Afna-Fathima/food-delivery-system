import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function RestaurantProfile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryTime: '',
    deliveryCharge: '',
    minimumOrderValue: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/login');
      return;
    }
    fetchRestaurantData();
  }, [user, token, navigate]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/my-restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data && response.data.data.length > 0) {
        const rest = response.data.data[0];
        setRestaurant(rest);
        setFormData({
          name: rest.name || '',
          description: rest.description || '',
          cuisine: rest.cuisine?.join(', ') || '',
          phone: rest.phone || '',
          email: rest.email || '',
          street: rest.address?.street || '',
          city: rest.address?.city || '',
          state: rest.address?.state || '',
          zipCode: rest.address?.zipCode || '',
          deliveryTime: rest.deliveryTime || '',
          deliveryCharge: rest.deliveryCharge || '',
          minimumOrderValue: rest.minimumOrderValue || '',
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        cuisine: formData.cuisine.split(',').map(c => c.trim()),
        phone: formData.phone,
        email: formData.email,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        deliveryTime: parseInt(formData.deliveryTime),
        deliveryCharge: parseInt(formData.deliveryCharge),
        minimumOrderValue: parseInt(formData.minimumOrderValue),
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/restaurants/${restaurant._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Restaurant details updated successfully!');
        setRestaurant(response.data.data);
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert(error.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No restaurant found. Please contact support.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Restaurant Details</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📋 Basic Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Restaurant Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your restaurant..."
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cuisine Types (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    placeholder="e.g., Indian, Continental, Vegetarian"
                  />
                </div>

                <hr />

                <h6 className="mb-3">📍 Address</h6>

                <div className="mb-3">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Zip Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <hr />

                <h6 className="mb-3">🚚 Delivery Details</h6>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Delivery Time (min) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Delivery Charge (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="deliveryCharge"
                      value={formData.deliveryCharge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Min Order (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumOrderValue"
                      value={formData.minimumOrderValue}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : '💾 Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📊 Quick Stats</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Restaurant Name</small>
                <p className="mb-0"><strong>{restaurant.name}</strong></p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Rating</small>
                <p className="mb-0"><strong>⭐ {restaurant.rating?.toFixed(1)}</strong></p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Reviews</small>
                <p className="mb-0"><strong>{restaurant.reviewCount || 0}</strong></p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Delivery Time</small>
                <p className="mb-0"><strong>{restaurant.deliveryTime} min</strong></p>
              </div>
              <div>
                <small className="text-muted">Delivery Charge</small>
                <p className="mb-0"><strong>₹{restaurant.deliveryCharge}</strong></p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">🍴 Cuisines</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {restaurant.cuisine?.map((c, idx) => (
                  <span key={idx} className="badge bg-primary">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantProfile;
