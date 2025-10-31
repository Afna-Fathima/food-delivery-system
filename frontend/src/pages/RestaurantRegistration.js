import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import './RestaurantRegistration.css';

function RestaurantRegistration() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryTime: '30',
    deliveryCharge: '50',
    minimumOrderValue: '200',
    cuisines: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if not logged in or already has restaurant
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'restaurant') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.cuisines.trim()) newErrors.cuisines = 'At least one cuisine is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
    if (!formData.deliveryCharge) newErrors.deliveryCharge = 'Delivery charge is required';
    if (!formData.minimumOrderValue) newErrors.minimumOrderValue = 'Minimum order value is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
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
        cuisines: formData.cuisines.split(',').map(c => c.trim()),
        isActive: true,
      };

      console.log('Registering restaurant:', payload);

      // Call API to create restaurant
      const response = await axios.post(
        `${API_BASE_URL}/api/restaurants`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Restaurant registered:', response.data);

      alert('✅ Restaurant registered successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error registering restaurant:', error);
      alert(`❌ Registration failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-registration">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">🍽️ Restaurant Registration</span>
          <div>
            <span className="text-white">Welcome, {user?.name}</span>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">📝 Register Your Restaurant</h4>
                <small>Fill in all details to start taking orders</small>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="section-title mb-3">
                    <h5 className="text-primary">📋 Basic Information</h5>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Restaurant Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Spice Kingdom"
                      />
                      {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="restaurant@example.com"
                      />
                      {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your restaurant, cuisine type, specialties, etc."
                    ></textarea>
                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cuisines (comma-separated) *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cuisines ? 'is-invalid' : ''}`}
                      name="cuisines"
                      value={formData.cuisines}
                      onChange={handleChange}
                      placeholder="e.g., Indian, Chinese, North Indian"
                    />
                    {errors.cuisines && <div className="invalid-feedback d-block">{errors.cuisines}</div>}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                      />
                      {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="section-title mb-3 mt-4">
                    <h5 className="text-primary">📍 Address</h5>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                    {errors.street && <div className="invalid-feedback d-block">{errors.street}</div>}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                      {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                      {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Zip Code *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="100000"
                      />
                      {errors.zipCode && <div className="invalid-feedback d-block">{errors.zipCode}</div>}
                    </div>
                  </div>

                  {/* Delivery & Order Settings */}
                  <div className="section-title mb-3 mt-4">
                    <h5 className="text-primary">🚚 Delivery & Order Settings</h5>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Delivery Time (mins) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.deliveryTime ? 'is-invalid' : ''}`}
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        placeholder="30"
                        min="1"
                      />
                      {errors.deliveryTime && <div className="invalid-feedback d-block">{errors.deliveryTime}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Delivery Charge (₹) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.deliveryCharge ? 'is-invalid' : ''}`}
                        name="deliveryCharge"
                        value={formData.deliveryCharge}
                        onChange={handleChange}
                        placeholder="50"
                        min="0"
                      />
                      {errors.deliveryCharge && <div className="invalid-feedback d-block">{errors.deliveryCharge}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Minimum Order Value (₹) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.minimumOrderValue ? 'is-invalid' : ''}`}
                        name="minimumOrderValue"
                        value={formData.minimumOrderValue}
                        onChange={handleChange}
                        placeholder="200"
                        min="0"
                      />
                      {errors.minimumOrderValue && <div className="invalid-feedback d-block">{errors.minimumOrderValue}</div>}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        '✅ Register Restaurant'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-lg"
                      onClick={() => navigate('/dashboard')}
                    >
                      Skip for Now
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Box */}
            <div className="alert alert-info mt-4">
              <h6>ℹ️ Why register your restaurant?</h6>
              <ul className="mb-0">
                <li>Customers can find and order from your restaurant</li>
                <li>Manage your menu and delivery settings</li>
                <li>Receive and track orders in real-time</li>
                <li>Monitor your business performance and revenue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantRegistration;
