import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export const RoleRoute = ({ children, allowedRoles, user }) => {
  const token = localStorage.getItem('token');
  if (!token || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};
