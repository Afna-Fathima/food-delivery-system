import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [search]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const url = search
        ? `${API_BASE_URL}/api/restaurants?search=${search}`
        : `${API_BASE_URL}/api/restaurants`;

      const response = await axios.get(url);
      setRestaurants(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div style={{ margin: 0, padding: 0, width: '100%' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ 
        margin: 0, 
        padding: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="/" style={{ fontSize: '1.8rem' }}>
            🍽️ FoodHub
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user && user.role !== 'restaurant' && (
                <li className="nav-item">
                  <a className="nav-link" href="/cart">
                    🛒 Cart
                  </a>
                </li>
              )}
              {user ? (
                <>
                  {user.role === 'restaurant' ? (
                    <li className="nav-item">
                      <a className="nav-link" href="/dashboard">
                        📊 Dashboard
                      </a>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <a className="nav-link" href="/orders">
                        📦 My Orders
                      </a>
                    </li>
                  )}
                  <li className="nav-item">
                    <a className="nav-link" href="/profile">
                      👤 {user.name}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/logout">
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      Login
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/signup">
                      Sign Up
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '120px',
        paddingBottom: '120px',
        textAlign: 'center',
        width: '100%'
      }}>
        <div className="container">
          <h1 style={{ 
            color: 'white',
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '15px',
            textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
            letterSpacing: '-1px'
          }}>
            Find Your Favorite Food
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.95)',
            fontSize: '1.25rem',
            marginBottom: '50px',
            fontWeight: '300',
            letterSpacing: '0.3px'
          }}>
            Order from the best restaurants in your area
          </p>
          
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8" style={{ paddingLeft: '0', paddingRight: '0' }}>
              <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: 'flex' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search restaurants or dishes..."
                  value={search}
                  onChange={handleSearch}
                  style={{ 
                    borderRadius: '50px 0 0 50px',
                    border: 'none',
                    padding: '16px 30px',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    boxShadow: 'none'
                  }}
                />
                <button 
                  className="btn"
                  type="submit"
                  style={{ 
                    borderRadius: '0 50px 50px 0',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#667eea',
                    padding: '16px 40px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fff';
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div style={{ 
        backgroundColor: '#fff',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}>
        <div className="container">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="alert alert-info" role="alert" style={{ marginBottom: 0 }}>
              No restaurants found. Try a different search.
            </div>
          ) : (
            <>
              <h2 style={{ 
                color: '#333',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '50px',
                paddingLeft: '0'
              }}>
                Popular Restaurants
              </h2>
              
              <div className="row g-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    >
                      {/* Image */}
                      {restaurant.image && (
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name}
                          style={{ 
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      
                      {/* Content */}
                      <div style={{ 
                        padding: '20px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <h5 style={{ 
                          color: '#333',
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          {restaurant.name}
                        </h5>
                        
                        <p style={{ 
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '12px',
                          flex: 1
                        }}>
                          {restaurant.description}
                        </p>

                        {/* Rating and Time */}
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#ffc107',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginRight: '8px'
                          }}>
                            ⭐ {restaurant.rating.toFixed(1)}
                          </span>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            🚚 {restaurant.deliveryTime} min
                          </span>
                        </div>

                        {/* Cuisine */}
                        <p style={{ 
                          color: '#999',
                          fontSize: '0.8rem',
                          marginBottom: '16px'
                        }}>
                          {restaurant.cuisine?.join(', ')}
                        </p>

                        {/* Button */}
                        <button
                          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                          style={{
                            width: '100%',
                            padding: '12px 0',
                            backgroundColor: '#667eea',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#5568d3';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#667eea';
                          }}
                        >
                          View Menu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
