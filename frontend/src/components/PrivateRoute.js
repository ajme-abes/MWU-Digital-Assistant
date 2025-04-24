// PrivateRoute.js
import React, { useEffect } from 'react';  // Import useEffect from React
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ roles, children }) {  // Changed to function declaration
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  console.log("Decoded token", jwtDecode(token));

  useEffect(() => {
    console.log('PrivateRoute Check:', { roles, hasToken: !!token }); // Debug log
  }, [roles, token]);

  try {
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    const decoded = jwtDecode(token);
    console.log('PrivateRoute Token:', decoded); // Debug log

    if (!roles.includes(decoded.role)) {
      console.log('Role Mismatch:', { required: roles, found: decoded.role }); // Debug log
      return <Navigate to="/" />;
    }

    return children;
    
  } catch (error) {
    console.error('PrivateRoute Error:', error);
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;  // Export the component