// frontend/src/components/PrivateRoute.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ roles, children }) => {
  const token = localStorage.getItem('accessToken');
  
  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to login');
    }
  }, [token]);

  try {
    if (!token) throw new Error('No token');
    
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);

    if (!roles.includes(decoded.role)) {
      console.log('Role mismatch, redirecting');
      return <Navigate to="/unauthorized" />;
    }

    if (!decoded.department) {
      console.log('No department assigned');
      return <Navigate to="/complete-profile" />;
    }

    return children;
    
  } catch (error) {
    console.error('Auth error:', error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;