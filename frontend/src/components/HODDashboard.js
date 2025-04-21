import React, { useState } from 'react';
import { Container, Typography, Button, TextField } from '@mui/material';
import api from '../api';

function HODDashboard() {
  const [inviteCode, setInviteCode] = useState('');
  const [courses, setCourses] = useState([]);

  const generateInvite = async () => {
    try {
      const response = await api.post('/api/invitations/', {
        max_uses: 50,
        expires_hours: 72
      });
      setInviteCode(response.data.code);
    } catch (error) {
      console.error('Error generating invitation:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        HOD Dashboard
      </Typography>
      
      <div className="department-controls">
        <Button variant="contained" onClick={generateInvite}>
          Generate Student Invite Code
        </Button>
        
        {inviteCode && (
          <TextField
            label="Invitation Code"
            value={inviteCode}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, width: '300px' }}
          />
        )}
      </div>

      {/* Add course management components here */}
    </Container>
  );
}

export default HODDashboard;