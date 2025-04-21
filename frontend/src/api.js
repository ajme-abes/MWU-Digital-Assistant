import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true

});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    const decoded = jwtDecode(token);
    const expiration = decoded.exp * 1000;
    
    if (Date.now() >= expiration) {
      try {
        const newToken = await refreshToken();
        localStorage.setItem('accessToken', newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}refresh/`,  // 👈 full URL now
    { refresh: refreshToken }
  );
  return response.data.access;
}

export default api;