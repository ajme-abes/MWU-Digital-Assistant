import React, { useState } from 'react';
import { Button, LinearProgress, Typography } from '@mui/material';
import api from '../api';

function ResourceUpload({ courseId }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course', courseId);

    try {
      await api.post('/api/resources/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      });
      setFile(null);
    } catch (err) {
      setError('Upload failed. Check file type (PDF, DOC, MP4) and size (<50MB)');
    }
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ margin: '20px 0' }}
      />
      
      {file && (
        <>
          <Button variant="contained" onClick={handleUpload}>
            Upload Resource
          </Button>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mt: 1 }}
          />
        </>
      )}
      
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export default ResourceUpload;