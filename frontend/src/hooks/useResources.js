// hooks/useResources.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { department } = jwtDecode(token);
        
        const response = await axios.get(`/api/department-resources/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { department }
        });
        
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { resources, loading };
}