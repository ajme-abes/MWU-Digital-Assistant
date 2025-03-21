// frontend/src/App.js
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';

// Components
//import Login from './components/Login';
import SignInSide from './SignInSide';
import Signup from './components/Signup';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
//import ForgotPassword from './components/ForgotPassword';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //const location = useLocation();

  const shouldShowAppBar = ![ "/login" , "/signup"].includes(window.location.pathname);


  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/auth/user/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    return <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">

    <BrowserRouter>
      <CssBaseline />
      {shouldShowAppBar && (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MWU Digital Assistant
          </Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      )}

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'teacher' ? (
                  <Navigate to="/teacher" />
                ) : user.role === 'student' ? (
                  <Navigate to="/student" />
                ) : (
                  <Navigate to="/admin" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/login" element={!user ? <SignInSide setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route
            path="/teacher/*"
            element={
              user?.role === 'teacher' ? (
                <TeacherDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/student/*"
            element={
              user?.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/*"
            element={
              user?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </BrowserRouter>
    </GoogleOAuthProvider>

  );
}

export default App;