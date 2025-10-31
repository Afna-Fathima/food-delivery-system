import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function MenuManagement({ restaurant: propRestaurant, token: propToken }) {
  const { user, token: authToken } = useAuth();
  const navigate = useNavigate();
  const finalToken = propToken || authToken;
  const [restaurant, setRestaurant] = useState(propRestaurant || null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(!propRestaurant);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
  });

  const categories = ['appetizer', 'main', 'side', 'beverage', 'dessert'];

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/login');
      return;
    }
    
    // If restaurant is passed as prop, use it directly
    if (propRestaurant) {
      setRestaurant(propRestaurant);
      fetchMenuItems(propRestaurant._id);
      setLoading(false);
    } else {
      fetchRestaurantData();
    }
  }, [user, navigate, propRestaurant]);

  const fetchMenuItems = async (restaurantId) => {
    try {
      const menuRes = await axios.get(
        `${API_BASE_URL}/api/menu/restaurant/${restaurantId}`,
        { headers: { Authorization: `Bearer ${finalToken}` } }
      );
      setMenuItems(menuRes.data.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/my-restaurants`, {
        headers: { Authorization: `Bearer ${finalToken}` },
      });

      if (response.data.data && response.data.data.length > 0) {
        const rest = response.data.data[0];
        setRestaurant(rest);

        // Fetch menu items
        const menuRes = await axios.get(
          `${API_BASE_URL}/api/menu/restaurant/${rest._id}`,
          { headers: { Authorization: `Bearer ${finalToken}` } }
        );
        setMenuItems(menuRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleAddItem = async (e) => {
    e.preventDefault();

    console.log('Form Data:', formData);
    console.log('Restaurant:', restaurant);
    console.log('Loading:', loading);

    if (!formData.name || !formData.price) {
      alert('Please fill in Dish Name and Price (required fields)');
      return;
    }

    if (!restaurant) {
      alert('Restaurant information is being loaded. Please wait a moment and try again.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        restaurant: restaurant._id,
        isAvailable: true,
      };

      console.log('Sending payload:', payload);

      if (editingId) {
        // Update existing item
        await axios.put(
          `${API_BASE_URL}/api/menu/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${finalToken}` } }
        );
        alert('Menu item updated successfully!');
      } else {
        // Create new item
        await axios.post(
          `${API_BASE_URL}/api/menu`,
          payload,
          { headers: { Authorization: `Bearer ${finalToken}` } }
        );
        alert('Menu item added successfully!');
      }

      // Reset form and reload
      setFormData({ name: '', description: '', price: '', category: 'main' });
      setEditingId(null);
      setShowAddForm(false);
      fetchRestaurantData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
    });
    setEditingId(item._id);
    setShowAddForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/menu/${itemId}`,
          { headers: { Authorization: `Bearer ${finalToken}` } }
        );
        alert('Menu item deleted successfully!');
        fetchRestaurantData();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', description: '', price: '', category: 'main' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleToggleAvailability = async (item) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/menu/${item._id}`,
        { ...item, isAvailable: !item.isAvailable },
        { headers: { Authorization: `Bearer ${finalToken}` } }
      );
      fetchRestaurantData();
    } catch (error) {
      console.error('Error toggling availability:', error);
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

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🍽️ Menu Management</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading || !restaurant}
          title={loading ? 'Loading restaurant data...' : !restaurant ? 'Restaurant data not loaded' : 'Add new dish'}
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Dish'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              {editingId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddItem}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Dish Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Butter Chicken"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 320"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the dish..."
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingId ? '💾 Update Item' : '➕ Add Item'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {menuItems.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              No menu items yet. Click "Add New Dish" to get started!
            </div>
          </div>
        ) : (
          <>
            {['appetizer', 'main', 'side', 'beverage', 'dessert'].map(category => {
              const categoryItems = menuItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="col-12 mb-4">
                  <h5 className="text-secondary mb-3">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h5>
                  <div className="row g-3">
                    {categoryItems.map(item => (
                      <div key={item._id} className="col-md-6 col-lg-4">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">{item.name}</h6>
                              <span className={`badge ${item.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <p className="card-text text-muted small">
                              {item.description}
                            </p>
                            <h5 className="text-primary mb-3">₹{item.price}</h5>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditItem(item)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                🗑️ Delete
                              </button>
                              <button
                                className={`btn btn-sm ${item.isAvailable ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                onClick={() => handleToggleAvailability(item)}
                              >
                                {item.isAvailable ? '❌ Unavailable' : '✅ Available'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default MenuManagement;
