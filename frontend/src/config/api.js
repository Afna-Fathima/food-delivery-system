// API Configuration
// Use this file to manage all API endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Log API base URL in development
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;
