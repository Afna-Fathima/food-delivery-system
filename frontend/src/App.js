import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Diagnostics from './pages/Diagnostics';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantRegistration from './pages/RestaurantRegistration';
import RestaurantProfile from './pages/RestaurantProfile';
import MenuManagement from './pages/MenuManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/dashboard" element={<RestaurantDashboard />} />
            <Route path="/register-restaurant" element={<RestaurantRegistration />} />
            <Route path="/restaurant-profile" element={<RestaurantProfile />} />
            <Route path="/menu-management" element={<MenuManagement />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
