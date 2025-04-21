import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MuiCard from '@mui/material/Card';
import {
   styled,
   CssBaseline,
   Typography,
   TextField,
   Link,
   FormControlLabel,
   FormControl,
   Stack,
   FormLabel,
   Divider,
   Checkbox,
   Button,
  Box,
  CircularProgress
  } from '@mui/material';
import { GoogleIcon } from './CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import AnimatedText from './AnimatedText';
import { jwtDecode } from 'jwt-decode';
import Api from '../api';
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login(props) {
  const navigate = useNavigate();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
     setOpen(true);
  }
  const handleClose = () => {
     setOpen(false);
  }

  const validateInputs = () => {
    let isValid = true;

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  // Removed unused fetchStudentResources function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await Api.post('/auth/login/', { email, password });
      console.log("Login Response:", response.data); // 🐛 DEBUG

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      const decoded = jwtDecode(response.data.access);
      console.log("Decoded Token:", jwtDecode(response.data.access));

      // Redirect based on role
      switch(decoded.role) {
        case 'STUDENT':
          navigate(`/student-dashboard?dept=${decoded.department}`);
          break;
        case 'TEACHER':
          navigate(`/teacher-dashboard?dept=${decoded.department}`);
          break;
        case 'HOD':
          navigate(`/hod-dashboard?dept=${decoded.department}`);
          break;
        default:
          navigate('/');
      }

    } 
    catch (error) {
      console.error('Login error:', error.response?.data);
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);

    }
  };
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
    <Card variant="outlined" sx={{ mt: -6 }}   >
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
       <AnimatedText/>
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mt: -2 }}
      >
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@university.edu"
          required
          fullWidth
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
          fullWidth
          error={passwordError}
        />
        {passwordError && (
          <Typography color="error" variant="caption">
            {passwordErrorMessage}
          </Typography>
        )}
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            color="primary"
          />
        }
        label="Remember me"
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

{error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>
      <Typography sx={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link href="/signup" underline="hover">
          Sign up here
        </Link>
      </Typography>
    </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
      
      </Box>
    </Card>
    </SignInContainer>
    </AppTheme>
  );
}