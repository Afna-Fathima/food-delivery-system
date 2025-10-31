import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config/api';

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchRestaurantDetails();
    // Save restaurant ID for checkout recovery
    localStorage.setItem('lastRestaurantId', id);
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/${id}`);
      setRestaurant(response.data.data);

      const menuResponse = await axios.get(
        `${API_BASE_URL}/api/menu/restaurant/${id}`
      );
      setMenu(menuResponse.data.data || []);

      if (menuResponse.data.data?.length > 0) {
        setSelectedCategory(menuResponse.data.data[0].category);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    const result = addToCart({
      ...item,
      restaurantId: id,
      restaurantName: restaurant?.name,
    });
    
    if (result.success) {
      alert(`${item.name} added to cart!`);
    } else {
      alert(result.message);
    }
  };

  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.category === selectedCategory)
    : menu;

  const categories = [...new Set(menu.map((item) => item.category))];

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className="container mt-5">Restaurant not found</div>;
  }

  return (
    <div>
      {/* Restaurant Header */}
      <div className="bg-light py-4 border-bottom">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-md-8">
              <h1 className="mb-2">{restaurant.name}</h1>
              <p className="text-muted mb-2">{restaurant.description}</p>
              <div className="mb-2">
                <span className="badge bg-warning me-2">⭐ {restaurant.rating}</span>
                <span className="badge bg-info me-2">📍 {restaurant.address?.city}</span>
                <span className="badge bg-success">🚚 {restaurant.deliveryTime} min</span>
              </div>
              <small className="text-muted">
                Cuisines: {restaurant.cuisine?.join(', ')}
              </small>
            </div>
            <div className="col-md-4 text-md-end">
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container my-5">
        <div className="row">
          {/* Category Filter */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <div className="list-group">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`list-group-item list-group-item-action ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="col-md-9">
            <div className="row g-3">
              {filteredMenu.map((item) => (
                <div key={item._id} className="col-md-6">
                  <div className="card h-100">
                    {item.image && (
                      <img src={item.image} className="card-img-top" alt={item.name} />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-muted small">
                        {item.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0">
                            <strong>₹{item.price}</strong>
                          </p>
                          {item.ratings > 0 && (
                            <small className="text-warning">⭐ {item.ratings}</small>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                        >
                          {item.isAvailable ? 'Add' : 'Out of stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
