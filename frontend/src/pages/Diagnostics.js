import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

function Diagnostics() {
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [restaurantsTest, setRestaurantsTest] = useState('checking...');
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);

  useEffect(() => {
    checkBackend();
    checkRestaurants();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setBackendStatus(`✅ Connected - ${JSON.stringify(data)}`);
    } catch (error) {
      setBackendStatus(`❌ Error - ${error.message}`);
    }
  };

  const checkRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants`);
      const data = await response.json();
      setRestaurantsTest(`✅ API Working - Found ${data.data?.length || 0} restaurants`);
    } catch (error) {
      setRestaurantsTest(`❌ Error - ${error.message}`);
    }
  };

  return (
    <div className="container my-5">
      <h2>🔧 System Diagnostics</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>API URL:</strong> {apiUrl}</p>
          <hr />
          <p><strong>Backend Status:</strong> {backendStatus}</p>
          <p><strong>Restaurants API:</strong> {restaurantsTest}</p>
          <hr />
          <button className="btn btn-primary" onClick={checkBackend}>
            Test Backend
          </button>
          <button className="btn btn-info ms-2" onClick={checkRestaurants}>
            Test Restaurants API
          </button>
        </div>
      </div>
    </div>
  );
}

export default Diagnostics;
