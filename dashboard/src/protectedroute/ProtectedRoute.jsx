import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ isAuthenticated }) => {
  useEffect(() => {  
  }, [isAuthenticated]);
  const hasToken = !!Cookies.get('access_token');
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;