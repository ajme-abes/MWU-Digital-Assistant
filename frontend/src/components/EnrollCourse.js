// frontend/src/components/EnrollCourse.js
import React, { useState } from 'react';
import api from '../api'; // Adjust the import path as necessary

export default function EnrollCourse() {
    const [code, setCode] = useState('');
  
    const handleEnroll = async () => {
      try {
        await api.post('enroll/', { code });
        alert('Enrolled successfully!');
      } catch (err) {
        alert('Invalid code!');
      }
    };
  
    return (
      <div>
        <input value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={handleEnroll}>Enroll</button>
      </div>
    );
  }