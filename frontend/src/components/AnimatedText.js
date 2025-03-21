import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedText = () => {
  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Typography
        variant="h4"
        sx={{
          background: 'linear-gradient(to right, #FF5733, #33FF57, #3357FF)',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        MWU Digital Assistant
      </Typography>
    </motion.div>
  );
};

export default AnimatedText;
