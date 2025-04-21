import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import api from '../api';
import ResourceUpload from './ResourceUpload';

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/teacher/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {courses.map(course => (
          <Grid item xs={12} md={6} key={course.id}>
            <div className="course-card">
              <Typography variant="h6">{course.title}</Typography>
              <Typography variant="body2">{course.description}</Typography>
              <ResourceUpload courseId={course.id} />
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TeacherDashboard;