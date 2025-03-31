// frontend/src/components/TeacherDashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/courses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>techaer dashboard</h2>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}