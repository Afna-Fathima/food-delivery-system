import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function MenuItem({ item }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <div className="card h-100">
      {item.image && (
        <img
          src={item.image}
          className="card-img-top"
          alt={item.name}
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{item.name}</h6>
        <p className="card-text text-muted small flex-grow-1">
          {item.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <p className="mb-0">
              <strong>₹{item.price}</strong>
            </p>
            {item.ratings > 0 && (
              <small className="text-warning">⭐ {item.ratings}</small>
            )}
          </div>
        </div>

        {!item.isAvailable ? (
          <button className="btn btn-secondary w-100 mt-auto" disabled>
            Out of Stock
          </button>
        ) : (
          <div className="mt-auto">
            <div className="input-group input-group-sm mb-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className={`btn w-100 ${added ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
