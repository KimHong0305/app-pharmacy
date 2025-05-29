import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element, requiredRole }) => {
  const { role } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (typeof requiredRole === 'string' && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (Array.isArray(requiredRole) && !requiredRole.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default PrivateRoute;
