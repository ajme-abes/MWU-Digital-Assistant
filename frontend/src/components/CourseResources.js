// frontend/src/components/CourseResources.js
import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the path as necessary

export default function CourseResources({ courseId }) {
    const [resources, setResources] = useState([]);
  
    useEffect(() => {
      const fetchResources = async () => {
        const res = await api.get(`courses/${courseId}/resources/`);
        setResources(res.data);
      };
      fetchResources();
    }, [courseId]);
  
    return (
      <div>
        {resources.map(resource => (
          <a key={resource.id} href={resource.file} download>Download {resource.resource_type}</a>
        ))}
      </div>
    );
  }