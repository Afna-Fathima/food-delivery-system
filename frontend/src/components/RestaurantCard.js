import React from 'react';
import { useNavigate } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm hover-effect">
      {restaurant.image && (
        <img
          src={restaurant.image}
          className="card-img-top"
          alt={restaurant.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{restaurant.name}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {restaurant.description}
        </p>

        <div className="mb-2">
          <span className="badge bg-warning me-2">⭐ {restaurant.rating}</span>
          <span className="badge bg-info me-2">🚚 {restaurant.deliveryTime} min</span>
        </div>

        <p className="text-muted small mb-3">
          {restaurant.cuisine?.slice(0, 3).join(', ')}
          {restaurant.cuisine?.length > 3 ? '...' : ''}
        </p>

        <button
          className="btn btn-primary w-100 mt-auto"
          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
        >
          View Menu
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
