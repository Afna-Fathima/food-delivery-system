import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <div className="container text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Logging out...</span>
      </div>
      <p className="mt-3">Logging out...</p>
    </div>
  );
}

export default Logout;
