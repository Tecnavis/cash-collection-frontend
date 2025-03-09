import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ isAuthenticated }) => {
  useEffect(() => {  
    // console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    // console.log('ProtectedRoute - access_token exists:', !!Cookies.get('access_token'));
  }, [isAuthenticated]);
  const hasToken = !!Cookies.get('access_token');
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;