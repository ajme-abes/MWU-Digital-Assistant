import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Card as MuiCard } from '@mui/material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormHelperText,
  Stack,
  Link,
  FormControlLabel,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import AnimatedText from './AnimatedText';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  
  const selectedRole = watch('role');

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleFormSubmit = (event) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSocialLogin = async (provider, token) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/${provider}/`, {
        access_token: token
      });
      
      localStorage.setItem('token', res.data.access);
      navigate(res.data.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
    } catch (err) {
      console.error('Social login failed:', err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        ...(data.role === 'STUDENT' && { code: data.invitation })  // 🔁 change `invitation` to `code`
      };
  
      await axios.post('http://localhost:8000/api/auth/signup/student/', payload);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };
  

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
    
  //   try {
  //     const res = await axios.post('http://localhost:8000/api/auth/signup/', {
  //       username: formData.get('username'),
  //       email: formData.get('email'),
  //       password: formData.get('password'),
  //       name: formData.get('name'),
  //       role: 'student' // Default role
  //     });

  //     localStorage.setItem('token', res.data.access);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     if (err.response?.data) {
  //       setErrors({
  //         name: err.response.data.name?.[0] || '',
  //         email: err.response.data.email?.[0] || '',
  //         password: err.response.data.password?.[0] || ''
  //       });
  //     }
  //   }
  // };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined" sx={{gap: 0.56}}>
          {/*<SitemarkIcon />*/}
          <AnimatedText />

          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="role">Account Type</FormLabel>
        <Select
          {...register('role', { required: 'Role is required' })}
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          variant="outlined"
          error={!!formErrors.role}
        >
          <MenuItem value=""><em>Select Role</em></MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="TEACHER">Teacher</MenuItem>
        </Select>
        {formErrors.role && (
          <FormHelperText error>{formErrors.role.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          id="email"
          placeholder="your@email.com"
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          type="password"
          id="password"
          placeholder="••••••"
          variant="outlined"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </FormControl>

      {role === 'STUDENT' && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel htmlFor="invitation">Invitation Code</FormLabel>
          <TextField
            {...register('invitation', { 
              required: 'Invitation code is required for students'
            })}
            id="invitation"
            placeholder="Enter department invitation code"
            variant="outlined"
            error={!!errors.invitation}
            helperText={errors.invitation?.message}
          />
        </FormControl>
      )}

      <FormControlLabel
        control={<Checkbox {...register('updates')} color="primary" />}
        label="I want to receive updates via email."
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ mb: 2 }}
      >
        Sign up
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          or continue with
        </Typography>
      </Divider>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success.main" variant="body2" sx={{ mt: 2 }}>
          Registration successful! Please check your email to verify your account.
        </Typography>
      )}
    </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/*
          <GoogleLogin
              onSuccess={credentialResponse => handleSocialLogin('google', credentialResponse.credential)}
              onError={() => console.log('Google login failed')}
              useOneTap
            />

            <FacebookLogin
              appId="YOUR_FACEBOOK_APP_ID"
              autoLoad={false}
              fields="name,email,picture"
              callback={response => handleSocialLogin('facebook', response.accessToken)}
              render={renderProps => (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={renderProps.onClick}
                  startIcon={<FacebookIcon />}
                >
                  Sign up with Facebook
                </Button>
              )}
            />*/}

            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}